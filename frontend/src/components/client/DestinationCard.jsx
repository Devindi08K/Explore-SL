import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

const DestinationCard = ({ _id, name, image, district, category }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Image container with fallback and overlay */}
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-52 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder.png";
          }}
        />
        
        {/* Category tag */}
        {category && (
          <span className="absolute top-4 right-4 bg-white/90 text-charcoal text-xs px-3 py-1 rounded-full font-medium shadow-md">
            {category}
          </span>
        )}
      </div>

      {/* Content section */}
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-charcoal mb-2 line-clamp-2">{name}</h2>
        
        {/* District with icon */}
        <p className="flex items-center text-sm text-tan mb-3">
          <FaMapMarkerAlt className="mr-1 flex-shrink-0" />
          <span>{district}</span>
        </p>
        
        {/* CTA button - Adjusted margin-top to auto to fill space */}
        <div className="mt-auto">
          <Link 
            to={`/destination/${_id}`}
            className="inline-flex items-center justify-center w-full bg-tan text-cream py-2.5 px-4 rounded-lg hover:bg-gold transition duration-200 font-medium"
          >
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
