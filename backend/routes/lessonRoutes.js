/**
 * Lesson Routes
 */

import express from "express";
import {
  getLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  hardDeleteLesson,
  sendTestEmail,
} from "../controllers/lessonController.js";
import {
  bookLesson,
  cancelLessonBooking,
  getMyLessonBookings,
  getAllLessonBookings,
  getLessonBookingsByLesson,
} from "../controllers/lessonBookingController.js";
import { authenticate, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getLessons);
router.get("/:id", getLessonById);

// User routes (authenticated)
router.post("/book", authenticate, bookLesson);
router.post("/cancel/:id", authenticate, cancelLessonBooking);
router.get("/bookings/my", authenticate, getMyLessonBookings);

// Admin routes
router.post("/", authenticate, isAdmin, createLesson);
router.put("/:id", authenticate, isAdmin, updateLesson);
router.post("/:id/test-email", authenticate, isAdmin, sendTestEmail);
router.delete("/:id/hard-delete", authenticate, isAdmin, hardDeleteLesson); // Must come before /:id
router.delete("/:id", authenticate, isAdmin, deleteLesson);
router.get("/bookings/all", authenticate, isAdmin, getAllLessonBookings);
router.get("/:lesson_id/bookings", authenticate, isAdmin, getLessonBookingsByLesson);

export default router;
