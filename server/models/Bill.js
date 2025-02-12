const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    enum: ['ONE_TIME', 'WEEKLY', 'MONTHLY', 'YEARLY'],
    default: 'MONTHLY'
  },
  isRecurring: {
    type: Boolean,
    default: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  reminderDays: {
    type: Number,
    default: 3 // Days before due date to send reminder
  }
});

module.exports = mongoose.model('Bill', billSchema); 