const Reservation = require('../models/Reservation');

// @desc    Create new table reservation
// @route   POST /api/reservations
// @access  Private
exports.createReservation = async (req, res) => {
  try {
    const { name, email, phone, date, timeSlot, guestsCount, tableNumber } = req.body;

    // Check if slot and table are already booked
    const bookingDate = new Date(date);
    const existing = await Reservation.findOne({
      date: {
        $gte: new Date(bookingDate.setHours(0,0,0,0)),
        $lt: new Date(bookingDate.setHours(23,59,59,999))
      },
      timeSlot,
      tableNumber,
      status: 'Confirmed'
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Table ${tableNumber} is already reserved for this date and time slot`
      });
    }

    const reservation = await Reservation.create({
      user: req.user.id,
      name,
      email,
      phone,
      date,
      timeSlot,
      guestsCount,
      tableNumber
    });

    res.status(201).json({ success: true, data: reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user reservations
// @route   GET /api/reservations/myreservations
// @access  Private
exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id }).sort('-date');
    res.status(200).json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private/Admin
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('user', 'name email')
      .sort('-date');
    res.status(200).json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel reservation
// @route   PUT /api/reservations/:id/cancel
// @access  Private
exports.cancelReservation = async (req, res) => {
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    // Make sure user owns reservation, or is admin
    if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this reservation' });
    }

    reservation.status = 'Cancelled';
    await reservation.save();

    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
