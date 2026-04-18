import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  time: { type: String, required: true },
  isBooked: { type: Boolean, default: false }
}, { _id: true });

const availabilitySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  dateString: {
    type: String,
    required: true,
  },
  consultantId: {
    type: String,
    required: true,
  },
  timeSlots: [timeSlotSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: String,
    default: 'admin',
  },
}, {
  timestamps: true,
});

// Index for faster queries
availabilitySchema.index({ dateString: 1 });

const Availability = mongoose.model('Availability', availabilitySchema);
export default Availability;
