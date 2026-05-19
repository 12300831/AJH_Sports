/**
 * Admin Service
 * Handles communication with the backend admin API
 */

// Get API URL from centralized config
import { getAPI_URL } from './api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated API calls
// Always fetches fresh data from MySQL - includes cache-busting headers
const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  
  // Merge headers - cache-busting headers by default, options.headers takes precedence
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };

  const headers: HeadersInit = {
    ...defaultHeaders,
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${getAPI_URL()}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      throw new Error('Authentication failed. Please log in again.');
    }
    
    // Try to extract error message from response
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      // Backend returns { success: false, message: "..." } format
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // If response is not JSON, use status text
      console.error('Failed to parse error response:', e);
    }
    
    throw new Error(errorMessage);
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
  age_group?: string;
  whats_included?: string;
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
  age_group?: string;
  whats_included?: string;
}

export const getEvents = async (): Promise<Event[]> => {
  // Admin should see all events including inactive ones
  // Add cache-busting timestamp to ensure fresh data from MySQL
  const timestamp = Date.now();
  const response = await apiCall(`/events?includeInactive=true&_t=${timestamp}`);
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
  console.log('📝 Updating event:', id, data);
  const response = await apiCall(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  // Parse response to get updated event data
  const result = await response.json();
  console.log('✅ Event updated successfully:', result);
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to update event');
  }
};

export const deleteEvent = async (id: number): Promise<void> => {
  await apiCall(`/events/${id}`, {
    method: 'DELETE',
  });
};

export const hardDeleteEvent = async (id: number): Promise<void> => {
  await apiCall(`/events/${id}/hard-delete`, {
    method: 'DELETE',
  });
};

export const sendTestEmail = async (eventId: number, testEmail: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiCall(`/events/${eventId}/test-email`, {
    method: 'POST',
    body: JSON.stringify({ testEmail }),
  });
  return response.json();
};

// ==================== COACHES ====================
export interface Coach {
  id: number;
  name: string;
  specialty: string;
  email?: string;
  phone?: string;
  location?: string;
  availability: string | Array<{ 
    type?: 'pattern' | 'date'; // 'pattern' for day-of-week, 'date' for specific dates
    day?: string; // For pattern-based availability
    date?: string; // For date-specific availability (YYYY-MM-DD)
    start: string; // Time (HH:MM)
    end: string; // Time (HH:MM)
    startDate?: string; // Optional: start date for pattern range (YYYY-MM-DD)
    endDate?: string; // Optional: end date for pattern range (YYYY-MM-DD)
  }>;
  hourly_rate: number;
  allowed_durations?: number[] | string; // Array of allowed durations in minutes
  status?: 'active' | 'inactive';
  image_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  created_at?: string;
}

export interface CreateCoachData {
  name: string;
  specialty: string;
  email?: string;
  phone?: string;
  location?: string;
  availability: Array<{ 
    type?: 'pattern' | 'date'; // 'pattern' for day-of-week, 'date' for specific dates
    day?: string; // For pattern-based availability
    date?: string; // For date-specific availability (YYYY-MM-DD)
    start: string; // Time (HH:MM)
    end: string; // Time (HH:MM)
    startDate?: string; // Optional: start date for pattern range (YYYY-MM-DD)
    endDate?: string; // Optional: end date for pattern range (YYYY-MM-DD)
  }>;
  hourly_rate: number;
  allowed_durations?: number[]; // Array of allowed durations in minutes (e.g., [60, 90, 120])
  status?: 'active' | 'inactive';
  image_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  facebook_url?: string;
}

