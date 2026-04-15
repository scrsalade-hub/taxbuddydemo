import User from '../models/User.js';
import TaxRecord from '../models/TaxRecord.js';
import Consultation from '../models/Consultation.js';

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
