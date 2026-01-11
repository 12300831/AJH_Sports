/**
 * Event Service
 * Handles event-related API calls
 */

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  return 'http://localhost:5001/api';
};

const API_URL = getApiUrl();

export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  time: string;
  max_players: number;
  price: number;
  location: string;
  image_url?: string | null;
  hero_image_url?: string | null;
  status: string;
  available_spots: number;
  booked_spots: number;
  created_at?: string;
  updated_at?: string;
}

export interface EventBooking {
  id: number;
  event_id: number;
  user_id: number;
  status: string;
  payment_status: string;
  event_name?: string;
  event_date?: string;
  created_at?: string;
}

/**
 * Get auth token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Check if user is logged in
 */
export const isUserLoggedIn = (): boolean => {
  const token = getAuthToken();
  return !!token;
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): { id: number; email: string; name: string; role: string } | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Fetch all events from the backend
 */
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch(`${API_URL}/events`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }

    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

/**
 * Fetch a single event by ID
 */
export const fetchEventById = async (eventId: number): Promise<Event | null> => {
  try {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch event: ${response.status}`);
    }

    const data = await response.json();
    return data.event || null;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

/**
 * Book an event (requires authentication)
 */
export const bookEvent = async (eventId: number): Promise<{ success: boolean; message: string; booking?: EventBooking }> => {
  const token = getAuthToken();
  
  if (!token) {
    return { success: false, message: 'You must be logged in to book an event' };
  }

  try {
    const response = await fetch(`${API_URL}/events/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ event_id: eventId }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Failed to book event' };
    }

    return { success: true, message: 'Event booked successfully', booking: data.booking };
  } catch (error: any) {
    console.error('Error booking event:', error);
    return { success: false, message: error.message || 'Failed to book event' };
  }
};

/**
 * Cancel an event booking (requires authentication)
 */
export const cancelEventBooking = async (bookingId: number): Promise<{ success: boolean; message: string }> => {
  const token = getAuthToken();
  
  if (!token) {
    return { success: false, message: 'You must be logged in to cancel a booking' };
  }

  try {
    const response = await fetch(`${API_URL}/events/cancel/${bookingId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Failed to cancel booking' };
    }

    return { success: true, message: 'Booking cancelled successfully' };
  } catch (error: any) {
    console.error('Error cancelling booking:', error);
    return { success: false, message: error.message || 'Failed to cancel booking' };
  }
};

/**
 * Get user's event bookings (requires authentication)
 */
export const getMyEventBookings = async (): Promise<EventBooking[]> => {
  const token = getAuthToken();
  
  if (!token) {
    return [];
  }

  try {
    const response = await fetch(`${API_URL}/events/bookings/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch bookings: ${response.status}`);
    }

    const data = await response.json();
    return data.bookings || [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};
