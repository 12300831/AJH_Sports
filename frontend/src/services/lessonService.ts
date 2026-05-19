/**
 * Lesson Service
 * Handles lesson booking-related API calls
 */

import { getAPI_URL } from './api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export interface LessonBooking {
  id: number;
  lesson_id: number;
  user_id: number;
  booking_type: 'single' | 'pack';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded';
  stripe_session_id?: string;
  payment_intent_id?: string;
  sessions_remaining?: number; // For pack bookings
  lesson_title?: string;
  lesson_description?: string;
  lesson_category?: string;
  user_name?: string;
  user_email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BookLessonRequest {
  lesson_id: number;
  booking_type: 'single' | 'pack';
}

/**
 * Book a lesson (single session or 10-session pack)
 */
export const bookLesson = async (data: BookLessonRequest): Promise<LessonBooking> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('You must be logged in to book a lesson');
  }

  const response = await fetch(`${getAPI_URL()}/lessons/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to book lesson' }));
    throw new Error(error.message || 'Failed to book lesson');
  }

  const result = await response.json();
  return result.booking;
};

/**
 * Cancel a lesson booking
 */
export const cancelLessonBooking = async (bookingId: number): Promise<void> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('You must be logged in to cancel a booking');
  }

  const response = await fetch(`${getAPI_URL()}/lessons/cancel/${bookingId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to cancel booking' }));
    throw new Error(error.message || 'Failed to cancel booking');
  }
};

/**
 * Get user's lesson bookings
 */
export const getMyLessonBookings = async (): Promise<LessonBooking[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('You must be logged in to view your bookings');
  }

  const response = await fetch(`${getAPI_URL()}/lessons/bookings/my`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch bookings' }));
    throw new Error(error.message || 'Failed to fetch bookings');
  }

  const result = await response.json();
  return result.bookings || [];
};
