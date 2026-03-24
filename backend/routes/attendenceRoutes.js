const express = require('express');
const { checkIn, checkOut, getAttendance } = require('../controllers/attendenceController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.route('/')
  .get(protect, getAttendance)
  .post(protect, checkIn);

router.put('/checkout/:id', protect, checkOut);

module.exports = router;