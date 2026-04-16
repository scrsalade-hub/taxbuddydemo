import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  consultantName: { type: String, required: true },
  consultantImage: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: Number, default: 60 },
  topic: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  amount: { type: Number, required: true },
  meetingLink: { type: String },
  notes: { type: String },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
}, { timestamps: true });

const Consultation = mongoose.model('Consultation', consultationSchema);
export default Consultation;
