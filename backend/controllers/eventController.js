/**
 * Event Controller
 * Handles event operations
 */

import { Event } from "../models/Event.js";
import { Booking } from "../models/Booking.js";

// Get all events
export const getEvents = async (req, res) => {
  try {
    const { status, date, dateFrom } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (date) filters.date = date;
    if (dateFrom) filters.dateFrom = dateFrom;

    const events = await Event.findAll(filters);

    // Add available spots for each event
    const eventsWithSpots = await Promise.all(
      events.map(async (event) => {
        const availableSpots = await Event.getAvailableSpots(event.id);
        return {
          ...event,
          available_spots: availableSpots,
          booked_spots: event.max_players - availableSpots
        };
      })
    );

    res.json({
      success: true,
      events: eventsWithSpots
    });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching events"
    });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    const availableSpots = await Event.getAvailableSpots(id);
    const bookings = await Booking.getEventBookingsByEvent(id);

    res.json({
      success: true,
      event: {
        ...event,
        available_spots: availableSpots,
        booked_spots: event.max_players - availableSpots,
        bookings_count: bookings.length
      }
    });
  } catch (error) {
    console.error("Get event by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching event"
    });
  }
};

// Admin: Create event
export const createEvent = async (req, res) => {
  try {
    const { name, description, date, time, max_players, price, location, status } = req.body;

    // Validation
    if (!name || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Name, date, and time are required"
      });
    }

    const eventId = await Event.create({
      name,
      description,
      date,
      time,
      max_players: max_players || 20,
      price: price || 0,
      location,
      status: status || "active"
    });

    const event = await Event.findById(eventId);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating event"
    });
  }
};

// Admin: Update event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, date, time, max_players, price, location, status } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    const updated = await Event.update(id, {
      name: name || event.name,
      description: description !== undefined ? description : event.description,
      date: date || event.date,
      time: time || event.time,
      max_players: max_players || event.max_players,
      price: price !== undefined ? price : event.price,
      location: location !== undefined ? location : event.location,
      status: status || event.status
    });

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "Failed to update event"
      });
    }

    const updatedEvent = await Event.findById(id);

    res.json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent
    });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating event"
    });
  }
};

// Admin: Delete event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    const deleted = await Event.delete(id);

    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: "Failed to delete event"
      });
    }

    res.json({
      success: true,
      message: "Event deleted successfully"
    });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting event"
    });
  }
};

// Book event
export const bookEvent = async (req, res) => {
  try {
    const { event_id } = req.body;
    const userId = req.user.id;

    if (!event_id) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required"
      });
    }

    const event = await Event.findById(event_id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    if (event.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Event is not available for booking"
      });
    }

    // Check available spots
    const availableSpots = await Event.getAvailableSpots(event_id);
    if (availableSpots <= 0) {
      return res.status(400).json({
        success: false,
        message: "Event is fully booked"
      });
    }

    // Check if user already booked this event
    const existingBookings = await Booking.getEventBookingsByEvent(event_id);
    const userBooking = existingBookings.find(b => b.user_id === userId && b.status !== "cancelled");

    if (userBooking) {
      return res.status(400).json({
        success: false,
        message: "You have already booked this event"
      });
    }

    // Create booking
    const bookingId = await Booking.createEventBooking({
      event_id,
      user_id: userId,
      status: "pending",
      payment_status: "pending"
    });

    const booking = await Booking.getEventBookingById(bookingId);

    res.status(201).json({
      success: true,
      message: "Event booked successfully",
      booking
    });
  } catch (error) {
    console.error("Book event error:", error);
    res.status(500).json({
      success: false,
      message: "Error booking event"
    });
  }
};

// Cancel event booking
export const cancelEventBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.getEventBookingById(id);
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

    const cancelled = await Booking.cancelEventBooking(id, userId);

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
    console.error("Cancel event booking error:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling booking"
    });
  }
};

// Get user's event bookings
// Get all event bookings (admin only)
export const getAllEventBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAllEventBookings();
    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error("Get all event bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching event bookings"
    });
  }
};

export const getMyEventBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.getEventBookingsByUser(userId);

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error("Get my event bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching bookings"
    });
  }
};

