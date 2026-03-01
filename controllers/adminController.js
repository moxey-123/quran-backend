// controllers/adminController.js

const StudentTracker = require('../models/StudentTracker');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');


/* =====================================================
   ADMIN LOGIN
===================================================== */

const loginAdmin = async (req, res) => {
  try {

    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: 'Username and password required' });

    const admin = await Admin.findOne({ username });

    if (!admin)
      return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      admin: {
        username: admin.username,
        name: admin.name
      },
      token
    });

  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};


/* =====================================================
   REGISTER STUDENT
===================================================== */

const registerStudent = async (req, res) => {

  try {

    const { name, username, password, age, gender, location, contact, level } = req.body;

    if (!name || !username || !password)
      return res.status(400).json({ message: 'Missing required fields' });

    const existing = await Student.findOne({ username });

    if (existing)
      return res.status(400).json({ message: 'Username already exists' });

    const hashed = await bcrypt.hash(password, 10);

    let photoUrl = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'students'
      });

      photoUrl = result.secure_url;
    }

    const student = new Student({
      name,
      username,
      password: hashed,
      age,
      gender,
      location,
      contact,
      level,
      profilePic: photoUrl
    });

    await student.save();

    res.json({
      message: 'Student registered successfully',
      student
    });

  } catch (err) {
    console.error('Register student error:', err);
    res.status(500).json({ message: 'Error registering student' });
  }
};


/* =====================================================
   GET ALL STUDENTS
===================================================== */

const getStudents = async (req, res) => {

  try {
    const students = await Student.find();
    res.json(students);

  } catch (err) {
    console.error('Get students error:', err);
    res.status(500).json({ message: 'Error fetching students' });
  }
};


/* =====================================================
   GET SINGLE STUDENT (FOR EDIT)
===================================================== */

const getSingleStudent = async (req, res) => {

  try {

    const student = await Student.findById(req.params.id);

    if (!student)
      return res.status(404).json({ message: "Student not found ❌" });

    res.json(student);

  } catch (err) {
    console.error("Get Single Student Error:", err);
    res.status(500).json({ message: "Server error ❌" });
  }
};


/* =====================================================
   ✅ UPDATE STUDENT (FIX FOR YOUR EDIT ERROR)
===================================================== */

const updateStudent = async (req, res) => {

  try {

    const id = req.params.id;
    const {
      name,
      username,
      password,
      age,
      gender,
      location,
      contact,
      level
    } = req.body;

    const student = await Student.findById(id);

    if (!student)
      return res.status(404).json({ message: "Student not found ❌" });

    // Update fields
    student.name = name || student.name;
    student.username = username || student.username;
    student.age = age || student.age;
    student.gender = gender || student.gender;
    student.location = location || student.location;
    student.contact = contact || student.contact;
    student.level = level || student.level;

    // ✅ Update password ONLY if provided
    if (password) {
      student.password = await bcrypt.hash(password, 10);
    }

    // ✅ Update photo if uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'students'
      });

      student.profilePic = result.secure_url;
    }

    await student.save();

    res.json({
      message: "Student updated successfully ✅",
      student
    });

  } catch (err) {
    console.error("Update Student Error:", err);
    res.status(500).json({ message: "Error updating student" });
  }
};


/* =====================================================
   DELETE STUDENT
===================================================== */

const deleteStudent = async (req, res) => {

  try {

    await Student.findByIdAndDelete(req.params.id);

    res.json({ message: 'Student deleted successfully' });

  } catch (err) {
    console.error('Delete student error:', err);
    res.status(500).json({ message: 'Error deleting student' });
  }
};


/* =====================================================
   SAVE TEACHER
===================================================== */

const saveTeacher = async (req, res) => {

  try {

    const { name, qualification, experience, bio } = req.body;

    let photoUrl = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'teachers'
      });

      photoUrl = result.secure_url;
    }

    const teacher = new Teacher({
      name,
      qualification,
      experience,
      bio,
      photo: photoUrl
    });

    await teacher.save();

    res.json({
      message: 'Teacher added successfully',
      teacher
    });

  } catch (err) {
    console.error('Save teacher error:', err);
    res.status(500).json({ message: 'Error adding teacher' });
  }
};


/* =====================================================
   GET TEACHERS
===================================================== */

const getTeachers = async (req, res) => {

  try {
    const teachers = await Teacher.find();
    res.json(teachers);

  } catch (err) {
    console.error('Get teachers error:', err);
    res.status(500).json({ message: 'Error fetching teachers' });
  }
};


/* =====================================================
   TRACKER
===================================================== */

const addProgress = async (req, res) => {

  try {

    const { studentId, surah, page, completed } = req.body;

    if (!studentId || !surah || !page)
      return res.status(400).json({ message: 'Missing required fields' });

    const tracker = new StudentTracker({
      studentId,
      surah,
      page,
      completed: completed || false
    });

    await tracker.save();

    res.json({
      message: 'Progress saved successfully',
      tracker
    });

  } catch (err) {
    console.error('Add progress error:', err);
    res.status(500).json({ message: 'Error adding progress' });
  }
};


const getAllProgress = async (req, res) => {

  try {

    const progress = await StudentTracker.find()
      .populate('studentId', 'name username profilePic')
      .sort({ date: -1 });

    res.json(progress);

  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ message: 'Error fetching progress' });
  }
};


const deleteProgress = async (req, res) => {

  try {

    await StudentTracker.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Progress deleted successfully'
    });

  } catch (err) {
    console.error('Delete progress error:', err);
    res.status(500).json({ message: 'Error deleting progress' });
  }
};


/* =====================================================
   EXPORT
===================================================== */

module.exports = {

  loginAdmin,
  registerStudent,
  getStudents,
  getSingleStudent,
  updateStudent,   // ✅ ADDED (IMPORTANT FIX)
  deleteStudent,

  saveTeacher,
  getTeachers,

  addProgress,
  getAllProgress,
  deleteProgress

};