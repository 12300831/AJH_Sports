/**
 * Admin Service
 * Handles communication with the backend admin API
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

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated API calls
const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Authentication failed. Please log in again.');
    }
    
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response;
};

// ==================== USER PROFILE ====================
export const getUserProfile = async () => {
  const response = await apiCall('/users/profile');
  const data = await response.json();
  // Backend returns { success: true, user: {...} } or just the user object
  return data.user || data;
};

// ==================== EVENTS ====================
export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  time: string;
  max_players: number;
  price: number;
  location?: string;
  status?: 'active' | 'cancelled' | 'completed';
  created_at?: string;
}

export interface CreateEventData {
  name: string;
  description: string;
  date: string;
  time: string;
  max_players: number;
  price: number;
  location?: string;
  status?: 'active' | 'cancelled' | 'completed';
}

export const getEvents = async (): Promise<Event[]> => {
  const response = await apiCall('/events');
  return response.json();
};

export const getEventById = async (id: number): Promise<Event> => {
  const response = await apiCall(`/events/${id}`);
  return response.json();
};

export const createEvent = async (data: CreateEventData): Promise<Event> => {
  const response = await apiCall('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result.event || result;
};

export const updateEvent = async (id: number, data: CreateEventData): Promise<void> => {
  await apiCall(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteEvent = async (id: number): Promise<void> => {
  await apiCall(`/events/${id}`, {
    method: 'DELETE',
  });
};

// ==================== COACHES ====================
export interface Coach {
  id: number;
  name: string;
  specialty: string;
  email?: string;
  phone?: string;
  availability: string | Array<{ day: string; start: string; end: string }>;
  hourly_rate: number;
  status?: 'active' | 'inactive';
  created_at?: string;
}

export interface CreateCoachData {
  name: string;
  specialty: string;
  email?: string;
  phone?: string;
  availability: Array<{ day: string; start: string; end: string }>;
  hourly_rate: number;
  status?: 'active' | 'inactive';
}

export const getCoaches = async (): Promise<Coach[]> => {
  const response = await apiCall('/coaches');
  const coaches = await response.json();
  // Parse availability if it's a JSON string
  return coaches.map((coach: Coach) => ({
    ...coach,
    availability: typeof coach.availability === 'string' 
      ? JSON.parse(coach.availability) 
      : coach.availability,
  }));
};

export const getCoachById = async (id: number): Promise<Coach> => {
  const response = await apiCall(`/coaches/${id}`);
  const coach = await response.json();
  return {
    ...coach,
    availability: typeof coach.availability === 'string' 
      ? JSON.parse(coach.availability) 
      : coach.availability,
  };
};

export const createCoach = async (data: CreateCoachData): Promise<Coach> => {
  const response = await apiCall('/coaches', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result.coach || result;
};

export const updateCoach = async (id: number, data: CreateCoachData): Promise<void> => {
  await apiCall(`/coaches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteCoach = async (id: number): Promise<void> => {
  await apiCall(`/coaches/${id}`, {
    method: 'DELETE',
  });
};

// ==================== USERS ====================
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  role: 'user' | 'admin';
}

export const getAllUsers = async (): Promise<User[]> => {
  const response = await apiCall('/users/all');
  return response.json();
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiCall(`/users/${id}`, {
    method: 'DELETE',
  });
};

// ==================== BOOKINGS ====================
export interface EventBooking {
  id: number;
  event_id: number;
  user_id: number;
  booking_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  event_name?: string;
  event_date?: string;
  event_time?: string;
  event_price?: number;
}

export interface CoachBooking {
  id: number;
  coach_id: number;
  user_id: number;
  session_date: string;
  session_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  google_calendar_event_id?: string | null;
  coach_name?: string;
  specialty?: string;
}

export const getEventBookings = async (): Promise<EventBooking[]> => {
  const response = await apiCall('/events/bookings/all');
  const result = await response.json();
  return result.bookings || [];
};

export const getCoachBookings = async (): Promise<CoachBooking[]> => {
  const response = await apiCall('/coaches/bookings/all');
  const result = await response.json();
  return result.bookings || [];
};

export const updateBookingStatus = async (
  bookingId: number,
  type: 'event' | 'coach',
  status: 'pending' | 'confirmed' | 'cancelled'
): Promise<void> => {
  await apiCall('/coaches/bookings/status', {
    method: 'PUT',
    body: JSON.stringify({ bookingId, type, status }),
  });
};

