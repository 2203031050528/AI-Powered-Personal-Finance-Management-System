const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Income = require('../models/Income');

// Get all income entries
router.get('/', auth, async (req, res) => {
  try {
    const income = await Income.find({ user: req.user.id }).sort({ date: -1 });
    res.json(income);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add new income
router.post('/', auth, async (req, res) => {
  try {
    const { amount, source, description, category, date } = req.body;

    const newIncome = new Income({
      user: req.user.id,
      amount,
      source,
      description,
      category,
      date: date || Date.now()
    });

    const income = await newIncome.save();
    res.json(income);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router; 