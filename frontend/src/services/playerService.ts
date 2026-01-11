// Player Service - API calls for player dashboard data

import { API_URL } from './api';

export interface Booking {
  id: number;
  venue?: string;
  event_name?: string;
  coach_name?: string;
  date: string;
  time: string;
  status: string;
  payment_status?: string;
  type: 'event' | 'coach';
}

export interface PlayerStats {
  totalBookings: number;
  hoursPlayed: number;
  winRate: number;
  monthlyHours: number;
  monthlyGoal: number;
}

export interface RecentActivity {
  message: string;
  timestamp: string;
}

// Get user profile
export const getUserProfile = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch user profile: ${response.status}`);
    }
    
    return response.json();
  } catch (error: any) {
    console.error('getUserProfile error:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (token: string, profileData: {
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update profile: ${response.status}`);
    }
    
    return response.json();
  } catch (error: any) {
    console.error('updateUserProfile error:', error);
    throw error;
  }
};

// Get user's event bookings
export const getEventBookings = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/events/bookings/my`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      // Return empty array instead of throwing for bookings
      console.warn('Failed to fetch event bookings:', response.status);
      return { bookings: [] };
    }
    
    return response.json();
  } catch (error: any) {
    console.error('getEventBookings error:', error);
    return { bookings: [] };
  }
};

// Get user's coach bookings
export const getCoachBookings = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/coaches/bookings/my`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      // Return empty array instead of throwing for bookings
      console.warn('Failed to fetch coach bookings:', response.status);
      return { bookings: [] };
    }
    
    return response.json();
  } catch (error: any) {
    console.error('getCoachBookings error:', error);
    return { bookings: [] };
  }
};

// Calculate player stats from bookings
export const calculateStats = (eventBookings: any[], coachBookings: any[]): PlayerStats => {
  const allBookings = [...eventBookings, ...coachBookings];
  const totalBookings = allBookings.length;
  
  // Calculate hours played (assuming 1 hour per event, duration for coach bookings)
  let hoursPlayed = 0;
  eventBookings.forEach(booking => {
    if (booking.status !== 'cancelled') {
      hoursPlayed += 1; // Default 1 hour per event
    }
  });
  coachBookings.forEach(booking => {
    if (booking.status !== 'cancelled') {
      hoursPlayed += booking.duration ? booking.duration / 60 : 1; // Convert minutes to hours
    }
  });
  
  // Calculate monthly hours (current month)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  let monthlyHours = 0;
  allBookings.forEach(booking => {
    if (booking.status === 'cancelled') return;
    
    const bookingDate = new Date(booking.date || booking.event_date || booking.session_date);
    if (!isNaN(bookingDate.getTime()) && 
        bookingDate.getMonth() === currentMonth && 
        bookingDate.getFullYear() === currentYear) {
      if (booking.event_name || !booking.duration) {
        monthlyHours += 1;
      } else {
        monthlyHours += (booking.duration || 60) / 60;
      }
    }
  });
  
  // Win rate calculation (placeholder - would need actual match results)
  // For now, calculate based on confirmed bookings percentage
  const confirmedBookings = allBookings.filter(b => b.status === 'confirmed').length;
  const winRate = totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0;
  
  return {
    totalBookings,
    hoursPlayed: Math.round(hoursPlayed),
    winRate,
    monthlyHours: Math.round(monthlyHours * 10) / 10,
    monthlyGoal: 20, // Default goal
  };
};

