import Notification from '../models/Notification.js';

// @desc    Get user's notifications
// @route   GET /api/notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear all notifications
// @route   DELETE /api/notifications
export const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.user._id });
    res.json({ message: 'All notifications cleared' });
  } catch (error) {
    console.error('Clear all notifications error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send notification to user (Admin only)
// @route   POST /api/notifications/send
export const sendNotification = async (req, res) => {
  try {
    const { userId, title, message, type = 'info' } = req.body;

    const notification = new Notification({
      userId,
      title,
      message,
      type,
      isRead: false,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send notification to all users (Admin only)
// @route   POST /api/notifications/send-all
export const sendNotificationToAll = async (req, res) => {
  try {
    const { title, message, type = 'info' } = req.body;
    const User = (await import('../models/User.js')).default;
    
    const users = await User.find({});
    const notifications = users.map(user => ({
      userId: user._id,
      title,
      message,
      type,
      isRead: false,
    }));

    await Notification.insertMany(notifications);
    res.status(201).json({ message: `Notification sent to ${users.length} users` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
