import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from '../../utils/api';
import { ClipLoader } from "react-spinners";

const DestinationDetails = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4f46e5" size={50} />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="text-center mt-10 text-red-600 text-lg">
        Destination not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        {destination.name}
      </h1>

      <img
        src={destination.image}
        alt={destination.name}
        className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
      />

      <p className="text-gray-700 text-lg leading-relaxed mb-4">
        {destination.description}
      </p>

      {destination.source && (
        <p className="text-blue-600 hover:underline">
          <a href={destination.source} target="_blank" rel="noopener noreferrer">
            Click here to learn more about the destination →
          </a>
        </p>
      )}
    </div>
  );
};

export default DestinationDetails;
