const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qualification: String,
  experience: String,
  bio: String,
  photo: String // <-- make sure this exists
});

module.exports = mongoose.model('Teacher', TeacherSchema);
