import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { BellIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const SalesTracker = () => {
  const [productName, setProductName] = useState('');
  const [platform, setPlatform] = useState('flipkart');
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);

  const platforms = [
    { id: 'flipkart', name: 'Flipkart' },
    { id: 'amazon', name: 'Amazon' },
    { id: 'meesho', name: 'Meesho' }
  ];

  const fetchProductData = async () => {
    if (!productName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/sales`, {
        params: { platform, product: productName },
        headers: { 'x-auth-token': token }
      });

      setProductData(response.data);
      updatePriceHistory(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch product data');
    } finally {
      setLoading(false);
    }
  };

  const updatePriceHistory = (data) => {
    setPriceHistory(prev => [...prev, {
      date: new Date(),
      price: data.discountedPrice
    }].slice(-30)); // Keep last 30 days
  };

  const toggleWishlist = () => {
    if (!productData) return;

    if (wishlist.some(item => item.name === productData.name)) {
      setWishlist(wishlist.filter(item => item.name !== productData.name));
    } else {
      setWishlist([...wishlist, productData]);
    }
  };

  const chartData = {
    labels: priceHistory.map(item => item.date.toLocaleDateString()),
    datasets: [{
      label: 'Price History',
      data: priceHistory.map(item => item.price),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      fill: false
    }]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Market Sales Tracker</h2>
        <p className="text-gray-600 mb-6">
          Track prices across multiple e-commerce platforms and get the best deals.
        </p>

        {/* Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {platforms.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchProductData}
              disabled={loading || !productName.trim()}
              className="w-full px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Searching...
                </span>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>

        {/* Instructions */}
        {!productData && !loading && !error && (
          <div className="mt-8 text-center text-gray-500">
            <p>Enter a product name and select a platform to start tracking prices</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8">
          {error}
        </div>
      )}

      {/* Product Data */}
      {productData && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold mb-2">{productData.name}</h3>
              <p className="text-gray-500">{platforms.find(p => p.id === platform).name}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleWishlist}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Add to Wishlist"
              >
                {wishlist.some(item => item.name === productData.name) ? (
                  <HeartIconSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-400" />
                )}
              </button>
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                title="Set Price Alert"
              >
                <BellIcon className="h-6 w-6 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Original Price</p>
              <p className="text-xl font-bold">₹{productData.price}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Discounted Price</p>
              <p className="text-xl font-bold text-green-600">₹{productData.discountedPrice}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Discount</p>
              <p className="text-xl font-bold text-indigo-600">{productData.discount}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Availability</p>
              <p className={`text-xl font-bold ${productData.available ? 'text-green-600' : 'text-red-600'}`}>
                {productData.available ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
          </div>

          {/* Price History Chart */}
          {priceHistory.length > 1 && (
            <div className="h-64">
              <Line data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          )}
        </div>
      )}

      {/* Wishlist */}
      {wishlist.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Wishlist</h3>
          <div className="divide-y">
            {wishlist.map((item, index) => (
              <div key={index} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">₹{item.discountedPrice}</p>
                </div>
                <button
                  onClick={() => setWishlist(wishlist.filter(w => w.name !== item.name))}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTracker; 