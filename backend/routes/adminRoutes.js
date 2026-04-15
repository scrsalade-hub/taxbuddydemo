import express from 'express';
import { adminLogin, getAllUsers, getAdminStats, getDashboard, updateUserStatus } from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/users', getAllUsers);
router.get('/stats', getAdminStats);
router.get('/dashboard', getDashboard);
router.put('/users/:id/status', updateUserStatus);

export default router;
