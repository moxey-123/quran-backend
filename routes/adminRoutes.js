// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'temp/' });

/* =====================================================
   CONTROLLERS
===================================================== */

const {
  loginAdmin,
  registerStudent,
  getStudents,
  getSingleStudent,   // ✅ required for edit
  updateStudent,      // ✅ required for update
  deleteStudent,
  addProgress,
  getAllProgress,
  deleteProgress,
  saveTeacher,
  getTeachers
} = require('../controllers/adminController');


/* =====================================================
   AUTH
===================================================== */

router.post('/login', loginAdmin);


/* =====================================================
   STUDENTS
===================================================== */

// ✅ Create student
router.post('/students', upload.single('photo'), registerStudent);

// ✅ Get all students
router.get('/students', getStudents);

// ✅ Get single student (for edit)
router.get('/students/:id', getSingleStudent);

// ✅ Update student (IMPORTANT FIX)
router.put('/students/:id', upload.single('photo'), updateStudent);

// ✅ Delete student
router.delete('/students/:id', deleteStudent);


/* =====================================================
   TEACHERS
===================================================== */

router.post('/teachers', upload.single('photo'), saveTeacher);
router.get('/teachers', getTeachers);

// ⚠️ TODO: create proper deleteTeacher later
router.delete('/teachers/:id', deleteStudent);


/* =====================================================
   TRACKER
===================================================== */

router.post('/tracker', addProgress);
router.get('/tracker', getAllProgress);
router.delete('/tracker/:id', deleteProgress);


/* =====================================================
   EXPORT
===================================================== */

module.exports = router;