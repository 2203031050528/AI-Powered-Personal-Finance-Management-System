import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import BadgeDisplay from './BadgeDisplay';

const API_URL = 'http://localhost:5000';

const SavingsTracker = () => {
  const [savings, setSavings] = useState([]);
  const [badges, setBadges] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'General'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view savings');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        };

        // Log the request details
        console.log('Making request with token:', token);
        
        const savingsRes = await axios.get(`${API_URL}/api/savings`, config);
        console.log('Savings response:', savingsRes.data);
        
        const badgesRes = await axios.get(`${API_URL}/api/savings/badges`, config);
        console.log('Badges response:', badgesRes.data);

        setSavings(savingsRes.data);
        setBadges(badgesRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error details:', err.response || err);
        setError(
          err.response?.data?.message || 
          'Failed to load data. Please check your connection.'
        );
        setLoading(false);
      }
    };

    fetchData();
    setupSocketConnection();
  }, []);

  const setupSocketConnection = () => {
    const socket = io('http://localhost:5000');
    const token = localStorage.getItem('token');
    const userId = token ? JSON.parse(atob(token.split('.')[1])).user.id : null;

    if (userId) {
      socket.emit('join', userId);
      socket.on('newBadges', handleNewBadges);
    }

    return () => socket.disconnect();
  };

  const handleNewBadges = (newBadges) => {
    setBadges(prev => [...newBadges, ...prev]);
    newBadges.forEach(badge => {
      // Show notification
      if (Notification.permission === 'granted') {
        new Notification('New Badge Earned!', {
          body: `Congratulations! You've earned the ${badge.name} badge!`,
          icon: '/badge-icon.png'
        });
      }
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to add savings');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      const res = await axios.post(
        `${API_URL}/api/savings`,
        formData,
        config
      );

      setSavings([res.data.saving, ...savings]);
      setFormData({ amount: '', category: 'General' });
      setError(null);
    } catch (err) {
      console.error('Error adding saving:', err.response || err);
      setError(err.response?.data?.message || 'Failed to add saving');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Savings Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Add Savings</h2>
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="General">General</option>
                <option value="Emergency">Emergency</option>
                <option value="Investment">Investment</option>
                <option value="Retirement">Retirement</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              disabled={!formData.amount}
            >
              Add Saving
            </button>
          </form>
        </div>

        {/* Badges Display */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Your Achievements</h2>
          <BadgeDisplay badges={badges} />
        </div>

        {/* Savings History */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Savings History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {savings.map((saving) => (
                  <tr key={saving._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(saving.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{parseFloat(saving.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {saving.category}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsTracker; 