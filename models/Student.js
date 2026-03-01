const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {           // for login
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {           // hashed
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 1
  },
  gender: {
    type: String,
    required: true,
    enum: ['male','female','other']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
    trim: true
  },
  profilePic: {
    type: String // Cloudinary URL
  },
  level: {
    type: String,
    enum: ['Beginner','Intermediate','Advanced'],
    default: 'Beginner',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