// Format bookings for display
export const formatBookings = (eventBookings: any[], coachBookings: any[]): Booking[] => {
  const formatted: Booking[] = [];
  const now = new Date();
  
  // Format event bookings
  eventBookings.forEach(booking => {
    if (!booking.event_date && !booking.date) return;
    
    const eventDate = new Date(booking.event_date || booking.date);
    if (isNaN(eventDate.getTime())) return;
    
    // Only show upcoming bookings
    if (eventDate.getTime() < now.getTime()) return;
    
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let dateLabel = '';
    if (diffDays === 0) dateLabel = 'Today';
    else if (diffDays === 1) dateLabel = 'Tomorrow';
    else if (diffDays < 7) dateLabel = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    else dateLabel = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Format time
    let timeStr = '';
    if (booking.event_time) {
      const timeDate = new Date(`2000-01-01T${booking.event_time}`);
      if (!isNaN(timeDate.getTime())) {
        timeStr = timeDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      }
    }
    
    formatted.push({
      id: booking.id,
      venue: booking.event_name || booking.location || 'Event',
      event_name: booking.event_name,
      date: dateLabel,
      time: timeStr || booking.time || '',
      status: booking.status === 'confirmed' ? 'confirmed' : 'pending',
      payment_status: booking.payment_status,
      type: 'event',
    });
  });
  
  // Format coach bookings
  coachBookings.forEach(booking => {
    if (!booking.date && !booking.session_date) return;
    
    const sessionDate = new Date(booking.date || booking.session_date);
    if (isNaN(sessionDate.getTime())) return;
    
    // Only show upcoming bookings
    if (sessionDate.getTime() < now.getTime()) return;
    
    const diffTime = sessionDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let dateLabel = '';
    if (diffDays === 0) dateLabel = 'Today';
    else if (diffDays === 1) dateLabel = 'Tomorrow';
    else if (diffDays < 7) dateLabel = sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    else dateLabel = sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Format time
    let timeStr = '';
    if (booking.time || booking.session_time) {
      const timeValue = booking.time || booking.session_time;
      const timeDate = new Date(`2000-01-01T${timeValue}`);
      if (!isNaN(timeDate.getTime())) {
        timeStr = timeDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      } else {
        timeStr = timeValue;
      }
    }
    
    formatted.push({
      id: booking.id,
      venue: `Coaching Session with ${booking.coach_name || 'Coach'}`,
      coach_name: booking.coach_name,
      date: dateLabel,
      time: timeStr || '',
      status: booking.status === 'confirmed' ? 'confirmed' : 'pending',
      payment_status: booking.payment_status,
      type: 'coach',
    });
  });
  
  // Sort by date (upcoming first)
  formatted.sort((a, b) => {
    // Parse date labels back to dates for sorting
    const getDateValue = (dateLabel: string) => {
      if (dateLabel === 'Today') return now.getTime();
      if (dateLabel === 'Tomorrow') return now.getTime() + 24 * 60 * 60 * 1000;
      return new Date(dateLabel).getTime();
    };
    
    try {
      return getDateValue(a.date) - getDateValue(b.date);
    } catch {
      return 0;
    }
  });
  
  return formatted.slice(0, 3); // Return only next 3 bookings
};

// Generate recent activity from bookings
export const generateRecentActivity = (eventBookings: any[], coachBookings: any[]): string[] => {
  const activities: string[] = [];
  const allBookings: any[] = [];
  
  // Add type to bookings for identification
  eventBookings.forEach(b => allBookings.push({ ...b, type: 'event' }));
  coachBookings.forEach(b => allBookings.push({ ...b, type: 'coach' }));
  
  // Sort by most recent (using created_at, date, or id as fallback)
  allBookings.sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 
                  (a.date ? new Date(a.date).getTime() : a.id || 0);
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 
                  (b.date ? new Date(b.date).getTime() : b.id || 0);
    return dateB - dateA;
  });
  
  // Generate activity messages
  allBookings.slice(0, 4).forEach(booking => {
    if (booking.type === 'event' || booking.event_name) {
      if (booking.status === 'confirmed') {
        activities.push(`Booking confirmed for ${booking.event_name || 'Event'}`);
      } else if (booking.payment_status === 'completed') {
        activities.push(`Payment processed for ${booking.event_name || 'Event'}`);
      } else {
        activities.push(`Booking request submitted for ${booking.event_name || 'Event'}`);
      }
    } else {
      if (booking.status === 'confirmed') {
        activities.push(`Coaching session confirmed with ${booking.coach_name || 'Coach'}`);
      } else if (booking.payment_status === 'completed') {
        activities.push(`Payment processed for coaching session`);
      } else {
        activities.push(`Coaching session request submitted`);
      }
    }
  });
  
  return activities.length > 0 ? activities : ['No recent activity'];
};

