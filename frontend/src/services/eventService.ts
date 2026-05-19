/**
 * Event Service
 * Handles event-related API calls and lesson API calls
 */

// Use centralized API URL function
import { getAPI_URL } from './api';

// Re-export for backward compatibility
export const getApiUrl = () => getAPI_URL();

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
 * Get current user from localStorage (DEPRECATED - use useAuth() hook instead)
 * This is kept for backward compatibility but should not be used in new code.
 * @deprecated Use useAuth() hook from AuthContext instead
 */
export const getCurrentUser = (): { id: number; email: string; name: string; role: string } | null => {
  // DEPRECATED: This function reads from localStorage which is no longer used for user data
  // All user data should come from the API via AuthContext
  return null;
};

/**
 * Lesson interface for public API
 */
export interface Lesson {
  id: number;
  title: string;
  description?: string;
  image_url?: string | null;
  pricing: Array<{ label: string; single: string; pack: string }>;
  category: 'Tennis' | 'Table Tennis' | 'Modified Sports';
  image_position: 'left' | 'right';
  cta_text?: string;
  status?: 'active' | 'inactive';
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch all lessons from the backend
 * Always fetches fresh data from MySQL - no caching
 */
export const fetchLessons = async (): Promise<Lesson[]> => {
  try {
    // Add cache-busting timestamp to ensure fresh data
    const timestamp = Date.now();
    const response = await fetch(`${getApiUrl()}/lessons?_t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lessons: ${response.status}`);
    }

    const data = await response.json();
    const lessons = data.lessons || data || [];
    
    // Parse pricing if it's a string
    return lessons.map((lesson: any) => {
      let pricing = lesson.pricing;
      if (typeof pricing === 'string') {
        try {
          pricing = JSON.parse(pricing);
        } catch (e) {
          pricing = [];
        }
      }
      return {
        ...lesson,
        pricing: Array.isArray(pricing) ? pricing : [],
      };
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }
};

/**
 * Fetch all events from the backend
 * Always fetches fresh data from MySQL - no caching
 */
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    // Add cache-busting timestamp to ensure fresh data
    const timestamp = Date.now();
    const response = await fetch(`${getApiUrl()}/events?_t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
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
    const response = await fetch(`${getApiUrl()}/events/${eventId}`, {
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
    const response = await fetch(`${getApiUrl()}/events/book`, {
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
    const response = await fetch(`${getApiUrl()}/events/cancel/${bookingId}`, {
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
    const response = await fetch(`${getApiUrl()}/events/bookings/my`, {
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
