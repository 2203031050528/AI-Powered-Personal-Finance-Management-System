import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import MonthlyBudgetPlanner from './MonthlyBudgetPlanner';
import BudgetAlerts from './BudgetAlerts';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import IncomeVsExpenses from '../visualizations/IncomeVsExpenses';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BudgetDashboard = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'x-auth-token': token };
        
        const [budgetsRes, expensesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/budget', { headers }),
          axios.get('http://localhost:5000/api/expenses', { headers })
        ]);

        setBudgets(budgetsRes.data);
        setExpenses(expensesRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: budgets.map(budget => budget.category),
    datasets: [
      {
        label: 'Budget Amount',
        data: budgets.map(budget => budget.amount),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Actual Expenses',
        data: budgets.map(budget => {
          return expenses
            .filter(expense => 
              expense.category === budget.category &&
              new Date(expense.date).getMonth() === new Date(budget.month).getMonth()
            )
            .reduce((total, expense) => total + expense.amount, 0);
        }),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Budget Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <MonthlyBudgetPlanner 
          onBudgetSet={(newBudget) => setBudgets([...budgets, newBudget])}
          currentBudgets={budgets}
        />
        <BudgetAlerts budgets={budgets} expenses={expenses} />
      </div>

      <div className="mb-8">
        <IncomeVsExpenses />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Budget vs. Actual Expenses</h3>
        <Bar data={chartData} />
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Current Budgets</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Remaining
                </th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget) => {
                const spent = expenses
                  .filter(expense => 
                    expense.category === budget.category &&
                    new Date(expense.date).getMonth() === new Date(budget.month).getMonth()
                  )
                  .reduce((total, expense) => total + expense.amount, 0);
                const remaining = budget.amount - spent;

                return (
                  <tr key={budget._id}>
                    <td className="px-6 py-4">{budget.category}</td>
                    <td className="px-6 py-4">${budget.amount}</td>
                    <td className="px-6 py-4">${spent}</td>
                    <td className={`px-6 py-4 ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${remaining}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BudgetDashboard; 