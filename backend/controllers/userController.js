import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { sendWelcomeEmail } from '../services/emailService.js';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, accountType, businessName, businessRegNumber, referredBy } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate referral code
    const referralCode = 'TB-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      accountType,
      businessName: accountType === 'business' ? businessName : undefined,
      businessRegNumber: accountType === 'business' ? businessRegNumber : undefined,
      referralCode,
      referredBy: referredBy || undefined,
    });

    // Create welcome notification
    await Notification.create({
      userId: user._id,
      title: 'Welcome to TaxBuddy!',
      message: 'Your account has been created successfully. Start managing your taxes today!',
      type: 'success',
    });

    // Send welcome email (always send, regardless of emailNotifications setting)
    try {
      await sendWelcomeEmail(user);
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accountType: user.accountType,
      subscription: user.subscription,
      referralCode: user.referralCode,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,
        businessName: user.businessName,
        taxId: user.taxId,
        subscription: user.subscription,
        referralCode: user.referralCode,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.phone = req.body.phone || user.phone;
      user.businessName = req.body.businessName || user.businessName;
      user.taxId = req.body.taxId || user.taxId;
      
      // Allow toggling email notifications preference
      if (req.body.emailNotifications !== undefined) {
        user.emailNotifications = req.body.emailNotifications;
      }
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        accountType: updatedUser.accountType,
        businessName: updatedUser.businessName,
        taxId: updatedUser.taxId,
        subscription: updatedUser.subscription,
        profileImage: updatedUser.profileImage,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
