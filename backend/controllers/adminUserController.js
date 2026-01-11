/**
 * Admin User Management Controller
 * Handles admin operations for user management with search, filters, and pagination
 */

import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import {
  normalizeRole,
  normalizeStatus,
  validateEmail,
  validateUsername,
  sanitizeSearch,
  validatePagination,
  validateDate,
  VALID_ROLES,
  VALID_STATUSES,
} from "../utils/validation.js";

// Get all users with search, filters, and pagination
export const getUsers = async (req, res) => {
  try {
    const {
      search = "",
      role = "",
      status = "",
      dateFrom = "",
      dateTo = "",
      page = 1,
      limit = 10,
      sortBy = "joinedDate",
      sortOrder = "DESC",
    } = req.query;

    // Validate and sanitize pagination
    const { page: pageNum, limit: limitNum } = validatePagination(page, limit);
    const offset = (pageNum - 1) * limitNum;

    // Sanitize search input
    const sanitizedSearch = sanitizeSearch(search);

    // Build WHERE clause
    let whereConditions = [];
    let queryParams = [];

    // Search filter (name, email, username) - sanitized
    if (sanitizedSearch) {
      whereConditions.push(
        `(fullName LIKE ? OR name LIKE ? OR email LIKE ? OR username LIKE ?)`
      );
      const searchPattern = `%${sanitizedSearch}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    // Role filter - normalized
    if (role) {
      const normalizedRole = normalizeRole(role);
      whereConditions.push("role = ?");
      queryParams.push(normalizedRole);
    }

    // Status filter - normalized
    if (status) {
      const normalizedStatus = normalizeStatus(status);
      whereConditions.push("status = ?");
      queryParams.push(normalizedStatus);
    }

    // Date range filter - validated
    if (dateFrom && validateDate(dateFrom)) {
      whereConditions.push("joinedDate >= ?");
      queryParams.push(dateFrom);
    }
    if (dateTo && validateDate(dateTo)) {
      whereConditions.push("joinedDate <= ?");
      queryParams.push(dateTo + " 23:59:59");
    }

    const whereClause =
      whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    // Valid sort columns
    const validSortColumns = [
      "fullName",
      "email",
      "username",
      "role",
      "status",
      "joinedDate",
      "lastActive",
    ];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "joinedDate";
    const sortDirection = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Get total count
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;

    // Get users with pagination
    const [users] = await pool.query(
      `SELECT 
        id, uuid, name, fullName, email, username, phone, location,
        role, status, joinedDate, lastActive, profileImage, created_at
      FROM users 
      ${whereClause}
      ORDER BY ${sortColumn} ${sortDirection}
      LIMIT ? OFFSET ?`,
      [...queryParams, limitNum, offset]
    );

    // Format dates and calculate "last active" relative time
    const formattedUsers = users.map((user) => {
      const lastActive = user.lastActive
        ? new Date(user.lastActive)
        : new Date(user.created_at);
      const now = new Date();
      const diffMs = now - lastActive;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      const diffMonths = Math.floor(diffDays / 30);

      let lastActiveText = "Just now";
      if (diffMins < 1) {
        lastActiveText = "Just now";
      } else if (diffMins < 60) {
        lastActiveText = `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
      } else if (diffHours < 24) {
        lastActiveText = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      } else if (diffDays < 30) {
        lastActiveText = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      } else if (diffMonths < 12) {
        lastActiveText = `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
      } else {
        lastActiveText = `${Math.floor(diffMonths / 12)} year${Math.floor(diffMonths / 12) > 1 ? "s" : ""} ago`;
      }

      return {
        ...user,
        joinedDate: user.joinedDate
          ? new Date(user.joinedDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : new Date(user.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
        lastActive: lastActiveText,
        lastActiveTimestamp: lastActive.toISOString(),
      };
    });

    res.json({
      success: true,
      users: formattedUsers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      // Don't leak error details in production
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.query(
      `SELECT 
        id, uuid, name, fullName, email, username, phone, location,
        role, status, joinedDate, lastActive, profileImage, created_at
      FROM users WHERE id = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];
    user.joinedDate = user.joinedDate
      ? new Date(user.joinedDate).toISOString()
      : new Date(user.created_at).toISOString();
    user.lastActive = user.lastActive
      ? new Date(user.lastActive).toISOString()
      : new Date(user.created_at).toISOString();

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
    });
  }
};

