/**
 * Google Calendar Service
 * Handles Google Calendar integration for bookings
 * 
 * CONFIGURATION:
 * Add to your .env file:
 * GOOGLE_CALENDAR_API_KEY=your_api_key_here
 * GOOGLE_CALENDAR_ID=your_calendar_id_here (e.g., 'primary')
 */

import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GOOGLE_CALENDAR_API_KEY;
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";

/**
 * Create a calendar event for a booking
 * @param {Object} bookingData - Booking information
 * @param {string} bookingData.title - Event title
 * @param {string} bookingData.description - Event description
 * @param {string} bookingData.date - Date in YYYY-MM-DD format
 * @param {string} bookingData.time - Time in HH:MM:SS format
 * @param {number} bookingData.duration - Duration in minutes
 * @param {string} bookingData.userEmail - User's email
 * @param {string} bookingData.userName - User's name
 * @returns {Promise<string|null>} - Calendar event ID or null if failed
 */
export const createCalendarEvent = async (bookingData) => {
  if (!API_KEY) {
    console.warn("Google Calendar API key not configured. Skipping calendar event creation.");
    return null;
  }

  try {
    const { title, description, date, time, duration = 60, userEmail, userName } = bookingData;

    // Parse date and time
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);

    // Format for Google Calendar API (RFC3339)
    const startTime = startDateTime.toISOString();
    const endTime = endDateTime.toISOString();

    // Create event object
    const event = {
      summary: title,
      description: description || `Booking for ${userName}`,
      start: {
        dateTime: startTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Australia/Sydney"
      },
      end: {
        dateTime: endTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Australia/Sydney"
      },
      attendees: userEmail ? [{ email: userEmail }] : [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 }, // 24 hours before
          { method: "popup", minutes: 60 } // 1 hour before
        ]
      }
    };

    // Make API request
    const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(event)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Google Calendar API error:", error);
      return null;
    }

    const result = await response.json();
    return result.id || null;
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    return null;
  }
};

/**
 * Delete a calendar event
 * @param {string} eventId - Google Calendar event ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteCalendarEvent = async (eventId) => {
  if (!API_KEY || !eventId) {
    return false;
  }

  try {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events/${eventId}?key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: "DELETE"
    });

    return response.ok;
  } catch (error) {
    console.error("Error deleting Google Calendar event:", error);
    return false;
  }
};

/**
 * Update a calendar event
 * @param {string} eventId - Google Calendar event ID
 * @param {Object} updates - Updated booking information
 * @returns {Promise<boolean>} - Success status
 */
export const updateCalendarEvent = async (eventId, updates) => {
  if (!API_KEY || !eventId) {
    return false;
  }

  try {
    // First, get the existing event
    const getUrl = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events/${eventId}?key=${API_KEY}`;
    const getResponse = await fetch(getUrl);

    if (!getResponse.ok) {
      return false;
    }

    const existingEvent = await getResponse.json();

    // Update with new data
    if (updates.date && updates.time) {
      const startDateTime = new Date(`${updates.date}T${updates.time}`);
      const endDateTime = new Date(startDateTime.getTime() + (updates.duration || 60) * 60 * 1000);

      existingEvent.start.dateTime = startDateTime.toISOString();
      existingEvent.end.dateTime = endDateTime.toISOString();
    }

    if (updates.title) {
      existingEvent.summary = updates.title;
    }

    if (updates.description) {
      existingEvent.description = updates.description;
    }

    // Update event
    const updateUrl = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events/${eventId}?key=${API_KEY}`;
    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(existingEvent)
    });

    return updateResponse.ok;
  } catch (error) {
    console.error("Error updating Google Calendar event:", error);
    return false;
  }
};

