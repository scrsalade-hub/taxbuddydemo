import express from 'express';
import { 
  adminLogin, 
  getAllUsers, 
  getAdminStats, 
  getDashboard, 
  updateUserStatus,
  getUsersWithFilter,
  getAllConsultations,
  getConsultationById,
  updateConsultationStatus,
  deleteConsultation,
  getConsultationStats,
  sendNotificationToUser,
  sendNotificationToAllUsers
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/users', getAllUsers);
router.get('/users/filter', getUsersWithFilter);
router.get('/stats', getAdminStats);
router.get('/dashboard', getDashboard);
router.put('/users/:id/status', updateUserStatus);

// Consultation routes
router.get('/consultations', getAllConsultations);
router.get('/consultations/stats', getConsultationStats);
router.get('/consultations/:id', getConsultationById);
router.put('/consultations/:id/status', updateConsultationStatus);
router.delete('/consultations/:id', deleteConsultation);

// Notification routes
router.post('/notifications/send', sendNotificationToUser);
router.post('/notifications/send-all', sendNotificationToAllUsers);

export default router;
