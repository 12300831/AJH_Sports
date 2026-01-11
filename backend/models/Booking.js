/**
 * Booking Model
 * Handles database operations for event and coach bookings
 */

import pool from "../config/db.js";

export const Booking = {
  // Event Bookings

  // Create event booking
  createEventBooking: async (bookingData) => {
    const { event_id, user_id, status, payment_status, stripe_session_id } = bookingData;
    const [result] = await pool.query(
      `INSERT INTO event_bookings (event_id, user_id, status, payment_status, stripe_session_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [event_id, user_id, status || "pending", payment_status || "pending", stripe_session_id]
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
    const { coach_id, user_id, date, time, duration, status, payment_status, stripe_session_id, notes } = bookingData;
    const [result] = await pool.query(
      `INSERT INTO coach_bookings (coach_id, user_id, date, time, duration, status, payment_status, stripe_session_id, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [coach_id, user_id, date, time, duration || 60, status || "pending", payment_status || "pending", stripe_session_id, notes]
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
       ORDER BY cb.date DESC, cb.time DESC`,
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
      query += " AND cb.date = ?";
      params.push(date);
    }

    query += " ORDER BY cb.date ASC, cb.time ASC";

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
              u.name as user_name, u.email as user_email, u.phone as user_phone
       FROM coach_bookings cb
       JOIN coaches c ON cb.coach_id = c.id
       JOIN users u ON cb.user_id = u.id
       ORDER BY cb.date DESC, cb.time DESC`
    );
    return rows;
  },

  // Update booking status (admin)
  updateBookingStatus: async (bookingId, type, status) => {
    const table = type === 'event' ? 'event_bookings' : 'coach_bookings';
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
  }
};

