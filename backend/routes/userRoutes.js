/**
 * User Routes
 */

import express from "express";
import {
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser
} from "../controllers/userController.js";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser as adminDeleteUser
} from "../controllers/adminUserController.js";
import { authenticate, authenticateWithUser, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// User routes (authenticated)
// Use authenticateWithUser for /profile to get full user data from DB
router.get("/profile", authenticateWithUser, getProfile);
router.put("/profile", authenticate, updateProfile);

// Admin routes - new user management API
router.get("/admin", authenticate, isAdmin, getUsers);
router.get("/admin/:id", authenticate, isAdmin, getUserById);
router.post("/admin", authenticate, isAdmin, createUser);
router.put("/admin/:id", authenticate, isAdmin, updateUser);
router.delete("/admin/:id", authenticate, isAdmin, adminDeleteUser);

// Legacy admin routes (for backward compatibility)
router.get("/all", authenticate, isAdmin, getAllUsers);
router.delete("/:id", authenticate, isAdmin, deleteUser);

export default router;

