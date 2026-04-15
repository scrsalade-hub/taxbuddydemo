import express from 'express';
import { bookConsultation, getConsultations, cancelConsultation } from '../controllers/consultationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, bookConsultation);
router.get('/', protect, getConsultations);
router.put('/:id/cancel', protect, cancelConsultation);

export default router;
