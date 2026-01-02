/**
 * Booking Payment Routes
 * Handles payments for event and coach bookings
 */

import express from "express";
import {
  createEventBookingPayment,
  createCoachBookingPayment
} from "../controllers/bookingPaymentController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Payment routes (authenticated)
router.post("/event", authenticate, createEventBookingPayment);
router.post("/coach", authenticate, createCoachBookingPayment);

export default router;

