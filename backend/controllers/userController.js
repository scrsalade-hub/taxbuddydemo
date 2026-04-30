import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Newsletter from '../models/Newsletter.js';
import { sendWelcomeEmail, sendVerificationEmail, sendResetCodeEmail } from '../services/emailService.js';

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

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    // Create welcome notification
    await Notification.create({
      userId: user._id,
      title: 'Welcome to TaxBuddy!',
      message: 'Your account has been created successfully. Start managing your taxes today!',
      type: 'success',
    });

    // Create email verification reminder notification
    await Notification.create({
      userId: user._id,
      title: 'Verify Your Email Address',
      message: 'Please verify your email to receive tax deadline reminders, booking confirmations, and account security alerts. Verifying your email ensures you never miss important updates and keeps your account protected.',
      type: 'alert',
    });

    // Send welcome email (always send, regardless of emailNotifications setting)
    try {
      await sendWelcomeEmail(user);
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
    }

    // Send verification email
    try {
      await sendVerificationEmail(user, verificationToken);
    } catch (emailError) {
      console.error('Verification email failed:', emailError);
    }

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accountType: user.accountType,
      subscription: user.subscription,
      referralCode: user.referralCode,
      emailVerified: user.emailVerified,
      verificationToken: verificationToken,
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
        emailVerified: user.emailVerified,
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
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,
        businessName: user.businessName,
        businessRegNumber: user.businessRegNumber,
        taxId: user.taxId,
        subscription: user.subscription,
        referralCode: user.referralCode,
        profileImage: user.profileImage,
        emailNotifications: user.emailNotifications,
        emailVerified: user.emailVerified,
      });
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

// @desc    Verify email with token
// @route   GET /api/users/verify-email/:token
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Send success notification
    await Notification.create({
      userId: user._id,
      title: 'Email Verified!',
      message: 'Your email has been successfully verified. You will now receive tax deadline reminders, booking confirmations, and important account updates.',
      type: 'success',
    });

    res.json({
      message: 'Email verified successfully',
      emailVerified: true,
      email: user.email,
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send password reset code
// @route   POST /api/users/forgot-password
export const sendResetCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Return generic message to prevent email enumeration
      return res.json({ message: 'If an account exists with this email, a reset code has been sent.' });
    }

    // Generate 4-digit numeric code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetPasswordCode = code;
    user.resetPasswordCodeExpires = expiresAt;
    await user.save();

    // Send reset code email
    const result = await sendResetCodeEmail(user, code);

    if (!result.success) {
      return res.status(500).json({ message: 'Failed to send reset code', error: result.error });
    }

    res.json({ message: 'If an account exists with this email, a reset code has been sent.' });
  } catch (error) {
    console.error('Send reset code error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify reset code
// @route   POST /api/users/verify-reset-code
export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const user = await User.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordCodeExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    res.json({ message: 'Code verified', valid: true });
  } catch (error) {
    console.error('Verify reset code error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password after code verification
// @route   POST /api/users/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;

    if (!email || !code || !password) {
      return res.status(400).json({ message: 'Email, code, and new password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordCodeExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired code. Please request a new one.' });
    }

    // Update password and clear reset code
    user.password = password;
    user.resetPasswordCode = undefined;
    user.resetPasswordCodeExpires = undefined;
    await user.save();

    // Send password change notification
    await Notification.create({
      userId: user._id,
      title: 'Password Changed Successfully',
      message: 'Your TaxBuddy password has been reset successfully. If you did not initiate this change, please contact support immediately.',
      type: 'success',
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resend verification email
// @route   POST /api/users/resend-verification
export const resendVerification = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    // Send verification email
    const result = await sendVerificationEmail(user, verificationToken);

    if (!result.success) {
      return res.status(500).json({ message: 'Failed to send verification email', error: result.error });
    }

    res.json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Subscribe to newsletter
// @route   POST /api/users/newsletter
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(200).json({ message: 'You are already subscribed to our newsletter!' });
    }

    const subscriber = await Newsletter.create({
      email: email.toLowerCase().trim(),
      name: name || '',
    });

    res.status(201).json({ message: 'Thank you for subscribing to the TaxBuddy newsletter!', subscriber });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send contact form message
// @route   POST /api/users/contact
export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailService = await import('../services/emailService.js');
    const result = await emailService.sendEmail(
      'scrsalade@gmail.com',
      `Contact Form: ${subject}`,
      `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e5e7eb;border-radius:8px;">
          <h2 style="color:#038C2A;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb;">
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap;background:#f9fafb;padding:12px;border-radius:6px;">${message}</p>
        </div>
      `
    );

    if (!result.success) {
      return res.status(500).json({ message: 'Failed to send message. Please try again.' });
    }

    res.json({ message: 'Message sent successfully! We will get back to you soon.' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: error.message });
  }
};
