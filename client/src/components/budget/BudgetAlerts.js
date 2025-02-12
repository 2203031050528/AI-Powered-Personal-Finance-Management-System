import React from 'react';

const BudgetAlerts = ({ budgets, expenses }) => {
  const calculateOverspending = () => {
    const alerts = [];
    budgets.forEach(budget => {
      const categoryExpenses = expenses
        .filter(expense => 
          expense.category === budget.category &&
          new Date(expense.date).getMonth() === new Date(budget.month).getMonth()
        )
        .reduce((total, expense) => total + expense.amount, 0);

      const percentageUsed = (categoryExpenses / budget.amount) * 100;
      
      if (percentageUsed >= 90) {
        alerts.push({
          category: budget.category,
          percentage: percentageUsed,
          remaining: budget.amount - categoryExpenses
        });
      }
    });
    return alerts;
  };

  const alerts = calculateOverspending();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Budget Alerts</h3>
      {alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div 
              key={index}
              className={`p-4 rounded-md ${
                alert.percentage >= 100 
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              <p className="font-medium">
                {alert.category}: {alert.percentage.toFixed(1)}% of budget used
              </p>
              <p className="text-sm">
                Remaining: ${alert.remaining.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No budget alerts at this time</p>
      )}
    </div>
  );
};

export default BudgetAlerts; 