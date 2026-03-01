const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },

    month: {
      type: String,
      required: true
    },

    amountPaid: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      default: 'Cash'
    },

    notes: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fee', feeSchema);