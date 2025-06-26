import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaTimes, FaStripe } from 'react-icons/fa';
import api from '../../utils/api';

const PaymentModal = ({ isOpen, onClose, serviceType, amount, description, itemId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleStripePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get customer info from localStorage if available
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await api.post('/payments/stripe/create-checkout', {
        serviceType,
        amount,
        description,
        itemId,
        customerName: user.userName || '',
        customerEmail: user.email || '',
        customerPhone: ''
      });
      
      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Stripe payment initialization failed:', error);
      setError('Failed to initialize payment. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
        
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-tan/10 flex items-center justify-center rounded-full mb-4">
            <FaCreditCard className="text-tan text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-charcoal">Complete Your Purchase</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium text-charcoal">{description}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2">
            <span className="font-medium">Total Amount:</span>
            <span className="font-bold text-tan">LKR {amount.toLocaleString()}</span>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <button
          onClick={handleStripePayment}
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center ${
            loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
          } transition mb-3`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <FaStripe className="mr-2 text-xl" /> Pay with Stripe
            </>
          )}
        </button>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>You'll be redirected to Stripe to complete the payment securely.</p>
          <p className="mt-1">Your information is protected with industry-standard encryption.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;