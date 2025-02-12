import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BillReminder = () => {
  const [bills, setBills] = useState([]);
  const [newBill, setNewBill] = useState({
    name: '',
    amount: '',
    dueDate: '',
    category: '',
    frequency: 'MONTHLY',
    isRecurring: true,
    reminderDays: 3
  });

  useEffect(() => {
    fetchBills();
    // Check for reminders every hour
    const interval = setInterval(() => {
      checkReminders();
    }, 3600000);
    return () => clearInterval(interval);
  }, []);

  const fetchBills = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/bills', {
        headers: { 'x-auth-token': token }
      });
      setBills(res.data);
    } catch (err) {
      console.error('Error fetching bills:', err);
    }
  };

  const checkReminders = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/bills/check-reminders', {}, {
        headers: { 'x-auth-token': token }
      });
    } catch (err) {
      console.error('Error checking reminders:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/bills', newBill, {
        headers: { 'x-auth-token': token }
      });
      setNewBill({
        name: '',
        amount: '',
        dueDate: '',
        category: '',
        frequency: 'MONTHLY',
        isRecurring: true,
        reminderDays: 3
      });
      fetchBills();
    } catch (err) {
      console.error('Error adding bill:', err);
    }
  };

  const markAsPaid = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/bills/${id}/paid`, {}, {
        headers: { 'x-auth-token': token }
      });
      fetchBills();
    } catch (err) {
      console.error('Error marking bill as paid:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Bill Reminders</h2>

      {/* Add New Bill Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bill Name</label>
            <input
              type="text"
              value={newBill.name}
              onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={newBill.amount}
              onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              value={newBill.dueDate}
              onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              value={newBill.category}
              onChange={(e) => setNewBill({ ...newBill, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Frequency</label>
            <select
              value={newBill.frequency}
              onChange={(e) => setNewBill({ ...newBill, frequency: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="ONE_TIME">One Time</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reminder Days Before</label>
            <input
              type="number"
              value={newBill.reminderDays}
              onChange={(e) => setNewBill({ ...newBill, reminderDays: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              min="1"
              max="30"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add Bill
          </button>
        </div>
      </form>

      {/* Bills List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bills.map(bill => (
              <tr key={bill._id}>
                <td className="px-6 py-4 whitespace-nowrap">{bill.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">${bill.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(bill.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    bill.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {bill.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {!bill.isPaid && (
                    <button
                      onClick={() => markAsPaid(bill._id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Mark as Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillReminder; 