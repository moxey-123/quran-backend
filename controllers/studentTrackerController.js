// controllers/studentController.js

const mongoose = require("mongoose");
const Student = require("../models/Student");
const StudentTracker = require("../models/StudentTracker");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =====================================================
   REGISTER STUDENT
===================================================== */
const registerStudent = async (req, res) => {
  try {
    const { name, username, password, age, gender, location, contact, level } =
      req.body;

    const existing = await Student.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already exists ❌" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePic = "";
    if (req.file) {
      profilePic = req.file.path;
    }

    const student = new Student({
      name,
      username,
      password: hashedPassword,
      age,
      gender,
      location,
      contact,
      level,
      profilePic,
    });

    await student.save();

    res.json({
      message: "Student registered successfully ✅",
      student,
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Error registering student ❌" });
  }
};

/* =====================================================
   LOGIN STUDENT
===================================================== */
const loginStudent = async (req, res) => {
  try {
    const { username, password } = req.body;

    const student = await Student.findOne({ username });
    if (!student) {
      return res.status(400).json({ message: "Invalid credentials ❌" });
    }

    let isMatch = false;

    if (student.password.startsWith("$2")) {
      isMatch = await bcrypt.compare(password, student.password);
    } else {
      isMatch = password === student.password;
    }

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials ❌" });
    }

    const token = jwt.sign(
      { id: student._id.toString(), role: "student" },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.json({
      studentId: student._id,
      name: student.name,
      token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed ❌" });
  }
};

/* =====================================================
   GET PROFILE
===================================================== */
const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.userId;

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID ❌" });
    }

    const student = await Student.findById(studentId).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found ❌" });
    }

    res.json(student);
  } catch (err) {
    console.error("Profile Error:", err);
    res.status(500).json({ message: "Failed to fetch profile ❌" });
  }
};

/* =====================================================
   GET PROGRESS
===================================================== */
const getStudentProgress = async (req, res) => {
  try {
    const studentId = req.userId;

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID ❌" });
    }

    const progress = await StudentTracker.find({ studentId })
      .sort({ date: -1 })
      .populate("studentId", "name username");

    res.json(progress);
  } catch (err) {
    console.error("Progress Error:", err);
    res.status(500).json({ message: "Failed to fetch progress ❌" });
  }
};

/* =====================================================
   ADD PROGRESS (ADMIN)
===================================================== */
const addProgress = async (req, res) => {
  try {
    const { studentId, surah, page, completed } = req.body;

    if (!studentId || !surah || !page) {
      return res.status(400).json({ message: "Missing required fields ❌" });
    }

    const tracker = new StudentTracker({
      studentId,
      surah,
      page,
      completed: completed || false,
    });

    await tracker.save();

    res.json({
      message: "Progress added successfully ✅",
      tracker,
    });
  } catch (err) {
    console.error("Add Progress Error:", err);
    res.status(500).json({ message: "Error adding progress ❌" });
  }
};

/* =====================================================
   DELETE PROGRESS (ADMIN)
===================================================== */
const deleteProgress = async (req, res) => {
  try {
    const trackerId = req.params.id;

    if (!trackerId || !mongoose.Types.ObjectId.isValid(trackerId)) {
      return res.status(400).json({ message: "Invalid tracker ID ❌" });
    }

    const deleted = await StudentTracker.findByIdAndDelete(trackerId);

    if (!deleted) {
      return res.status(404).json({ message: "Tracker not found ❌" });
    }

    res.json({
      message: "Progress deleted successfully ✅",
    });
  } catch (err) {
    console.error("Delete Progress Error:", err);
    res.status(500).json({ message: "Failed to delete progress ❌" });
  }
};

/* =====================================================
   TIMETABLE (TEMP)
===================================================== */
const getStudentTimetable = async (req, res) => {
  try {
    res.json([]);
  } catch (err) {
    console.error("Timetable Error:", err);
    res.status(500).json({ message: "Failed to fetch timetable ❌" });
  }
};

/* =====================================================
   ✅ EXPORTS (IMPORTANT FIX)
===================================================== */

module.exports = {
  registerStudent,
  loginStudent,
  getStudentProfile,
  getStudentProgress,
  addProgress,
  deleteProgress,
  getStudentTimetable,
};