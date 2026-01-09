import { handleBookingPaymentSuccess } from './bookingPaymentController.js';

/**
 * Create a Stripe Checkout Session
 * This endpoint creates a secure payment session that redirects users to Stripe's hosted checkout page
 */
export const createCheckoutSession = async (req, res) => {
  try {
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
        message: 'Missing required fields: eventId, eventName, and amount are required'
      });
    }

    // Validate amount is a positive number
    const amountInCents = Math.round(parseFloat(amount) * 100);
    if (isNaN(amountInCents) || amountInCents <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }

    // Check if we're in development mode (no Stripe key)
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const isDevelopmentMode = process.env.NODE_ENV === 'development' && 
                              (!stripeKey || stripeKey.includes('placeholder') || stripeKey.trim() === '');

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
      };
      
      if (bookingType === 'coach') {
        if (coachId) metadata.coach_id = coachId.toString();
        if (bookingId) metadata.booking_id = bookingId.toString();
      }

      // Return mock response that redirects directly to success page
      // In development, we'll simulate successful payment
      const finalSuccessUrl = (successUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`)
        .replace('{CHECKOUT_SESSION_ID}', mockSessionId);
      
      return res.json({
        success: true,
        sessionId: mockSessionId,
        url: finalSuccessUrl, // Redirect directly to success page
        mock: true, // Indicate this is a mock payment
        message: 'Development Mode: Payment simulated successfully. Add STRIPE_SECRET_KEY to use real payments.'
      });
    }

    // Production/Real Stripe Mode - Only import Stripe if we have a valid key
    if (!stripeKey || stripeKey.trim() === '' || stripeKey.includes('placeholder')) {
      return res.status(500).json({
        success: false,
        message: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your .env file.'
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
    };

    // Add coach-specific metadata if it's a coach booking
    if (bookingType === 'coach') {
      if (coachId) metadata.coach_id = coachId.toString();
      if (bookingId) metadata.booking_id = bookingId.toString();
    }

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
      success_url: successUrl || `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/payment?canceled=true`,
      customer_email: customerEmail,
      metadata: metadata,
      // Enable automatic tax calculation if needed
      // automatic_tax: { enabled: true },
    });

    // Return the session ID and URL to the frontend
    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session',
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
 * IMPORTANT: In production, verify the webhook signature
 */
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature (important for security)
    if (webhookSecret) {
      // Import and initialize Stripe for webhook verification
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey || stripeKey.includes('placeholder') || stripeKey.trim() === '') {
        console.warn('⚠️  Stripe key not configured. Skipping webhook verification.');
        event = req.body;
      } else {
        const Stripe = (await import('stripe')).default;
        const stripe = new Stripe(stripeKey, {
          apiVersion: '2024-11-20.acacia',
        });
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      }
    } else {
      // In development, you might skip signature verification
      // NEVER do this in production
      event = req.body;
      console.warn('⚠️  Webhook signature verification skipped (development mode)');
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful for session:', session.id);
      
      // Handle booking payments (event or coach bookings)
      if (session.metadata && (session.metadata.booking_type === 'event' || session.metadata.booking_type === 'coach')) {
        await handleBookingPaymentSuccess(session);
      }
      break;
    
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('PaymentIntent failed:', failedPayment.id);
      break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};
