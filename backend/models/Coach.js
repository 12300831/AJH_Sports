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
    const { name, specialty, email, phone, location, availability, hourly_rate, allowed_durations, status, image_url, linkedin_url, twitter_url, instagram_url, facebook_url } = coachData;
    const allowedDurationsJson = allowed_durations && Array.isArray(allowed_durations) 
      ? JSON.stringify(allowed_durations) 
      : JSON.stringify([60]);
    const [result] = await pool.query(
      `INSERT INTO coaches (name, specialty, email, phone, location, availability, hourly_rate, allowed_durations, status, image_url, linkedin_url, twitter_url, instagram_url, facebook_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, specialty, email, phone, location || null, availability, hourly_rate || 0, allowedDurationsJson, status || "active", image_url || null, linkedin_url || null, twitter_url || null, instagram_url || null, facebook_url || null]
    );
    return result.insertId;
  },

  // Update coach
  update: async (id, coachData) => {
    try {
      const { name, specialty, email, phone, location, availability, hourly_rate, allowed_durations, status, image_url, linkedin_url, twitter_url, instagram_url, facebook_url } = coachData;
      const allowedDurationsJson = allowed_durations && Array.isArray(allowed_durations) 
        ? JSON.stringify(allowed_durations) 
        : JSON.stringify([60]);
      
      console.log('📝 Coach.update - SQL update for ID:', id);
      console.log('📝 Coach.update - Data:', { name, specialty, email, phone, location, availability, hourly_rate, allowed_durations, status, image_url: image_url ? `base64 (${image_url.substring(0, 50)}...)` : image_url, linkedin_url, twitter_url, instagram_url, facebook_url });
      
      const [result] = await pool.query(
        `UPDATE coaches 
         SET name = ?, specialty = ?, email = ?, phone = ?, location = ?, availability = ?, hourly_rate = ?, allowed_durations = ?, status = ?, image_url = ?, linkedin_url = ?, twitter_url = ?, instagram_url = ?, facebook_url = ?
         WHERE id = ?`,
        [name, specialty, email, phone, location || null, availability, hourly_rate, allowedDurationsJson, status, image_url, linkedin_url || null, twitter_url || null, instagram_url || null, facebook_url || null, id]
      );
      
      console.log('✅ Coach.update - Result:', {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
        warningCount: result.warningCount
      });
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('❌ Coach.update - Database error:', error);
      throw error;
    }
  },

  // Soft delete coach (set status to 'inactive')
  delete: async (id) => {
    const [result] = await pool.query(
      "UPDATE coaches SET status = 'inactive' WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },

  // Hard delete coach (permanent - use with caution)
  hardDelete: async (id) => {
    const [result] = await pool.query("DELETE FROM coaches WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  // Check if coach is available at a specific date/time
  isAvailable: async (coachId, date, time, duration = 60) => {
    const [bookings] = await pool.query(
      `SELECT * FROM coach_bookings 
       WHERE coach_id = ? 
       AND booking_date = ? 
       AND status IN ('pending', 'confirmed')
       AND (
         (booking_time <= ? AND ADDTIME(booking_time, SEC_TO_TIME(? * 60)) > ?)
         OR
         (? < ADDTIME(booking_time, SEC_TO_TIME(? * 60)) AND ? >= booking_time)
       )`,
      [coachId, date, time, duration, time, time, duration, time]
    );
    return bookings.length === 0;
  }
};

