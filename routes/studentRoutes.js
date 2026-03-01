// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  loginStudent,
  getStudentProfile,
  getStudentProgress,
  getStudentTimetable,
  addProgress,    // admin only
  deleteProgress  // admin only
} = require('../controllers/studentController');

// =============================
// AUTH
// =============================
router.post('/login', loginStudent);

// =============================
// PROFILE
// =============================
router.get('/profile', auth, getStudentProfile); // student sees own profile

// =============================
// PROGRESS TRACKER
// =============================
router.get('/tracker', auth, getStudentProgress); // student sees own progress

// Admin-only routes for adding/deleting progress
router.post('/tracker/add', auth, (req, res, next) => {
  if (req.userRole !== 'admin') return res.status(403).json({ message: 'Access denied ❌' });
  addProgress(req, res);
});

router.delete('/tracker/:id', auth, (req, res, next) => {
  if (req.userRole !== 'admin') return res.status(403).json({ message: 'Access denied ❌' });
  deleteProgress(req, res);
});

// =============================
// TIMETABLE
// =============================
router.get('/timetable', auth, getStudentTimetable); // student sees own timetable

module.exports = router;