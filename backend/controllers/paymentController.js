import stripe from '../config/stripe.js';

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
      cancelUrl 
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

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: eventName,
              description: `Registration for ${eventName}`,
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
      metadata: {
        eventId: eventId.toString(),
        eventName: eventName,
      },
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

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      success: true,
      session: {
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_email,
        amount_total: session.amount_total,
        currency: session.currency,
        metadata: session.metadata,
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
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
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
      // Here you can:
      // - Save payment to database
      // - Send confirmation email
      // - Update booking status
      // - etc.
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


