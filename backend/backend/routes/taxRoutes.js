import express from 'express';
import { 
  calculateTax, 
  createTaxRecord, 
  getTaxRecords, 
  updateTaxRecord, 
  markTaxAsPaid, 
  deleteTaxRecord,
  getDashboardStats 
} from '../controllers/taxController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/calculate', protect, calculateTax);
router.post('/records', protect, createTaxRecord);
router.get('/records', protect, getTaxRecords);
router.put('/records/:id', protect, updateTaxRecord);
router.put('/records/:id/pay', protect, markTaxAsPaid);
router.delete('/records/:id', protect, deleteTaxRecord);
router.get('/dashboard', protect, getDashboardStats);

export default router;
