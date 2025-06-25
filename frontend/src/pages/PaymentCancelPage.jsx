import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancelPage = () => {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-100 rounded-full p-3">
            <svg className="h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-charcoal mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment process was cancelled. No charges have been made to your account.
        </p>
        <div className="space-y-3">
          <Link to="/" className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Return to Home
          </Link>
          <Link to="/partnership" className="block w-full py-3 bg-tan text-cream rounded-lg hover:bg-gold transition-colors">
            View Partnership Options
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;