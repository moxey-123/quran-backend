const Teacher = require('../models/Teacher');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// upload helper
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'teachers' },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ADD TEACHER
exports.addTeacher = async (req, res) => {
  try {
    let photo = '';

    if (req.file) {
      photo = await uploadFromBuffer(req.file.buffer);
    }

    const teacher = new Teacher({
      name: req.body.name,
      qualification: req.body.qualification,
      experience: req.body.experience,
      bio: req.body.bio,
      photo
    });

    await teacher.save();
    res.json({ message: 'Teacher saved', teacher });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving teacher' });
  }
};

// GET TEACHERS
exports.getTeachers = async (req, res) => {
  const teachers = await Teacher.find().sort({ createdAt: -1 });
  res.json(teachers);
};
