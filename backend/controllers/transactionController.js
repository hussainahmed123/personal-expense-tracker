const Transaction = require('../models/Transaction');

// Helper to format Mongoose document for frontend compatibility (e.g. converting ID and date format)
function formatTransaction(t) {
  return {
    id: t._id.toString(),
    type: t.type,
    amount: t.amount,
    category: t.category,
    date: t.date ? t.date.toISOString().split('T')[0] : '',
    description: t.description
  };
}

async function getTransactions(req, res) {
  try {
    const transactions = await Transaction.find({});
    res.json(transactions.map(formatTransaction));
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving transactions', error: err.message });
  }
}

async function getTransactionById(req, res) {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(formatTransaction(transaction));
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving transaction', error: err.message });
  }
}

async function addTransaction(req, res) {
  try {
    const { type, amount, category, date, description } = req.body || {};

    if (!type || !amount || !category || !date) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const newTransaction = new Transaction({
      type,
      amount,
      category,
      date,
      description: description || ''
    });

    await newTransaction.save();
    res.status(201).json(formatTransaction(newTransaction));
  } catch (err) {
    res.status(500).json({ message: 'Error adding transaction', error: err.message });
  }
}

async function updateTransaction(req, res) {
  try {
    const { type, amount, category, date, description } = req.body || {};

    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (type !== undefined) transaction.type = type;
    if (amount !== undefined) transaction.amount = amount;
    if (category !== undefined) transaction.category = category;
    if (date !== undefined) transaction.date = date;
    if (description !== undefined) transaction.description = description;

    await transaction.save();
    res.json(formatTransaction(transaction));
  } catch (err) {
    res.status(500).json({ message: 'Error updating transaction', error: err.message });
  }
}

async function deleteTransaction(req, res) {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting transaction', error: err.message });
  }
}

module.exports = {
  getTransactions,
  getTransactionById,
  addTransaction,
  updateTransaction,
  deleteTransaction
};