/**
 * Coach Routes
 */

import express from "express";
import {
  getCoaches,
  getCoachById,
  createCoach,
  updateCoach,
  deleteCoach,
  hardDeleteCoach,
  bookCoach,
  cancelCoachBooking,
  getMyCoachBookings,
  getAllCoachBookings,
  updateBookingStatus,
  getAvailableTimeSlots
} from "../controllers/coachController.js";
import { authenticate, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getCoaches);
router.get("/available-slots", getAvailableTimeSlots); // Must come before /:id
router.get("/:id", getCoachById);

// User routes (authenticated)
router.post("/book", authenticate, bookCoach);
router.post("/cancel/:id", authenticate, cancelCoachBooking);
router.get("/bookings/my", authenticate, getMyCoachBookings);

// Admin routes
router.post("/", authenticate, isAdmin, createCoach);
router.put("/:id", authenticate, isAdmin, updateCoach);
router.delete("/:id/hard-delete", authenticate, isAdmin, hardDeleteCoach); // Must come before /:id
router.delete("/:id", authenticate, isAdmin, deleteCoach);
router.get("/bookings/all", authenticate, isAdmin, getAllCoachBookings);
router.put("/bookings/status", authenticate, isAdmin, updateBookingStatus);

export default router;

