import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StockCard from './StockCard';
import { SearchIcon, PlusIcon } from '@heroicons/react/24/outline';

const InvestmentSuggestions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customSymbol, setCustomSymbol] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customStocks, setCustomStocks] = useState([]);
  const [error, setError] = useState(null);
  
  // Popular Indian stocks with NSE symbols
  const indianStocks = [
    'RELIANCE.NS',    // Reliance Industries
    'TCS.NS',         // Tata Consultancy Services
    'HDFCBANK.NS',    // HDFC Bank
    'INFY.NS',        // Infosys
    'ICICIBANK.NS',   // ICICI Bank
    'BHARTIARTL.NS',  // Bharti Airtel
    'WIPRO.NS',       // Wipro
    'LT.NS',          // Larsen & Toubro
    'HINDUNILVR.NS',  // Hindustan Unilever
    'TATAMOTORS.NS'   // Tata Motors
  ];

  // Search for stocks using Yahoo Finance API
  const searchStocks = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/stocks/search?query=${query}`);
      setSearchResults(response.data.filter(stock => stock.symbol.endsWith('.NS')));
    } catch (error) {
      console.error('Error searching stocks:', error);
      setSearchResults([]);
    }
    setLoading(false);
  };

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchStocks(customSymbol);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [customSymbol]);

  const addCustomStock = (symbol) => {
    if (!customStocks.includes(symbol)) {
      setCustomStocks([...customStocks, symbol]);
    }
    setCustomSymbol('');
    setSearchResults([]);
  };

  const removeCustomStock = (symbol) => {
    setCustomStocks(customStocks.filter(stock => stock !== symbol));
  };

  const filteredStocks = indianStocks.filter(stock => 
    stock.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Indian Stock Recommendations</h2>
        <p className="text-gray-600 mt-2">Track and analyze top performing Indian stocks</p>
        
        {/* Search Bars Container */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {/* Filter Existing Stocks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Recommended Stocks
            </label>
            <input
              type="text"
              placeholder="Filter stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Search Custom Stocks */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Any Indian Stock
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by company name or symbol..."
                value={customSymbol}
                onChange={(e) => setCustomSymbol(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {loading && (
                <div className="absolute right-3 top-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                </div>
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                {searchResults.map((result) => (
                  <button
                    key={result.symbol}
                    onClick={() => addCustomStock(result.symbol)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{result.shortName}</div>
                      <div className="text-sm text-gray-500">{result.symbol}</div>
                    </div>
                    <PlusIcon className="h-5 w-5 text-gray-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Stocks Section */}
      {customStocks.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Your Watched Stocks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customStocks.map(symbol => (
              <div key={symbol} className="relative">
                <button
                  onClick={() => removeCustomStock(symbol)}
                  className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  title="Remove from watchlist"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <StockCard symbol={symbol} onError={(err) => setError(err)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Stocks Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Recommended Stocks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStocks.map(symbol => (
            <StockCard key={symbol} symbol={symbol} onError={(err) => setError(err)} />
          ))}
        </div>

        {filteredStocks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No stocks found matching your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentSuggestions;