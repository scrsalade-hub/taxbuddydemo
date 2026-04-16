import mongoose from 'mongoose';

const taxRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  income: { type: Number, required: true },
  expenses: { type: Number, default: 0 },
  taxableIncome: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  taxRate: { type: Number, required: true },
  taxType: { type: String, enum: ['PIT', 'CIT', 'VAT', 'WHT'], required: true },
  status: { type: String, enum: ['paid', 'unpaid', 'pending'], default: 'unpaid' },
  paymentDate: { type: Date },
  paymentReference: { type: String },
  notes: { type: String },
}, { timestamps: true });

const TaxRecord = mongoose.model('TaxRecord', taxRecordSchema);
export default TaxRecord;
