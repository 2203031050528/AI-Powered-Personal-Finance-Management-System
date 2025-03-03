const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['Swiggy', 'Zomato', 'UberEats', 'Other']
  },
  code: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  discount: {
    type: String,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  minimumOrder: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Offer', offerSchema); 