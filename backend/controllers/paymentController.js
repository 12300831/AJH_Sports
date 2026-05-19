import { handleBookingPaymentSuccess } from './bookingPaymentController.js';
import { Event } from '../models/Event.js';
import { Lesson } from '../models/Lesson.js';
import { Booking } from '../models/Booking.js';
import pool from '../config/db.js';

// Error codes for structured error responses
const ERROR_CODES = {
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  EVENT_NOT_FOUND: 'EVENT_NOT_FOUND',
  EVENT_UNAVAILABLE: 'EVENT_UNAVAILABLE',
  EVENT_FULL: 'EVENT_FULL',
  ALREADY_REGISTERED: 'ALREADY_REGISTERED',
  STRIPE_CONFIG_MISSING: 'STRIPE_CONFIG_MISSING',
  STRIPE_ERROR: 'STRIPE_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
};

/**
 * Create a Stripe Checkout Session
 * This endpoint creates a secure payment session that redirects users to Stripe's hosted checkout page
 * PROTECTED: Requires JWT authentication (user must be logged in)
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        code: ERROR_CODES.AUTH_REQUIRED,
        message: 'Authentication required. Please log in.'
      });
    }

    const { 
      eventId: originalEventId, 
      eventName: frontendEventName, // Rename to avoid conflict
      amount: frontendAmount, // Rename to avoid conflict
      currency = 'AUD',
      customerEmail,
      successUrl,
      cancelUrl,
      bookingType = 'event', // 'event', 'coach', or 'lesson'
      coachId,
      lessonId, // For lesson bookings
      bookingType_lesson, // 'single' or 'pack' for lesson bookings
      bookingId: existingBookingId, // Rename to avoid conflict
      bookingDate, // For coach bookings
      bookingTime, // For coach bookings
      bookingDuration // For coach bookings (in minutes)
    } = req.body;
    
    // These will be set to database values for events, or frontend values for coaches
    let eventName = frontendEventName;
    let amount = frontendAmount;
    // eventId will be set based on booking type (eventId for events/coaches, lessonId for lessons)
    let eventId = originalEventId;

    // Validate required fields based on booking type
    if (bookingType === 'lesson') {
      // For lesson bookings, lessonId is required instead of eventId
      if (!lessonId || !frontendEventName || !frontendAmount) {
        return res.status(400).json({
          success: false,
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Missing required fields: lessonId, eventName, and amount are required for lesson bookings'
        });
      }
      // Set eventId to lessonId for consistency in metadata and URL building
      eventId = lessonId;
    } else {
      // For event and coach bookings, eventId is required
      if (!eventId || !frontendEventName || !frontendAmount) {
        return res.status(400).json({
          success: false,
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Missing required fields: eventId, eventName, and amount are required'
        });
      }
    }

    // bookingId will be set to either existingBookingId (for coaches/lessons) or newly created (for events)
    let bookingId = existingBookingId || null;
    let event = null;
    let coach = null;
    let lesson = null;

    // For event bookings, validate capacity, check for duplicates, and create pending booking
    if (bookingType === 'event') {
      // ALWAYS fetch event from database to ensure we use current data
      event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          code: ERROR_CODES.EVENT_NOT_FOUND,
          message: 'Event not found'
        });
      }
      if (event.status !== 'active') {
        return res.status(400).json({
          success: false,
          code: ERROR_CODES.EVENT_UNAVAILABLE,
          message: 'This event is no longer available for registration'
        });
      }

      // Check available spots
      const availableSpots = await Event.getAvailableSpots(eventId);
      if (availableSpots <= 0) {
        return res.status(400).json({
          success: false,
          code: ERROR_CODES.EVENT_FULL,
          message: 'Sorry, this event is fully booked'
        });
      }

      // Check for existing PAID booking (prevent duplicates)
      // Only block if user has a PAID booking - allow retry if they cancelled Stripe checkout
      const existingBookings = await Booking.getEventBookingsByEvent(eventId);
      const paidBooking = existingBookings.find(
        b => b.user_id === userId && b.payment_status === 'paid' && b.status !== 'cancelled'
      );
      if (paidBooking) {
        return res.status(409).json({
          success: false,
          code: ERROR_CODES.ALREADY_REGISTERED,
          message: 'You have already registered for this event'
        });
      }
      
      // If user has a pending booking from a previous attempt, we'll update it instead of creating a new one
      const pendingBooking = existingBookings.find(
        b => b.user_id === userId && b.payment_status === 'pending' && b.status === 'pending'
      );
      if (pendingBooking) {
        // Use existing pending booking ID - webhook will update it when payment succeeds
        bookingId = pendingBooking.id;
        console.log(`ℹ️ Found existing pending booking #${bookingId} - will update on payment success`);
      }

      // USE DATABASE VALUES FOR STRIPE (always current, even if admin changed event)
      // Override frontend values with database values
      eventName = event.name; // Use current name from database
      const eventPrice = parseFloat(event.price) || 0;
      amount = eventPrice; // Use current price from database
      
      console.log(`📊 Using database values - Event: "${eventName}", Price: $${amount}`);

      // CREATE PENDING BOOKING ONLY IF ONE DOESN'T EXIST
      // If user cancelled Stripe before, they can retry - we'll reuse the pending booking
      if (!bookingId) {
        bookingId = await Booking.createEventBooking({
          event_id: eventId,
          user_id: userId,
          status: 'pending',
          payment_status: 'pending',
          stripe_session_id: null // Will be updated after session creation
        });
        console.log(`✅ Created pending booking #${bookingId} for event ${eventId}`);
      } else {
        console.log(`ℹ️ Reusing existing pending booking #${bookingId} for retry`);
      }
    }

    // For coach bookings, validate and create pending booking
    if (bookingType === 'coach') {
      if (!coachId) {
        return res.status(400).json({
          success: false,
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'coachId is required for coach bookings'
        });
      }

      // ALWAYS fetch coach from database to ensure we use current data
      const [coachRows] = await pool.query('SELECT * FROM coaches WHERE id = ?', [coachId]);
      coach = coachRows[0] || null;
      
      if (!coach) {
        return res.status(404).json({
          success: false,
          code: ERROR_CODES.EVENT_NOT_FOUND,
          message: 'Coach not found'
        });
      }

      if (coach.status !== 'active') {
        return res.status(400).json({
          success: false,
          code: ERROR_CODES.EVENT_UNAVAILABLE,
          message: 'Coach is not available for booking'
        });
      }

      // Validate date/time/duration for coach bookings
      if (!bookingDate || !bookingTime || !bookingDuration) {
        return res.status(400).json({
          success: false,
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'bookingDate, bookingTime, and bookingDuration are required for coach bookings'
        });
      }

      // Check if coach is available at selected time
      try {
        const Coach = (await import('../models/Coach.js')).Coach;
        const coachIdInt = parseInt(coachId, 10);
        if (isNaN(coachIdInt)) {
          return res.status(400).json({
            success: false,
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'Invalid coach ID'
          });
        }
        const isAvailable = await Coach.isAvailable(coachIdInt, bookingDate, bookingTime, parseInt(bookingDuration, 10));
        if (!isAvailable) {
          return res.status(400).json({
            success: false,
            code: ERROR_CODES.EVENT_UNAVAILABLE,
            message: 'Coach is not available at this time'
          });
        }
      } catch (availabilityError) {
        console.error('Error checking coach availability:', availabilityError);
        return res.status(500).json({
          success: false,
          code: ERROR_CODES.SERVER_ERROR,
          message: 'Error checking coach availability: ' + availabilityError.message
        });
      }

      // Check for existing pending booking to reuse
      const coachIdInt = parseInt(coachId, 10);
      const existingBookings = await Booking.getCoachBookingsByCoach(coachIdInt);
      const pendingBooking = existingBookings.find(
        b => b.user_id === userId && b.status === 'pending' && b.booking_date === bookingDate && b.booking_time === bookingTime
      );

      if (pendingBooking) {
        bookingId = pendingBooking.id;
        console.log(`ℹ️ Reusing existing pending booking #${bookingId} for coach ${coachIdInt}`);
      } else {
        // CREATE NEW PENDING BOOKING BEFORE STRIPE SESSION
        try {
          bookingId = await Booking.createCoachBooking({
            coach_id: coachIdInt,
            user_id: userId,
            booking_date: bookingDate,
            booking_time: bookingTime,
            duration: parseInt(bookingDuration, 10),
            status: 'pending',
            payment_status: 'pending',
            stripe_session_id: null // Will be updated after session creation
          });
          console.log(`✅ Created new pending booking #${bookingId} for coach ${coachIdInt}`);
        } catch (bookingError) {
          console.error('Error creating coach booking:', bookingError);
          return res.status(500).json({
            success: false,
            code: ERROR_CODES.SERVER_ERROR,
            message: 'Error creating booking: ' + bookingError.message
          });
        }
      }

      // USE DATABASE VALUES FOR STRIPE (always current, even if admin changed coach)
      eventName = `Coaching Session with ${coach.name}`; // Use current name from database
      const coachHourlyRate = parseFloat(coach.hourly_rate) || 0;
      const durationHours = parseFloat(bookingDuration) / 60;
      amount = coachHourlyRate * durationHours; // Use current hourly_rate from database

      console.log(`📊 Using database values - Coach: "${coach.name}", Hourly Rate: $${coachHourlyRate}, Duration: ${bookingDuration}min, Total: $${amount}`);
    }

    // For lesson bookings, validate and create pending booking
    if (bookingType === 'lesson') {
      if (!lessonId) {
        return res.status(400).json({
          success: false,
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'lessonId is required for lesson bookings'
        });
      }

      if (!bookingType_lesson || !['single', 'pack'].includes(bookingType_lesson)) {
        return res.status(400).json({
          success: false,
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'bookingType_lesson must be "single" or "pack"'
        });
      }

      // ALWAYS fetch lesson from database to ensure we use current data
      lesson = await Lesson.findById(lessonId);
      
      if (!lesson) {
        return res.status(404).json({
          success: false,
          code: ERROR_CODES.EVENT_NOT_FOUND,
          message: 'Lesson not found'
        });
      }

      if (lesson.status !== 'active') {
        return res.status(400).json({
          success: false,
          code: ERROR_CODES.EVENT_UNAVAILABLE,
          message: 'Lesson is not available for booking'
        });
      }

      // Parse pricing JSON to get single/pack prices
      let pricing = [];
      if (lesson.pricing) {
        try {
          pricing = typeof lesson.pricing === 'string' 
            ? JSON.parse(lesson.pricing) 
            : lesson.pricing;
        } catch (e) {
          pricing = [];
        }
      }

      // Find price based on booking type (single or pack)
      // For now, we'll use the first pricing option if available
      // In the future, you might want to support multiple pricing tiers
      let lessonPrice = 0;
      if (pricing.length > 0) {
        const priceOption = pricing[0];
        if (bookingType_lesson === 'single') {
          // Extract number from price string (e.g., "$80" -> 80)
          const singlePriceStr = priceOption.single || priceOption.single_price || '0';
          lessonPrice = parseFloat(singlePriceStr.replace(/[^0-9.]/g, '')) || 0;
        } else if (bookingType_lesson === 'pack') {
          // Extract number from price string (e.g., "$700*" -> 700)
          const packPriceStr = priceOption.pack || priceOption.pack_price || '0';
          lessonPrice = parseFloat(packPriceStr.replace(/[^0-9.]/g, '')) || 0;
        }
      }

      if (lessonPrice <= 0) {
        return res.status(400).json({
          success: false,
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Lesson pricing not configured. Please contact support.'
        });
      }

      // Check for existing pending booking to reuse
      const existingBookings = await Booking.getLessonBookingsByLesson(lessonId);
      const pendingBooking = existingBookings.find(
        b => b.user_id === userId && 
        b.booking_type === bookingType_lesson &&
        b.status === 'pending' && 
        b.payment_status === 'pending'
      );

      if (pendingBooking) {
        bookingId = pendingBooking.id;
        console.log(`ℹ️ Reusing existing pending booking #${bookingId} for lesson ${lessonId}`);
      } else {
        // CREATE NEW PENDING BOOKING BEFORE STRIPE SESSION
        try {
          bookingId = await Booking.createLessonBooking({
            lesson_id: lessonId,
            user_id: userId,
            booking_type: bookingType_lesson,
            status: 'pending',
            payment_status: 'pending',
            stripe_session_id: null // Will be updated after session creation
          });
          console.log(`✅ Created new pending booking #${bookingId} for lesson ${lessonId} (${bookingType_lesson})`);
        } catch (bookingError) {
          console.error('Error creating lesson booking:', bookingError);
          return res.status(500).json({
            success: false,
            code: ERROR_CODES.SERVER_ERROR,
            message: 'Error creating booking: ' + bookingError.message
          });
        }
      }

      // USE DATABASE VALUES FOR STRIPE (always current, even if admin changed lesson)
      eventName = `${lesson.title} - ${bookingType_lesson === 'pack' ? '10 Session Pack' : 'Single Session'}`;
      amount = lessonPrice; // Use calculated price from database

      console.log(`📊 Using database values - Lesson: "${lesson.title}", Type: ${bookingType_lesson}, Price: $${amount}`);
    }

    // Validate amount is a positive number
    const amountInCents = Math.round(parseFloat(amount) * 100);
    if (isNaN(amountInCents) || amountInCents <= 0) {
      return res.status(400).json({
        success: false,
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Amount must be a positive number'
      });
    }

    // Validate Stripe configuration
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const isStripeKeyMissing = !stripeKey || stripeKey.trim() === '' || stripeKey.includes('placeholder');

    // Check if we should use mock mode (development only with no key)
    const isDevelopmentMode = process.env.NODE_ENV === 'development' && isStripeKeyMissing;

    if (isDevelopmentMode) {
      // Mock payment for development (no Stripe key needed)
      console.log('⚠️  Development Mode: Using mock payment (Stripe key not configured)');
      
      // Build mock session response
      const mockSessionId = `cs_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Build metadata
      const metadata = {
        eventId: eventId ? eventId.toString() : (lessonId ? lessonId.toString() : ''),
        eventName: eventName,
        booking_type: bookingType,
        user_id: userId.toString(),
      };
      
      if (bookingType === 'coach') {
        if (coachId) metadata.coach_id = coachId.toString();
        if (bookingId) metadata.booking_id = bookingId.toString();
        if (bookingDate && bookingTime) {
          metadata.slotStartTime = `${bookingDate}T${bookingTime}:00`; // ISO format
        }
        if (bookingDuration) {
          metadata.duration = bookingDuration.toString(); // Duration in minutes
        }
      } else if (bookingType === 'lesson') {
        if (lessonId) metadata.lesson_id = lessonId.toString();
        if (bookingType_lesson) metadata.lesson_booking_type = bookingType_lesson;
        if (bookingId) metadata.booking_id = bookingId.toString();
      }

      // Build frontend base URL
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      
      // Return mock response that redirects directly to events page with success params
      const finalSuccessUrl = (successUrl || `${frontendUrl}/events?payment=success&eventId=${eventId}&session_id={CHECKOUT_SESSION_ID}`)
        .replace('{CHECKOUT_SESSION_ID}', mockSessionId);
      
      return res.json({
        success: true,
        sessionId: mockSessionId,
        url: finalSuccessUrl,
        mock: true,
        message: 'Development Mode: Payment simulated successfully. Add STRIPE_SECRET_KEY to use real payments.'
      });
    }

    // Production mode - Stripe key is required
    if (isStripeKeyMissing) {
      console.error('❌ STRIPE_SECRET_KEY is missing or invalid');
      return res.status(500).json({
        success: false,
        code: ERROR_CODES.STRIPE_CONFIG_MISSING,
        message: 'Payment system is not configured. Please contact support.'
      });
    }

    // Import and initialize Stripe
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2024-11-20.acacia',
    });

    // Get user email if customerEmail not provided
    let userEmail = customerEmail;
    if (!userEmail) {
      const [userRows] = await pool.query('SELECT email FROM users WHERE id = ?', [userId]);
      if (userRows[0]) {
        userEmail = userRows[0].email;
      }
    }

    // Build metadata based on booking type - include bookingId
    // ALWAYS use database values for metadata (eventName is now from database for events)
    const metadata = {
      eventId: eventId.toString(),
      eventName: eventName, // This is now from database for events (updated above)
      booking_type: bookingType,
      user_id: userId.toString(),
    };

    // Add bookingId to metadata if we created a pending booking
    if (bookingId) {
      metadata.booking_id = bookingId.toString();
    }

    // Add coach-specific metadata if it's a coach booking
    if (bookingType === 'coach') {
      if (coachId) metadata.coach_id = coachId.toString();
      if (bookingId) metadata.booking_id = bookingId.toString();
      if (bookingDate && bookingTime) {
        metadata.slotStartTime = `${bookingDate}T${bookingTime}:00`; // ISO format
      }
      if (bookingDuration) {
        metadata.duration = bookingDuration.toString(); // Duration in minutes
      }
    }

    // Add lesson-specific metadata if it's a lesson booking
    if (bookingType === 'lesson') {
      if (lessonId) metadata.lesson_id = lessonId.toString();
      if (bookingType_lesson) metadata.lesson_booking_type = bookingType_lesson;
      if (bookingId) metadata.booking_id = bookingId.toString();
    }

    // Build enhanced description with date, time, coach name
    // ALWAYS use database values for description (event is fetched from DB above)
    let description = '';
    if (bookingType === 'event' && event) {
      // Event: Include date and time from database
      try {
        const dateStr = event.date instanceof Date 
          ? event.date.toISOString().split('T')[0] 
          : String(event.date).trim();
        const timeStr = event.time instanceof Date 
          ? event.time.toTimeString().split(' ')[0] 
          : String(event.time).trim();
        const timeWithoutSeconds = timeStr.split(':').slice(0, 2).join(':');
        
        const eventDate = new Date(`${dateStr}T${timeWithoutSeconds}:00`).toLocaleString('en-AU', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        description = `${event.name} - ${eventDate}`;
        if (event.location) {
          description += ` at ${event.location}`;
        }
        // Add description if available
        if (event.description) {
          description += ` | ${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}`;
        }
      } catch (error) {
        console.error('[Payment] Error formatting event date for Stripe description:', error);
        description = `${event.name}`;
        if (event.location) {
          description += ` at ${event.location}`;
        }
      }
    } else if (bookingType === 'coach' && coach) {
      // Coach: Include coach name and specialty
      description = `Coaching session with ${coach.name}`;
      if (coach.specialty) {
        description += ` (${coach.specialty})`;
      }
    } else if (bookingType === 'lesson' && lesson) {
      // Lesson: Include lesson title and booking type
      description = `${lesson.title} - ${bookingType_lesson === 'pack' ? '10 Session Pack' : 'Single Session'}`;
      if (lesson.description) {
        description += ` | ${lesson.description.substring(0, 100)}${lesson.description.length > 100 ? '...' : ''}`;
      }
    } else {
      // Fallback
      description = bookingType === 'coach' 
        ? `Coaching session: ${eventName}` 
        : bookingType === 'lesson'
        ? `Lesson booking: ${eventName}`
        : `Registration for ${eventName}`;
    }

    // Build frontend base URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // Build success and cancel URLs with query params for frontend handling
    const defaultSuccessUrl = `${frontendUrl}/events?payment=success&eventId=${eventId}&session_id={CHECKOUT_SESSION_ID}`;
    const defaultCancelUrl = `${frontendUrl}/events?payment=cancel&eventId=${eventId}`;
    
    // Create Stripe Checkout Session with enhanced details
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: eventName, // This will show on Stripe receipt
              description: description, // Enhanced description with date/time/coach
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || defaultSuccessUrl,
      cancel_url: cancelUrl || defaultCancelUrl,
      customer_email: userEmail, // Use user email so Stripe sends receipt automatically
      metadata: metadata, // Includes bookingId, eventId, userId, etc.
    });

    // Update pending booking with session ID (for event, coach, and lesson bookings)
    // This updates both new and reused pending bookings
    if (bookingId) {
      if (bookingType === 'event') {
        await Booking.updateEventBooking(bookingId, {
          stripe_session_id: session.id
        });
        console.log(`✅ Updated event booking #${bookingId} with session ID: ${session.id}`);
      } else if (bookingType === 'coach') {
        await Booking.updateCoachBooking(bookingId, {
          stripe_session_id: session.id
        });
        console.log(`✅ Updated coach booking #${bookingId} with session ID: ${session.id}`);
      } else if (bookingType === 'lesson') {
        await Booking.updateLessonBooking(bookingId, {
          stripe_session_id: session.id
        });
        console.log(`✅ Updated lesson booking #${bookingId} with session ID: ${session.id}`);
      }
    }

    // Return the session ID and URL to the frontend
    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    // Check if this is a Stripe API error
    const isStripeError = error.type && error.type.startsWith('Stripe');
    
    if (isStripeError) {
      return res.status(500).json({
        success: false,
        code: ERROR_CODES.STRIPE_ERROR,
        message: 'Payment processing error. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    res.status(500).json({
      success: false,
      code: ERROR_CODES.SERVER_ERROR,
      message: 'Failed to create checkout session',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Send test payment confirmation email
 * Used for test/mock payments that don't go through Stripe webhook
 * PROTECTED - requires JWT authentication
 */
