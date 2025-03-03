import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FoodOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        console.log('Fetching offers...');
        const res = await axios.get('http://localhost:5000/api/offers', {
          headers: {
            'x-auth-token': localStorage.getItem('token') // Add token if needed
          }
        });
        console.log('Received offers:', res.data);
        setOffers(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error details:', err.response || err);
        setError(err.response?.data?.msg || 'Failed to fetch offers');
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading) {
    return <div className="text-center">Loading offers...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (offers.length === 0) {
    return <div className="text-center">No current offers available</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Current Food Offers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <div 
            key={offer._id}
            className={`p-4 rounded-lg border-2 ${
              offer.platform === 'Swiggy' ? 'border-orange-500 bg-orange-50' :
              offer.platform === 'Zomato' ? 'border-red-500 bg-red-50' :
              'border-blue-500 bg-blue-50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-lg">{offer.platform}</span>
              <span className="text-sm bg-white px-2 py-1 rounded-full">
                {offer.code}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{offer.description}</p>
            <div className="flex justify-between items-end">
              <span className="text-lg font-semibold text-green-600">
                {offer.discount}
              </span>
              <span className="text-sm text-gray-500">
                Valid till {new Date(offer.validUntil).toLocaleDateString()}
              </span>
            </div>
            {offer.minimumOrder > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Min. order: ₹{offer.minimumOrder}
              </p>
            )}
            {offer.maxDiscount && (
              <p className="text-sm text-gray-500">
                Max discount: ₹{offer.maxDiscount}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodOffers; 