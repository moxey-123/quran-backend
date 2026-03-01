// routes/timetableRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Timetable = require('../models/Timetable');

const {
  addTimetable,
  getAllTimetable,
  deleteTimetable
} = require('../controllers/timetableController');


// ======================================================
// ✅ CREATE SINGLE TIMETABLE (ADMIN ONLY)
// POST /api/timetable/add
// ======================================================
router.post('/add', auth, async (req, res, next) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied ❌' });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ message: 'Server error ❌' });
  }
}, addTimetable);


// ======================================================
// ✅ CREATE / UPDATE WEEKLY TIMETABLE
// POST /api/timetable/add-week
// ======================================================
router.post('/add-week', auth, async (req, res) => {
  try {

    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied ❌' });
    }

    const { entries } = req.body;

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({
        message: "Invalid weekly timetable data ❌"
      });
    }

    const studentId = entries[0]?.studentId;

    if (!studentId) {
      return res.status(400).json({
        message: "studentId missing ❌"
      });
    }

    // ✅ Check if timetable already exists
    let timetable = await Timetable.findOne({ studentId });

    if (timetable) {

      // Update existing timetable
      timetable.week = entries.map(e => ({
        day: e.day,
        slots: e.slots
      }));

    } else {

      // Create new timetable
      timetable = new Timetable({
        studentId,
        week: entries.map(e => ({
          day: e.day,
          slots: e.slots
        }))
      });

    }

    await timetable.save();

    return res.json({
      message: "Weekly timetable saved successfully ✅",
      timetable
    });

  } catch (err) {
    console.error("Weekly timetable error:", err);
    res.status(500).json({
      message: "Server error ❌"
    });
  }
});


// ======================================================
// ✅ GET ALL TIMETABLE (ADMIN)
// GET /api/timetable
// ======================================================
router.get('/', auth, async (req, res) => {
  try {

    if (req.userRole === 'admin') {

      const entries = await Timetable.find()
        .populate('studentId', 'name username')
        .sort({ createdAt: -1 });

      return res.json(entries);
    }

    // ✅ Student gets only their timetable
    const entries = await Timetable.find({
      studentId: req.userId
    }).populate('studentId', 'name username');

    return res.json(entries);

  } catch (err) {
    console.error("Fetch timetable error:", err);
    res.status(500).json({
      message: "Error fetching timetable ❌"
    });
  }
});


// ======================================================
// ✅ DELETE TIMETABLE (ADMIN ONLY)
// DELETE /api/timetable/:id
// ======================================================
router.delete('/:id', auth, async (req, res) => {
  try {

    if (req.userRole !== 'admin') {
      return res.status(403).json({
        message: 'Access denied ❌'
      });
    }

    const deleted = await Timetable.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: 'Timetable not found ❌'
      });
    }

    res.json({
      message: 'Timetable deleted ✅'
    });

  } catch (err) {
    console.error("Delete timetable error:", err);
    res.status(500).json({
      message: "Server error ❌"
    });
  }
});


console.log("Admin Timetable Route Loaded ✅");

module.exports = router;