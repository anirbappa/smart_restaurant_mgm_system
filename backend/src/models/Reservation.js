const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a name for the reservation']
  },
  email: {
    type: String,
    required: [true, 'Please add an email']
  },
  phone: {
    type: String,
    required: [true, 'Please add a contact phone number']
  },
  date: {
    type: Date,
    required: [true, 'Please add a reservation date']
  },
  timeSlot: {
    type: String,
    required: [true, 'Please select a time slot']
  },
  guestsCount: {
    type: Number,
    required: [true, 'Please specify the number of guests'],
    min: [1, 'Must book for at least 1 guest']
  },
  tableNumber: {
    type: Number,
    required: [true, 'Please select a table number']
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled'],
    default: 'Confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
