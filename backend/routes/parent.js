const express = require('express');
const { body, validationResult } = require('express-validator');
const Attendance = require('../models/Attendance');
const Report = require('../models/Report');
const Teacher = require('../models/Teacher');
const School = require('../models/School');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// All parent routes require authentication and parent role
router.use(auth);
router.use(authorize('parent'));
 
// Dashboard statistics for parents
router.get('/stats', async (req, res) => {
  try {
    const daysChecked = await Attendance.countDocuments(); // Simplified: all attendance records
    const reportsFiled = await Report.countDocuments({ parent: req.user._id });
    
    const school = await School.findOne();
    const notices = school ? school.notices : [];

    res.json({
      daysChecked,
      reportsFiled,
      notices
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// View attendance route
router.get('/attendance', async (req, res) => {
  try {
    const { date } = req.query;
    const queryDate = date ? new Date(date) : new Date();

    // Set to start of day
    queryDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const attendance = await Attendance.find({
      date: { $gte: queryDate, $lt: nextDay }
    }).populate('teacher', 'name subject email');

    const school = await School.findOne();
    const schoolName = school ? school.name : 'School Name Not Set';

    res.json({ attendance, schoolName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit report route
router.post('/reports', [
  body('teacherId').isMongoId().withMessage('Invalid teacher ID'),
  body('issue').trim().isLength({ min: 10 }).withMessage('Issue description must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { teacherId, issue } = req.body;

    // Check if teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const report = new Report({
      parent: req.user._id,
      teacher: teacherId,
      issue
    });

    await report.save();
    await report.populate('parent', 'name email');
    await report.populate('teacher', 'name subject email');

    res.status(201).json({
      message: 'Report submitted successfully',
      report
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's submitted reports
router.get('/reports', async (req, res) => {
  try {
    const reports = await Report.find({ parent: req.user._id })
      .populate('teacher', 'name subject email')
      .sort({ createdAt: -1 });

    const school = await School.findOne();
    const schoolName = school ? school.name : 'School Name Not Set';

    res.json({ reports, schoolName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get list of teachers (for report submission form)
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find().select('name subject email').sort({ name: 1 });

    const school = await School.findOne();
    const schoolName = school ? school.name : 'School Name Not Set';

    res.json({ teachers, schoolName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;