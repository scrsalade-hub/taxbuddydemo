import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['reminder', 'alert', 'success', 'info'], default: 'info' },
  isRead: { type: Boolean, default: false },
  dueDate: { type: Date },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
