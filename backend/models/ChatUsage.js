import mongoose from 'mongoose';

const chatUsageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  messageCount: {
    type: Number,
    default: 0,
  },
  lastResetDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for faster user lookups
chatUsageSchema.index({ userId: 1 });

const ChatUsage = mongoose.model('ChatUsage', chatUsageSchema);
export default ChatUsage;
