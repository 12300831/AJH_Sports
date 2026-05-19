/**
 * Booking Model
 * Handles database operations for event and coach bookings
 */

import pool from "../config/db.js";

export const Booking = {
  // Event Bookings

  // Create event booking
  createEventBooking: async (bookingData) => {
    const { event_id, user_id, status, payment_status, stripe_session_id, payment_intent_id } = bookingData;
    const [result] = await pool.query(
      `INSERT INTO event_bookings (event_id, user_id, status, payment_status, stripe_session_id, payment_intent_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [event_id, user_id, status || "pending", payment_status || "pending", stripe_session_id, payment_intent_id || null]
    );
    return result.insertId;
  },

  // Get event booking by ID
  getEventBookingById: async (id) => {
    const [rows] = await pool.query(
      `SELECT eb.*, e.name as event_name, e.date as event_date, e.time as event_time, 
              u.name as user_name, u.email as user_email
       FROM event_bookings eb
       JOIN events e ON eb.event_id = e.id
       JOIN users u ON eb.user_id = u.id
       WHERE eb.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // Get event bookings by user
  getEventBookingsByUser: async (userId) => {
    const [rows] = await pool.query(
      `SELECT eb.*, e.name as event_name, e.description, e.date, e.time, e.location, e.price
       FROM event_bookings eb
       JOIN events e ON eb.event_id = e.id
       WHERE eb.user_id = ?
       ORDER BY e.date DESC, e.time DESC`,
      [userId]
    );
    return rows;
  },

  // Get event bookings by event
  getEventBookingsByEvent: async (eventId) => {
    const [rows] = await pool.query(
      `SELECT eb.*, u.name as user_name, u.email as user_email, u.phone
       FROM event_bookings eb
       JOIN users u ON eb.user_id = u.id
       WHERE eb.event_id = ?
       ORDER BY eb.created_at DESC`,
      [eventId]
    );
    return rows;
  },

  // Update event booking status
  updateEventBooking: async (id, updates) => {
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.query(
      `UPDATE event_bookings SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  // Cancel event booking
  cancelEventBooking: async (id, userId) => {
    const [result] = await pool.query(
      `UPDATE event_bookings 
       SET status = 'cancelled' 
       WHERE id = ? AND user_id = ? AND status IN ('pending', 'confirmed')`,
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  // Coach Bookings

  // Create coach booking
  createCoachBooking: async (bookingData) => {
    // Support both 'date'/'time' and 'booking_date'/'booking_time' for flexibility
    const { coach_id, user_id, date, time, booking_date, booking_time, duration, status, payment_status, stripe_session_id, payment_intent_id, notes } = bookingData;
    const bookingDate = booking_date || date;
    const bookingTime = booking_time || time;
    
    if (!bookingDate || !bookingTime) {
      throw new Error('date/booking_date and time/booking_time are required');
    }
    
    const [result] = await pool.query(
      `INSERT INTO coach_bookings (coach_id, user_id, booking_date, booking_time, duration, status, payment_status, stripe_session_id, payment_intent_id, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [coach_id, user_id, bookingDate, bookingTime, duration || 60, status || "pending", payment_status || "pending", stripe_session_id, payment_intent_id || null, notes]
    );
    return result.insertId;
  },

  // Get coach booking by ID
  getCoachBookingById: async (id) => {
    const [rows] = await pool.query(
      `SELECT cb.*, c.name as coach_name, c.specialty, c.hourly_rate,
              u.name as user_name, u.email as user_email
       FROM coach_bookings cb
       JOIN coaches c ON cb.coach_id = c.id
       JOIN users u ON cb.user_id = u.id
       WHERE cb.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // Get coach bookings by user
  getCoachBookingsByUser: async (userId) => {
    const [rows] = await pool.query(
      `SELECT cb.*, c.name as coach_name, c.specialty, c.hourly_rate
       FROM coach_bookings cb
       JOIN coaches c ON cb.coach_id = c.id
       WHERE cb.user_id = ?
       ORDER BY cb.booking_date DESC, cb.booking_time DESC`,
      [userId]
    );
    return rows;
  },

  // Get coach bookings by coach
  getCoachBookingsByCoach: async (coachId, date = null) => {
    let query = `SELECT cb.*, u.name as user_name, u.email as user_email, u.phone
                 FROM coach_bookings cb
                 JOIN users u ON cb.user_id = u.id
                 WHERE cb.coach_id = ?`;
    const params = [coachId];

    if (date) {
      query += " AND cb.booking_date = ?";
      params.push(date);
    }

    query += " ORDER BY cb.booking_date ASC, cb.booking_time ASC";

    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Update coach booking
  updateCoachBooking: async (id, updates) => {
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.query(
      `UPDATE coach_bookings SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  // Cancel coach booking
  cancelCoachBooking: async (id, userId) => {
    const [result] = await pool.query(
      `UPDATE coach_bookings 
       SET status = 'cancelled' 
       WHERE id = ? AND user_id = ? AND status IN ('pending', 'confirmed')`,
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  // Get all event bookings (admin)
  getAllEventBookings: async () => {
    const [rows] = await pool.query(
      `SELECT eb.*, e.name as event_name, e.date as event_date, e.time as event_time, e.price as event_price,
              u.name as user_name, u.email as user_email, u.phone as user_phone
       FROM event_bookings eb
       JOIN events e ON eb.event_id = e.id
       JOIN users u ON eb.user_id = u.id
       ORDER BY eb.created_at DESC`
    );
    return rows;
  },

  // Get all coach bookings (admin)
  getAllCoachBookings: async () => {
    const [rows] = await pool.query(
      `SELECT cb.*, c.name as coach_name, c.specialty,
              u.name as user_name, u.email as user_email, u.phone as user_phone,
              cb.booking_date as session_date, cb.booking_time as session_time
       FROM coach_bookings cb
       JOIN coaches c ON cb.coach_id = c.id
       JOIN users u ON cb.user_id = u.id
       ORDER BY cb.booking_date DESC, cb.booking_time DESC`
    );
    return rows;
  },

  // Update booking status (admin)
  updateBookingStatus: async (bookingId, type, status) => {
    let table;
    if (type === 'event') {
      table = 'event_bookings';
    } else if (type === 'coach') {
      table = 'coach_bookings';
    } else if (type === 'lesson') {
      table = 'lesson_bookings';
    } else {
      throw new Error(`Invalid booking type: ${type}`);
    }
    const [result] = await pool.query(
      `UPDATE ${table} SET status = ? WHERE id = ?`,
      [status, bookingId]
    );
    return result.affectedRows > 0;
  },

  // Find event booking by Stripe session ID (for idempotency)
  findEventBookingByStripeSessionId: async (stripeSessionId) => {
    if (!stripeSessionId) return null;
    const [rows] = await pool.query(
      `SELECT eb.*, e.name as event_name, u.name as user_name, u.email as user_email
       FROM event_bookings eb
       JOIN events e ON eb.event_id = e.id
       JOIN users u ON eb.user_id = u.id
       WHERE eb.stripe_session_id = ?`,
      [stripeSessionId]
    );
    return rows[0] || null;
  },

  // Find coach booking by Stripe session ID (for idempotency)
  findCoachBookingByStripeSessionId: async (stripeSessionId) => {
    if (!stripeSessionId) return null;
    const [rows] = await pool.query(
      `SELECT cb.*, c.name as coach_name, u.name as user_name, u.email as user_email
       FROM coach_bookings cb
       JOIN coaches c ON cb.coach_id = c.id
       JOIN users u ON cb.user_id = u.id
       WHERE cb.stripe_session_id = ?`,
      [stripeSessionId]
    );
    return rows[0] || null;
  },

  // Lesson Bookings

  // Create lesson booking
  createLessonBooking: async (bookingData) => {
    const { lesson_id, user_id, booking_type, status, payment_status, stripe_session_id, payment_intent_id } = bookingData;
    // For pack bookings, set sessions_remaining to 10
    const sessions_remaining = booking_type === 'pack' ? 10 : null;
    const [result] = await pool.query(
      `INSERT INTO lesson_bookings (lesson_id, user_id, booking_type, status, payment_status, stripe_session_id, payment_intent_id, sessions_remaining) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [lesson_id, user_id, booking_type || 'single', status || "pending", payment_status || "pending", stripe_session_id, payment_intent_id || null, sessions_remaining]
    );
    return result.insertId;
  },

  // Get lesson booking by ID
  getLessonBookingById: async (id) => {
    const [rows] = await pool.query(
      `SELECT lb.*, l.title as lesson_title, l.description as lesson_description, l.category,
              u.name as user_name, u.email as user_email
       FROM lesson_bookings lb
       JOIN lessons l ON lb.lesson_id = l.id
       JOIN users u ON lb.user_id = u.id
       WHERE lb.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // Get lesson bookings by user
  getLessonBookingsByUser: async (userId) => {
    const [rows] = await pool.query(
      `SELECT lb.*, l.title as lesson_title, l.description, l.category, l.pricing
       FROM lesson_bookings lb
       JOIN lessons l ON lb.lesson_id = l.id
       WHERE lb.user_id = ?
       ORDER BY lb.created_at DESC`,
      [userId]
    );
    return rows;
  },

  // Get lesson bookings by lesson
  getLessonBookingsByLesson: async (lessonId) => {
    const [rows] = await pool.query(
      `SELECT lb.*, u.name as user_name, u.email as user_email, u.phone
       FROM lesson_bookings lb
       JOIN users u ON lb.user_id = u.id
       WHERE lb.lesson_id = ?
       ORDER BY lb.created_at DESC`,
      [lessonId]
    );
    return rows;
  },

  // Update lesson booking
  updateLessonBooking: async (id, updates) => {
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.query(
      `UPDATE lesson_bookings SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  // Cancel lesson booking
  cancelLessonBooking: async (id, userId) => {
    const [result] = await pool.query(
      `UPDATE lesson_bookings 
       SET status = 'cancelled' 
       WHERE id = ? AND user_id = ? AND status IN ('pending', 'confirmed')`,
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  // Get all lesson bookings (admin)
  getAllLessonBookings: async () => {
    const [rows] = await pool.query(
      `SELECT lb.*, l.title as lesson_title, l.category,
              u.name as user_name, u.email as user_email, u.phone as user_phone
       FROM lesson_bookings lb
       JOIN lessons l ON lb.lesson_id = l.id
       JOIN users u ON lb.user_id = u.id
       ORDER BY lb.created_at DESC`
    );
    return rows;
  },

  // Find lesson booking by Stripe session ID (for idempotency)
  findLessonBookingByStripeSessionId: async (stripeSessionId) => {
    if (!stripeSessionId) return null;
    const [rows] = await pool.query(
      `SELECT lb.*, l.title as lesson_title, u.name as user_name, u.email as user_email
       FROM lesson_bookings lb
       JOIN lessons l ON lb.lesson_id = l.id
       JOIN users u ON lb.user_id = u.id
       WHERE lb.stripe_session_id = ?`,
      [stripeSessionId]
    );
    return rows[0] || null;
  }
};

