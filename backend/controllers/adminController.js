import User from '../models/User.js';
import TaxRecord from '../models/TaxRecord.js';
import Consultation from '../models/Consultation.js';
import Notification from '../models/Notification.js';
import { sendEmail, sendBulkEmail } from '../services/emailService.js';

// @desc    Admin login
// @route   POST /api/admin/login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      res.json({
        email,
        role: 'admin',
        token: 'admin-token-' + Date.now(),
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ subscription: { $ne: 'free' } });
    const totalTaxRecords = await TaxRecord.countDocuments();
    const totalConsultations = await Consultation.countDocuments();

    // Calculate revenue (mock calculation)
    const proUsers = await User.countDocuments({ subscription: 'pro' });
    const enterpriseUsers = await User.countDocuments({ subscription: 'enterprise' });
    const monthlyRevenue = (proUsers * 5000) + (enterpriseUsers * 25000);

    res.json({
      totalUsers,
      activeUsers,
      totalTaxRecords,
      totalConsultations,
      monthlyRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard data (stats + recent users)
// @route   GET /api/admin/dashboard
export const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCalculations = await TaxRecord.countDocuments();
    const totalConsultations = await Consultation.countDocuments();

    // Calculate revenue
    const proUsers = await User.countDocuments({ subscription: 'pro' });
    const enterpriseUsers = await User.countDocuments({ subscription: 'enterprise' });
    const revenue = (proUsers * 5000) + (enterpriseUsers * 25000);

    const recentUsers = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalCalculations,
        totalConsultations,
        revenue,
      },
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // You can add a status field to User model if needed
    res.json({ message: 'User status updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get users with email notification filter
// @route   GET /api/admin/users/filter
export const getUsersWithFilter = async (req, res) => {
  try {
    const { emailNotifications, accountType, subscription } = req.query;
    
    let query = {};
    
    if (emailNotifications !== undefined) {
      query.emailNotifications = emailNotifications === 'true';
    }
    
    if (accountType) {
      query.accountType = accountType;
    }
    
    if (subscription) {
      query.subscription = subscription;
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({ users, count: users.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all consultations
// @route   GET /api/admin/consultations
export const getAllConsultations = async (req, res) => {
  try {
    const { status, consultant } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (consultant) query.consultantName = consultant;
    
    const consultations = await Consultation.find(query)
      .populate('userId', 'firstName lastName email phone')
      .sort({ createdAt: -1 });
    
    res.json({ consultations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get consultation by ID
// @route   GET /api/admin/consultations/:id
export const getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('userId', 'firstName lastName email phone accountType');
    
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    res.json(consultation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update consultation status
// @route   PUT /api/admin/consultations/:id/status
export const updateConsultationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const consultation = await Consultation.findById(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    const oldStatus = consultation.status;
    consultation.status = status;
    if (notes !== undefined) consultation.notes = notes;
    
    await consultation.save();
    
    // Send notification to user about status update
    const Notification = (await import('../models/Notification.js')).default;
    
    const statusMessages = {
      pending: 'Your consultation is pending review.',
      confirmed: 'Your consultation has been confirmed!',
      completed: 'Your consultation has been completed.',
      cancelled: 'Your consultation has been cancelled.',
    };
    
    let notificationMessage = statusMessages[status] || `Your consultation status has been updated to ${status}.`;
    if (notes) {
      notificationMessage += `\n\nMessage: ${notes}`;
    }
    
    await Notification.create({
      userId: consultation.userId,
      title: `Consultation ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: notificationMessage,
      type: status === 'cancelled' ? 'alert' : status === 'completed' ? 'success' : 'info',
    });
    
    res.json({ message: 'Consultation status updated', consultation });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete consultation
// @route   DELETE /api/admin/consultations/:id
export const deleteConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    await consultation.deleteOne();
    res.json({ message: 'Consultation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get consultation statistics
// @route   GET /api/admin/consultations/stats
export const getConsultationStats = async (req, res) => {
  try {
    const total = await Consultation.countDocuments();
    const pending = await Consultation.countDocuments({ status: { $in: ['pending', 'scheduled'] } });
    const confirmed = await Consultation.countDocuments({ status: 'confirmed' });
    const completed = await Consultation.countDocuments({ status: 'completed' });
    const cancelled = await Consultation.countDocuments({ status: 'cancelled' });
    
    // Calculate total revenue from consultations
    const revenue = await Consultation.aggregate([
      { $match: { status: { $nin: ['cancelled'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    res.json({
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      revenue: revenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send email to a specific user
// @route   POST /api/admin/emails/send
export const sendEmailToUser = async (req, res) => {
  try {
    const { userId, subject, html } = req.body;

    if (!userId || !subject || !html) {
      return res.status(400).json({ message: 'userId, subject, and html are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send email regardless of notification preference (admin override)
    const result = await sendEmail(user.email, subject, html);

    if (!result.success) {
      return res.status(500).json({ message: 'Failed to send email', error: result.error });
    }

    res.json({ message: 'Email sent successfully', recipient: user.email });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send email to all users or filtered group
// @route   POST /api/admin/emails/send-all
export const sendEmailToAllUsers = async (req, res) => {
  try {
    const { subject, html, filter } = req.body;

    if (!subject || !html) {
      return res.status(400).json({ message: 'subject and html are required' });
    }

    let userQuery = {};

    // Apply email notification filter if provided
    if (filter?.emailNotifications !== undefined) {
      userQuery.emailNotifications = filter.emailNotifications === true || filter.emailNotifications === 'true';
    }

    // Apply account type filter
    if (filter?.accountType) {
      userQuery.accountType = filter.accountType;
    }

    // Apply subscription filter
    if (filter?.subscription) {
      userQuery.subscription = filter.subscription;
    }

    // Apply specific userIds (group send)
    if (filter?.userIds && Array.isArray(filter.userIds) && filter.userIds.length > 0) {
      userQuery._id = { $in: filter.userIds };
    }

    const users = await User.find(userQuery).select('email firstName lastName');

    if (users.length === 0) {
      return res.status(200).json({
        message: 'No users match the filter criteria',
        count: 0,
      });
    }

    // Send emails
    const results = await sendBulkEmail(users, subject, html);

    res.json({
      message: `Email sent to ${results.success} users (${results.failed} failed)`,
      sent: results.success,
      failed: results.failed,
      total: users.length,
      errors: results.failed > 0 ? results.errors : undefined,
    });
  } catch (error) {
    console.error('Send bulk email error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get users for email sending with notification filter
// @route   GET /api/admin/emails/users
export const getUsersForEmail = async (req, res) => {
  try {
    const { emailNotifications, accountType, subscription } = req.query;

    let query = {};

    if (emailNotifications !== undefined) {
      query.emailNotifications = emailNotifications === 'true';
    }

    if (accountType) {
      query.accountType = accountType;
    }

    if (subscription) {
      query.subscription = subscription;
    }

    const users = await User.find(query)
      .select('_id firstName lastName email emailNotifications accountType subscription createdAt')
      .sort({ createdAt: -1 });

    // Count stats
    const totalUsers = await User.countDocuments();
    const subscribedCount = await User.countDocuments({ emailNotifications: true });
    const unsubscribedCount = await User.countDocuments({ emailNotifications: false });

    res.json({
      users,
      count: users.length,
      stats: {
        totalUsers,
        subscribedCount,
        unsubscribedCount,
      },
    });
  } catch (error) {
    console.error('Get users for email error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send notification to specific user
// @route   POST /api/admin/notifications/send
export const sendNotificationToUser = async (req, res) => {
  try {
    const { userId, title, message, type = 'info' } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const notification = new Notification({
      userId,
      title,
      message,
      type,
      isRead: false,
    });
    
    await notification.save();
    
    res.status(201).json({ 
      message: 'Notification sent successfully', 
      notification 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send notification to all users
// @route   POST /api/admin/notifications/send-all
export const sendNotificationToAllUsers = async (req, res) => {
  try {
    const { title, message, type = 'info', filter = {} } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }
    
    let userQuery = {};
    
    // Apply filters if provided
    if (filter.emailNotifications !== undefined) {
      userQuery.emailNotifications = filter.emailNotifications;
    }
    if (filter.accountType) {
      userQuery.accountType = filter.accountType;
    }
    if (filter.subscription) {
      userQuery.subscription = filter.subscription;
    }
    
    const users = await User.find(userQuery);
    
    if (users.length === 0) {
      return res.status(200).json({ 
        message: 'No users match the filter criteria',
        count: 0
      });
    }
    
    const notifications = users.map(user => ({
      userId: user._id,
      title,
      message,
      type,
      isRead: false,
    }));
    
    await Notification.insertMany(notifications);
    
    res.status(201).json({ 
      message: `Notification sent to ${users.length} users`,
      count: users.length
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ message: error.message });
  }
};
