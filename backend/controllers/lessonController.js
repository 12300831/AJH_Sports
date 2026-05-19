/**
 * Lesson Controller
 * Handles lesson operations (group coaching)
 */

import { Lesson } from "../models/Lesson.js";
import { sendBookingConfirmationEmail } from "../services/emailService.js";

// Get all lessons
export const getLessons = async (req, res) => {
  try {
    const { status, category, includeInactive } = req.query;
    const filters = {};

    if (status) {
      filters.status = status;
    } else if (includeInactive !== 'true') {
      // Exclude inactive lessons by default
      filters.excludeInactive = true;
    }

    if (category) {
      filters.category = category;
    }

    let lessons = await Lesson.findAll(filters);

    // If excludeInactive is true (default), filter out inactive lessons
    if (includeInactive !== 'true') {
      lessons = lessons.filter(lesson => lesson.status === 'active');
    }

    // Parse pricing JSON strings
    lessons = lessons.map(lesson => {
      if (lesson.pricing) {
        try {
          lesson.pricing = typeof lesson.pricing === 'string' 
            ? JSON.parse(lesson.pricing) 
            : lesson.pricing;
        } catch (e) {
          lesson.pricing = [];
        }
      } else {
        lesson.pricing = [];
      }
      return lesson;
    });

    // Prevent caching to ensure fresh data
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.json({
      success: true,
      lessons
    });
  } catch (error) {
    console.error("Get lessons error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching lessons"
    });
  }
};

// Get lesson by ID
export const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found"
      });
    }

    // Parse pricing JSON string
    if (lesson.pricing) {
      try {
        lesson.pricing = typeof lesson.pricing === 'string' 
          ? JSON.parse(lesson.pricing) 
          : lesson.pricing;
      } catch (e) {
        lesson.pricing = [];
      }
    } else {
      lesson.pricing = [];
    }

    res.json({
      success: true,
      lesson
    });
  } catch (error) {
    console.error("Get lesson by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching lesson"
    });
  }
};

// Admin: Create lesson
export const createLesson = async (req, res) => {
  try {
    const { title, description, image_url, pricing, category, image_position, cta_text, status, display_order } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    // Validate image size if provided (max ~14MB base64 = ~10MB image)
    if (image_url && image_url.trim().length > 14000000) {
      return res.status(400).json({
        success: false,
        message: "Image is too large. Maximum size is 10MB"
      });
    }

    // Validate pricing is an array
    let pricingArray = pricing;
    if (pricing && typeof pricing === 'string') {
      try {
        pricingArray = JSON.parse(pricing);
      } catch (e) {
        pricingArray = [];
      }
    }
    if (!Array.isArray(pricingArray)) {
      pricingArray = [];
    }

    const lessonId = await Lesson.create({
      title,
      description,
      image_url: image_url || null,
      pricing: pricingArray,
      category: category || 'Tennis',
      image_position: image_position || 'right',
      cta_text: cta_text || 'Register Now!',
      status: status || 'active',
      display_order: display_order || 0
    });

    const lesson = await Lesson.findById(lessonId);
    
    // Parse pricing for response
    if (lesson.pricing) {
      try {
        lesson.pricing = typeof lesson.pricing === 'string' 
          ? JSON.parse(lesson.pricing) 
          : lesson.pricing;
      } catch (e) {
        lesson.pricing = [];
      }
    } else {
      lesson.pricing = [];
    }

    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson
    });
  } catch (error) {
    console.error("Create lesson error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error creating lesson"
    });
  }
};

// Admin: Update lesson
export const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image_url, pricing, category, image_position, cta_text, status, display_order } = req.body;

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found"
      });
    }

    // Validate image size if provided (max ~14MB base64 = ~10MB image)
    if (image_url !== undefined && image_url && image_url.trim().length > 14000000) {
      return res.status(400).json({
        success: false,
        message: "Image is too large. Maximum size is 10MB"
      });
    }

    // Validate pricing is an array if provided
    let pricingArray = pricing;
    if (pricing !== undefined) {
      if (typeof pricing === 'string') {
        try {
          pricingArray = JSON.parse(pricing);
        } catch (e) {
          pricingArray = [];
        }
      }
      if (!Array.isArray(pricingArray)) {
        pricingArray = [];
      }
    }

    const updateData = {
      title: title !== undefined ? title : lesson.title,
      description: description !== undefined ? description : lesson.description,
      image_url: image_url !== undefined ? (image_url || null) : lesson.image_url,
      pricing: pricing !== undefined ? pricingArray : undefined,
      category: category !== undefined ? category : lesson.category,
      image_position: image_position !== undefined ? image_position : lesson.image_position,
      cta_text: cta_text !== undefined ? cta_text : lesson.cta_text,
      status: status !== undefined ? status : lesson.status,
      display_order: display_order !== undefined ? display_order : lesson.display_order
    };

    const updated = await Lesson.update(id, updateData);

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "Failed to update lesson"
      });
    }

    const updatedLesson = await Lesson.findById(id);
    
    // Parse pricing for response
    if (updatedLesson.pricing) {
      try {
        updatedLesson.pricing = typeof updatedLesson.pricing === 'string' 
          ? JSON.parse(updatedLesson.pricing) 
          : updatedLesson.pricing;
      } catch (e) {
        updatedLesson.pricing = [];
      }
    } else {
      updatedLesson.pricing = [];
    }

    res.json({
      success: true,
      message: "Lesson updated successfully",
      lesson: updatedLesson
    });
  } catch (error) {
    console.error("Update lesson error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating lesson"
    });
  }
};

// Admin: Delete lesson (soft delete - archive)
export const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found"
      });
    }

    await Lesson.delete(id);

    res.json({
      success: true,
      message: "Lesson archived successfully"
    });
  } catch (error) {
    console.error("Delete lesson error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting lesson"
    });
  }
};

// Admin: Hard delete lesson (permanent)
export const hardDeleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found"
      });
    }

    await Lesson.hardDelete(id);

    res.json({
      success: true,
      message: "Lesson deleted permanently"
    });
  } catch (error) {
    console.error("Hard delete lesson error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting lesson"
    });
  }
};

// Admin: Send test email for a lesson
export const sendTestEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { testEmail, bookingType } = req.body;

    if (!testEmail) {
      return res.status(400).json({
        success: false,
        message: "Test email address is required"
      });
    }

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found"
      });
    }

    // Default to 'single' if not provided
    const bookingType_lesson = bookingType || 'single';

    // Create mock booking details for test email
    const mockBookingDetails = {
      id: 9999,
      user_email: testEmail,
      user_name: 'Test User',
      email: testEmail,
      name: 'Test User',
      booking_type: bookingType_lesson,
      sessions_remaining: bookingType_lesson === 'pack' ? 10 : null
    };

    // Send test email
    const emailSent = await sendBookingConfirmationEmail(mockBookingDetails, lesson, 'lesson');

    if (emailSent) {
      res.json({
        success: true,
        message: `Test email sent successfully to ${testEmail}`
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send test email. Check server logs for details."
      });
    }
  } catch (error) {
    console.error("Send test email error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error sending test email"
    });
  }
};
