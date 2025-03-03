const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Offer = require('../models/Offer');

// Test route
router.get('/test', (req, res) => {
  res.json({ msg: 'Offers route working' });
});

// Get all active offers
router.get('/', async (req, res) => {
  try {
    console.log('Fetching offers from database...');
    const offers = await Offer.find({ 
      isActive: true,
      validUntil: { $gte: new Date() }
    }).sort({ validUntil: 1 });
    console.log('Found offers:', offers);
    res.json(offers);
  } catch (err) {
    console.error('Error in GET /api/offers:', err);
    res.status(500).send('Server Error');
  }
});

// Add new offer (admin only)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const newOffer = new Offer(req.body);
    const offer = await newOffer.save();
    res.json(offer);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add test data route (remove in production)
router.post('/test-data', async (req, res) => {
  try {
    const testOffers = [
      {
        platform: 'Swiggy',
        code: 'FIRST50',
        description: '50% off on your first order',
        discount: '50% OFF',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        minimumOrder: 200,
        maxDiscount: 150,
        isActive: true
      },
      {
        platform: 'Zomato',
        code: 'ZOMATO100',
        description: 'Flat ₹100 off on orders above ₹300',
        discount: '₹100 OFF',
        validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        minimumOrder: 300,
        maxDiscount: 100,
        isActive: true
      }
    ];

    await Offer.insertMany(testOffers);
    res.json({ msg: 'Test data added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 