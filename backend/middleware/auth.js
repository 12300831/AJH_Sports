/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user info to request
 * Uses JWT payload (id, email, role, status) - no database query needed
 * Database remains source of truth, JWT is the access key
 */

import jwt from "jsonwebtoken";
import pool from "../config/db.js";

/**
 * Main authentication middleware
 * Reads user info from JWT token (no DB query for performance)
 * Attaches: { id, email, role, status } to req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Authorization header must be: Bearer <token>"
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract user info from JWT payload
    // JWT contains: { id, email, role, status } (set during login)
    // CRITICAL: id is the source of truth, email is informational only
    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload: missing user ID"
      });
    }

    // Email is optional in JWT (for backward compatibility with old tokens)
    // But we always need id to identify the user
    if (!decoded.email) {
      console.warn(`⚠️  JWT token missing email for user ID ${decoded.id}. User should re-login.`);
    }

    // Normalize role from JWT (handle case variations)
    const normalizedRole = decoded.role ? 
      String(decoded.role).charAt(0).toUpperCase() + String(decoded.role).slice(1).toLowerCase() : 
      'User';
    
    // Normalize status from JWT
    const normalizedStatus = decoded.status ? 
      String(decoded.status).charAt(0).toUpperCase() + String(decoded.status).slice(1).toLowerCase() : 
      'Active';

    // Attach user info to request from JWT (no DB query)
    // This is fast and consistent - role/status come from token
    // IMPORTANT: Always use req.user.id for database queries, never req.user.email
    req.user = {
      id: decoded.id,
      email: decoded.email || null, // Optional, for backward compatibility
      role: normalizedRole,
      status: normalizedStatus
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired"
      });
    }
    
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error"
    });
  }
};

/**
 * Optional: Fetch full user from database when needed
 * Use this only for endpoints that need full user profile data
 * (e.g., /profile endpoint that returns phone, location, etc.)
 * First verifies JWT, then fetches full user data from DB
 */
export const authenticateWithUser = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Authorization header must be: Bearer <token>"
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // CRITICAL: id is required, email is optional (for backward compatibility)
    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload: missing user ID"
      });
    }

    // Fetch full user data from database using ID (never use email for authenticated lookups)
    const [users] = await pool.query(
      "SELECT id, uuid, name, fullName, email, username, phone, location, role, status, joinedDate, lastActive, profileImage, created_at FROM users WHERE id = ?",
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    const user = users[0];
    
    // Normalize role and status
    const normalizedRole = user.role ? 
      String(user.role).charAt(0).toUpperCase() + String(user.role).slice(1).toLowerCase() : 
      'User';
    
    const normalizedStatus = user.status ? 
      String(user.status).charAt(0).toUpperCase() + String(user.status).slice(1).toLowerCase() : 
      'Active';

    // Attach full user data to request
    req.user = {
      ...user,
      role: normalizedRole,
      status: normalizedStatus
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired"
      });
    }
    
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error"
    });
  }
};

/**
 * Admin-only middleware
 * Checks if user has admin role from JWT
 * Must be used after authenticate middleware
 * Returns 403 Forbidden if not admin
 */
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  // Case-insensitive role check (Admin, admin, ADMIN all work)
  // Role comes from JWT payload, already normalized in authenticate middleware
  const userRole = req.user.role ? String(req.user.role).toLowerCase() : '';
  if (userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Admin access required"
    });
  }

  next();
};

/**
 * Role-based access control middleware
 * Allows multiple roles to access a route
 * Usage: router.get('/route', authenticate, roleGuard(['Admin', 'Moderator']), handler)
 * 
 * @param {string[]} allowedRoles - Array of allowed role names (case-insensitive)
 */
export const roleGuard = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Normalize user role and allowed roles for comparison
    const userRole = req.user.role ? String(req.user.role).toLowerCase() : '';
    const normalizedAllowedRoles = allowedRoles.map(role => String(role).toLowerCase());

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

