/**
 * Event Routes
 */

import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  bookEvent,
  cancelEventBooking,
  getMyEventBookings,
  getAllEventBookings
} from "../controllers/eventController.js";
import { authenticate, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// User routes (authenticated)
router.post("/book", authenticate, bookEvent);
router.post("/cancel/:id", authenticate, cancelEventBooking);
router.get("/bookings/my", authenticate, getMyEventBookings);

// Admin routes
router.post("/", authenticate, isAdmin, createEvent);
router.put("/:id", authenticate, isAdmin, updateEvent);
router.delete("/:id", authenticate, isAdmin, deleteEvent);
router.get("/bookings/all", authenticate, isAdmin, getAllEventBookings);

export default router;

