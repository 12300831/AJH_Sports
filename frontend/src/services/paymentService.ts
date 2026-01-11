/**
 * Payment Service
 * Handles communication with the backend payment API
 */

// Get API URL from centralized config
import { API_URL } from './api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Log API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('🔗 Payment API URL:', API_URL);
}

export interface CreateCheckoutSessionRequest {
  eventId: string;
  eventName: string;
  amount: number;
  currency?: string;
  customerEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
  bookingType?: 'event' | 'coach'; // Type of booking
  coachId?: string; // Coach ID for coach bookings
  bookingId?: string; // Booking ID if booking already exists
}

export interface CreateCheckoutSessionResponse {
  success: boolean;
  sessionId: string;
  url: string;
  mock?: boolean;
}

// Error codes returned by the backend
export const PAYMENT_ERROR_CODES = {
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  EVENT_NOT_FOUND: 'EVENT_NOT_FOUND',
  EVENT_UNAVAILABLE: 'EVENT_UNAVAILABLE',
  EVENT_FULL: 'EVENT_FULL',
  ALREADY_REGISTERED: 'ALREADY_REGISTERED',
  STRIPE_CONFIG_MISSING: 'STRIPE_CONFIG_MISSING',
  STRIPE_ERROR: 'STRIPE_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

export interface PaymentError {
  code: string;
  message: string;
  status: number;
}

export interface CheckoutSessionResponse {
  success: boolean;
  session: {
    id: string;
    payment_status: string;
    customer_email: string | null;
    amount_total: number;
    currency: string;
    metadata: Record<string, string>;
  };
}

/**
 * Create a Stripe Checkout Session
 * This will return a URL that redirects the user to Stripe's hosted checkout page
 * REQUIRES: User must be logged in (JWT token in localStorage)
 */
export const createCheckoutSession = async (
  data: CreateCheckoutSessionRequest
): Promise<CreateCheckoutSessionResponse> => {
  try {
    const url = `${API_URL}/payments/create-checkout-session`;
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('You must be logged in to make a payment');
    }
    
    // Log the request in development
    if (import.meta.env.DEV) {
      console.log('📤 Creating checkout session:', url, data);
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorData: any = { message: 'Failed to create checkout session' };
      try {
        errorData = await response.json();
      } catch (e) {
        errorData.message = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      // Create a structured error with code and status
      const paymentError: PaymentError = {
        code: errorData.code || 'UNKNOWN_ERROR',
        message: errorData.message || 'An error occurred',
        status: response.status,
      };
      
      // Log the error for debugging
      console.error('Payment API Error:', paymentError);
      
      // Throw error with structured data in message for parsing
      const error = new Error(paymentError.message);
      (error as any).code = paymentError.code;
      (error as any).status = paymentError.status;
      throw error;
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    
    // Provide more helpful error messages
    if (error.message && error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to payment server. Please check if the backend is running on port 5001.');
    }
    
    throw error;
  }
};

/**
 * Retrieve checkout session details
 * Use this to verify payment status after redirect
 */
export const getCheckoutSession = async (
  sessionId: string
): Promise<CheckoutSessionResponse> => {
  try {
    const response = await fetch(`${API_URL}/payments/session/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to retrieve checkout session');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    throw error;
  }
};


