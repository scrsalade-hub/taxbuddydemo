import Availability from '../models/Availability.js';

// @desc    Set admin availability for a date
// @route   POST /api/admin/availability
export const setAvailability = async (req, res) => {
  try {
    const { date, timeSlots } = req.body;

    if (!date || !timeSlots || !Array.isArray(timeSlots) || timeSlots.length === 0) {
      return res.status(400).json({ message: 'Please provide date and at least one time slot' });
    }

    const dateObj = new Date(date);
    const dateString = dateObj.toISOString().split('T')[0];

    // Check if availability already exists for this date
    let availability = await Availability.findOne({ dateString });

    if (availability) {
      // Update existing
      availability.timeSlots = timeSlots.map(time => ({
        time,
        isBooked: false
      }));
      availability.isActive = true;
      await availability.save();
    } else {
      // Create new
      availability = await Availability.create({
        date: dateObj,
        dateString,
        timeSlots: timeSlots.map(time => ({
          time,
          isBooked: false
        })),
        createdBy: req.admin?._id || 'admin',
      });
    }

    res.status(201).json({
      message: 'Availability set successfully',
      availability
    });
  } catch (error) {
    console.error('Set availability error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all admin availability
// @route   GET /api/admin/availability
export const getAllAvailability = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const availabilities = await Availability.find({
      date: { $gte: today },
      isActive: true
    }).sort({ date: 1 });

    res.json(availabilities);
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete availability for a date
// @route   DELETE /api/admin/availability/:id
export const deleteAvailability = async (req, res) => {
  try {
    const availability = await Availability.findById(req.params.id);
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }

    availability.isActive = false;
    await availability.save();

    res.json({ message: 'Availability removed' });
  } catch (error) {
    console.error('Delete availability error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available dates for users
// @route   GET /api/availability/dates
export const getAvailableDates = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const availabilities = await Availability.find({
      date: { $gte: today },
      isActive: true
    }).sort({ date: 1 });

    // Format dates for frontend
    const dates = availabilities.map(a => ({
      _id: a._id,
      date: a.dateString,
      dateObj: a.date,
      hasAvailableSlots: a.timeSlots.some(s => !s.isBooked)
    }));

    res.json(dates);
  } catch (error) {
    console.error('Get available dates error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available time slots for a specific date
// @route   GET /api/availability/times/:date
export const getAvailableTimes = async (req, res) => {
  try {
    const { date } = req.params;

    const availability = await Availability.findOne({
      dateString: date,
      isActive: true
    });

    if (!availability) {
      return res.json([]);
    }

    // Return only unbooked slots
    const availableSlots = availability.timeSlots
      .filter(s => !s.isBooked)
      .map(s => s.time);

    res.json(availableSlots);
  } catch (error) {
    console.error('Get available times error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark a time slot as booked
// @route   PUT /api/admin/availability/book
export const bookTimeSlot = async (req, res) => {
  try {
    const { date, time } = req.body;

    const availability = await Availability.findOne({
      dateString: date,
      isActive: true
    });

    if (!availability) {
      return res.status(404).json({ message: 'Date not available' });
    }

    // Find and mark the slot as booked
    const slot = availability.timeSlots.find(s => s.time === time);
    if (!slot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    if (slot.isBooked) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }

    slot.isBooked = true;
    await availability.save();

    res.json({ message: 'Time slot booked' });
  } catch (error) {
    console.error('Book time slot error:', error);
    res.status(500).json({ message: error.message });
  }
};
