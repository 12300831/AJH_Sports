// Load environment variables FIRST - before any imports that depend on them
import dotenv from 'dotenv';
dotenv.config();

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import pool from './db.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// Helper function to find or create user from OAuth profile
async function findOrCreateUser(profile, provider) {
  const email = profile.emails?.[0]?.value || profile.email;
  const name = profile.displayName || profile.name?.givenName + ' ' + profile.name?.familyName || 'User';
  const providerId = profile.id;

  if (!email) {
    throw new Error('Email is required for OAuth login');
  }

  // Check if user exists by email
  try {
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      
      // CRITICAL: Preserve admin role - never overwrite it with OAuth login
      // Only set default role if user doesn't have one (shouldn't happen, but defensive)
      if (!existingUser.role) {
        existingUser.role = 'User';
      }
      // Ensure status has default value if missing
      if (!existingUser.status) {
        existingUser.status = 'Active';
      }
      
      // IMPORTANT: Admin role must remain unchanged - OAuth cannot change admin status
      // The existing role (especially 'Admin') is preserved as-is
      
      // Update provider info if not set and update lastActive
      if (!existingUser.provider || !existingUser.provider_id) {
        try {
          await pool.query(
            'UPDATE users SET provider = ?, provider_id = ?, lastActive = NOW() WHERE id = ?',
            [provider, providerId, existingUser.id]
          );
          existingUser.provider = provider;
          existingUser.provider_id = providerId;
        } catch (updateError) {
          console.error('Error updating provider info:', updateError.message);
          // If columns don't exist, try to add them
          if (updateError.code === 'ER_BAD_FIELD_ERROR') {
            throw new Error('OAuth columns missing. Please run the database migration.');
          }
          throw updateError;
        }
      } else {
        // Just update lastActive
        await pool.query(
          'UPDATE users SET lastActive = NOW() WHERE id = ?',
          [existingUser.id]
        );
      }
      
      return existingUser;
    }
  } catch (queryError) {
    console.error('Error querying users:', queryError.message);
    if (queryError.code === 'ER_BAD_FIELD_ERROR') {
      throw new Error('OAuth columns missing. Please run the database migration.');
    }
    throw queryError;
  }

  // Create new user with all required fields
  try {
    // Generate username from email
    let username = email.split('@')[0];
    let attempts = 0;
    while (attempts < 10) {
      const [usernameCheck] = await pool.query(
        'SELECT id FROM users WHERE username = ?',
        [username]
      );
      if (Array.isArray(usernameCheck) && usernameCheck.length === 0) break;
      username = email.split('@')[0] + Math.floor(Math.random() * 10000);
      attempts++;
    }

    const uuid = uuidv4();

    const [result] = await pool.query(
      `INSERT INTO users (
        uuid, name, fullName, email, username, provider, provider_id, 
        phone, location, password, role, status, joinedDate, lastActive
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        uuid,
        name,
        name, // fullName same as name initially
        email,
        username,
        provider,
        providerId,
        null, // phone
        null, // location
        null, // password (OAuth users don't have passwords)
        'User', // Default role
        'Active', // Default status
      ]
    );

    const [newUsers] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [result.insertId]
    );

    const newUser = newUsers[0];
    
    // Ensure role and status are set (should already be set from INSERT, but be defensive)
    if (!newUser.role) {
      newUser.role = 'User';
    }
    if (!newUser.status) {
      newUser.status = 'Active';
    }
    
    return newUser;
  } catch (insertError) {
    console.error('Error inserting user:', insertError.message);
    console.error('SQL Error Code:', insertError.code);
    if (insertError.code === 'ER_BAD_FIELD_ERROR') {
      throw new Error('Required columns are missing in the users table. Please run the database migration.');
    }
    throw insertError;
  }
}

// OAuth configuration (optional - only initialize if credentials are provided)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

// Use environment variable for backend URL, fallback to localhost for development
// In production (Azure), this should be set to https://ajh-sports-backend.azurewebsites.net
// For local development, it defaults to localhost
const BACKEND_URL = process.env.BACKEND_URL || 
  (process.env.AZURE_WEBSITE_HOSTNAME 
    ? `https://${process.env.AZURE_WEBSITE_HOSTNAME}` 
    : (process.env.PORT ? `http://localhost:${process.env.PORT}` : 'http://localhost:5001'));

console.log('🔗 OAuth callback URL base:', BACKEND_URL);

// Google OAuth Strategy (only if credentials are provided)
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('🔵 Google OAuth profile received:', {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName
          });
          const user = await findOrCreateUser(profile, 'google');
          console.log('✅ Google OAuth user found/created:', { id: user.id, email: user.email });
          return done(null, user);
        } catch (error) {
          console.error('❌ Google OAuth strategy error:', error);
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code
          });
          return done(error, undefined);
        }
      }
    )
  );
  console.log('✅ Google OAuth strategy initialized');
} else {
  console.warn('⚠️  Google OAuth credentials not found. Google login will be disabled.');
}

// Facebook OAuth Strategy (only if credentials are provided)
if (FACEBOOK_APP_ID && FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: `${BACKEND_URL}/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'emails'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await findOrCreateUser(profile, 'facebook');
          return done(null, user);
        } catch (error) {
          return done(error, undefined);
        }
      }
    )
  );
  console.log('✅ Facebook OAuth strategy initialized');
} else {
  console.warn('⚠️  Facebook OAuth credentials not found. Facebook login will be disabled.');
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (Array.isArray(rows) && rows.length > 0) {
      done(null, rows[0]);
    } else {
      done(new Error('User not found'), null);
    }
  } catch (error) {
    done(error, null);
  }
});

export default passport;

