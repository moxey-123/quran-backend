// controllers/timetableController.js
const Timetable = require('../models/Timetable');
const Student = require('../models/Student');

/* =====================================================
   CREATE OR UPDATE FULL 7 DAY TIMETABLE
===================================================== */

exports.addTimetable = async (req, res) => {
  try {
    const { studentId, week } = req.body;

    if (!studentId || !week || !Array.isArray(week)) {
      return res.status(400).json({
        message: "studentId and week array required ❌"
      });
    }

    if (week.length !== 7) {
      return res.status(400).json({
        message: "Week must contain 7 days ❌"
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found ❌" });
    }

    // ✅ Check if timetable already exists
    let timetable = await Timetable.findOne({ studentId });

    if (timetable) {
      timetable.week = week; // update
    } else {
      timetable = new Timetable({
        studentId,
        week
      });
    }

    await timetable.save();

    const populated = await timetable.populate(
      "studentId",
      "name username"
    );

    res.status(200).json({
      message: "Weekly timetable saved ✅",
      timetable: populated
    });

  } catch (err) {
    console.error("Timetable Save Error:", err);
    res.status(500).json({
      message: "Server error ❌"
    });
  }
};

/* =====================================================
   GET ALL TIMETABLES
===================================================== */

exports.getAllTimetable = async (req, res) => {
  try {

    const { studentId } = req.query;

    const filter = studentId ? { studentId } : {};
const timetables = await Timetable.find(filter)
  .populate('studentId', 'name username')
  .lean(); // <-- ADD THIS
    res.json(timetables);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching timetable ❌"
    });
  }
};

/* =====================================================
   DELETE TIMETABLE
===================================================== */

exports.deleteTimetable = async (req, res) => {
  try {

    await Timetable.findByIdAndDelete(req.params.id);

    res.json({
      message: "Timetable deleted ✅"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error deleting timetable ❌"
    });
  }
};