import db from '../config/db.js';

/**
 * Submit a contact message
 * POST /api/contact
 */
export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        message: 'Name, email, and message are required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format'
      });
    }

    // Insert message into database
    const [result] = await db.execute(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
      [name.trim(), email.trim(), message.trim()]
    );

    res.status(201).json({
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({
      message: 'Failed to submit message. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all contact messages (Admin only)
 * GET /api/contact
 */
export const getContactMessages = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    // Parse limit and offset as integers (ensure they're numbers, not strings)
    const limitNum = parseInt(String(limit), 10);
    const offsetNum = parseInt(String(offset), 10);
    
    // Ensure valid numbers (sanitize to prevent SQL injection)
    const safeLimit = isNaN(limitNum) || limitNum < 1 ? 50 : Math.min(limitNum, 1000);
    const safeOffset = isNaN(offsetNum) || offsetNum < 0 ? 0 : offsetNum;

    let query = 'SELECT * FROM contact_messages';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    // Build query with LIMIT and OFFSET as part of the string (sanitized above)
    // mysql2 execute() has issues with LIMIT/OFFSET parameters, so we use query() instead
    query += ` ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;
    
    // Use query() instead of execute() since we're building LIMIT/OFFSET directly
    const [messages] = await db.query(query, params.length > 0 ? params : []);

    res.json({
      messages,
      count: messages.length
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      message: 'Error fetching messages',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get a single contact message (Admin only)
 * GET /api/contact/:id
 */
export const getContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const [messages] = await db.execute(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    if (messages.length === 0) {
      return res.status(404).json({
        message: 'Message not found'
      });
    }

    res.json(messages[0]);
  } catch (error) {
    console.error('Error fetching contact message:', error);
    res.status(500).json({
      message: 'Error fetching message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update contact message status (Admin only)
 * PUT /api/contact/:id
 */
export const updateContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    if (!status) {
      return res.status(400).json({
        message: 'Status is required'
      });
    }

    const validStatuses = ['new', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status. Must be one of: new, read, replied, archived'
      });
    }

    let query = 'UPDATE contact_messages SET status = ?';
    const params = [status];

    if (admin_notes !== undefined) {
      query += ', admin_notes = ?';
      params.push(admin_notes);
    }

    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await db.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Message not found'
      });
    }

    res.json({
      message: 'Message updated successfully'
    });
  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({
      message: 'Error updating message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete contact message (Admin only)
 * DELETE /api/contact/:id
 */
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      'DELETE FROM contact_messages WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Message not found'
      });
    }

    res.json({
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({
      message: 'Error deleting message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};




