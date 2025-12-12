/**
 * Payment Service
 * Handles communication with the backend payment API
 */

// Get API URL from environment or use default
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  return 'http://localhost:5001/api';
};

const API_URL = getApiUrl();

// Log API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('🔗 API URL:', API_URL);
}

export interface CreateCheckoutSessionRequest {
  eventId: string;
  eventName: string;
  amount: number;
  currency?: string;
  customerEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreateCheckoutSessionResponse {
  success: boolean;
  sessionId: string;
  url: string;
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
 */
export const createCheckoutSession = async (
  data: CreateCheckoutSessionRequest
): Promise<CreateCheckoutSessionResponse> => {
  try {
    const url = `${API_URL}/payments/create-checkout-session`;
    
    // Log the request in development
    if (import.meta.env.DEV) {
      console.log('📤 Creating checkout session:', url, data);
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating checkout session:', error);
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


