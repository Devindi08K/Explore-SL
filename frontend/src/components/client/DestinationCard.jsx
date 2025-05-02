import React from "react";
import { Link } from "react-router-dom";

const DestinationCard = ({ _id, name, image, description }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition duration-300 ease-in-out">
            <img
                src={image}
                alt={name}
                className="w-full h-52 object-cover"
            />
            <div className="p-4">
                <h5 className="text-xl font-semibold text-tan mb-2">{name}</h5>
                <p className="text-charcoal mb-3">
                    {description.length > 100 ? `${description.substring(0, 100)}...` : description}
                </p>
                <Link
                    to={`/destination/${_id}`}
                    className="inline-block px-4 py-2 bg-tan text-cream rounded hover:bg-gold hover:text-charcoal transition"
                >
                    View More
                </Link>
            </div>
        </div>
    );
};

export default DestinationCard;
