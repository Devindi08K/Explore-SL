import React from "react";
import { Link } from "react-router-dom";

const DestinationCard = ({ name, description, image, district }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold text-charcoal mb-2">{name}</h2>
        <p className="text-sm text-gold mb-2">
          <span className="font-medium">District:</span> {district}
        </p>
        <p className="text-gray-600 text-sm">
          {description.length > 150 
            ? `${description.substring(0, 150)}...` 
            : description}
        </p>
      </div>
    </div>
  );
};

export default DestinationCard;
