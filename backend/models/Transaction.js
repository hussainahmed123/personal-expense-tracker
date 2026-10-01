const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Type is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  }
}, {
  timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
