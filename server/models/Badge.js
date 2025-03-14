const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['SUPER_SAVER', 'FINANCE_GURU', 'WEALTH_BUILDER'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  icon: String,
  earnedDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Badge', badgeSchema); 