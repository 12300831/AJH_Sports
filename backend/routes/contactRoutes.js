import express from 'express';
import {
  submitContactMessage,
  getContactMessages,
  getContactMessage,
  updateContactMessage,
  deleteContactMessage
} from '../controllers/contactController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public route - anyone can submit a contact message
router.post('/', submitContactMessage);

// Admin routes - require authentication
router.get('/', authenticate, getContactMessages);
router.get('/:id', authenticate, getContactMessage);
router.put('/:id', authenticate, updateContactMessage);
router.delete('/:id', authenticate, deleteContactMessage);

export default router;




