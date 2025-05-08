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

      {/* Search and Filter Section */}
      <div className="max-w-2xl mx-auto mb-10 space-y-4">
        <input
          type="text"
          placeholder="Search destinations..."
          className="w-full px-4 py-2 border border-gold rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-gold"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="w-full px-4 py-2 border border-gold rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="">All Districts</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
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