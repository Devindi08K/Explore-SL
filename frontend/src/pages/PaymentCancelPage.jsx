import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentCancel = () => {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
        <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Payment Cancelled</h2>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made to your account.
        </p>
        <div className="space-y-4">
          <Link to="/partnership" className="bg-tan text-white px-6 py-2 rounded-lg inline-block hover:bg-gold transition">
            Return to Partnership Page
          </Link>
          <div className="pt-4">
            <Link to="/" className="text-tan hover:text-gold">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;