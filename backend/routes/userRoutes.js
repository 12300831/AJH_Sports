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
import { authenticate, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// User routes (authenticated)
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);

// Admin routes
router.get("/all", authenticate, isAdmin, getAllUsers);
router.delete("/:id", authenticate, isAdmin, deleteUser);

export default router;

