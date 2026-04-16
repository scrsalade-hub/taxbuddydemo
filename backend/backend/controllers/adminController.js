import User from '../models/User.js';
import TaxRecord from '../models/TaxRecord.js';
import Consultation from '../models/Consultation.js';
import Notification from '../models/Notification.js';

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
    
    consultation.status = status;
    if (notes !== undefined) consultation.notes = notes;
    
    await consultation.save();
    
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
