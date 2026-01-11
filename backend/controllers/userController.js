/**
 * User Controller
 * Handles user management operations
 */

import pool from "../config/db.js";

// Get user profile
// Note: Uses authenticateWithUser middleware which fetches full user from DB
export const getProfile = async (req, res) => {
  try {
    // req.user already contains full user data from authenticateWithUser middleware
    // No need to query database again
    const user = req.user;

    res.json({
      success: true,
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        phone: user.phone,
        location: user.location,
        role: user.role,
        status: user.status,
        joinedDate: user.joinedDate,
        lastActive: user.lastActive,
        profileImage: user.profileImage,
        created_at: user.created_at
      }
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
    const { name, fullName, email, phone, location, bio } = req.body;

    // Build updates object
    const updates = {};
    if (name !== undefined && name.trim()) updates.name = name.trim();
    if (fullName !== undefined && fullName.trim()) updates.fullName = fullName.trim();
    if (phone !== undefined) updates.phone = phone ? phone.trim() : null;
    if (location !== undefined) updates.location = location ? location.trim() : null;
    
    // Email update requires validation
    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format"
        });
      }
      // Check if email already exists for another user
      const [emailCheck] = await pool.query(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [normalizedEmail, userId]
      );
      if (emailCheck.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email already exists"
        });
      }
      updates.email = normalizedEmail;
    }

    // Note: bio field doesn't exist in users table yet, but we'll store it if needed
    // For now, we'll skip bio if the column doesn't exist

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update"
      });
    }

    // Update user in database
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(", ");
    const values = [...Object.values(updates), userId];

    await pool.query(
      `UPDATE users SET ${fields}, updated_at = NOW() WHERE id = ?`,
      values
    );

    // Fetch updated user data
    const [updatedUserRows] = await pool.query(
      `SELECT id, uuid, name, fullName, email, username, phone, location, 
       role, status, joinedDate, lastActive, profileImage, created_at, updated_at 
       FROM users WHERE id = ?`,
      [userId]
    );

    if (updatedUserRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found after update"
      });
    }

    const updatedUser = updatedUserRows[0];

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        uuid: updatedUser.uuid,
        name: updatedUser.name,
        fullName: updatedUser.fullName || updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        phone: updatedUser.phone || null,
        location: updatedUser.location || null,
        role: updatedUser.role || 'player',
        status: updatedUser.status || 'active',
        joinedDate: updatedUser.joinedDate || updatedUser.created_at,
        lastActive: updatedUser.lastActive || new Date().toISOString(),
        profileImage: updatedUser.profileImage || null,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

