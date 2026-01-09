import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe with secret key from environment variables
// NEVER commit your secret key to version control
// In development mode without a key, we'll use mock payments
const stripeKey = process.env.STRIPE_SECRET_KEY;
const isDevelopmentMode = process.env.NODE_ENV === 'development' && 
                          (!stripeKey || stripeKey.includes('placeholder') || stripeKey.trim() === '');

let stripe = null;

// Only initialize Stripe if we have a valid key
if (!isDevelopmentMode && stripeKey && stripeKey.trim() !== '') {
  stripe = new Stripe(stripeKey, {
    apiVersion: '2024-11-20.acacia',
  });
} else if (isDevelopmentMode) {
  console.log('⚠️  Development Mode: Stripe not initialized (using mock payments)');
  console.log('💡 To use real Stripe payments, add STRIPE_SECRET_KEY to your .env file');
  // Create a dummy object to prevent errors
  stripe = {
    checkout: {
      sessions: {
        create: async () => {
          throw new Error('Stripe not configured - using mock payment mode');
        }
      }
    }
  };
}

export default stripe;


