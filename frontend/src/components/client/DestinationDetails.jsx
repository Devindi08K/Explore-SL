import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from '../../utils/api';
import { ClipLoader } from "react-spinners";
import { FaMapMarkerAlt, FaInfoCircle, FaArrowLeft } from "react-icons/fa";

const DestinationDetails = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await api.get(`/destinations/${id}`);
        setDestination(response.data);
      } catch (error) {
        console.error("Error fetching destination details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-cream">
        <ClipLoader color="#B1843F" size={50} /> {/* Use tan color */}
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-cream px-4 py-16 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <FaInfoCircle className="mx-auto text-tan text-4xl mb-4" />
          <h2 className="text-2xl font-bold text-charcoal mb-2">Destination Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the destination you're looking for.</p>
          <Link 
            to="/destinations" 
            className="bg-tan hover:bg-gold text-cream px-4 py-2 rounded-lg transition-colors inline-flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  // Handle multiple images if they exist
  const images = Array.isArray(destination.images) ? destination.images : 
                (destination.image ? [destination.image] : []);

  return (
    <div className="min-h-screen bg-cream px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <Link 
          to="/destinations" 
          className="inline-flex items-center text-tan hover:text-gold mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Destinations
        </Link>

        {/* Hero section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative">
            {images.length > 0 ? (
              <>
                <img
                  src={images[activeImage]}
                  alt={destination.name}
                  className="w-full h-80 sm:h-96 object-cover"
                />
                
                {/* Image navigation if multiple images */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <div className="flex space-x-2 bg-black/30 rounded-full px-3 py-1">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImage(index)}
                          className={`w-2.5 h-2.5 rounded-full ${
                            activeImage === index ? "bg-white" : "bg-white/50"
                          }`}
                          aria-label={`View image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-80 sm:h-96 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-charcoal">{destination.name}</h1>
              
              {destination.district && (
                <div className="flex items-center mt-2 md:mt-0">
                  <FaMapMarkerAlt className="text-tan mr-2" />
                  <span className="text-gray-600">{destination.district}</span>
                </div>
              )}
            </div>

            {destination.summary && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-charcoal mb-2">Overview</h3>
                <p className="text-gray-700 leading-relaxed italic">
                  {destination.summary}
                </p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-charcoal mb-2">Description</h3>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="leading-relaxed">{destination.description}</p>
              </div>
            </div>

            {destination.activities && destination.activities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-charcoal mb-3">Activities</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {destination.activities.map((activity, index) => (
                    <li key={index} className="flex items-center bg-cream/50 p-3 rounded-md">
                      <span className="w-2 h-2 bg-tan rounded-full mr-3" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {destination.bestTimeToVisit && (
              <div className="bg-cream/30 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-charcoal mb-2">
                  Best Time to Visit
                </h3>
                <p className="text-gray-700">{destination.bestTimeToVisit}</p>
              </div>
            )}

            {destination.source && (
              <div className="border-t border-gray-100 pt-4 mt-6">
                <a 
                  href={destination.source} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-tan hover:text-gold transition-colors"
                >
                  Learn more about this destination
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Nearby attractions - conditionally rendered if available */}
        {destination.nearbyAttractions && destination.nearbyAttractions.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-semibold text-charcoal mb-4">Nearby Attractions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {destination.nearbyAttractions.map((attraction, index) => (
                <div key={index} className="bg-cream/30 p-4 rounded-lg">
                  <h4 className="font-medium text-charcoal mb-1">{attraction.name}</h4>
                  <p className="text-sm text-gray-600">{attraction.description}</p>
                  {attraction.distance && (
                    <div className="mt-2 text-sm text-tan">{attraction.distance} away</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map section - if coordinates are available */}
        {destination.coordinates && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <h3 className="text-xl font-semibold text-charcoal p-6 border-b border-gray-100">Location</h3>
            <div className="h-[400px]">
              <iframe
                src={`https://maps.google.com/maps?q=${destination.coordinates.lat},${destination.coordinates.lng}&z=12&output=embed`}
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
                title={`Map of ${destination.name}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationDetails;
