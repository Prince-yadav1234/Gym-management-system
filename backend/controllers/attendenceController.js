const Attendance = require('../models/Attendence.js');
const Member = require('../models/Member.js');

// @desc    Check-in a member
// @route   POST /api/attendance/checkin
const checkIn = async (req, res) => {
  const { memberId } = req.body;
  const member = await Member.findById(memberId);
  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }
  const attendance = await Attendance.create({ member: memberId });
  res.status(201).json(attendance);
};

// @desc    Check-out a member
// @route   PUT /api/attendance/checkout/:id
const checkOut = async (req, res) => {
  const attendance = await Attendance.findById(req.params.id);
  if (attendance) {
    attendance.checkOut = Date.now();
    await attendance.save();
    res.json(attendance);
  } else {
    res.status(404).json({ message: 'Attendance record not found' });
  }
};

// @desc    Get all attendance records
// @route   GET /api/attendance
const getAttendance = async (req, res) => {
  const attendance = await Attendance.find({}).populate('member', 'name email');
  res.json(attendance);
};

module.exports = { checkIn, checkOut, getAttendance };