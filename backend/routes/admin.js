const express = require('express');
const { body, validationResult } = require('express-validator');
const Teacher = require('../models/Teacher');
const Attendance = require('../models/Attendance');
const Report = require('../models/Report');
const School = require('../models/School');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route for school name (no auth required)
router.get('/public/school', async (req, res) => {
  try {
    const school = await School.findOne();
    if (!school) {
      return res.json({ name: 'School Name Not Set' });
    }
    res.json(school);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// All admin routes require authentication and admin role
router.use(auth);
router.use(authorize('admin'));

// Teacher management routes
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/teachers', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('subject').trim().isLength({ min: 2 }).withMessage('Subject must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, subject, email } = req.body;

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Teacher with this email already exists' });
    }

    const teacher = new Teacher({ name, subject, email });
    await teacher.save();

    res.status(201).json({
      message: 'Teacher added successfully',
      teacher
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/teachers/:id', [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('subject').optional().trim().isLength({ min: 2 }).withMessage('Subject must be at least 2 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = req.body;

    // Check if email is being updated and if it conflicts
    if (updates.email) {
      const existingTeacher = await Teacher.findOne({ email: updates.email, _id: { $ne: id } });
      if (existingTeacher) {
        return res.status(400).json({ message: 'Another teacher with this email already exists' });
      }
    }

    const teacher = await Teacher.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({
      message: 'Teacher updated successfully',
      teacher
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByIdAndDelete(id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Also delete related attendance records
    await Attendance.deleteMany({ teacher: id });

    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Attendance management routes
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

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/attendance', [
  body('teacherId').isMongoId().withMessage('Invalid teacher ID'),
  body('status').isIn(['Present', 'Absent']).withMessage('Status must be Present or Absent'),
  body('date').optional().isISO8601().withMessage('Invalid date format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { teacherId, status, date = new Date() } = req.body;

    // Check if teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Normalize date to start of day
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already exists for this teacher on this date
    const existingAttendance = await Attendance.findOne({
      teacher: teacherId,
      date: attendanceDate
    });

    if (existingAttendance) {
      // Update existing record
      existingAttendance.status = status;
      await existingAttendance.save();
      await existingAttendance.populate('teacher', 'name subject email');

      return res.json({
        message: 'Attendance updated successfully',
        attendance: existingAttendance
      });
    }

    // Create new attendance record
    const attendance = new Attendance({
      teacher: teacherId,
      status,
      date: attendanceDate
    });

    await attendance.save();
    await attendance.populate('teacher', 'name subject email');

    res.status(201).json({
      message: 'Attendance recorded successfully',
      attendance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/attendance/:id', [
  body('status').isIn(['Present', 'Absent']).withMessage('Status must be Present or Absent')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    const attendance = await Attendance.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('teacher', 'name subject email');

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json({
      message: 'Attendance updated successfully',
      attendance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Report management routes
router.get('/reports', async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('parent', 'name email')
      .populate('teacher', 'name subject email')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/reports/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByIdAndUpdate(
      id,
      { status: 'Resolved' },
      { new: true }
    ).populate('parent', 'name email')
     .populate('teacher', 'name subject email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({
      message: 'Report resolved successfully',
      report
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// School settings routes
router.get('/school', async (req, res) => {
  try {
    const school = await School.findOne();
    if (!school) {
      return res.json({ name: 'School Name Not Set' });
    }
    res.json(school);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/school', [
  body('name').trim().isLength({ min: 2 }).withMessage('School name must be at least 2 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    // Upsert: update if exists, create if not
    const school = await School.findOneAndUpdate(
      {},
      { name },
      { new: true, upsert: true }
    );

    res.json({
      message: 'School name updated successfully',
      school
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;