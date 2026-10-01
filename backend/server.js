
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/transactions', transactionRoutes);

app.use(express.static(path.join(__dirname, '..', 'frontend', 'html')));
app.use('/css', express.static(path.join(__dirname, '..', 'frontend', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', 'frontend', 'js')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'index.html'));
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Backend server is running successfully!',
    endpoints: {
      transactions: '/api/transactions'
    }
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense_tracker';

const Transaction = require('./models/Transaction');
const initialTransactions = require('./data/transactions');

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected\n');

    // Seed initial transactions if the collection has fewer documents than initialTransactions
    Transaction.countDocuments()
      .then(count => {
        if (count < initialTransactions.length) {
          return Transaction.deleteMany({})
            .then(() => {
              const seedData = initialTransactions.map(({ id, ...rest }) => rest);
              return Transaction.insertMany(seedData);
            })
            .then(() => console.log('\n'));
        }
      })
      .catch(err => console.error('Database seeding error:', err));

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });