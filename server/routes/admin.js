const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Expense = require('../models/Expense');

// Get all users (admin only)
router.get('/users', [auth, admin], async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


// Get all expenses (admin only)
router.get('/expenses', [auth, admin], async (req, res) => {
  try {
    const expenses = await Expense.find().populate('user', ['name', 'email']);
    res.json(expenses);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Activate/Deactivate user
router.put('/users/:id/:action', [auth, admin], async (req, res) => {
  try {
    const { action } = req.params;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.isActive = action === 'activate';
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get admin statistics
router.get('/stats', [auth, admin], async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalExpenses = await Expense.countDocuments();
    const expenses = await Expense.find();
    
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const averageExpense = totalAmount / totalExpenses;

    res.json({
      totalUsers,
      activeUsers,
      totalExpenses,
      averageExpense
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router; 