import ChatUsage from '../models/ChatUsage.js';
import { generateChatResponse } from '../services/gemini.js';

const MAX_MESSAGES_PER_DAY = 10;
const MESSAGE_CHAR_LIMIT = 500;

/**
 * Check if two dates are the same calendar day
 */
const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * Get or create user's chat usage record, with daily reset
 */
const getOrCreateUsage = async (userId) => {
  let usage = await ChatUsage.findOne({ userId });

  if (!usage) {
    usage = await ChatUsage.create({
      userId,
      messageCount: 0,
      lastResetDate: new Date(),
    });
    return usage;
  }

  // Check if we need to reset for a new day
  const now = new Date();
  if (!isSameDay(usage.lastResetDate, now)) {
    usage.messageCount = 0;
    usage.lastResetDate = now;
    await usage.save();
  }

  return usage;
};

/**
 * POST /api/chat
 * Handle chat messages with validation, limits, and tiered responses
 */
export const handleChat = async (req, res) => {
  try {
    const { userId, message } = req.body;

    // A. Validation
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    if (message.length > MESSAGE_CHAR_LIMIT) {
      return res.status(400).json({
        error: `Message exceeds ${MESSAGE_CHAR_LIMIT} character limit`,
      });
    }

    if (!userId || userId.trim().length === 0) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // B & C. Get usage with daily reset, check limit
    const usage = await getOrCreateUsage(userId);

    if (usage.messageCount >= MAX_MESSAGES_PER_DAY) {
      return res.status(429).json({ error: 'Daily limit reached' });
    }

    // D. Tier system: messages 6-10 get reduced responses
    const isReducedTier = usage.messageCount >= 5;

    // Generate Gemini response
    const reply = await generateChatResponse(message.trim(), isReducedTier);

    // E. Increment message count
    usage.messageCount += 1;
    await usage.save();

    const remainingMessages = MAX_MESSAGES_PER_DAY - usage.messageCount;

    return res.json({
      reply,
      remainingMessages: Math.max(0, remainingMessages),
    });
  } catch (error) {
    console.error('Chat handler error:', error);
    return res.status(500).json({
      error: error.message || 'Something went wrong. Please try again later.',
    });
  }
};
