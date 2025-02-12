import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const IncomeVsExpenses = () => {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('monthly'); // monthly, yearly
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'x-auth-token': token };

        const [incomeRes, expensesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/income', { headers }),
          axios.get('http://localhost:5000/api/expenses', { headers })
        ]);

        setIncome(incomeRes.data);
        setExpenses(expensesRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const monthlyIncome = new Array(12).fill(0);
    const monthlyExpenses = new Array(12).fill(0);
    const monthlySavings = new Array(12).fill(0);

    income.forEach(inc => {
      const date = new Date(inc.date);
      if (date.getFullYear() === year) {
        monthlyIncome[date.getMonth()] += inc.amount;
      }
    });

    expenses.forEach(exp => {
      const date = new Date(exp.date);
      if (date.getFullYear() === year) {
        monthlyExpenses[date.getMonth()] += exp.amount;
      }
    });

    monthlyIncome.forEach((inc, index) => {
      monthlySavings[index] = inc - monthlyExpenses[index];
    });

    return {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: monthlyIncome,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          type: 'bar'
        },
        {
          label: 'Expenses',
          data: monthlyExpenses,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          type: 'bar'
        },
        {
          label: 'Savings',
          data: monthlySavings,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          type: 'line',
          yAxisID: 'savings'
        }
      ]
    };
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        title: {
          display: true,
          text: 'Amount ($)'
        }
      },
      savings: {
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Savings ($)'
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: `Income vs Expenses (${year})`
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const chartData = processMonthlyData();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold">Income vs Expenses Analysis</h3>
        <div className="flex gap-4">
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {[...Array(5)].map((_, i) => {
              const yearOption = new Date().getFullYear() - i;
              return (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <Bar data={chartData} options={options} />
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="p-4 bg-green-100 rounded-lg">
          <h4 className="text-sm font-medium text-green-800">Total Income</h4>
          <p className="text-2xl font-bold text-green-600">
            ${income.reduce((total, inc) => total + inc.amount, 0).toFixed(2)}
          </p>
        </div>
        <div className="p-4 bg-red-100 rounded-lg">
          <h4 className="text-sm font-medium text-red-800">Total Expenses</h4>
          <p className="text-2xl font-bold text-red-600">
            ${expenses.reduce((total, exp) => total + exp.amount, 0).toFixed(2)}
          </p>
        </div>
        <div className="p-4 bg-blue-100 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800">Net Savings</h4>
          <p className="text-2xl font-bold text-blue-600">
            ${(
              income.reduce((total, inc) => total + inc.amount, 0) -
              expenses.reduce((total, exp) => total + exp.amount, 0)
            ).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IncomeVsExpenses; 