export const sendTestPaymentEmail = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { eventId, eventName, amount, bookingId } = req.body;

    if (!eventId || !eventName) {
      return res.status(400).json({
        success: false,
        message: 'eventId and eventName are required'
      });
    }

    // Get event details
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get user details
    const [userRows] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [userId]);
    const user = userRows[0];
    
    if (!user || !user.email) {
      return res.status(400).json({
        success: false,
        message: 'User email not found'
      });
    }

    // Get or create booking details for email
    let bookingDetails = null;
    if (bookingId) {
      bookingDetails = await Booking.getEventBookingById(bookingId);
    }

    // If no booking found, create mock booking details for email
    if (!bookingDetails) {
      bookingDetails = {
        id: bookingId || `test-${Date.now()}`,
        user_id: userId,
        user_name: user.name,
        user_email: user.email,
        event_id: eventId
      };
    }

    // Send confirmation email
    const { sendBookingConfirmationEmail } = await import('../services/emailService.js');
    await sendBookingConfirmationEmail(bookingDetails, event, 'event');

    res.json({
      success: true,
      message: 'Test payment confirmation email sent'
    });
  } catch (error) {
    console.error('Error sending test payment email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test payment email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Send test payment confirmation email for coach bookings
export const sendTestPaymentEmailCoach = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { coachId, coachName, amount, bookingDate, bookingTime, bookingDuration, bookingId } = req.body;

    if (!coachId || !coachName) {
      return res.status(400).json({
        success: false,
        message: 'coachId and coachName are required'
      });
    }

    // Get coach details from database (always fetch latest)
    const { Coach } = await import('../models/Coach.js');
    const coach = await Coach.findById(coachId);
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    // Get user details
    const [userRows] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [userId]);
    const user = userRows[0];
    
    if (!user || !user.email) {
      return res.status(400).json({
        success: false,
        message: 'User email not found'
      });
    }

    // Create mock booking details for email
    const bookingDetails = {
      id: bookingId || `test-coach-${Date.now()}`,
      user_id: userId,
      user_name: user.name,
      user_email: user.email,
      coach_id: coachId,
      booking_date: bookingDate || new Date().toISOString().split('T')[0],
      booking_time: bookingTime || '10:00',
      duration: parseInt(bookingDuration) || 60
    };

    // Send confirmation email
    const { sendBookingConfirmationEmail } = await import('../services/emailService.js');
    await sendBookingConfirmationEmail(bookingDetails, coach, 'coach');

    res.json({
      success: true,
      message: 'Test payment confirmation email sent for coach booking'
    });
  } catch (error) {
    console.error('Error sending test payment email for coach:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test payment email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Retrieve Checkout Session details
 * Use this to verify payment status after redirect
 */
export const getCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    // Check if this is a mock session (development mode)
    if (sessionId.startsWith('cs_mock_')) {
      // Return mock session data
      return res.json({
        success: true,
        session: {
          id: sessionId,
          payment_status: 'paid',
          customer_email: null,
          amount_total: 0,
          currency: 'aud',
          metadata: {},
        }
      });
    }

    // Real Stripe session - get Stripe key
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey.includes('placeholder') || stripeKey.trim() === '') {
      return res.status(500).json({
        success: false,
        message: 'Stripe is not configured. Cannot retrieve session details.'
      });
    }

    // Import and initialize Stripe
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2024-11-20.acacia',
    });

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      success: true,
      session: {
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_email,
        amount_total: session.amount_total,
        currency: session.currency,
        metadata: session.metadata || {},
      }
    });
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve checkout session',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Webhook endpoint for Stripe events
 * This handles asynchronous events from Stripe (payment succeeded, failed, etc.)
 * 
 * SECURITY: Signature verification is ALWAYS required (dev and prod)
 * Use Stripe CLI for local development: stripe listen --forward-to localhost:5001/api/payments/webhook
 */
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  console.log('[Webhook] ────────────────────────────────────────');
  console.log('[Webhook] Received webhook request');

  let event;

  try {
    // SECURITY: Always require STRIPE_WEBHOOK_SECRET (no dev bypass)
    const hasWebhookSecret = webhookSecret && webhookSecret.trim() !== '' && !webhookSecret.includes('placeholder');
    
    if (!hasWebhookSecret) {
      console.error('[Webhook] ❌ STRIPE_WEBHOOK_SECRET is not configured');
      console.error('[Webhook] 📋 To fix this:');
      console.error('[Webhook]    1. Install Stripe CLI: https://stripe.com/docs/stripe-cli');
      console.error('[Webhook]    2. Run: stripe listen --forward-to localhost:5001/api/payments/webhook');
      console.error('[Webhook]    3. Copy the webhook signing secret (whsec_...) to your .env file');
      console.error('[Webhook]    4. Add: STRIPE_WEBHOOK_SECRET=whsec_...');
      console.error('[Webhook]    5. Restart the backend server');
      return res.status(500).json({
        code: 'STRIPE_WEBHOOK_SECRET_MISSING',
        message: 'Webhook signature verification cannot proceed. STRIPE_WEBHOOK_SECRET is not configured. See server logs for setup instructions.'
      });
    }

    // Require stripe-signature header
    if (!sig) {
      console.error('[Webhook] ❌ Missing stripe-signature header');
      return res.status(400).json({
        code: 'MISSING_SIGNATURE',
        message: 'Missing stripe-signature header. Ensure the request is from Stripe.'
      });
    }

    // Require STRIPE_SECRET_KEY for signature verification
    const hasValidStripeKey = stripeKey && stripeKey.trim() !== '' && !stripeKey.includes('placeholder');
    if (!hasValidStripeKey) {
      console.error('[Webhook] ❌ STRIPE_SECRET_KEY is not configured');
      return res.status(500).json({
        code: 'STRIPE_CONFIG_MISSING',
        message: 'Stripe is not properly configured. STRIPE_SECRET_KEY is missing.'
      });
    }

    // Import and initialize Stripe
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-11-20.acacia' });
    
    // Verify webhook signature (ALWAYS - no exceptions)
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    console.log('[Webhook] ✅ Signature verified successfully');

  } catch (err) {
    console.error('[Webhook] ❌ Signature verification failed:', err.message);
    return res.status(400).json({
      code: 'SIGNATURE_VERIFICATION_FAILED',
      message: `Webhook signature verification failed: ${err.message}`
    });
  }

  // Log event details (no secrets)
  console.log(`[Webhook] Event type: ${event.type}`);
  console.log(`[Webhook] Event ID: ${event.id}`);

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log(`[Webhook] checkout.session.completed - Session ID: ${session.id}`);
        console.log(`[Webhook] Metadata: eventId=${session.metadata?.eventId}, userId=${session.metadata?.user_id}, type=${session.metadata?.booking_type}`);
        
        // Handle booking payments (event or coach bookings)
        if (session.metadata && (session.metadata.booking_type === 'event' || session.metadata.booking_type === 'coach')) {
          await handleBookingPaymentSuccess(session);
        } else {
          console.warn('[Webhook] Session has no valid booking_type in metadata, skipping');
        }
        break;
      
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`[Webhook] payment_intent.succeeded - PaymentIntent ID: ${paymentIntent.id}`);
        break;
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log(`[Webhook] payment_intent.payment_failed - PaymentIntent ID: ${failedPayment.id}`);
        console.log(`[Webhook] Failure reason: ${failedPayment.last_payment_error?.message || 'Unknown'}`);
        break;
      
      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (handlerError) {
    console.error('[Webhook] ❌ Error processing event:', handlerError);
    // Still return 200 to prevent Stripe from retrying
    // The error is logged for investigation
  }

  console.log('[Webhook] ────────────────────────────────────────');
  
  // Return 200 to acknowledge receipt of the event
  res.json({ received: true });
};
