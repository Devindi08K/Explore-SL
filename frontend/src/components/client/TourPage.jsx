import React, { useState, useEffect } from "react";
import api from '../../utils/api';

const TourPage = () => {
  const [tours, setTours] = useState([]);
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await api.get("/tours"); // This endpoint now only returns verified tours
        setTours(response.data);
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    fetchTours();
  }, []);

  const filteredTours = selectedType === "all" 
    ? tours 
    : tours.filter(tour => tour.isExternal === (selectedType === "external"));

  return (
    <div className="min-h-screen bg-cream px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-charcoal text-center mb-8">
          Explore Our Tours
        </h1>
        
        {/* Updated Tour Type Filter */}
        <div className="flex justify-center mb-8">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="all">All Tours</option>
            <option value="external">Direct Booking Tours</option>
            <option value="local">Contact Required Tours</option>
          </select>
        </div>

        {/* Optional: Add description for each tour type */}
        <div className="text-center mb-8 text-gray-600">
          {selectedType === "external" && (
            <p>Tours that can be booked directly through our partner websites</p>
          )}
          {selectedType === "local" && (
            <p>Tours that require direct contact with our local tour providers</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour) => (
            <div key={tour._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={tour.image}
                alt={tour.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-charcoal mb-2">{tour.name}</h3>
                <p className="text-gray-600 mb-4">{tour.description}</p>
                <p className="text-lg font-semibold text-charcoal mb-4">{tour.priceRange}</p>
                
                {tour.isExternal ? (
                  // External Tour - Show Book Now Button
                  <a 
                    href={tour.bookingUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <button className="w-full bg-tan text-cream py-2 rounded-lg hover:bg-gold transition duration-200">
                      Book Now
                    </button>
                  </a>
                ) : (
                  // Local Tour - Show Details and Contact
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p><span className="font-medium">Duration:</span> {tour.duration}</p>
                      <p><span className="font-medium">Group Size:</span> {tour.groupSize}</p>
                      {tour.highlights && (
                        <p><span className="font-medium">Highlights:</span> {tour.highlights}</p>
                      )}
                      <div className="mt-2">
                        <p className="font-medium mb-1">What's Included:</p>
                        <p className="text-gray-600">{tour.included}</p>
                      </div>
                      {tour.notIncluded && (
                        <div className="mt-2">
                          <p className="font-medium mb-1">Not Included:</p>
                          <p className="text-gray-600">{tour.notIncluded}</p>
                        </div>
                      )}
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="font-medium mb-1">Contact:</p>
                      <p className="text-sm text-gray-600">{tour.contactEmail}</p>
                      <p className="text-sm text-gray-600">{tour.contactPhone}</p>
                    </div>
                    <button 
                      onClick={() => window.location.href = `mailto:${tour.contactEmail}`}
                      className="w-full bg-tan text-cream py-2 rounded-lg hover:bg-gold transition duration-200"
                    >
                      Contact Tour Provider
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourPage;
