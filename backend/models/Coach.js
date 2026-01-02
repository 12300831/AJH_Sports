/**
 * Coach Model
 * Handles database operations for coaches
 */

import pool from "../config/db.js";

export const Coach = {
  // Get all coaches
  findAll: async (filters = {}) => {
    let query = "SELECT * FROM coaches WHERE 1=1";
    const params = [];

    if (filters.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }

    query += " ORDER BY name ASC";

    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Get coach by ID
  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM coaches WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  // Create coach
  create: async (coachData) => {
    const { name, specialty, email, phone, availability, hourly_rate, status } = coachData;
    const [result] = await pool.query(
      `INSERT INTO coaches (name, specialty, email, phone, availability, hourly_rate, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, specialty, email, phone, availability, hourly_rate || 0, status || "active"]
    );
    return result.insertId;
  },

  // Update coach
  update: async (id, coachData) => {
    const { name, specialty, email, phone, availability, hourly_rate, status } = coachData;
    const [result] = await pool.query(
      `UPDATE coaches 
       SET name = ?, specialty = ?, email = ?, phone = ?, availability = ?, hourly_rate = ?, status = ?
       WHERE id = ?`,
      [name, specialty, email, phone, availability, hourly_rate, status, id]
    );
    return result.affectedRows > 0;
  },

  // Delete coach
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM coaches WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  // Check if coach is available at a specific date/time
  isAvailable: async (coachId, date, time, duration = 60) => {
    const [bookings] = await pool.query(
      `SELECT * FROM coach_bookings 
       WHERE coach_id = ? 
       AND date = ? 
       AND status IN ('pending', 'confirmed')
       AND (
         (time <= ? AND ADDTIME(time, SEC_TO_TIME(? * 60)) > ?)
         OR
         (? < ADDTIME(time, SEC_TO_TIME(? * 60)) AND ? >= time)
       )`,
      [coachId, date, time, duration, time, time, duration, time]
    );
    return bookings.length === 0;
  }
};

