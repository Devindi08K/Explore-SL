import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Admin Dashboard
        </h1>
        
        <div className="space-y-4">
          <Link 
            to="/admin/destinations" 
            className="block text-xl text-center text-white bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition duration-200">
            Manage Destinations
          </Link>
          
          <Link 
            to="/admin/bookings" 
            className="block text-xl text-center text-white bg-green-600 hover:bg-green-700 py-2 rounded-lg transition duration-200">
            View Bookings
          </Link>
          
          <Link 
            to="/admin/reviews" 
            className="block text-xl text-center text-white bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition duration-200">
            Manage Reviews
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
