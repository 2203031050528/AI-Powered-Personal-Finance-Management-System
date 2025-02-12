import React, { useState } from 'react';
import axios from 'axios';

const MonthlyBudgetPlanner = ({ onBudgetSet, currentBudgets }) => {
  const [budgetData, setBudgetData] = useState({
    category: '',
    amount: '',
    month: new Date().toISOString().slice(0, 7) // YYYY-MM format
  });

  const categories = [
    'Housing',
    'Transportation',
    'Food',
    'Utilities',
    'Healthcare',
    'Entertainment',
    'Shopping',
    'Savings',
    'Other'
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/budget', budgetData, {
        headers: {
          'x-auth-token': token
        }
      });
      onBudgetSet(res.data);
      setBudgetData({
        category: '',
        amount: '',
        month: new Date().toISOString().slice(0, 7)
      });
    } catch (err) {
      console.error('Error setting budget:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Set Monthly Budget</h3>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={budgetData.category}
              onChange={(e) => setBudgetData({ ...budgetData, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={budgetData.amount}
              onChange={(e) => setBudgetData({ ...budgetData, amount: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Month</label>
            <input
              type="month"
              value={budgetData.month}
              onChange={(e) => setBudgetData({ ...budgetData, month: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Set Budget
          </button>
        </div>
      </form>
    </div>
  );
};

export default MonthlyBudgetPlanner; 