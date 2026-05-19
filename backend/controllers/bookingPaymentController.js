/**
 * Booking Payment Controller
 * Handles payments for event and coach bookings
 */

import stripe from "../config/stripe.js";
import { Booking } from "../models/Booking.js";
import { Event } from "../models/Event.js";
import { Lesson } from "../models/Lesson.js";
import { Coach } from "../models/Coach.js";
import { createCalendarEvent } from "../services/googleCalendar.js";
import { sendBookingConfirmationEmail } from "../services/emailService.js";
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
 * This is called from the main payment webhook handler when checkout.session.completed
 * Creates the booking in the database with confirmed status
 * 
 * IDEMPOTENCY: Checks stripe_session_id to prevent double bookings from webhook retries
 * CAPACITY: Re-checks available spots before creating booking to prevent race conditions
 */
export const handleBookingPaymentSuccess = async (session) => {
  const stripeSessionId = session.id;
  
  console.log('[Webhook:BookingSuccess] ────────────────────────────────────────');
  console.log(`[Webhook:BookingSuccess] Processing session: ${stripeSessionId}`);

  try {
    const { booking_type, eventId, lesson_id, user_id, booking_id, coach_id, eventName, lesson_booking_type } = session.metadata || {};

    // Validate required metadata
    if (!booking_type || !user_id) {
      console.error('[Webhook:BookingSuccess] ❌ Missing required metadata');
      console.error('[Webhook:BookingSuccess] Received metadata:', JSON.stringify(session.metadata));
      return;
    }

    console.log(`[Webhook:BookingSuccess] Type: ${booking_type}, EventId: ${eventId}, LessonId: ${lesson_id}, UserId: ${user_id}`);

    const userId = parseInt(user_id);

    // ═══════════════════════════════════════════════════════════════════
    // EVENT BOOKINGS
    // ═══════════════════════════════════════════════════════════════════
    if (booking_type === "event" && eventId) {
      const eventIdNum = parseInt(eventId);
      const bookingIdFromMetadata = booking_id ? parseInt(booking_id) : null;

      // Get payment_intent_id from session
      const paymentIntentId = session.payment_intent || null;

      // IDEMPOTENCY CHECK 1: Check if this stripe_session_id was already processed
      const existingBySession = await Booking.findEventBookingByStripeSessionId(stripeSessionId);
      if (existingBySession) {
        console.log(`[Webhook:BookingSuccess] ℹ️ Session ${stripeSessionId} already processed`);
        console.log(`[Webhook:BookingSuccess] Existing booking ID: ${existingBySession.id}, status: ${existingBySession.status}`);
        return;
      }

      let bookingToUpdate = null;

      // PRIORITY 1: Check if we have a pending booking from metadata (created before Stripe session)
      if (bookingIdFromMetadata) {
        const pendingBooking = await Booking.getEventBookingById(bookingIdFromMetadata);
        if (pendingBooking && pendingBooking.status === 'pending' && pendingBooking.user_id === userId) {
          bookingToUpdate = pendingBooking;
          console.log(`[Webhook:BookingSuccess] Found pending booking #${bookingIdFromMetadata} to confirm`);
        }
      }

      // PRIORITY 2: If no pending booking found, check for existing booking
      if (!bookingToUpdate) {
        const existingBookings = await Booking.getEventBookingsByEvent(eventIdNum);
        const existingUserBooking = existingBookings.find(
          b => b.user_id === userId && b.status !== 'cancelled'
        );
        
        if (existingUserBooking) {
          bookingToUpdate = existingUserBooking;
          console.log(`[Webhook:BookingSuccess] ℹ️ Found existing booking #${existingUserBooking.id} for user ${userId}`);
        }
      }
      
      // UPDATE EXISTING/PENDING BOOKING TO CONFIRMED
      if (bookingToUpdate) {
        const updateData = {
          payment_status: "paid",
          status: "confirmed",
          stripe_session_id: stripeSessionId
        };
        
        // Add payment_intent_id if available
        if (paymentIntentId) {
          updateData.payment_intent_id = paymentIntentId;
        }

        await Booking.updateEventBooking(bookingToUpdate.id, updateData);
        console.log(`[Webhook:BookingSuccess] ✅ Updated booking #${bookingToUpdate.id} to confirmed/paid`);
        
        const event = await Event.findById(eventIdNum);
        const bookingDetails = await Booking.getEventBookingById(bookingToUpdate.id);
        
        // Get booking details for email and calendar
        if (bookingDetails && event) {
          // Send confirmation email (async, don't wait)
          sendBookingConfirmationEmail(bookingDetails, event, 'event').catch(err => {
            console.error('[Webhook:BookingSuccess] ⚠️ Failed to send confirmation email:', err);
          });

          // Create calendar event
          try {
            const calendarEventId = await createCalendarEvent({
              title: event.name,
              description: event.description || `Event booking for ${event.name}`,
              date: event.date,
              time: event.time,
              duration: 60,
              userEmail: bookingDetails.user_email,
              userName: bookingDetails.user_name
            });

            if (calendarEventId) {
              console.log(`[Webhook:BookingSuccess] 📅 Calendar event created: ${calendarEventId}`);
            }
          } catch (calendarError) {
            console.warn(`[Webhook:BookingSuccess] ⚠️ Failed to create calendar event: ${calendarError.message}`);
          }
        }
        
        return;
      }

      // CAPACITY CHECK: Re-check available spots to prevent race conditions
      const event = await Event.findById(eventIdNum);
      if (!event) {
        console.error(`[Webhook:BookingSuccess] ❌ Event ${eventIdNum} not found - cannot create booking`);
        return;
      }

      const availableSpots = await Event.getAvailableSpots(eventIdNum);
      console.log(`[Webhook:BookingSuccess] Event "${event.name}" - Available spots: ${availableSpots}/${event.max_players}`);
      
      if (availableSpots <= 0) {
        console.error(`[Webhook:BookingSuccess] ❌ Event "${event.name}" is fully booked`);
        console.error(`[Webhook:BookingSuccess] Payment received but no spots available - MANUAL REFUND MAY BE REQUIRED`);
        // TODO: In production, trigger automatic refund via Stripe API
        return;
      }

      // CREATE BOOKING (fallback - should not happen if pending booking was created)
      const createData = {
        event_id: eventIdNum,
        user_id: userId,
        status: "confirmed",
        payment_status: "paid",
        stripe_session_id: stripeSessionId
      };
      
      if (paymentIntentId) {
        createData.payment_intent_id = paymentIntentId;
      }

      const bookingId = await Booking.createEventBooking(createData);

      console.log(`[Webhook:BookingSuccess] ✅ Created event booking #${bookingId}`);
      console.log(`[Webhook:BookingSuccess] Event: "${eventName || event.name}", User: ${userId}`);

      // Verify available spots decreased
      const newAvailableSpots = await Event.getAvailableSpots(eventIdNum);
      console.log(`[Webhook:BookingSuccess] Available spots after booking: ${newAvailableSpots}/${event.max_players}`);

      // Get booking details for email and calendar
      const booking = await Booking.getEventBookingById(bookingId);
      if (booking) {
        // Send confirmation email (async, don't wait)
        sendBookingConfirmationEmail(booking, event, 'event').catch(err => {
          console.error('[Webhook:BookingSuccess] ⚠️ Failed to send confirmation email:', err);
        });

        // Create calendar event
        try {
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
            console.log(`[Webhook:BookingSuccess] 📅 Calendar event created: ${calendarEventId}`);
          }
        } catch (calendarError) {
          console.warn(`[Webhook:BookingSuccess] ⚠️ Failed to create calendar event: ${calendarError.message}`);
        }
      }

    // ═══════════════════════════════════════════════════════════════════
    // COACH BOOKINGS
    // ═══════════════════════════════════════════════════════════════════
    } else if (booking_type === "coach" && booking_id) {
      const bookingIdNum = parseInt(booking_id);

      // Get payment_intent_id from session
      const paymentIntentId = session.payment_intent || null;

      // IDEMPOTENCY CHECK: Check if this stripe_session_id was already processed
      const existingBySession = await Booking.findCoachBookingByStripeSessionId(stripeSessionId);
      if (existingBySession) {
        console.log(`[Webhook:BookingSuccess] ℹ️ Session ${stripeSessionId} already processed for coach booking`);
        return;
      }

      // Update existing pending booking to confirmed
      const updateData = {
        payment_status: "paid",
        status: "confirmed",
        stripe_session_id: stripeSessionId
      };
      
      if (paymentIntentId) {
        updateData.payment_intent_id = paymentIntentId;
      }

      await Booking.updateCoachBooking(bookingIdNum, updateData);

      console.log(`[Webhook:BookingSuccess] ✅ Updated coach booking #${bookingIdNum} to confirmed/paid`);

      // Get booking details for email and calendar
      const booking = await Booking.getCoachBookingById(bookingIdNum);
      if (booking) {
        // ALWAYS fetch latest coach details from database to ensure current info
        const coach = await Coach.findById(booking.coach_id);
        
        if (coach) {
          // Send confirmation email with current coach info (async, don't wait)
          sendBookingConfirmationEmail(booking, coach, 'coach').catch(err => {
            console.error('[Webhook:BookingSuccess] ⚠️ Failed to send confirmation email:', err);
          });
        }

        // Create calendar event
        try {
          const calendarEventId = await createCalendarEvent({
            title: `Coaching Session with ${booking.coach_name}`,
            description: `${booking.specialty} - ${booking.duration || 60} minutes`,
            date: booking.booking_date,
            time: booking.booking_time,
            duration: booking.duration || 60,
            userEmail: booking.user_email,
            userName: booking.user_name
          });

          if (calendarEventId) {
            await Booking.updateCoachBooking(bookingIdNum, {
              google_calendar_event_id: calendarEventId
            });
            console.log(`[Webhook:BookingSuccess] 📅 Calendar event created: ${calendarEventId}`);
          }
        } catch (calendarError) {
          console.warn(`[Webhook:BookingSuccess] ⚠️ Failed to create calendar event: ${calendarError.message}`);
        }
      }

    // ═══════════════════════════════════════════════════════════════════
    // LESSON BOOKINGS
    // ═══════════════════════════════════════════════════════════════════
    } else if (booking_type === "lesson" && lesson_id) {
      const lessonIdNum = parseInt(lesson_id);
      const bookingIdFromMetadata = booking_id ? parseInt(booking_id) : null;

      // Get payment_intent_id from session
      const paymentIntentId = session.payment_intent || null;

      // IDEMPOTENCY CHECK: Check if this stripe_session_id was already processed
      const existingBySession = await Booking.findLessonBookingByStripeSessionId(stripeSessionId);
      if (existingBySession) {
        console.log(`[Webhook:BookingSuccess] ℹ️ Session ${stripeSessionId} already processed for lesson booking`);
        console.log(`[Webhook:BookingSuccess] Existing booking ID: ${existingBySession.id}, status: ${existingBySession.status}`);
        return;
      }

      let bookingToUpdate = null;

      // PRIORITY 1: Check if we have a pending booking from metadata (created before Stripe session)
      if (bookingIdFromMetadata) {
        const pendingBooking = await Booking.getLessonBookingById(bookingIdFromMetadata);
        if (pendingBooking && pendingBooking.status === 'pending' && pendingBooking.user_id === userId) {
          bookingToUpdate = pendingBooking;
          console.log(`[Webhook:BookingSuccess] Found pending lesson booking #${bookingIdFromMetadata} to confirm`);
        }
      }

      // PRIORITY 2: If no pending booking found, check for existing booking
      if (!bookingToUpdate) {
        const existingBookings = await Booking.getLessonBookingsByLesson(lessonIdNum);
        const existingUserBooking = existingBookings.find(
          b => b.user_id === userId && 
          b.booking_type === lesson_booking_type &&
          b.status !== 'cancelled'
        );
        
        if (existingUserBooking) {
          bookingToUpdate = existingUserBooking;
          console.log(`[Webhook:BookingSuccess] ℹ️ Found existing lesson booking #${existingUserBooking.id} for user ${userId}`);
        }
      }
      
      // UPDATE EXISTING/PENDING BOOKING TO CONFIRMED
      if (bookingToUpdate) {
        const updateData = {
          payment_status: "paid",
          status: "confirmed",
          stripe_session_id: stripeSessionId
        };
        
        // Add payment_intent_id if available
        if (paymentIntentId) {
          updateData.payment_intent_id = paymentIntentId;
        }

        await Booking.updateLessonBooking(bookingToUpdate.id, updateData);
        console.log(`[Webhook:BookingSuccess] ✅ Updated lesson booking #${bookingToUpdate.id} to confirmed/paid`);
        
        const lesson = await Lesson.findById(lessonIdNum);
        const bookingDetails = await Booking.getLessonBookingById(bookingToUpdate.id);
        
        // Get booking details for email
        if (bookingDetails && lesson) {
          // Send confirmation email (async, don't wait)
          sendBookingConfirmationEmail(bookingDetails, lesson, 'lesson').catch(err => {
            console.error('[Webhook:BookingSuccess] ⚠️ Failed to send confirmation email:', err);
          });
        }
        
        return;
      }

      // CREATE BOOKING (fallback - should not happen if pending booking was created)
      const createData = {
        lesson_id: lessonIdNum,
        user_id: userId,
        booking_type: lesson_booking_type || 'single',
        status: "confirmed",
        payment_status: "paid",
        stripe_session_id: stripeSessionId
      };
      
      if (paymentIntentId) {
        createData.payment_intent_id = paymentIntentId;
      }

      const bookingId = await Booking.createLessonBooking(createData);

      console.log(`[Webhook:BookingSuccess] ✅ Created lesson booking #${bookingId}`);
      console.log(`[Webhook:BookingSuccess] Lesson: "${eventName || 'Unknown'}", Type: ${lesson_booking_type}, User: ${userId}`);

      // Get booking details for email
      const booking = await Booking.getLessonBookingById(bookingId);
      const lesson = await Lesson.findById(lessonIdNum);
      
      if (booking && lesson) {
        // Send confirmation email (async, don't wait)
        sendBookingConfirmationEmail(booking, lesson, 'lesson').catch(err => {
          console.error('[Webhook:BookingSuccess] ⚠️ Failed to send confirmation email:', err);
        });
      }
    } else {
      console.warn(`[Webhook:BookingSuccess] ⚠️ Unhandled booking type or missing ID`);
      console.warn(`[Webhook:BookingSuccess] Type: ${booking_type}, EventId: ${eventId}, LessonId: ${lesson_id}, BookingId: ${booking_id}`);
    }
  } catch (error) {
    console.error("[Webhook:BookingSuccess] ❌ Error processing payment success:", error);
    console.error("[Webhook:BookingSuccess] Stack:", error.stack);
    // Don't throw - webhook should return 200 even if processing fails
    // The error is logged for investigation
  }

  console.log('[Webhook:BookingSuccess] ────────────────────────────────────────');
};

