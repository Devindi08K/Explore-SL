import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import DestinationCard from './DestinationCard';
import { ClipLoader } from 'react-spinners';

const HomePage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredDestinations = destinations.filter((destination) =>
    destination.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-cream">
        <ClipLoader color="#b68d40" size={60} />
      </div>
    );

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="px-6 py-10 bg-cream min-h-screen">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-tan mb-8">
        Uncover the Wonders of Sri Lanka
      </h1>

      {/* Search Bar */}
      <div className="max-w-lg mx-auto mb-10">
        <input
          type="text"
          placeholder="Search destinations..."
          className="w-full px-4 py-2 border border-gold rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-gold"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Cards */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDestinations.length > 0 ? (
          filteredDestinations.map((destination) => (
            <DestinationCard key={destination._id} {...destination} />
          ))
        ) : (
          <p className="text-center text-charcoal text-lg col-span-full">No destinations found.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
