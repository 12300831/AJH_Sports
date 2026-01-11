/**
 * Event Model
 * Handles database operations for events
 */

import pool from "../config/db.js";

export const Event = {
  // Get all events
  findAll: async (filters = {}) => {
    let query = "SELECT * FROM events WHERE 1=1";
    const params = [];

    if (filters.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }

    // Exclude inactive events by default for public access
    if (filters.excludeInactive) {
      query += " AND status != 'inactive'";
    }

    if (filters.date) {
      query += " AND date = ?";
      params.push(filters.date);
    }

    if (filters.dateFrom) {
      query += " AND date >= ?";
      params.push(filters.dateFrom);
    }

    query += " ORDER BY date ASC, time ASC";

    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Get event by ID
  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM events WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  // Create event
  create: async (eventData) => {
    const { name, description, date, time, max_players, price, location, status, image_url, hero_image_url } = eventData;
    const [result] = await pool.query(
      `INSERT INTO events (name, description, date, time, max_players, price, location, image_url, hero_image_url, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, date, time, max_players || 20, price || 0, location, image_url || null, hero_image_url || null, status || "active"]
    );
    return result.insertId;
  },

  // Update event
  update: async (id, eventData) => {
    const { name, description, date, time, max_players, price, location, image_url, hero_image_url, status } = eventData;
    const [result] = await pool.query(
      `UPDATE events 
       SET name = ?, description = ?, date = ?, time = ?, max_players = ?, price = ?, location = ?, image_url = ?, hero_image_url = ?, status = ?
       WHERE id = ?`,
      [name, description, date, time, max_players, price, location, image_url, hero_image_url, status, id]
    );
    return result.affectedRows > 0;
  },

  // Soft delete event (set status to 'inactive')
  delete: async (id) => {
    const [result] = await pool.query(
      "UPDATE events SET status = 'inactive' WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },

  // Hard delete event (permanent - use with caution)
  hardDelete: async (id) => {
    const [result] = await pool.query("DELETE FROM events WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  // Get available spots for an event
  // Only counts confirmed bookings (bookings are created with 'confirmed' status after payment)
  getAvailableSpots: async (eventId) => {
    const event = await Event.findById(eventId);
    if (!event) return null;

    const [bookings] = await pool.query(
      `SELECT COUNT(*) as booked_count 
       FROM event_bookings 
       WHERE event_id = ? AND status = 'confirmed'`,
      [eventId]
    );

    const booked = bookings[0].booked_count;
    return Math.max(0, event.max_players - booked);
  }
};

