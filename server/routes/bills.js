const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Bill = require('../models/Bill');
const Notification = require('../models/Notification');

// Get all bills
router.get('/', auth, async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.user.id }).sort({ dueDate: 1 });
    res.json(bills);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add new bill
router.post('/', auth, async (req, res) => {
  try {
    const newBill = new Bill({
      user: req.user.id,
      ...req.body
    });

    const bill = await newBill.save();
    
    // Create initial reminder notification if due date is approaching
    const daysUntilDue = Math.ceil((new Date(bill.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue <= bill.reminderDays) {
      await createBillReminder(bill);
    }

    res.json(bill);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Mark bill as paid
router.put('/:id/paid', auth, async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      { isPaid: true },
      { new: true }
    );

    // If recurring, create next bill
    if (bill.isRecurring) {
      const nextDueDate = getNextDueDate(bill.dueDate, bill.frequency);
      const newBill = new Bill({
        ...bill.toObject(),
        dueDate: nextDueDate,
        isPaid: false,
        _id: undefined
      });
      await newBill.save();
    }

    res.json(bill);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Check for bills due soon and create reminders
router.post('/check-reminders', auth, async (req, res) => {
  try {
    const bills = await Bill.find({
      user: req.user.id,
      isPaid: false
    });

    const notifications = [];

    for (const bill of bills) {
      const daysUntilDue = Math.ceil((new Date(bill.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue <= bill.reminderDays) {
        const notification = await createBillReminder(bill);
        notifications.push(notification);
      }
    }

    res.json(notifications);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Helper function to create bill reminder notification
async function createBillReminder(bill) {
  const daysUntilDue = Math.ceil((new Date(bill.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  
  const notification = new Notification({
    user: bill.user,
    type: 'BILL_DUE',
    title: `Bill Reminder: ${bill.name}`,
    message: `Your ${bill.name} bill of $${bill.amount} is due in ${daysUntilDue} days`,
    dueDate: bill.dueDate,
    priority: daysUntilDue <= 1 ? 'HIGH' : 'MEDIUM'
  });

  return await notification.save();
}

// Helper function to calculate next due date for recurring bills
function getNextDueDate(currentDueDate, frequency) {
  const date = new Date(currentDueDate);
  
  switch (frequency) {
    case 'WEEKLY':
      date.setDate(date.getDate() + 7);
      break;
    case 'MONTHLY':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'YEARLY':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  
  return date;
}

module.exports = router; 