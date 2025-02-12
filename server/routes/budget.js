const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Budget = require('../models/Budget');

// Get all budgets for a user
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({ month: -1 });
    res.json(budgets);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add new budget
router.post('/', auth, async (req, res) => {
  try {
    const { category, amount, month } = req.body;

    const newBudget = new Budget({
      user: req.user.id,
      category,
      amount,
      month: new Date(month)
    });

    const budget = await newBudget.save();
    res.json(budget);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update budget
router.put('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(budget);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router; 