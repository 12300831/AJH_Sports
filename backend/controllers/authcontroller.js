import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

// ---------- SIGNUP ----------
export const signup = async (req, res) => {
  const { name, email, phone, location, password } = req.body;

  try {
    // Check if user already exists
    const [exists] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (exists.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    
    // Insert new user
    await pool.query(
      "INSERT INTO users (name, email, phone, location, password) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, location, hashed]
    );

    res.json({ message: "Signup successful" });

  } catch (err) {
    res.status(500).json({ error: err.message });
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
    // Explicitly select all columns including role
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, location, password, role, created_at, updated_at FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Email not found" });
    }

    const user = rows[0];

    // Debug: Log the raw user object from DB
    console.log('Login - Raw user from DB:', JSON.stringify(user, null, 2));
    console.log('Login - User role value:', user.role);
    console.log('Login - User role type:', typeof user.role);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    // create token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Ensure role is set - explicitly check for null/undefined/empty string
    let userRole = user.role;
    if (!userRole || userRole === null || userRole === undefined || userRole === '') {
      userRole = 'user';
    }
    console.log('Login - Final user role:', userRole);
    console.log('Login - User role after processing:', typeof userRole, userRole);

    const response = {
      message: "Login success",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        location: user.location || null,
        role: String(userRole), // Explicitly convert to string
      },
    };

    console.log('Login - Response being sent:');
    console.log(JSON.stringify(response, null, 2));
    console.log('Login - Response user.role specifically:', response.user.role);
    
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

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
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

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
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

