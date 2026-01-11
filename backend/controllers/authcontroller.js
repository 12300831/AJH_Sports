import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

// ---------- SIGNUP ----------
export const signup = async (req, res) => {
  const { name, email, phone, location, password } = req.body;

  // Validate JWT_SECRET before processing
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not set in environment variables');
    return res.status(500).json({ 
      message: "Server configuration error: JWT_SECRET is missing"
    });
  }

  try {
    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password is required and must be at least 6 characters" });
    }

    // Trim and normalize email for consistent storage
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists (case-insensitive)
    const [exists] = await pool.query(
      "SELECT * FROM users WHERE LOWER(TRIM(email)) = ?",
      [normalizedEmail]
    );

    if (exists.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Generate username from email (before @)
    const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
    
    // Check if username exists, if so append random number
    let finalUsername = username;
    let attempts = 0;
    while (attempts < 10) {
      const [usernameCheck] = await pool.query(
        "SELECT id FROM users WHERE username = ?",
        [finalUsername]
      );
      if (usernameCheck.length === 0) break;
      finalUsername = email.split('@')[0] + Math.floor(Math.random() * 10000);
      attempts++;
    }

    // Hash password using bcrypt
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Generate UUID
    const uuid = uuidv4();
    
    // Insert new user with all required fields
    // Default role is 'player', default status is 'active'
    const [result] = await pool.query(
      `INSERT INTO users (
        uuid, name, fullName, email, username, phone, location, password, 
        role, status, joinedDate, lastActive
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        uuid,
        name.trim(),
        name.trim(), // fullName same as name initially
        normalizedEmail, // Store normalized email
        finalUsername,
        phone ? phone.trim() : null,
        location ? location.trim() : null,
        passwordHash, // Hashed password
        'player', // Default role is 'player'
        'active', // Default status is 'active'
      ]
    );

    // Fetch the created user to return in response
    const [newUserRows] = await pool.query(
      `SELECT id, uuid, name, fullName, email, username, phone, location, 
       role, status, joinedDate, lastActive, profileImage, created_at 
       FROM users WHERE id = ?`,
      [result.insertId]
    );

    if (newUserRows.length === 0) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    const newUser = newUserRows[0];

    // Normalize role and status (ensure lowercase for consistency)
    const userRole = (newUser.role || 'player').toLowerCase();
    const userStatus = (newUser.status || 'active').toLowerCase();

    // Generate JWT token with user info
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email,
        role: userRole,
        status: userStatus
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return token and user object
    res.json({ 
      message: "Signup successful",
      token,
      user: {
        id: newUser.id,
        uuid: newUser.uuid,
        name: newUser.name,
        fullName: newUser.fullName || newUser.name,
        email: newUser.email,
        username: newUser.username,
        phone: newUser.phone || null,
        location: newUser.location || null,
        role: userRole,
        status: userStatus,
        joinedDate: newUser.joinedDate || newUser.created_at,
        lastActive: newUser.lastActive || new Date().toISOString(),
        profileImage: newUser.profileImage || null,
      }
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// ---------- LOGIN ----------
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate JWT_SECRET before processing
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not set in environment variables');
    return res.status(500).json({ 
      message: "Server configuration error: JWT_SECRET is missing"
    });
  }

  try {
    // Trim and lowercase email for case-insensitive matching
    const normalizedEmail = email ? email.trim().toLowerCase() : '';
    
    if (!normalizedEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Explicitly select all columns including role
    // Use LOWER() for case-insensitive email matching
    const [rows] = await pool.query(
      `SELECT id, uuid, name, fullName, email, username, phone, location, password, 
       role, status, joinedDate, lastActive, profileImage, created_at, updated_at 
       FROM users WHERE LOWER(TRIM(email)) = ?`,
      [normalizedEmail]
    );

    if (rows.length === 0) {
      console.log(`Login attempt with email: "${email}" (normalized: "${normalizedEmail}")`);
      return res.status(400).json({ message: "Email not found" });
    }

    const user = rows[0];

    // Check password BEFORE updating lastActive (security: only update on successful login)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Update lastActive timestamp ONLY after successful password verification
    await pool.query(
      "UPDATE users SET lastActive = NOW() WHERE id = ?",
      [user.id]
    );

    // Normalize role value (handle case variations)
    // Security: Normalize to prevent case-sensitivity bugs
    // Keep lowercase for consistency with signup ('player', 'coach', 'admin')
    let userRole = user.role;
    if (!userRole || userRole === null || userRole === undefined || userRole === '') {
      userRole = 'player';
    } else {
      // Normalize to lowercase for consistency
      userRole = String(userRole).toLowerCase();
    }

    // Normalize status value (keep lowercase for consistency)
    let userStatus = user.status || 'active';
    if (userStatus) {
      userStatus = String(userStatus).toLowerCase();
    }

    // Create token with role and status for better security
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: userRole,
        status: userStatus
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = {
      message: "Login success",
      token,
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name || user.fullName,
        fullName: user.fullName || user.name,
        email: user.email,
        username: user.username,
        phone: user.phone || null,
        location: user.location || null,
        role: userRole, // Normalized role
        status: userStatus, // Normalized status
        joinedDate: user.joinedDate || user.created_at,
        lastActive: new Date().toISOString(),
        profileImage: user.profileImage || null,
      },
    };
    
    return res.json(response);

  } catch (error) {
    console.error('Login error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check for common issues
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not set in environment variables');
      return res.status(500).json({ 
        message: "Server configuration error: JWT_SECRET is missing",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    return res.status(500).json({ 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ---------- GOOGLE OAUTH CALLBACK ----------
export const googleCallback = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/signin?error=oauth_failed`);
    }

    // Normalize role and status (same as login)
    let userRole = user.role || 'User';
    if (userRole) {
      userRole = String(userRole).charAt(0).toUpperCase() + String(userRole).slice(1).toLowerCase();
    }

    let userStatus = user.status || 'Active';
    if (userStatus) {
      userStatus = String(userStatus).charAt(0).toUpperCase() + String(userStatus).slice(1).toLowerCase();
    }

    // Create JWT token with role and status (consistent with login)
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: userRole,
        status: userStatus
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect to frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/callback?token=${token}&provider=google`
    );
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/signin?error=oauth_failed`);
  }
};

// ---------- FACEBOOK OAUTH CALLBACK ----------
export const facebookCallback = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/signin?error=oauth_failed`);
    }

    // Normalize role and status (same as login)
    let userRole = user.role || 'User';
    if (userRole) {
      userRole = String(userRole).charAt(0).toUpperCase() + String(userRole).slice(1).toLowerCase();
    }

    let userStatus = user.status || 'Active';
    if (userStatus) {
      userStatus = String(userStatus).charAt(0).toUpperCase() + String(userStatus).slice(1).toLowerCase();
    }

    // Create JWT token with role and status (consistent with login)
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: userRole,
        status: userStatus
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect to frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/callback?token=${token}&provider=facebook`
    );
  } catch (error) {
    console.error("Facebook OAuth error:", error);
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/signin?error=oauth_failed`);
  }
};

