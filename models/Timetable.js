// models/Timetable.js
const mongoose = require('mongoose');

// Each time slot for a day
const timeSlotSchema = new mongoose.Schema({
  time: { type: String, required: true },      // e.g., "12am"
  subject: { type: String, required: true },   // e.g., "Quran"
  teacher: { type: String }                    // optional, e.g., "Luffff"
});

// Each day with multiple slots (in our case, 1 slot per day for simplicity)
const daySchema = new mongoose.Schema({
  day: { type: String, required: true },      // e.g., "Monday"
  slots: [timeSlotSchema]                     // array of slots for the day
});

// Full timetable for a student
const timetableSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  week: [daySchema]                            // holds Monday → Sunday
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);