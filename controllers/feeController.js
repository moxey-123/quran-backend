const Fee = require('../models/Fee');
const Student = require('../models/Student');

/* =========================================================
   ADD MONTHLY FEE PAYMENT
========================================================= */

exports.addFee = async (req, res) => {
  try {

    const {
      studentId,
      month,
      amountPaid,
      paymentMethod,
      notes
    } = req.body;

    if (!studentId || !month || !amountPaid) {
      return res.status(400).json({
        message: "Student, month and amount are required ❌"
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        message: "Student not found ❌"
      });
    }

    const fee = new Fee({
      studentId,
      month,
      amountPaid,
      paymentMethod,
      notes
    });

    await fee.save();

    res.status(201).json({
      message: "Fee saved successfully ✅",
      fee
    });

  } catch (err) {
    console.error("Add Fee Error:", err);
    res.status(500).json({ message: "Server error ❌" });
  }
};


/* =========================================================
   GET ALL FEE RECORDS
========================================================= */

exports.getAllFees = async (req, res) => {

  try {

    const fees = await Fee.find()
      .populate('studentId', 'name username level')
      .sort({ createdAt: -1 });

    res.json(fees);

  } catch (err) {
    console.error("Get Fees Error:", err);
    res.status(500).json({ message: "Server error ❌" });
  }

};


/* =========================================================
   GET SINGLE FEE (🔥 REQUIRED FOR EDIT)
========================================================= */

exports.getSingleFee = async (req, res) => {

  try {

    const fee = await Fee.findById(req.params.id)
      .populate('studentId', 'name username');

    if (!fee) {
      return res.status(404).json({
        message: "Fee not found ❌"
      });
    }

    res.json(fee);

  } catch (err) {
    console.error("Get Single Fee Error:", err);
    res.status(500).json({ message: "Server error ❌" });
  }

};


/* =========================================================
   UPDATE FEE (🔥 REQUIRED FOR EDIT SAVE)
========================================================= */

exports.updateFee = async (req, res) => {

  try {

    const updated = await Fee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('studentId', 'name username');

    if (!updated) {
      return res.status(404).json({
        message: "Fee not found ❌"
      });
    }

    res.json({
      message: "Fee updated successfully ✅",
      updated
    });

  } catch (err) {
    console.error("Update Fee Error:", err);
    res.status(500).json({ message: "Server error ❌" });
  }

};


/* =========================================================
   DELETE FEE
========================================================= */

exports.deleteFee = async (req, res) => {

  try {

    const deleted = await Fee.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Fee not found ❌"
      });
    }

    res.json({
      message: "Fee deleted successfully ✅"
    });

  } catch (err) {
    console.error("Delete Fee Error:", err);
    res.status(500).json({ message: "Server error ❌" });
  }

};


/* =========================================================
   GET TOTAL MONEY COLLECTED
========================================================= */

exports.getTotalIncome = async (req, res) => {

  try {

    const total = await Fee.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amountPaid" }
        }
      }
    ]);

    res.json({
      total: total[0]?.totalAmount || 0
    });

  } catch (err) {
    console.error("Total Income Error:", err);
    res.status(500).json({ message: "Server error ❌" });
  }

};