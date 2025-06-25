import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import DestinationCard from './DestinationCard';
import { ClipLoader } from 'react-spinners';

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // Sri Lankan districts array
  const districts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
    'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
    'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
    'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await api.get('/destinations');
        setDestinations(response.data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setError('Failed to load destinations');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = !selectedDistrict || destination.district === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-cream">
      <ClipLoader color="#b68d40" size={60} />
    </div>
  );

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="px-6 py-10 bg-cream min-h-screen">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-tan mb-8">
        Explore Sri Lankan Destinations
      </h1>

      {/* Enhanced Search and Filter Section */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="bg-white p-5 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            {/* Search Input with Icon */}
            <div className="md:w-2/3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search destinations..."
                className="w-full pl-10 pr-4 py-2.5 bg-cream border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-tan focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* District Dropdown with Custom Style */}
            <div className="md:w-1/3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-cream border border-transparent rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-tan focus:border-transparent"
              >
                <option value="">All Districts</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div
          >
          
          {/* Active Filters Display */}
          {(searchTerm || selectedDistrict) && (
            <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              
              {searchTerm && (
                <span className="flex items-center text-sm bg-tan/10 text-tan px-3 py-1 rounded-full">
                  Search: "{searchTerm}"
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="ml-2 focus:outline-none"
                    aria-label="Clear search"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              
              {selectedDistrict && (
                <span className="flex items-center text-sm bg-tan/10 text-tan px-3 py-1 rounded-full">
                  District: {selectedDistrict}
                  <button 
                    onClick={() => setSelectedDistrict('')} 
                    className="ml-2 focus:outline-none"
                    aria-label="Clear district filter"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDistrict('');
                }} 
                className="text-sm text-gray-500 hover:text-tan ml-auto"
              >
                Clear all
              </button>
            </div>
          )}
          
          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredDestinations.length} of {destinations.length} destinations
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDestinations.length > 0 ? (
          filteredDestinations.map((destination) => (
            <DestinationCard key={destination._id} {...destination} />
          ))
        ) : (
          <p className="text-center text-charcoal text-lg col-span-full">
            No destinations found.
          </p>
        )}
      </div>
    </div>
  );
};

export default DestinationsPage;