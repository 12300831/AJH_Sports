import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Google OAuth initiation
router.get(
  '/google',
  (req, res, next) => {
    console.log('🔵 Google OAuth initiation requested');
    console.log('Backend URL:', process.env.BACKEND_URL);
    console.log('Callback URL will be:', `${process.env.BACKEND_URL || 'http://localhost:5001'}/auth/google/callback`);
    next();
  },
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'select_account', // Force account chooser to show every time
  })
);

// Google OAuth callback
router.get(
  '/google/callback',
  (req, res, next) => {
    console.log('🔵 Google OAuth callback received');
    console.log('Query params:', req.query);
    next();
  },
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: '/auth/error',
    failureMessage: true 
  }),
  (req, res) => {
    try {
      console.log('✅ Google OAuth authentication successful');
      const user = req.user;
      
      if (!user) {
        console.error('❌ No user object in request after authentication');
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/signin?error=oauth_error&message=no_user`);
      }

      console.log('👤 User authenticated:', { id: user.id, email: user.email, role: user.role });

      // Normalize role and status
      let userRole = user.role || 'User';
      if (userRole) {
        userRole = String(userRole).charAt(0).toUpperCase() + String(userRole).slice(1).toLowerCase();
      }

      let userStatus = user.status || 'Active';
      if (userStatus) {
        userStatus = String(userStatus).charAt(0).toUpperCase() + String(userStatus).slice(1).toLowerCase();
      }

      // Generate JWT token with role and status (consistent with login)
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          role: userRole,
          status: userStatus
        },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '7d' }
      );

      console.log('🎫 JWT token generated, redirecting to frontend');

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/oauth-success?token=${token}`);
    } catch (error) {
      console.error('❌ Google OAuth callback error:', error);
      console.error('Error stack:', error.stack);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/signin?error=oauth_error&message=${encodeURIComponent(error.message)}`);
    }
  }
);

// Facebook OAuth initiation
router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email'],
  })
);

// Facebook OAuth callback
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/auth/error' }),
  (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/signin?error=oauth_error`);
      }

      // Normalize role and status
      let userRole = user.role || 'User';
      if (userRole) {
        userRole = String(userRole).charAt(0).toUpperCase() + String(userRole).slice(1).toLowerCase();
      }

      let userStatus = user.status || 'Active';
      if (userStatus) {
        userStatus = String(userStatus).charAt(0).toUpperCase() + String(userStatus).slice(1).toLowerCase();
      }

      // Generate JWT token with role and status (consistent with login)
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          role: userRole,
          status: userStatus
        },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '7d' }
      );

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/oauth-success?token=${token}`);
    } catch (error) {
      console.error('Facebook OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/signin?error=oauth_error`);
    }
  }
);

// OAuth error handler
router.get('/error', (req, res) => {
  console.error('❌ OAuth error handler triggered');
  console.error('Error query params:', req.query);
  console.error('Error message:', req.query.error || 'Unknown error');
  
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const errorMessage = req.query.error || 'oauth_error';
  res.redirect(`${frontendUrl}/signin?error=${errorMessage}`);
});

export default router;

