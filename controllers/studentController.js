// controllers/studentController.js
const mongoose = require('mongoose');
const Student = require('../models/Student');
const StudentTracker = require('../models/StudentTracker');
const Timetable = require('../models/Timetable');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =============================
// LOGIN STUDENT
// =============================
exports.loginStudent = async (req, res) => {
  try {
    const { username, password } = req.body;
    const student = await Student.findOne({ username });
    if (!student) return res.status(401).json({ message: 'Invalid credentials ❌' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials ❌' });

    const token = jwt.sign(
      { id: student._id, role: 'student' },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '7d' }
    );

    res.json({ message: 'Login successful ✅', studentId: student._id, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error ❌' });
  }
};

// =============================
// GET STUDENT PROFILE
// =============================
exports.getStudentProfile = async (req, res) => {
  try {
    const studentId = req.userId;
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId))
      return res.status(400).json({ message: 'Invalid student ID ❌' });

    const student = await Student.findById(studentId).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found ❌' });

    res.json(student);
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ message: 'Failed to fetch profile ❌' });
  }
};

// =============================
// GET STUDENT PROGRESS
// =============================
exports.getStudentProgress = async (req, res) => {
  try {
    const studentId = req.userId;
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId))
      return res.status(400).json({ message: 'Invalid student ID ❌' });

    const progress = await StudentTracker.find({ studentId })
      .populate('studentId', 'username name') // include username
      .sort({ date: -1 });

    res.json(progress);
  } catch (err) {
    console.error('Error fetching student progress:', err);
    res.status(500).json({ message: 'Failed to fetch progress ❌' });
  }
};
exports.getStudentTimetable = async (req, res) => {
  try {

    // ✅ SAFE WAY (works with our fixed auth)
    const studentId = req.userId;

    if (!studentId) {
      return res.status(400).json({
        message: "Student ID missing ❌"
      });
    }

    const timetable = await Timetable.find({
      studentId: studentId
    }).sort({ createdAt: -1 });

    return res.json(timetable);

  } catch (err) {

    console.error("Timetable Error:", err);

    return res.status(500).json({
      message: "Failed to fetch timetable ❌"
    });
  }
};