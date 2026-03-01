const mongoose = require('mongoose');

const studentTrackerSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  surah: { type: String, required: true },
  page: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('StudentTracker', studentTrackerSchema);
