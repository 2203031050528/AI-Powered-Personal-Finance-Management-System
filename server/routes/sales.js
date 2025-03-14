const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const axios = require('axios');
const auth = require('../middleware/auth');

// Flipkart API handler
const getFlipkartData = async (productName) => {
  try {
    const response = await axios.get(`https://affiliate-api.flipkart.net/affiliate/1.0/search.json`, {
      headers: {
        'Fk-Affiliate-Id': process.env.FLIPKART_AFFILIATE_ID,
        'Fk-Affiliate-Token': process.env.FLIPKART_AFFILIATE_TOKEN
      },
      params: { query: productName }
    });

    const product = response.data.products[0];
    return {
      name: product.productBaseInfoV1.title,
      price: product.productBaseInfoV1.maximumRetailPrice.amount,
      discountedPrice: product.productBaseInfoV1.flipkartSpecialPrice.amount,
      discount: product.productBaseInfoV1.discountPercentage,
      available: product.productBaseInfoV1.inStock,
      platform: 'flipkart',
      url: product.productBaseInfoV1.productUrl
    };
  } catch (error) {
    console.error('Flipkart API Error:', error);
    throw error;
  }
};

// Amazon scraper
const getAmazonData = async (productName) => {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(`https://www.amazon.in/s?k=${encodeURIComponent(productName)}`);
    
    const productData = await page.evaluate(() => {
      const product = document.querySelector('.s-result-item');
      if (!product) return null;

      const name = product.querySelector('h2')?.textContent.trim();
      const price = product.querySelector('.a-price-whole')?.textContent.trim();
      const originalPrice = product.querySelector('.a-text-price span')?.textContent.trim();
      const available = !product.querySelector('.s-result-unavailable');

      return { name, price, originalPrice, available };
    });

    if (!productData) throw new Error('Product not found');

    const discount = productData.originalPrice ? 
      Math.round((1 - (parseFloat(productData.price) / parseFloat(productData.originalPrice))) * 100) : 0;

    return {
      name: productData.name,
      price: parseFloat(productData.originalPrice || productData.price),
      discountedPrice: parseFloat(productData.price),
      discount,
      available: productData.available,
      platform: 'amazon'
    };
  } finally {
    await browser.close();
  }
};

// Meesho scraper
const getMeeshoData = async (productName) => {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(`https://www.meesho.com/search?q=${encodeURIComponent(productName)}`);
    
    const productData = await page.evaluate(() => {
      const product = document.querySelector('.ProductCard');
      if (!product) return null;

      const name = product.querySelector('.ProductCard__ProductName')?.textContent.trim();
      const price = product.querySelector('.ProductCard__Price')?.textContent.replace('₹', '').trim();
      const originalPrice = product.querySelector('.ProductCard__OriginalPrice')?.textContent.replace('₹', '').trim();
      const available = true; // Meesho typically shows only available products

      return { name, price, originalPrice, available };
    });

    if (!productData) throw new Error('Product not found');

    const discount = productData.originalPrice ? 
      Math.round((1 - (parseFloat(productData.price) / parseFloat(productData.originalPrice))) * 100) : 0;

    return {
      name: productData.name,
      price: parseFloat(productData.originalPrice || productData.price),
      discountedPrice: parseFloat(productData.price),
      discount,
      available: productData.available,
      platform: 'meesho'
    };
  } finally {
    await browser.close();
  }
};

// Main API endpoint
router.get('/', auth, async (req, res) => {
  try {
    const { platform, product } = req.query;
    if (!platform || !product) {
      return res.status(400).json({ error: 'Platform and product name are required' });
    }

    let data;
    switch (platform.toLowerCase()) {
      case 'flipkart':
        data = await getFlipkartData(product);
        break;
      case 'amazon':
        data = await getAmazonData(product);
        break;
      case 'meesho':
        data = await getMeeshoData(product);
        break;
      default:
        return res.status(400).json({ error: 'Invalid platform' });
    }

    res.json(data);
  } catch (error) {
    console.error('Sales API Error:', error);
    res.status(500).json({ error: 'Failed to fetch product data' });
  }
});

module.exports = router; 