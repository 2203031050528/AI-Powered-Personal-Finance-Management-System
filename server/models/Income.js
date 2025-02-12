const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: String,
  category: {
    type: String,
    default: 'Salary'
  }
});

module.exports = mongoose.model('Income', incomeSchema); 