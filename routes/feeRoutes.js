const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  addFee,
  getAllFees,
  getTotalIncome,
  updateFee,
  deleteFee,
  getSingleFee
} = require('../controllers/feeController');


/* =========================================
   ADMIN FEE ROUTES (PROPER REST VERSION)
========================================= */

// ✅ Add Fee
router.post('/add', auth, (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: "Access denied ❌" });
  }
  next();
}, addFee);


// ✅ Get All Fees
router.get('/', auth, (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: "Access denied ❌" });
  }
  next();
}, getAllFees);


// ✅ Get Single Fee (IMPORTANT FOR EDIT)
router.get('/:id', auth, (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: "Access denied ❌" });
  }
  next();
}, getSingleFee);


// ✅ Update Fee
router.put('/:id', auth, (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: "Access denied ❌" });
  }
  next();
}, updateFee);


// ✅ Delete Fee
router.delete('/:id', auth, (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: "Access denied ❌" });
  }
  next();
}, deleteFee);


// ✅ Total Income
router.get('/total', auth, (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: "Access denied ❌" });
  }
  next();
}, getTotalIncome);


module.exports = router;