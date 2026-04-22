import express from 'express';
import rateLimit from 'express-rate-limit';
import { handleChat } from '../controllers/chatController.js';

const router = express.Router();

// Rate limiter: 20 requests per minute per IP
const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/chat
router.post('/', chatRateLimiter, handleChat);

export default router;
