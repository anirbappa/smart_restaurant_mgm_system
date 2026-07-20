const express = require('express');
const {
  createReservation,
  getMyReservations,
  getReservations,
  cancelReservation
} = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All reservation routes require login

router.route('/')
  .post(createReservation)
  .get(authorize('admin'), getReservations);

router.get('/myreservations', getMyReservations);

router.put('/:id/cancel', cancelReservation);

module.exports = router;
