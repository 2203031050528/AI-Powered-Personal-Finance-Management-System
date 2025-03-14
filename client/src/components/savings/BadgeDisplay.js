import React from 'react';

const BadgeDisplay = ({ badges }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {badges.map((badge) => (
        <div
          key={badge._id}
          className="flex flex-col items-center p-4 border rounded-lg bg-gray-50"
        >
          <span className="text-4xl mb-2">{badge.icon}</span>
          <h3 className="font-semibold text-center">{badge.name}</h3>
          <p className="text-sm text-gray-600 text-center">{badge.description}</p>
          <p className="text-xs text-gray-500 mt-2">
            Earned: {new Date(badge.earnedDate).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default BadgeDisplay; 