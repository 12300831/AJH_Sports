/**
 * Booking Payment Controller
 * Handles payments for event and coach bookings
 */

import stripe from "../config/stripe.js";
import { Booking } from "../models/Booking.js";
import { Event } from "../models/Event.js";
import { Coach } from "../models/Coach.js";
import { createCalendarEvent } from "../services/googleCalendar.js";
import pool from "../config/db.js";

/**
 * Create payment intent for event booking
 */
export const createEventBookingPayment = async (req, res) => {
  try {
    const { booking_id } = req.body;
    const userId = req.user.id;

    if (!booking_id) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required"
      });
    }

    // Get booking
    const booking = await Booking.getEventBookingById(booking_id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Verify booking belongs to user
    if (booking.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Get event details
    const event = await Event.findById(booking.event_id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // Calculate amount (in cents)
    const amount = Math.round(event.price * 100);

    if (amount <= 0) {
      // Free event - confirm booking directly
      await Booking.updateEventBooking(booking_id, {
        payment_status: "paid",
        status: "confirmed"
      });

      // Create Google Calendar event
      const [users] = await pool.query("SELECT name, email FROM users WHERE id = ?", [userId]);
      const user = users[0];

      if (user) {
        const calendarEventId = await createCalendarEvent({
          title: event.name,
          description: event.description || `Event booking for ${event.name}`,
          date: event.date,
          time: event.time,
          duration: 60, // Default 1 hour for events
          userEmail: user.email,
          userName: user.name
        });

        if (calendarEventId) {
          // Store calendar event ID if needed (add column to event_bookings if required)
          console.log(`Calendar event created: ${calendarEventId}`);
        }
      }

      return res.json({
        success: true,
        message: "Booking confirmed (free event)",
        booking_id,
        payment_required: false
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: event.name,
              description: event.description || `Event booking for ${event.name}`
            },
            unit_amount: amount
          },
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=event&booking_id=${booking_id}`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment?canceled=true&type=event&booking_id=${booking_id}`,
      metadata: {
        booking_id: booking_id.toString(),
        booking_type: "event",
        event_id: event.id.toString(),
        user_id: userId.toString()
      }
    });

    // Update booking with session ID
    await Booking.updateEventBooking(booking_id, {
      stripe_session_id: session.id
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error("Create event booking payment error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating payment session"
    });
  }
};

/**
 * Create payment intent for coach booking
 */
export const createCoachBookingPayment = async (req, res) => {
  try {
    const { booking_id } = req.body;
    const userId = req.user.id;

    if (!booking_id) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required"
      });
    }

    // Get booking
    const booking = await Booking.getCoachBookingById(booking_id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Verify booking belongs to user
    if (booking.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Get coach details
    const coach = await Coach.findById(booking.coach_id);
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: "Coach not found"
      });
    }

    // Calculate amount (hourly rate * duration in hours, in cents)
    const hours = (booking.duration || 60) / 60;
    const amount = Math.round(coach.hourly_rate * hours * 100);

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid pricing"
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: `Coaching Session with ${coach.name}`,
              description: `${coach.specialty} - ${booking.duration || 60} minutes`
            },
            unit_amount: amount
          },
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=coach&booking_id=${booking_id}`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment?canceled=true&type=coach&booking_id=${booking_id}`,
      metadata: {
        booking_id: booking_id.toString(),
        booking_type: "coach",
        coach_id: coach.id.toString(),
        user_id: userId.toString()
      }
    });

    // Update booking with session ID
    await Booking.updateCoachBooking(booking_id, {
      stripe_session_id: session.id
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error("Create coach booking payment error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating payment session"
    });
  }
};

/**
 * Handle successful payment webhook
 * This should be called from the main payment webhook handler
 */
export const handleBookingPaymentSuccess = async (session) => {
  try {
    const { booking_id, booking_type } = session.metadata || {};

    if (!booking_id || !booking_type) {
      return;
    }

    if (booking_type === "event") {
      // Update event booking
      await Booking.updateEventBooking(parseInt(booking_id), {
        payment_status: "paid",
        status: "confirmed"
      });

      // Get booking and user details for calendar
      const booking = await Booking.getEventBookingById(parseInt(booking_id));
      if (booking) {
        const event = await Event.findById(booking.event_id);
        if (event) {
          const calendarEventId = await createCalendarEvent({
            title: event.name,
            description: event.description || `Event booking for ${event.name}`,
            date: event.date,
            time: event.time,
            duration: 60,
            userEmail: booking.user_email,
            userName: booking.user_name
          });

          if (calendarEventId) {
            console.log(`Calendar event created for event booking: ${calendarEventId}`);
          }
        }
      }
    } else if (booking_type === "coach") {
      // Update coach booking
      await Booking.updateCoachBooking(parseInt(booking_id), {
        payment_status: "paid",
        status: "confirmed"
      });

      // Get booking and user details for calendar
      const booking = await Booking.getCoachBookingById(parseInt(booking_id));
      if (booking) {
        const calendarEventId = await createCalendarEvent({
          title: `Coaching Session with ${booking.coach_name}`,
          description: `${booking.specialty} - ${booking.duration || 60} minutes`,
          date: booking.date,
          time: booking.time,
          duration: booking.duration || 60,
          userEmail: booking.user_email,
          userName: booking.user_name
        });

        if (calendarEventId) {
          // Update booking with calendar event ID
          await Booking.updateCoachBooking(parseInt(booking_id), {
            google_calendar_event_id: calendarEventId
          });
          console.log(`Calendar event created for coach booking: ${calendarEventId}`);
        }
      }
    }
  } catch (error) {
    console.error("Handle booking payment success error:", error);
  }
};

