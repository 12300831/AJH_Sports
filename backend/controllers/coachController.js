/**
 * Coach Controller
 * Handles coach operations
 */

import { Coach } from "../models/Coach.js";
import { Booking } from "../models/Booking.js";

// Get all coaches
export const getCoaches = async (req, res) => {
  try {
    const { status } = req.query;
    const filters = {};

    if (status) filters.status = status;

    const coaches = await Coach.findAll(filters);

    // Parse availability JSON for each coach
    const coachesWithParsedAvailability = coaches.map(coach => {
      if (coach.availability && typeof coach.availability === 'string') {
        try {
          coach.availability = JSON.parse(coach.availability);
        } catch (e) {
          console.error(`Error parsing availability for coach ${coach.id}:`, e);
          coach.availability = [];
        }
      }
      return coach;
    });

    // Prevent caching to ensure fresh data
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.json({
      success: true,
      coaches: coachesWithParsedAvailability
    });
  } catch (error) {
    console.error("Get coaches error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching coaches"
    });
  }
};

// Get coach by ID
export const getCoachById = async (req, res) => {
  try {
    const { id } = req.params;
    const coach = await Coach.findById(id);

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: "Coach not found"
      });
    }

    // Parse availability JSON if it's a string
    if (coach.availability && typeof coach.availability === 'string') {
      try {
        coach.availability = JSON.parse(coach.availability);
      } catch (e) {
        console.error(`Error parsing availability for coach ${id}:`, e);
        coach.availability = [];
      }
    }

    // Get upcoming bookings for this coach
    const bookings = await Booking.getCoachBookingsByCoach(id);

    res.json({
      success: true,
      coach: {
        ...coach,
        upcoming_bookings: bookings.filter(b => b.status === "confirmed" && new Date(`${b.date} ${b.time}`) >= new Date())
      }
    });
  } catch (error) {
    console.error("Get coach by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching coach"
    });
  }
};

// Admin: Create coach
export const createCoach = async (req, res) => {
  try {
    const { name, specialty, email, phone, availability, hourly_rate, status, image_url, linkedin_url, twitter_url, instagram_url, facebook_url } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    // Validate image size if provided (max ~14MB base64 = ~10MB image)
    if (image_url && image_url.trim().length > 14000000) {
      return res.status(400).json({
        success: false,
        message: "Image is too large. Maximum size is 10MB"
      });
    }

    // Convert availability array to JSON string if it's an array
    let availabilityString = availability;
    if (Array.isArray(availability)) {
      availabilityString = JSON.stringify(availability);
    } else if (typeof availability === 'string' && availability.trim() !== '') {
      // If it's already a string, use it as is
      availabilityString = availability;
    } else {
      // Default to empty string if not provided
      availabilityString = '';
    }

    const coachId = await Coach.create({
      name,
      specialty,
      email,
      phone,
      availability: availabilityString,
      hourly_rate: hourly_rate || 0,
      status: status || "active",
      image_url: image_url || null,
      linkedin_url: linkedin_url || null,
      twitter_url: twitter_url || null,
      instagram_url: instagram_url || null,
      facebook_url: facebook_url || null
    });

    const coach = await Coach.findById(coachId);

    res.status(201).json({
      success: true,
      message: "Coach created successfully",
      coach
    });
  } catch (error) {
    console.error("Create coach error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating coach"
    });
  }
};

