const express = require('express');
const router = express.Router();
const yahooFinance = require('yahoo-finance2').default;
const auth = require('../middleware/auth');
const FavoriteStock = require('../models/FavoriteStock');

// Configure Yahoo Finance with correct options structure
yahooFinance.setGlobalConfig({
  queue: {
    concurrency: 1,    // Number of concurrent requests
    timeout: 30000     // Timeout in milliseconds
  }
});

// Get stock data
router.get('/', auth, async (req, res) => {
  try {
    const { symbol } = req.query;
    if (!symbol) {
      return res.status(400).json({ msg: 'Stock symbol is required' });
    }

    // Use a try-catch block specifically for Yahoo Finance calls
    try {
      const quote = await yahooFinance.quote(symbol);
      const historical = await yahooFinance.historical(symbol, {
        period1: '50d',
        interval: '1d'
      });

      // Calculate 50-day moving average
      const ma50 = historical.reduce((sum, day) => sum + day.close, 0) / historical.length;
      
      // Generate suggestion
      let suggestion;
      if (quote.regularMarketPrice > ma50 * 1.05) {
        suggestion = 'SELL';
      } else if (quote.regularMarketPrice < ma50 * 0.95) {
        suggestion = 'BUY';
      } else {
        suggestion = 'HOLD';
      }

      res.json({
        symbol: quote.symbol,
        name: quote.shortName,
        price: quote.regularMarketPrice,
        change: quote.regularMarketChangePercent,
        ma50,
        suggestion,
        historical: historical.map(day => ({
          date: day.date,
          price: day.close
        }))
      });

    } catch (yahooError) {
      // If Yahoo Finance fails, return mock data for development
      console.error('Yahoo Finance API Error:', yahooError);
      
      // Return mock data during API issues
      res.json({
        symbol: symbol,
        name: `${symbol} Stock`,
        price: 150.00,
        change: 0.5,
        ma50: 148.00,
        suggestion: 'HOLD',
        historical: Array(50).fill().map((_, i) => ({
          date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)),
          price: 150 + Math.random() * 10 - 5
        }))
      });
    }

  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ 
      error: 'Server Error', 
      message: 'Unable to fetch stock data' 
    });
  }
});

// Add to favorites
router.post('/favorites', auth, async (req, res) => {
  try {
    const { symbol } = req.body;
    const favorite = new FavoriteStock({
      user: req.user.id,
      symbol
    });
    await favorite.save();
    res.json(favorite);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add this new route to your existing stocks.js file
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ msg: 'Search query is required' });
    }

    const results = await yahooFinance.search(query, {
      quotesCount: 6,
      newsCount: 0,
      enableFuzzyQuery: true,
      quotesQueryFields: ['shortName', 'longName', 'symbol']
    });

    // Filter for Indian stocks (ending with .NS)
    const indianStocks = results.quotes.filter(quote => 
      quote.symbol.endsWith('.NS')
    );

    res.json(indianStocks);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 