// Update user (admin)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const { fullName, email, username, role, status, phone, location, profileImage } =
      req.body;

    // Prevent privilege escalation: users cannot change their own role or status
    if (userId === req.user.id) {
      if (role !== undefined && normalizeRole(role) !== 'Admin') {
        return res.status(403).json({
          success: false,
          message: "Cannot change your own role from Admin",
        });
      }
      if (status !== undefined && normalizeStatus(status) !== 'Active') {
        return res.status(403).json({
          success: false,
          message: "Cannot change your own status",
        });
      }
    }

    // Normalize role and status values
    const normalizedRole = role !== undefined ? normalizeRole(role) : undefined;
    const normalizedStatus = status !== undefined ? normalizeStatus(status) : undefined;

    // Validate email format if provided
    if (email && !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate username format if provided
    if (username && !validateUsername(username)) {
      return res.status(400).json({
        success: false,
        message: "Username must be 3-30 characters (alphanumeric, underscore, hyphen only)",
      });
    }

    // Check if email already exists (for other users)
    if (email) {
      const [emailCheck] = await pool.query(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [email, id]
      );
      if (emailCheck.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    // Check if username already exists (for other users)
    if (username) {
      const [usernameCheck] = await pool.query(
        "SELECT id FROM users WHERE username = ? AND id != ?",
        [username, id]
      );
      if (usernameCheck.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Username already exists",
        });
      }
    }

    // Build update query with normalized values
    const updates = {};
    if (fullName !== undefined && fullName.trim()) {
      updates.fullName = fullName.trim().substring(0, 255);
    }
    if (email !== undefined) updates.email = email.trim().toLowerCase();
    if (username !== undefined) updates.username = username.trim();
    if (normalizedRole !== undefined) updates.role = normalizedRole;
    if (normalizedStatus !== undefined) updates.status = normalizedStatus;
    if (phone !== undefined) updates.phone = phone ? phone.trim().substring(0, 50) : null;
    if (location !== undefined) updates.location = location ? location.trim().substring(0, 255) : null;
    if (profileImage !== undefined) updates.profileImage = profileImage ? profileImage.trim().substring(0, 500) : null;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updates), id];

    await pool.query(`UPDATE users SET ${fields} WHERE id = ?`, values);

    res.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Update user error:", error);
    
    // Handle specific database errors
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: "Email or username already exists",
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Create user (admin)
export const createUser = async (req, res) => {
  try {
    const { fullName, email, username, password, role, status, phone, location } =
      req.body;

    // Validate required fields
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate username format if provided
    if (username && !validateUsername(username)) {
      return res.status(400).json({
        success: false,
        message: "Username must be 3-30 characters (alphanumeric, underscore, hyphen only)",
      });
    }

    // Normalize role and status
    const normalizedRole = normalizeRole(role);
    const normalizedStatus = normalizeStatus(status);

    // Check if email already exists
    const [emailCheck] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (emailCheck.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Generate username if not provided
    let finalUsername = username || email.split("@")[0];
    let attempts = 0;
    while (attempts < 10) {
      const [usernameCheck] = await pool.query(
        "SELECT id FROM users WHERE username = ?",
        [finalUsername]
      );
      if (usernameCheck.length === 0) break;
      finalUsername = email.split("@")[0] + Math.floor(Math.random() * 10000);
      attempts++;
    }

    // Hash password if provided, otherwise null (for OAuth users)
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Generate UUID
    const uuid = uuidv4();

    // Insert user with normalized values
    const [result] = await pool.query(
      `INSERT INTO users (
        uuid, name, fullName, email, username, phone, location, password,
        role, status, joinedDate, lastActive
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        uuid,
        fullName.trim(),
        fullName.trim(),
        email.trim().toLowerCase(),
        finalUsername.trim(),
        phone ? phone.trim().substring(0, 50) : null,
        location ? location.trim().substring(0, 255) : null,
        hashedPassword,
        normalizedRole,
        normalizedStatus,
      ]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Delete user (hard delete)
 * Security: Prevents admins from deleting themselves
 * Note: Soft delete can be implemented by adding a 'deleted_at' column
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Prevent deleting yourself
    if (userId === req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    // Check if user exists before deleting
    const [existingUsers] = await pool.query(
      "SELECT id, role FROM users WHERE id = ?",
      [userId]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deleting other admins (optional security measure)
    // Uncomment if you want to prevent deleting admin users:
    // if (existingUsers[0].role === 'Admin') {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Cannot delete admin users",
    //   });
    // }

    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
    });
  }
};