// Admin: Update coach
export const updateCoach = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialty, email, phone, availability, hourly_rate, status, image_url, linkedin_url, twitter_url, instagram_url, facebook_url } = req.body;

    console.log('📝 Update coach request:', { id, body: req.body });

    const coach = await Coach.findById(id);
    if (!coach) {
      console.error('❌ Coach not found:', id);
      return res.status(404).json({
        success: false,
        message: "Coach not found"
      });
    }

    console.log('✅ Found coach:', { id: coach.id, name: coach.name, current_image_url: coach.image_url ? 'exists' : 'null' });

    // Validate image size if provided (max ~14MB base64 = ~10MB image)
    if (image_url !== undefined && image_url && image_url.trim().length > 14000000) {
      return res.status(400).json({
        success: false,
        message: "Image is too large. Maximum size is 10MB"
      });
    }

    // Convert availability array to JSON string if it's an array
    let availabilityString = availability;
    if (availability !== undefined) {
      if (Array.isArray(availability)) {
        availabilityString = JSON.stringify(availability);
      } else if (typeof availability === 'string' && availability.trim() !== '') {
        // If it's already a string, use it as is
        availabilityString = availability;
      } else {
        // Default to empty string if not provided
        availabilityString = '';
      }
    } else {
      // Keep existing availability if not provided
      availabilityString = coach.availability;
    }

    const updateData = {
      name: name || coach.name,
      specialty: specialty !== undefined ? specialty : coach.specialty,
      email: email !== undefined ? email : coach.email,
      phone: phone !== undefined ? phone : coach.phone,
      availability: availabilityString,
      hourly_rate: hourly_rate !== undefined ? hourly_rate : coach.hourly_rate,
      status: status || coach.status,
      image_url: image_url !== undefined ? (image_url || null) : coach.image_url,
      linkedin_url: linkedin_url !== undefined ? (linkedin_url || null) : coach.linkedin_url,
      twitter_url: twitter_url !== undefined ? (twitter_url || null) : coach.twitter_url,
      instagram_url: instagram_url !== undefined ? (instagram_url || null) : coach.instagram_url,
      facebook_url: facebook_url !== undefined ? (facebook_url || null) : coach.facebook_url
    };

    console.log('📤 Updating coach with data:', { 
      ...updateData, 
      image_url: updateData.image_url ? `base64 (${updateData.image_url.substring(0, 50)}...)` : 'null' 
    });

    const updated = await Coach.update(id, updateData);

    if (!updated) {
      console.error('❌ Coach.update returned false for ID:', id);
      return res.status(400).json({
        success: false,
        message: "Failed to update coach"
      });
    }

    console.log('✅ Coach.update successful, fetching updated coach');

    const updatedCoach = await Coach.findById(id);
    
    if (!updatedCoach) {
      console.error('❌ Could not fetch updated coach:', id);
      return res.status(500).json({
        success: false,
        message: "Coach updated but could not fetch updated data"
      });
    }

    console.log('✅ Coach updated successfully:', { 
      id: updatedCoach.id, 
      name: updatedCoach.name, 
      image_url: updatedCoach.image_url ? 'exists' : 'null' 
    });

    res.json({
      success: true,
      message: "Coach updated successfully",
      coach: updatedCoach
    });
  } catch (error) {
    console.error("❌ Update coach error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating coach"
    });
  }
};

// Admin: Delete coach (soft delete - archive)
export const deleteCoach = async (req, res) => {
  try {
    const { id } = req.params;

    const coach = await Coach.findById(id);
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: "Coach not found"
      });
    }

    const deleted = await Coach.delete(id);

    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: "Failed to delete coach"
      });
    }

    res.json({
      success: true,
      message: "Coach deleted successfully"
    });
  } catch (error) {
    console.error("Delete coach error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting coach"
    });
  }
};

// Admin: Hard delete coach (permanent deletion)
export const hardDeleteCoach = async (req, res) => {
  try {
    const { id } = req.params;

    const coach = await Coach.findById(id);
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: "Coach not found"
      });
    }

    const deleted = await Coach.hardDelete(id);

    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: "Failed to delete coach"
      });
    }

    res.json({
      success: true,
      message: "Coach permanently deleted"
    });
  } catch (error) {
    console.error("Hard delete coach error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting coach"
    });
  }
};

// Book coach session
export const bookCoach = async (req, res) => {
  try {
    const { coach_id, date, time, duration, notes } = req.body;
    const userId = req.user.id;

    // Validation
    if (!coach_id || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Coach ID, date, and time are required"
      });
    }

    const coach = await Coach.findById(coach_id);
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: "Coach not found"
      });
    }

    if (coach.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Coach is not available for booking"
      });
    }

    // Check if coach is available
    const isAvailable = await Coach.isAvailable(coach_id, date, time, duration || 60);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Coach is not available at this time"
      });
    }

    // Check if date is in the past
    const bookingDateTime = new Date(`${date} ${time}`);
    if (bookingDateTime < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot book sessions in the past"
      });
    }

    // Create booking
    const bookingId = await Booking.createCoachBooking({
      coach_id,
      user_id: userId,
      date,
      time,
      duration: duration || 60,
      status: "pending",
      payment_status: "pending",
      notes
    });

    const booking = await Booking.getCoachBookingById(bookingId);

    res.status(201).json({
      success: true,
      message: "Coach session booked successfully",
      booking
    });
  } catch (error) {
    console.error("Book coach error:", error);
    res.status(500).json({
      success: false,
      message: "Error booking coach session"
    });
  }
};

