import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AddExpense from './components/expenses/AddExpense';
import Reports from './components/reports/Reports';
import BudgetDashboard from './components/budget/BudgetDashboard';
import BillReminder from './components/bills/BillReminder';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import InvestmentSuggestions from './components/stocks/InvestmentSuggestions';
import SalesTracker from './components/sales/SalesTracker';
import SavingsTracker from './components/savings/SavingsTracker';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-expense"
              element={
                <PrivateRoute>
                  <AddExpense />
                </PrivateRoute>
              }
            />
            <Route
              path="/budget"
              element={
                <PrivateRoute>
                  <BudgetDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              }
            />
            <Route
              path="/bills"
              element={
                <PrivateRoute>
                  <BillReminder />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/investments"
              element={
                <PrivateRoute>
                  <InvestmentSuggestions />
                </PrivateRoute>
              }
            />
            <Route
              path="/sales-tracker"
              element={
                <PrivateRoute>
                  <SalesTracker />
                </PrivateRoute>
              }
            />
            <Route
              path="/savings"
              element={
                <PrivateRoute>
                  <SavingsTracker />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 