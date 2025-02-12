const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// Get all notifications for a user
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ date: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Generate smart notifications
router.post('/generate', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = [];

    // Check for budget overspending
    const budgets = await Budget.find({ user: userId });
    const expenses = await Expense.find({ user: userId });

    budgets.forEach(budget => {
      const categoryExpenses = expenses
        .filter(expense => 
          expense.category === budget.category &&
          new Date(expense.date).getMonth() === new Date(budget.month).getMonth()
        )
        .reduce((total, expense) => total + expense.amount, 0);

      if (categoryExpenses > budget.amount) {
        notifications.push({
          user: userId,
          type: 'OVERSPENDING',
          title: 'Budget Alert',
          message: `You've exceeded your ${budget.category} budget by $${(categoryExpenses - budget.amount).toFixed(2)}`,
          priority: 'HIGH'
        });
      } else if (categoryExpenses > budget.amount * 0.9) {
        notifications.push({
          user: userId,
          type: 'OVERSPENDING',
          title: 'Budget Warning',
          message: `You're approaching your ${budget.category} budget limit`,
          priority: 'MEDIUM'
        });
      }
    });

    // Save generated notifications
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.json(notifications);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router; 