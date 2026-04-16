import Consultation from '../models/Consultation.js';
import Notification from '../models/Notification.js';

// @desc    Book consultation
// @route   POST /api/consultation
export const bookConsultation = async (req, res) => {
  try {
    const { consultantName, consultantImage, date, time, duration, topic, amount } = req.body;

    if (!consultantName || !date || !time || !topic || !amount) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const consultation = await Consultation.create({
      userId: req.user._id,
      consultantName,
      consultantImage,
      date,
      time,
      duration: duration || 60,
      topic,
      amount,
      meetingLink: `https://meet.taxbuddy.com/session-${Math.random().toString(36).substring(2, 9)}`,
    });

    // Create notification
    await Notification.create({
      userId: req.user._id,
      title: 'Consultation Booked',
      message: `Your consultation with ${consultantName} has been scheduled for ${new Date(date).toLocaleDateString()} at ${time}`,
      type: 'success',
    });

    res.status(201).json(consultation);
  } catch (error) {
    console.error('Book consultation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's consultations
// @route   GET /api/consultation
export const getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(consultations);
  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel consultation
// @route   PUT /api/consultation/:id/cancel
export const cancelConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findOne({ _id: req.params.id, userId: req.user._id });
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    consultation.status = 'cancelled';
    await consultation.save();

    res.json({ message: 'Consultation cancelled' });
  } catch (error) {
    console.error('Cancel consultation error:', error);
    res.status(500).json({ message: error.message });
  }
};
