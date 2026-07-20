const express = require('express');
const {
  createFeedback,
  getFeedbacks,
  deleteFeedback
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getFeedbacks)
  .post(protect, createFeedback);

router.delete('/:id', protect, authorize('admin'), deleteFeedback);

module.exports = router;