export const getCoaches = async (): Promise<Coach[]> => {
  // Add cache-busting timestamp to ensure fresh data
  const timestamp = Date.now();
  const response = await apiCall(`/coaches?_t=${timestamp}`);
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

export const hardDeleteCoach = async (id: number): Promise<void> => {
  await apiCall(`/coaches/${id}/hard-delete`, {
    method: 'DELETE',
  });
};

// ==================== LESSONS ====================
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

export interface CreateLessonData {
  title: string;
  description?: string;
  image_url?: string;
  pricing: Array<{ label: string; single: string; pack: string }>;
  category?: 'Tennis' | 'Table Tennis' | 'Modified Sports';
  image_position?: 'left' | 'right';
  cta_text?: string;
  status?: 'active' | 'inactive';
  display_order?: number;
}

export const getLessons = async (): Promise<Lesson[]> => {
  const timestamp = Date.now();
  const response = await apiCall(`/lessons?_t=${timestamp}`);
  const result = await response.json();
  const lessons = result.lessons || result || [];
  return lessons.map((lesson: Lesson) => {
    let pricing = lesson.pricing;
    if (typeof lesson.pricing === 'string') {
      try {
        pricing = JSON.parse(lesson.pricing);
      } catch (e) {
        pricing = [];
      }
    }
    return {
      ...lesson,
      pricing: Array.isArray(pricing) ? pricing : [],
    };
  });
};

export const getLessonById = async (id: number): Promise<Lesson> => {
  const response = await apiCall(`/lessons/${id}`);
  const result = await response.json();
  const lesson = result.lesson || result;
  let pricing = lesson.pricing;
  if (typeof lesson.pricing === 'string') {
    try {
      pricing = JSON.parse(lesson.pricing);
    } catch (e) {
      pricing = [];
    }
  }
  return {
    ...lesson,
    pricing: Array.isArray(pricing) ? pricing : [],
  };
};

export const createLesson = async (data: CreateLessonData): Promise<Lesson> => {
  const response = await apiCall('/lessons', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result.lesson || result;
};

export const updateLesson = async (id: number, data: CreateLessonData): Promise<void> => {
  await apiCall(`/lessons/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteLesson = async (id: number): Promise<void> => {
  await apiCall(`/lessons/${id}`, {
    method: 'DELETE',
  });
};

export const hardDeleteLesson = async (id: number): Promise<void> => {
  await apiCall(`/lessons/${id}/hard-delete`, {
    method: 'DELETE',
  });
};

export const sendLessonTestEmail = async (lessonId: number, testEmail: string, bookingType: 'single' | 'pack' = 'single'): Promise<{ success: boolean; message: string }> => {
  const response = await apiCall(`/lessons/${lessonId}/test-email`, {
    method: 'POST',
    body: JSON.stringify({ testEmail, bookingType }),
  });
  return response.json();
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
  role: 'Admin' | 'User';
  sports: 'Tennis' | 'Table Tennis';
  status?: 'Active' | 'Inactive' | 'Pending' | 'Suspended' | 'Banned'; // Kept for backward compatibility
  joinedDate: string;
  lastActive: string;
  lastActiveTimestamp?: string;
  profileImage?: string | null;
  provider?: string | null; // 'google', 'facebook', or null for email/password users
  provider_id?: string | null; // OAuth provider's user ID
}

export interface UserFilters {
  search?: string;
  role?: string;
  sports?: string; // Changed from status to sports
  status?: string; // Kept for backward compatibility
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
  role?: 'Admin' | 'User';
  status?: 'Active' | 'Inactive' | 'Pending' | 'Suspended' | 'Banned';
  phone?: string;
  location?: string;
  profileImage?: string;
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: 'Admin' | 'User';
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

export interface LessonBooking {
  id: number;
  lesson_id: number;
  user_id: number;
  booking_type: 'single' | 'pack';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded';
  stripe_session_id?: string | null;
  payment_intent_id?: string | null;
  sessions_remaining?: number | null;
  lesson_title?: string;
  lesson_category?: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  created_at?: string;
  updated_at?: string;
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

export const getLessonBookings = async (): Promise<LessonBooking[]> => {
  const response = await apiCall('/lessons/bookings/all');
  const result = await response.json();
  return result.bookings || [];
};

export const updateBookingStatus = async (
  bookingId: number,
  type: 'event' | 'coach' | 'lesson',
  status: 'pending' | 'confirmed' | 'cancelled'
): Promise<void> => {
  await apiCall('/coaches/bookings/status', {
    method: 'PUT',
    body: JSON.stringify({ bookingId, type, status }),
  });
};

