const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Saving = require('../models/Saving');
const Badge = require('../models/Badge');

// Helper function to check and award badges
async function checkAndAwardBadges(userId, io) {
  try {
    const savings = await Saving.find({ user: userId });
    const existingBadges = await Badge.find({ user: userId });
    const newBadges = [];

    // Calculate total savings
    const totalSavings = savings.reduce((acc, curr) => acc + curr.amount, 0);

    // Check for Super Saver badge
    const currentMonth = new Date().getMonth();
    const thisMonthSavings = savings
      .filter(s => s.date.getMonth() === currentMonth)
      .reduce((acc, curr) => acc + curr.amount, 0);

    if (thisMonthSavings >= 5000 && !existingBadges.some(b => b.type === 'SUPER_SAVER')) {
      newBadges.push({
        user: userId,
        type: 'SUPER_SAVER',
        name: 'Super Saver',
        description: 'Saved ₹5000 in a month',
        icon: '🏆'
      });
    }

    // Check for Finance Guru badge (3-month streak)
    const months = [...new Set(savings.map(s => 
      `${s.date.getFullYear()}-${s.date.getMonth()}`
    ))].sort();
    
    let streak = 1;
    for (let i = 1; i < months.length; i++) {
      const [prevYear, prevMonth] = months[i-1].split('-').map(Number);
      const [currYear, currMonth] = months[i].split('-').map(Number);
      
      if ((prevYear === currYear && prevMonth === currMonth - 1) ||
          (prevYear === currYear - 1 && prevMonth === 11 && currMonth === 0)) {
        streak++;
      } else {
        streak = 1;
      }
    }

    if (streak >= 3 && !existingBadges.some(b => b.type === 'FINANCE_GURU')) {
      newBadges.push({
        user: userId,
        type: 'FINANCE_GURU',
        name: 'Finance Guru',
        description: 'Maintained a 3-month saving streak',
        icon: '📈'
      });
    }

    // Check for Wealth Builder badge
    if (totalSavings >= 50000 && !existingBadges.some(b => b.type === 'WEALTH_BUILDER')) {
      newBadges.push({
        user: userId,
        type: 'WEALTH_BUILDER',
        name: 'Wealth Builder',
        description: 'Saved ₹50,000 in total',
        icon: '💰'
      });
    }

    // Save new badges and emit notifications
    if (newBadges.length > 0) {
      await Badge.insertMany(newBadges);
      io.to(userId).emit('newBadges', newBadges);
    }

    return newBadges;
  } catch (err) {
    console.error('Error checking badges:', err);
    throw err;
  }
}

// Add new saving
router.post('/', auth, async (req, res) => {
  try {
    const { amount, category } = req.body;
    
    // Validate input
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: 'Please enter a valid amount' });
    }

    // Log the saving attempt
    console.log('Adding saving for user:', req.user.id, { amount, category });

    const newSaving = new Saving({
      user: req.user.id,
      amount: parseFloat(amount),
      category: category || 'General'
    });

    await newSaving.save();
    
    // Log successful save
    console.log('Saving added successfully:', newSaving);

    // Check and award badges
    const io = req.app.get('io');
    const newBadges = await checkAndAwardBadges(req.user.id, io);

    res.json({ 
      saving: newSaving,
      newBadges,
      message: 'Saving added successfully'
    });
  } catch (err) {
    console.error('Error adding saving:', err);
    res.status(500).json({ 
      message: 'Error adding saving',
      error: err.message 
    });
  }
});

// Get user's savings
router.get('/', auth, async (req, res) => {
  try {
    // Log the user ID and request
    console.log('Fetching savings for user:', req.user.id);

    const savings = await Saving.find({ user: req.user.id })
      .sort({ date: -1 })
      .lean();

    console.log('Found savings:', savings);
    res.json(savings);
  } catch (err) {
    console.error('Error fetching savings:', err);
    res.status(500).json({ 
      message: 'Server Error',
      error: err.message 
    });
  }
});

// Get user's badges
router.get('/badges', auth, async (req, res) => {
  try {
    console.log('Fetching badges for user:', req.user.id);
    const badges = await Badge.find({ user: req.user.id }).sort({ earnedDate: -1 });
    console.log('Found badges:', badges);
    res.json(badges);
  } catch (err) {
    console.error('Error in GET /api/savings/badges:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router; 