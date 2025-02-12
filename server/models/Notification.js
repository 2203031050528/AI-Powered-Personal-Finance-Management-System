const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['BILL_DUE', 'SAVINGS_GOAL', 'OVERSPENDING', 'RENEWAL', 'GENERAL'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  dueDate: Date,
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM'
  }
});

module.exports = mongoose.model('Notification', notificationSchema); 