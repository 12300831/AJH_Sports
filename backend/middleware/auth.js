/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user info to request
 */

import jwt from "jsonwebtoken";
import pool from "../config/db.js";

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

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const [users] = await pool.query(
      "SELECT id, name, email, phone, location, role FROM users WHERE id = ?",
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Attach user to request
    req.user = users[0];
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
 * Admin Middleware
 * Checks if user has admin role
 * Must be used after authenticate middleware
 */
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required"
    });
  }

  next();
};

