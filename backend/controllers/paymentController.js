import { handleBookingPaymentSuccess } from './bookingPaymentController.js';
import { Event } from '../models/Event.js';
import { Booking } from '../models/Booking.js';

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
      eventId, 
      eventName, 
      amount, 
      currency = 'AUD',
      customerEmail,
      successUrl,
      cancelUrl,
      bookingType = 'event', // 'event' or 'coach'
      coachId,
      bookingId
    } = req.body;

    // Validate required fields
    if (!eventId || !eventName || !amount) {
      return res.status(400).json({
        success: false,
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Missing required fields: eventId, eventName, and amount are required'
      });
    }

    // For event bookings, validate capacity and check for duplicates
    if (bookingType === 'event') {
      // Check if event exists and is active
      const event = await Event.findById(eventId);
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

      // Check for existing booking (prevent duplicates)
      const existingBookings = await Booking.getEventBookingsByEvent(eventId);
      const userBooking = existingBookings.find(
        b => b.user_id === userId && b.status !== 'cancelled'
      );
      if (userBooking) {
        return res.status(409).json({
          success: false,
          code: ERROR_CODES.ALREADY_REGISTERED,
          message: 'You have already registered for this event'
        });
      }
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
        eventId: eventId.toString(),
        eventName: eventName,
        booking_type: bookingType,
        user_id: userId.toString(),
      };
      
      if (bookingType === 'coach') {
        if (coachId) metadata.coach_id = coachId.toString();
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

    // Build metadata based on booking type
    const metadata = {
      eventId: eventId.toString(),
      eventName: eventName,
      booking_type: bookingType,
      user_id: userId.toString(), // Include user ID for webhook handler
    };

    // Add coach-specific metadata if it's a coach booking
    if (bookingType === 'coach') {
      if (coachId) metadata.coach_id = coachId.toString();
      if (bookingId) metadata.booking_id = bookingId.toString();
    }

    // Build frontend base URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // Build success and cancel URLs with query params for frontend handling
    const defaultSuccessUrl = `${frontendUrl}/events?payment=success&eventId=${eventId}&session_id={CHECKOUT_SESSION_ID}`;
    const defaultCancelUrl = `${frontendUrl}/events?payment=cancel&eventId=${eventId}`;
    
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: eventName,
              description: bookingType === 'coach' 
                ? `Coaching session: ${eventName}` 
                : `Registration for ${eventName}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || defaultSuccessUrl,
      cancel_url: cancelUrl || defaultCancelUrl,
      customer_email: customerEmail,
      metadata: metadata,
    });

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
