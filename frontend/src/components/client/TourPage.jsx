import React, { useState, useEffect } from "react";
import api from '../../utils/api';
import { FaRegClock, FaUsers, FaMapMarkerAlt, FaTag, FaCheck, FaTimes } from 'react-icons/fa';

const TourPage = () => {
  const [tours, setTours] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const response = await api.get("/tours"); // This endpoint only returns verified tours
        setTours(response.data);
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Update filteredTours to include search functionality
  const filteredTours = tours.filter(tour => {
    const matchesType = selectedType === "all" || tour.isExternal === (selectedType === "external");
    const matchesSearch = searchTerm.trim() === "" ||
      tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tour.highlights && tour.highlights.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const getTourTypeTag = (isExternal) => {
    return isExternal 
      ? { label: "Direct Booking", color: "bg-green-100 text-green-800" }
      : { label: "Contact Required", color: "bg-blue-100 text-blue-800" };
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-charcoal text-center mb-2">
          Explore Our Tours
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover the beauty of Sri Lanka with our carefully curated tours led by experienced guides
        </p>
        
        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search tours by name, description, or highlight..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold bg-white shadow-sm"
          />
        </div>

        {/* Enhanced Tour Type Filter */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-base font-medium text-charcoal mb-3 text-center">Filter Tours</h3>
            
            <div className="flex justify-center gap-2">
              <button 
                onClick={() => setSelectedType("all")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedType === "all" 
                    ? "bg-tan text-cream" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                All Tours
              </button>
              <button 
                onClick={() => setSelectedType("external")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedType === "external" 
                    ? "bg-tan text-cream" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Direct Booking
              </button>
              <button 
                onClick={() => setSelectedType("local")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedType === "local" 
                    ? "bg-tan text-cream" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Contact Required
              </button>
            </div>
            
            {/* Tour type description - smaller and lighter */}
            <div className="mt-2 text-center text-xs text-gray-500">
              {selectedType === "all" && (
                <p>Showing all available tours</p>
              )}
              {selectedType === "external" && (
                <p>Tours that can be booked directly through partner websites</p>
              )}
              {selectedType === "local" && (
                <p>Tours that require direct contact with tour providers</p>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-tan border-t-gold"></div>
          </div>
        ) : filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTours.map((tour) => {
              const tourType = getTourTypeTag(tour.isExternal);
              
              return (
                <div key={tour._id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
                  {/* Image Section with Tag */}
                  <div className="relative">
                    <img
                      src={tour.image && tour.image.startsWith('http') 
                        ? tour.image 
                        : `${import.meta.env.VITE_BACKEND_URL}/${tour.image?.replace(/\\/g, '/')}`}
                      alt={tour.name}
                      className="w-full h-56 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x400?text=Tour+Image";
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${tourType.color}`}>
                        {tourType.label}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Tour Title and Basic Info */}
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-charcoal mb-2">{tour.name}</h3>
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">{tour.description}</p>
                    </div>
                    
                    {/* Tour Details */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      {tour.duration && (
                        <div className="flex items-center text-sm text-gray-700">
                          <FaRegClock className="mr-1 text-tan" />
                          <span>{tour.duration}</span>
                        </div>
                      )}
                      {tour.groupSize && (
                        <div className="flex items-center text-sm text-gray-700">
                          <FaUsers className="mr-1 text-tan" />
                          <span>{tour.groupSize}</span>
                        </div>
                      )}
                      {tour.priceRange && (
                        <div className="flex items-center text-sm text-gray-700">
                          <FaTag className="mr-1 text-tan" />
                          <span>{tour.priceRange}</span>
                        </div>
                      )}
                      {tour.startingPoint && (
                        <div className="flex items-center text-sm text-gray-700">
                          <FaMapMarkerAlt className="mr-1 text-tan" />
                          <span>{tour.startingPoint}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Tour Content Based on Type */}
                    {tour.isExternal ? (
                      // External Tour - Book Now Button
                      <div className="mt-auto">
                        <a 
                          href={tour.bookingUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block w-full mt-4"
                        >
                          <button className="w-full bg-tan text-cream py-3 rounded-lg hover:bg-gold transition duration-200">
                            Book Now
                          </button>
                        </a>
                      </div>
                    ) : (
                      // Local Tour - Highlights, Included/Not Included, and Contact
                      <div className="space-y-3 flex-grow">
                        {tour.highlights && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-charcoal mb-1">Highlights:</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">{tour.highlights}</p>
                          </div>
                        )}

                        {/* Added: Display included/not included if available */}
                        <div className="grid grid-cols-1 gap-3">
                          {tour.included && (
                            <div>
                              <h4 className="text-sm font-medium text-charcoal mb-1 flex items-center">
                                <FaCheck className="text-green-500 mr-1" /> What's Included:
                              </h4>
                              <p className="text-sm text-gray-600 line-clamp-2">{tour.included}</p>
                            </div>
                          )}
                          
                          {tour.notIncluded && (
                            <div>
                              <h4 className="text-sm font-medium text-charcoal mb-1 flex items-center">
                                <FaTimes className="text-red-500 mr-1" /> What's Not Included:
                              </h4>
                              <p className="text-sm text-gray-600 line-clamp-2">{tour.notIncluded}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-auto pt-3 border-t border-gray-100">
                          <div className="flex justify-between text-sm">
                            <div>
                              <p className="font-medium text-charcoal mb-1">Contact:</p>
                              <p className="text-gray-600">{tour.contactPhone}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-charcoal mb-1">Email:</p>
                              <p className="text-gray-600">{tour.contactEmail}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-charcoal mb-2">No tours found</h3>
            <p className="text-gray-600">Try selecting a different tour type</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourPage;
