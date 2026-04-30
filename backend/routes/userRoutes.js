import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, getAllUsers, verifyEmail, resendVerification, sendResetCode, verifyResetCode, resetPassword, subscribeNewsletter, sendContactMessage } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', sendResetCode);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);
router.post('/newsletter', subscribeNewsletter);
router.post('/contact', sendContactMessage);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/', protect, admin, getAllUsers);

export default router;
