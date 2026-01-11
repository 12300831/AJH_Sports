import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Google OAuth initiation
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'select_account', // Force account chooser to show every time
  })
);

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/error' }),
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
      console.error('Google OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/signin?error=oauth_error`);
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
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  res.redirect(`${frontendUrl}/signin?error=oauth_error`);
});

export default router;