// Get available time slots for a coach on a specific date
export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { coachId, date } = req.query;

    if (!coachId || !date) {
      return res.status(400).json({
        success: false,
        message: 'coachId and date are required'
      });
    }

    const coach = await Coach.findById(coachId);
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    if (coach.status !== 'active') {
      return res.json({
        success: true,
        availableSlots: [],
        message: 'Coach is not available'
      });
    }

    // Parse availability
    let availability = [];
    if (Array.isArray(coach.availability)) {
      availability = coach.availability;
    } else if (typeof coach.availability === 'string' && coach.availability.trim() !== '') {
      try {
        availability = JSON.parse(coach.availability);
      } catch (e) {
        availability = [];
      }
    }

    // Get day name from date
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-AU', { weekday: 'long' });

    // Find availability for this day/date
    // First check for date-specific availability
    const dateSpecificAvailability = availability.find(av => 
      av.type === 'date' && av.date === date
    );
    
    let dayAvailability = dateSpecificAvailability;
    
    // If no date-specific availability, check pattern-based
    if (!dayAvailability) {
      dayAvailability = availability.find(av => {
        // Pattern-based availability (type: 'pattern' or no type for backward compatibility)
        if (av.type && av.type !== 'pattern') return false;
        
        // Check if day matches
        if (!av.day || av.day.toLowerCase() !== dayName.toLowerCase()) return false;
        
        // Check date range if provided
        if (av.startDate || av.endDate) {
          const startDate = av.startDate ? new Date(av.startDate) : null;
          const endDate = av.endDate ? new Date(av.endDate) : null;
          const checkDate = new Date(date);
          checkDate.setHours(0, 0, 0, 0);
          
          if (startDate) {
            startDate.setHours(0, 0, 0, 0);
            if (checkDate < startDate) return false;
          }
          if (endDate) {
            endDate.setHours(0, 0, 0, 0);
            if (checkDate > endDate) return false;
          }
        }
        
        return true;
      });
    }

    if (!dayAvailability) {
      return res.json({
        success: true,
        availableSlots: [],
        message: 'No availability for this day/date range'
      });
    }

    // Get existing bookings for this coach on this date
    const existingBookings = await Booking.getCoachBookingsByCoach(coachId, date);
    const bookedSlots = existingBookings
      .filter(b => b.status !== 'cancelled')
      .map(b => ({
        start: b.booking_time,
        duration: b.duration || 60
      }));

    // Generate all possible time slots (hourly intervals - 1 hour minimum booking)
    const [startHour, startMin] = dayAvailability.start.split(':').map(Number);
    const [endHour, endMin] = dayAvailability.end.split(':').map(Number);
    
    const allSlots = [];
    let currentHour = startHour;
    let currentMin = startMin;
    
    // Generate hourly slots (e.g., 5am, 6am, 7am, etc.)
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      allSlots.push(timeStr);
      
      // Move to next hour
      currentHour += 1;
      // Don't add slots that would exceed the end time
      if (currentHour > endHour || (currentHour === endHour && currentMin >= endMin)) {
        break;
      }
    }

    // Filter out slots that conflict with existing bookings
    const availableSlots = allSlots.filter(slotTime => {
      const slotStart = new Date(`${date}T${slotTime}:00`);
      
      // Check if this slot conflicts with any existing booking
      return !bookedSlots.some(booked => {
        const bookedStart = new Date(`${date}T${booked.start}`);
        const bookedEnd = new Date(bookedStart.getTime() + booked.duration * 60000);
        const slotEnd = new Date(slotStart.getTime() + 60 * 60000); // Assume 1 hour for checking
        
        // Check for overlap
        return slotStart < bookedEnd && slotEnd > bookedStart;
      });
    });

    // Get allowed durations from coach (default to [60] if not set)
    let allowedDurations = [60];
    if (coach.allowed_durations) {
      try {
        if (typeof coach.allowed_durations === 'string') {
          allowedDurations = JSON.parse(coach.allowed_durations);
        } else if (Array.isArray(coach.allowed_durations)) {
          allowedDurations = coach.allowed_durations;
        }
      } catch (e) {
        console.error('Error parsing allowed_durations:', e);
      }
    }

    res.json({
      success: true,
      availableSlots,
      allowedDurations,
      coachName: coach.name,
      hourlyRate: coach.hourly_rate
    });
  } catch (error) {
    console.error('Get available time slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available time slots'
    });
  }
};

// Cancel coach booking
export const cancelCoachBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.getCoachBookingById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own bookings"
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled"
      });
    }

    const cancelled = await Booking.cancelCoachBooking(id, userId);

    if (!cancelled) {
      return res.status(400).json({
        success: false,
        message: "Failed to cancel booking"
      });
    }

    res.json({
      success: true,
      message: "Booking cancelled successfully"
    });
  } catch (error) {
    console.error("Cancel coach booking error:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling booking"
    });
  }
};

// Get user's coach bookings
// Get all coach bookings (admin only)
export const getAllCoachBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAllCoachBookings();
    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error("Get all coach bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching coach bookings"
    });
  }
};

// Update booking status (admin only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, type, status } = req.body;
    
    if (!bookingId || !type || !status) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: bookingId, type, status"
      });
    }

    if (!['event', 'coach'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be 'event' or 'coach'"
      });
    }

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'pending', 'confirmed', or 'cancelled'"
      });
    }

    const success = await Booking.updateBookingStatus(bookingId, type, status);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.json({
      success: true,
      message: "Booking status updated successfully"
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating booking status"
    });
  }
};

export const getMyCoachBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.getCoachBookingsByUser(userId);

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error("Get my coach bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching bookings"
    });
  }
};

