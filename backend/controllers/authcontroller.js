import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import dotenv from "dotenv";
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

    // Hash password using bcrypt
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Insert new user with all required fields
    // Only use columns that actually exist in the database
    const [result] = await pool.query(
      `INSERT INTO users (
        name, email, phone, location, password, role
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        normalizedEmail, // Store normalized email
        phone ? phone.trim() : null,
        location ? location.trim() : null,
        passwordHash, // Hashed password
        'user', // Default role is 'user' (matches database default)
      ]
    );

    // Fetch the created user to return in response
    const [newUserRows] = await pool.query(
      `SELECT id, name, email, phone, location, role, created_at 
       FROM users WHERE id = ?`,
      [result.insertId]
    );

    if (newUserRows.length === 0) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    const newUser = newUserRows[0];

    // Normalize role (ensure lowercase for consistency)
    const userRole = (newUser.role || 'user').toLowerCase();

    // Generate JWT token with user info
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email,
        role: userRole
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
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || null,
        location: newUser.location || null,
        role: userRole,
        created_at: newUser.created_at,
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
    // Only select columns that actually exist in the database
    const [rows] = await pool.query(
      `SELECT id, name, email, phone, location, password, role, created_at, updated_at 
       FROM users WHERE LOWER(TRIM(email)) = ?`,
      [normalizedEmail]
    );

    if (rows.length === 0) {
      console.log(`Login attempt with email: "${email}" (normalized: "${normalizedEmail}")`);
      return res.status(400).json({ message: "Email not found" });
    }

    const user = rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Normalize role value (handle case variations)
    // Keep lowercase for consistency with signup ('user', 'admin', 'player', 'coach')
    let userRole = user.role;
    if (!userRole || userRole === null || userRole === undefined || userRole === '') {
      userRole = 'user';
    } else {
      // Normalize to lowercase for consistency
      userRole = String(userRole).toLowerCase();
    }

    // Create token with role for better security
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: userRole
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = {
      message: "Login success",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        location: user.location || null,
        role: userRole, // Normalized role
        created_at: user.created_at,
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

