require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ================= ROUTES =================
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/adminTeacherRoutes');
const feeRoutes = require('./routes/feeRoutes');

// ================= TIMETABLE ROUTES =================
const adminTimetableRoutes = require('./routes/adminTimetableRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTE FIX =================
// 🔥 We change students → student here

app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);   // ✅ FIXED (SINGULAR)
app.use('/api/teachers', teacherRoutes);
app.use('/api/admin/fees', feeRoutes);

// Admin timetable
app.use('/api/admin/timetable', adminTimetableRoutes);

// ================= STATIC FILES =================
app.use('/uploads', express.static('uploads'));

// ================= MONGODB =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully ✅'))
  .catch(err => console.error('MongoDB connection error ❌', err));

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ================= START SERVER =================
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} 🚀`)
);