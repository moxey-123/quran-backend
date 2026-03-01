// routes/timetableRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // JWT auth middleware
const Timetable = require('../models/Timetable'); // import model for student view

const {
  addTimetable,
  getAllTimetable,
  deleteTimetable
} = require('../controllers/timetableController');

// =============================
// ADMIN TIMETABLE CRUD
// =============================

// Create a single timetable entry (Admin only)
router.post('/add', auth, (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied ❌' });
  }
  next();
}, addTimetable);

// Create a **weekly timetable** (bulk) – Admin only
router.post('/add-week', auth, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied ❌' });
  }

  try {
    const { entries } = req.body;
    if (!entries || !Array.isArray(entries)) {
      return res.status(400).json({ message: 'Invalid data ❌' });
    }

    // Insert all entries at once
    const created = await Timetable.insertMany(entries);

    res.json({ message: 'Weekly timetable saved ✅', created });
  } catch (err) {
    console.error('Error adding weekly timetable:', err);
    res.status(500).json({ message: 'Server error ❌' });
  }
});

// Get all timetable entries
router.get('/', auth, async (req, res) => {
  try {
    if (req.userRole === 'admin') {
      // Admin: get all entries or filter by studentId
      return getAllTimetable(req, res);
    }
    // Student: get only their entries
    const studentId = req.userId; // extracted from JWT in auth middleware
    const entries = await Timetable.find({ studentId })
      .populate('studentId', 'name username')
      .sort({ day: 1, time: 1 });
    res.json(entries);
  } catch (err) {
    console.error('Error fetching timetable:', err);
    res.status(500).json({ message: 'Error fetching timetable ❌' });
  }
});

// Delete a timetable entry (Admin only)
router.delete('/:id', auth, (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied ❌' });
  }
  next();
}, deleteTimetable);

module.exports = router;