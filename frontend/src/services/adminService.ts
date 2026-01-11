/**
 * Admin Service
 * Handles communication with the backend admin API
 */

// Get API URL from centralized config
import { API_URL } from './api';

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
  image_url?: string | null;
  hero_image_url?: string | null;
  status?: 'active' | 'inactive' | 'cancelled' | 'completed';
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
  image_url?: string;
  hero_image_url?: string;
  status?: 'active' | 'inactive' | 'cancelled' | 'completed';
}

export const getEvents = async (): Promise<Event[]> => {
  // Admin should see all events including inactive ones
  const response = await apiCall('/events?includeInactive=true');
  const data = await response.json();
  
  // Handle different response formats
  if (Array.isArray(data)) {
    return data;
  }
  if (data.events && Array.isArray(data.events)) {
    return data.events;
  }
  if (data.data && Array.isArray(data.data)) {
    return data.data;
  }
  // If it's an object but not an array, return empty array
  console.warn('getEvents: Unexpected response format:', typeof data);
  return [];
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
  const result = await response.json();
  // Backend returns { success: true, coaches: [...] }
  const coaches = result.coaches || result || [];
  // Parse availability if it's a JSON string, otherwise keep as string or array
  return coaches.map((coach: Coach) => {
    let availability = coach.availability;
    if (typeof coach.availability === 'string') {
      // Try to parse as JSON, if it fails, keep as string
      try {
        availability = JSON.parse(coach.availability);
      } catch (e) {
        // If parsing fails, it's a plain string - keep it as is
        availability = coach.availability;
      }
    }
    return {
      ...coach,
      availability,
    };
  });
};

export const getCoachById = async (id: number): Promise<Coach> => {
  const response = await apiCall(`/coaches/${id}`);
  const result = await response.json();
  // Backend returns { success: true, coach: {...} }
  const coach = result.coach || result;
  let availability = coach.availability;
  if (typeof coach.availability === 'string') {
    // Try to parse as JSON, if it fails, keep as string
    try {
      availability = JSON.parse(coach.availability);
    } catch (e) {
      // If parsing fails, it's a plain string - keep it as is
      availability = coach.availability;
    }
  }
  return {
    ...coach,
    availability,
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
  uuid?: string;
  name: string;
  fullName: string;
  email: string;
  username: string;
  phone: string | null;
  location: string | null;
  role: 'Admin' | 'Coach' | 'User' | 'Guest' | 'Moderator';
  status: 'Active' | 'Inactive' | 'Pending' | 'Suspended' | 'Banned';
  joinedDate: string;
  lastActive: string;
  lastActiveTimestamp?: string;
  profileImage?: string | null;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface UsersResponse {
  success: boolean;
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateUserData {
  fullName: string;
  email: string;
  username?: string;
  password?: string;
  role?: 'Admin' | 'Coach' | 'User' | 'Guest' | 'Moderator';
  status?: 'Active' | 'Inactive' | 'Pending' | 'Suspended' | 'Banned';
  phone?: string;
  location?: string;
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  username?: string;
  role?: 'Admin' | 'Coach' | 'User' | 'Guest' | 'Moderator';
  status?: 'Active' | 'Inactive' | 'Pending' | 'Suspended' | 'Banned';
  phone?: string;
  location?: string;
  profileImage?: string;
}

// Get all users with filters and pagination
export const getUsers = async (filters: UserFilters = {}): Promise<UsersResponse> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  
  const queryString = params.toString();
  const url = `/users/admin${queryString ? `?${queryString}` : ''}`;
  const response = await apiCall(url);
  const data = await response.json();
  
  // Validate response structure
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response from server');
  }
  
  // Ensure response has expected structure
  return {
    success: data.success !== undefined ? data.success : true,
    users: data.users || [],
    pagination: data.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  };
};

// Legacy: Get all users (for backward compatibility)
export const getAllUsers = async (): Promise<User[]> => {
  const response = await apiCall('/users/all');
  const result = await response.json();
  return result.users || result;
};

// Get user by ID
export const getUserById = async (id: number): Promise<User> => {
  const response = await apiCall(`/users/admin/${id}`);
  const result = await response.json();
  return result.user;
};

// Create user
export const createUser = async (data: CreateUserData): Promise<{ success: boolean; userId: number }> => {
  const response = await apiCall('/users/admin', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
};

// Update user
export const updateUser = async (id: number, data: UpdateUserData): Promise<void> => {
  await apiCall(`/users/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Delete user
export const deleteUser = async (id: number): Promise<void> => {
  await apiCall(`/users/admin/${id}`, {
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

