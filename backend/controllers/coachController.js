/**
 * Coach Controller
 * Handles coach operations
 */

import { Coach } from "../models/Coach.js";
import { Booking } from "../models/Booking.js";

// Get all coaches
export const getCoaches = async (req, res) => {
  try {
    const { status } = req.query;
    const filters = {};

    if (status) filters.status = status;

    const coaches = await Coach.findAll(filters);

    res.json({
      success: true,
      coaches
    });
  } catch (error) {
    console.error("Get coaches error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching coaches"
    });
  }
};

// Get coach by ID
export const getCoachById = async (req, res) => {
  try {
    const { id } = req.params;
    const coach = await Coach.findById(id);

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: "Coach not found"
      });
    }

    // Get upcoming bookings for this coach
    const bookings = await Booking.getCoachBookingsByCoach(id);

    res.json({
      success: true,
      coach: {
        ...coach,
        upcoming_bookings: bookings.filter(b => b.status === "confirmed" && new Date(`${b.date} ${b.time}`) >= new Date())
      }
    });
  } catch (error) {
    console.error("Get coach by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching coach"
    });
  }
};

// Admin: Create coach
export const createCoach = async (req, res) => {
  try {
    const { name, specialty, email, phone, availability, hourly_rate, status } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    const coachId = await Coach.create({
      name,
      specialty,
      email,
      phone,
      availability,
      hourly_rate: hourly_rate || 0,
      status: status || "active"
    });

    const coach = await Coach.findById(coachId);

    res.status(201).json({
      success: true,
      message: "Coach created successfully",
      coach
    });
  } catch (error) {
    console.error("Create coach error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating coach"
    });
  }
};

// Admin: Update coach
export const updateCoach = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialty, email, phone, availability, hourly_rate, status } = req.body;

    const coach = await Coach.findById(id);
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: "Coach not found"
      });
    }

    const updated = await Coach.update(id, {
      name: name || coach.name,
      specialty: specialty !== undefined ? specialty : coach.specialty,
      email: email !== undefined ? email : coach.email,
      phone: phone !== undefined ? phone : coach.phone,
      availability: availability !== undefined ? availability : coach.availability,
      hourly_rate: hourly_rate !== undefined ? hourly_rate : coach.hourly_rate,
      status: status || coach.status
    });

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "Failed to update coach"
      });
    }

    const updatedCoach = await Coach.findById(id);

    res.json({
      success: true,
      message: "Coach updated successfully",
      coach: updatedCoach
    });
  } catch (error) {
    console.error("Update coach error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating coach"
    });
  }
};

// Admin: Delete coach
export const deleteCoach = async (req, res) => {
  try {
    const { id } = req.params;

    const coach = await Coach.findById(id);
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: "Coach not found"
      });
    }

    const deleted = await Coach.delete(id);

    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: "Failed to delete coach"
      });
    }

    res.json({
      success: true,
      message: "Coach deleted successfully"
    });
  } catch (error) {
    console.error("Delete coach error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting coach"
    });
  }
};

// Book coach session
export const bookCoach = async (req, res) => {
  try {
    const { coach_id, date, time, duration, notes } = req.body;
    const userId = req.user.id;

    // Validation
    if (!coach_id || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Coach ID, date, and time are required"
      });
    }

    const coach = await Coach.findById(coach_id);
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: "Coach not found"
      });
    }

    if (coach.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Coach is not available for booking"
      });
    }

    // Check if coach is available
    const isAvailable = await Coach.isAvailable(coach_id, date, time, duration || 60);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Coach is not available at this time"
      });
    }

    // Check if date is in the past
    const bookingDateTime = new Date(`${date} ${time}`);
    if (bookingDateTime < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot book sessions in the past"
      });
    }

    // Create booking
    const bookingId = await Booking.createCoachBooking({
      coach_id,
      user_id: userId,
      date,
      time,
      duration: duration || 60,
      status: "pending",
      payment_status: "pending",
      notes
    });

    const booking = await Booking.getCoachBookingById(bookingId);

    res.status(201).json({
      success: true,
      message: "Coach session booked successfully",
      booking
    });
  } catch (error) {
    console.error("Book coach error:", error);
    res.status(500).json({
      success: false,
      message: "Error booking coach session"
    });
  }
};

// Cancel coach booking
export const cancelCoachBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.getCoachBookingById(id);
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

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled"
      });
    }

    const cancelled = await Booking.cancelCoachBooking(id, userId);

    if (!cancelled) {
      return res.status(400).json({
        success: false,
        message: "Failed to cancel booking"
      });
    }

    res.json({
      success: true,
      message: "Booking cancelled successfully"
    });
  } catch (error) {
    console.error("Cancel coach booking error:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling booking"
    });
  }
};

// Get user's coach bookings
// Get all coach bookings (admin only)
export const getAllCoachBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAllCoachBookings();
    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error("Get all coach bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching coach bookings"
    });
  }
};

// Update booking status (admin only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, type, status } = req.body;
    
    if (!bookingId || !type || !status) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: bookingId, type, status"
      });
    }

    if (!['event', 'coach'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be 'event' or 'coach'"
      });
    }

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'pending', 'confirmed', or 'cancelled'"
      });
    }

    const success = await Booking.updateBookingStatus(bookingId, type, status);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.json({
      success: true,
      message: "Booking status updated successfully"
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating booking status"
    });
  }
};

export const getMyCoachBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.getCoachBookingsByUser(userId);

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error("Get my coach bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching bookings"
    });
  }
};

