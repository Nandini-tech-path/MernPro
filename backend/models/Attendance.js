const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one attendance record per teacher per date
attendanceSchema.index({ teacher: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);