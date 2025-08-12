import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'; // Add this import
import api from '../../utils/api';
import { FaRegClock, FaUsers, FaMapMarkerAlt, FaTag, FaCheck, FaTimes, FaPlusCircle, FaMap, FaRoute } from 'react-icons/fa'; // Add FaPlusCircle and FaRoute

const TourPage = () => {
  const [tours, setTours] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state
  const [showScrollButton, setShowScrollButton] = useState(false); // Add scroll button state

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

  // Scroll detection effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Title section with button positioned in top-left */}
        <div className="mb-8">
          <div className="flex flex-col mb-6">
            <h1 className="text-4xl font-bold text-charcoal text-center mb-2">
              Explore Our Tours
            </h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto">
              Discover the beauty of Sri Lanka with our carefully curated tours led by experienced guides
            </p>
          </div>
          
          <div className="flex justify-start">
            <Link 
              to="/partnership#tour-partnership" 
              className="bg-tan text-cream px-6 py-3 rounded-lg hover:bg-gold transition duration-300 shadow-md flex items-center"
            >
              <FaPlusCircle className="mr-2" />
              Register Your Tour
            </Link>
          </div>
        </div>
        
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
            
            <div className="flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => setSelectedType("all")}
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium ${
                  selectedType === "all" 
                    ? "bg-tan text-cream" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                All Tours
              </button>
              <button 
                onClick={() => setSelectedType("external")}
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium ${
                  selectedType === "external" 
                    ? "bg-tan text-cream" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Direct Booking
              </button>
              <button 
                onClick={() => setSelectedType("local")}
                className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium ${
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
          <div className="space-y-6">
            {filteredTours.map((tour) => {
              const tourType = getTourTypeTag(tour.isExternal);
              
              return (
                <div key={tour._id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row h-full hover:shadow-xl transition-shadow duration-300">
                  {/* Image Section with Tag - Smaller on desktop */}
                  <div className="relative md:w-1/3 flex-shrink-0">
                    <img
                      src={tour.image && tour.image.startsWith('http') 
                        ? tour.image 
                        : `${import.meta.env.VITE_BACKEND_URL}/${tour.image?.replace(/\\/g, '/')}`}
                      alt={tour.name}
                      className="w-full h-56 md:h-full object-cover"
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
                  
                  {/* Content Section - More space on desktop */}
                  <div className="p-6 flex flex-col flex-grow md:w-2/3">
                    {/* Tour Title and Basic Info */}
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-charcoal mb-2">{tour.name}</h3>
                      <p className="text-gray-600 mb-4 text-sm">{tour.description}</p>
                    </div>
                    
                    {/* Tour Details */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
                      {tour.type && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded-full">
                          <FaMap className="mr-1 text-tan" />
                          <span>{tour.type}</span>
                        </div>
                      )}
                      {tour.duration && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded-full">
                          <FaRegClock className="mr-1 text-tan" />
                          <span>{tour.duration}</span>
                        </div>
                      )}
                      {tour.groupSize && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded-full">
                          <FaUsers className="mr-1 text-tan" />
                          <span>{tour.groupSize}</span>
                        </div>
                      )}
                      {tour.priceRange && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded-full">
                          <FaTag className="mr-1 text-tan" />
                          <span>{tour.priceRange}</span>
                        </div>
                      )}
                      {tour.location && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded-full">
                          <FaMapMarkerAlt className="mr-1 text-gold" />
                          <span>{tour.location}</span>
                        </div>
                      )}
                      {tour.startingPoint && tour.startingPoint !== tour.location && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded-full">
                          <FaMapMarkerAlt className="mr-1 text-tan" />
                          <span>{tour.startingPoint}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Tour Content Based on Type */}
                    <div className="flex-grow">
                      {tour.isExternal ? (
                        // External Tour - Book Now Button
                        <div className="mt-auto">
                          <a 
                            href={tour.bookingUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block md:w-auto md:inline-block mt-4"
                          >
                            <button className="w-full md:w-auto px-8 bg-tan text-cream py-3 rounded-lg hover:bg-gold transition duration-200">
                              Book Now
                            </button>
                          </a>
                        </div>
                      ) : (
                        // Local Tour - Highlights, Included/Not Included, and Contact
                        <div className="space-y-3 flex-grow">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              {tour.highlights && (
                                <div className="mb-3">
                                  <h4 className="text-sm font-medium text-charcoal mb-1">Highlights:</h4>
                                  <p className="text-sm text-gray-600 line-clamp-2">{tour.highlights}</p>
                                </div>
                              )}
                              
                              {tour.included && (
                                <div>
                                  <h4 className="text-sm font-medium text-charcoal mb-1 flex items-center">
                                    <FaCheck className="text-green-500 mr-1" /> What's Included:
                                  </h4>
                                  <p className="text-sm text-gray-600 line-clamp-2">{tour.included}</p>
                                </div>
                              )}
                            </div>
                            
                            <div>
                              {tour.notIncluded && (
                                <div className="mb-3">
                                  <h4 className="text-sm font-medium text-charcoal mb-1 flex items-center">
                                    <FaTimes className="text-red-500 mr-1" /> What's Not Included:
                                  </h4>
                                  <p className="text-sm text-gray-600 line-clamp-2">{tour.notIncluded}</p>
                                </div>
                              )}
                              
                              <div className="mt-2">
                                <h4 className="text-sm font-medium text-charcoal mb-1">Contact:</h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <p className="text-gray-600">📞 {tour.contactPhone}</p>
                                  <p className="text-gray-600">✉️ {tour.contactEmail}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
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

        {/* Special Section for Tour Operators - Added */}
        {!loading && filteredTours.length === 0 && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg p-6 mb-8 shadow-md">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6">
                <div className="bg-white text-amber-600 rounded-full w-16 h-16 flex items-center justify-center mb-2 mx-auto md:mx-0">
                  <FaRoute className="text-3xl" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">Be the First Tour Operator on SLExplora! 🌄</h3>
                <p className="mb-4">List your tours early and gain prominence as we grow our user base!</p>
                <Link 
                  to="/partnership#tour-partnership" 
                  className="inline-block bg-white text-amber-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow-md font-medium"
                >
                  Register Your Tour
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Scroll to Top Button - Added */}
        {showScrollButton && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 bg-tan text-cream p-3 rounded-full shadow-lg hover:bg-gold transition-colors z-10"
            aria-label="Scroll to top"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default TourPage;
