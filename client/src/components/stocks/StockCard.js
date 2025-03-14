import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { StarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, BellIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const StockCard = ({ symbol, onError }) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('1D');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertPrice, setAlertPrice] = useState('');

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/stocks?symbol=${symbol}`, {
          headers: { 'x-auth-token': token }
        });
        setStockData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        onError && onError(error.message);
        setLoading(false);
      }
    };

    fetchStockData();
    checkIfFavorite();
    // Set up real-time updates every minute
    const interval = setInterval(fetchStockData, 60000);
    return () => clearInterval(interval);
  }, [symbol, onError]);

  const checkIfFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/stocks/favorites`, {
        headers: { 'x-auth-token': token }
      });
      setIsFavorite(res.data.some(stock => stock.symbol === symbol));
    } catch (err) {
      console.error('Error checking favorites:', err);
    }
  };

  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      if (isFavorite) {
        await axios.delete(`http://localhost:5000/api/stocks/favorites/${symbol}`, {
          headers: { 'x-auth-token': token }
        });
      } else {
        await axios.post('http://localhost:5000/api/stocks/favorites', 
          { symbol },
          { headers: { 'x-auth-token': token } }
        );
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const setAlert = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/stocks/alerts', 
        { symbol, targetPrice: alertPrice },
        { headers: { 'x-auth-token': token } }
      );
      setShowAlertModal(false);
      setAlertPrice('');
    } catch (err) {
      console.error('Error setting alert:', err);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(price);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (!stockData) {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow-md">
        <p className="text-red-500">Unable to load stock data</p>
      </div>
    );
  }

  const chartData = {
    labels: stockData.historical.map(day => new Date(day.date).toLocaleDateString('en-IN')),
    datasets: [{
      label: 'Stock Price',
      data: stockData.historical.map(day => day.price),
      borderColor: stockData.change >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
      backgroundColor: stockData.change >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{stockData.name}</h3>
            <p className="text-gray-500 text-sm">{stockData.symbol.replace('.NS', '')}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAlertModal(true)}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
              title="Set Price Alert"
            >
              <BellIcon className="h-5 w-5" />
            </button>
            <button
              onClick={toggleFavorite}
              className={`p-2 transition-colors ${isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              {isFavorite ? <StarIconSolid className="h-5 w-5" /> : <StarIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-3xl font-bold text-gray-900">{formatPrice(stockData.price)}</span>
            <div className="flex items-center mt-1">
              <span className={`flex items-center ${
                stockData.change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {stockData.change >= 0 ? 
                  <ArrowTrendingUpIcon className="h-5 w-5 mr-1" /> : 
                  <ArrowTrendingDownIcon className="h-5 w-5 mr-1" />
                }
                {Math.abs(stockData.change).toFixed(2)}%
              </span>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg ${
            stockData.suggestion === 'BUY' ? 'bg-green-100 text-green-800' :
            stockData.suggestion === 'SELL' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            <span className="font-semibold">{stockData.suggestion}</span>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-4">
          {['1D', '1W', '1M', '3M', '1Y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                timeRange === range 
                  ? 'bg-indigo-100 text-indigo-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-48">
          <Line 
            data={chartData} 
            options={{ 
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) => `${formatPrice(context.raw)}`
                  }
                }
              },
              scales: {
                x: { display: false },
                y: { 
                  grid: { display: false },
                  ticks: { callback: (value) => formatPrice(value) }
                }
              }
            }} 
          />
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Volume</p>
            <p className="font-semibold">{stockData.volume?.toLocaleString() || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">50-Day MA</p>
            <p className="font-semibold">{formatPrice(stockData.ma50)}</p>
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Set Price Alert</h3>
            <input
              type="number"
              value={alertPrice}
              onChange={(e) => setAlertPrice(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter target price"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAlertModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={setAlert}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Set Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockCard; 