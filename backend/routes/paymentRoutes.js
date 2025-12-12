import express from 'express';
import { 
  createCheckoutSession, 
  getCheckoutSession, 
  handleWebhook 
} from '../controllers/paymentController.js';

const router = express.Router();

/**
 * POST /api/payments/create-checkout-session
 * Creates a Stripe Checkout Session
 * 
 * Request body:
 * {
 *   eventId: string,
 *   eventName: string,
 *   amount: number (in dollars, e.g., 75.00),
 *   currency?: string (default: 'usd'),
 *   customerEmail?: string,
 *   successUrl?: string,
 *   cancelUrl?: string
 * }
 */
router.post('/create-checkout-session', createCheckoutSession);

/**
 * GET /api/payments/session/:sessionId
 * Retrieves checkout session details
 */
router.get('/session/:sessionId', getCheckoutSession);

/**
 * POST /api/payments/webhook
 * Stripe webhook endpoint for handling payment events
 * Note: This endpoint should use raw body for signature verification
 */
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;


