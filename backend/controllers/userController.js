/**
 * User Controller
 * Handles user management operations
 */

import pool from "../config/db.js";

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await pool.query(
      "SELECT id, name, email, phone, location, role, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile"
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, location } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (location !== undefined) updates.location = location;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update"
      });
    }

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(", ");
    const values = [...Object.values(updates), userId];

    await pool.query(
      `UPDATE users SET ${fields} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile"
    });
  }
};

// Admin: Get all users
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, name, email, phone, location, role, created_at FROM users ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users"
    });
  }
};

// Admin: Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account"
      });
    }

    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user"
    });
  }
};

