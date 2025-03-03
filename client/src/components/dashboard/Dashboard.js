import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FoodOffers from './FoodOffers';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/expenses', {
          headers: {
            'x-auth-token': token
          }
        });
        setExpenses(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      <div className="mb-8">
        <FoodOffers />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Total Expenses</h2>
          <p className="text-2xl text-indigo-600">
            ${expenses.reduce((acc, exp) => acc + exp.amount, 0).toFixed(2)}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-2">
            {expenses.slice(0, 5).map(expense => (
              <div key={expense._id} className="flex justify-between">
                <span>{expense.description}</span>
                <span>${expense.amount}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-md mb-2">
            Add Expense
          </button>
          <button className="w-full bg-green-600 text-white py-2 rounded-md">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 