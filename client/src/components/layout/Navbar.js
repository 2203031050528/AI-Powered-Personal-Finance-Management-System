import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationCenter from '../notifications/NotificationCenter';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.user.isAdmin);
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              FinanceManager
            </Link>
            {token && (
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/dashboard"
                  className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/add-expense"
                  className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Add Expense
                </Link>
                <Link
                  to="/budget"
                  className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Budget
                </Link>
                <Link
                  to="/reports"
                  className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Reports
                </Link>
                <Link
                  to="/bills"
                  className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Bills
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/investments"
                  className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Investments
                </Link>
                <Link
                  to="/sales-tracker"
                  className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sales Tracker
                </Link>
                <Link
                  to="/savings"
                  className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Savings
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {token ? (
              <div className="flex items-center space-x-4">
                <NotificationCenter />
                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 