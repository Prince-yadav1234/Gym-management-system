const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  date: { type: Date, default: Date.now },
  checkIn: { type: Date, default: Date.now },
  checkOut: { type: Date }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;