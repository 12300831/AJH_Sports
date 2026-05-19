/**
 * Lesson Booking Controller
 * Handles lesson booking operations (group coaching)
 */

import { Booking } from "../models/Booking.js";
import { Lesson } from "../models/Lesson.js";

// Book lesson
export const bookLesson = async (req, res) => {
  try {
    const { lesson_id, booking_type } = req.body;
    const userId = req.user.id;

    if (!lesson_id) {
      return res.status(400).json({
        success: false,
        message: "Lesson ID is required"
      });
    }

    if (!booking_type || !['single', 'pack'].includes(booking_type)) {
      return res.status(400).json({
        success: false,
        message: "Booking type must be 'single' or 'pack'"
      });
    }

    const lesson = await Lesson.findById(lesson_id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found"
      });
    }

    if (lesson.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Lesson is not available for booking"
      });
    }

    // Check if user already has a paid booking for this lesson
    const existingBookings = await Booking.getLessonBookingsByLesson(lesson_id);
    const userBooking = existingBookings.find(
      b => b.user_id === userId && 
      b.payment_status === 'paid' && 
      b.status !== 'cancelled'
    );

    if (userBooking) {
      return res.status(400).json({
        success: false,
        message: "You have already booked this lesson"
      });
    }

    // Create booking
    const bookingId = await Booking.createLessonBooking({
      lesson_id,
      user_id: userId,
      booking_type,
      status: "pending",
      payment_status: "pending"
    });

    const booking = await Booking.getLessonBookingById(bookingId);

    res.status(201).json({
      success: true,
      message: "Lesson booked successfully",
      booking
    });
  } catch (error) {
    console.error("Book lesson error:", error);
    res.status(500).json({
      success: false,
      message: "Error booking lesson"
    });
  }
};

// Cancel lesson booking
export const cancelLessonBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.getLessonBookingById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own bookings"
      });
    }

    const cancelled = await Booking.cancelLessonBooking(id, userId);
    if (!cancelled) {
      return res.status(400).json({
        success: false,
        message: "Unable to cancel booking. It may already be cancelled or completed."
      });
    }

    res.json({
      success: true,
      message: "Booking cancelled successfully"
    });
  } catch (error) {
    console.error("Cancel lesson booking error:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling booking"
    });
  }
};

// Get user's lesson bookings
export const getMyLessonBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.getLessonBookingsByUser(userId);

    // Parse pricing JSON strings
    const bookingsWithParsedPricing = bookings.map(booking => {
      if (booking.pricing) {
        try {
          booking.pricing = typeof booking.pricing === 'string' 
            ? JSON.parse(booking.pricing) 
            : booking.pricing;
        } catch (e) {
          booking.pricing = [];
        }
      } else {
        booking.pricing = [];
      }
      return booking;
    });

    res.json({
      success: true,
      bookings: bookingsWithParsedPricing
    });
  } catch (error) {
    console.error("Get my lesson bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching bookings"
    });
  }
};

// Admin: Get all lesson bookings
export const getAllLessonBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAllLessonBookings();

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error("Get all lesson bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching bookings"
    });
  }
};

// Admin: Get lesson bookings by lesson
export const getLessonBookingsByLesson = async (req, res) => {
  try {
    const { lesson_id } = req.params;
    const bookings = await Booking.getLessonBookingsByLesson(lesson_id);

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error("Get lesson bookings by lesson error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching bookings"
    });
  }
};
