/**
 * Lesson Model
 * Handles database operations for lessons (group coaching)
 */

import pool from "../config/db.js";

export const Lesson = {
  // Get all lessons
  findAll: async (filters = {}) => {
    let query = "SELECT * FROM lessons WHERE 1=1";
    const params = [];

    if (filters.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }

    if (filters.category) {
      query += " AND category = ?";
      params.push(filters.category);
    }

    query += " ORDER BY display_order ASC, id ASC";

    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Get lesson by ID
  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM lessons WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  // Create lesson
  create: async (lessonData) => {
    const { 
      title, 
      description, 
      image_url, 
      pricing, 
      category, 
      image_position, 
      cta_text, 
      status, 
      display_order 
    } = lessonData;
    
    // Convert pricing array to JSON string if it's an array
    let pricingString = pricing;
    if (Array.isArray(pricing)) {
      pricingString = JSON.stringify(pricing);
    } else if (typeof pricing === 'string' && pricing.trim() !== '') {
      pricingString = pricing;
    } else {
      pricingString = '[]';
    }
    
    const [result] = await pool.query(
      `INSERT INTO lessons (title, description, image_url, pricing, category, image_position, cta_text, status, display_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, 
        description || null, 
        image_url || null, 
        pricingString, 
        category || 'Tennis', 
        image_position || 'right', 
        cta_text || 'Register Now!', 
        status || 'active', 
        display_order || 0
      ]
    );
    return result.insertId;
  },

  // Update lesson
  update: async (id, lessonData) => {
    try {
      const { 
        title, 
        description, 
        image_url, 
        pricing, 
        category, 
        image_position, 
        cta_text, 
        status, 
        display_order 
      } = lessonData;
      
      // Convert pricing array to JSON string if it's an array
      let pricingString = pricing;
      if (pricing !== undefined) {
        if (Array.isArray(pricing)) {
          pricingString = JSON.stringify(pricing);
        } else if (typeof pricing === 'string' && pricing.trim() !== '') {
          pricingString = pricing;
        }
      }
      
      const updateFields = [];
      const updateValues = [];
      
      if (title !== undefined) {
        updateFields.push('title = ?');
        updateValues.push(title);
      }
      if (description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(description || null);
      }
      if (image_url !== undefined) {
        updateFields.push('image_url = ?');
        updateValues.push(image_url || null);
      }
      if (pricing !== undefined) {
        updateFields.push('pricing = ?');
        updateValues.push(pricingString);
      }
      if (category !== undefined) {
        updateFields.push('category = ?');
        updateValues.push(category);
      }
      if (image_position !== undefined) {
        updateFields.push('image_position = ?');
        updateValues.push(image_position);
      }
      if (cta_text !== undefined) {
        updateFields.push('cta_text = ?');
        updateValues.push(cta_text);
      }
      if (status !== undefined) {
        updateFields.push('status = ?');
        updateValues.push(status);
      }
      if (display_order !== undefined) {
        updateFields.push('display_order = ?');
        updateValues.push(display_order);
      }
      
      if (updateFields.length === 0) {
        return false;
      }
      
      updateValues.push(id);
      
      const [result] = await pool.query(
        `UPDATE lessons SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('❌ Lesson.update - Database error:', error);
      throw error;
    }
  },

  // Soft delete lesson (set status to 'inactive')
  delete: async (id) => {
    const [result] = await pool.query(
      "UPDATE lessons SET status = 'inactive' WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },

  // Hard delete lesson (permanent - use with caution)
  hardDelete: async (id) => {
    const [result] = await pool.query("DELETE FROM lessons WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
};
