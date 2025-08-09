import React, { useState } from 'react';
import { FaCreditCard, FaTimes, FaLock, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import api from '../../utils/api';
import { redirectToPayhere } from '../../utils/paymentUtils';

const PaymentModal = ({ isOpen, onClose, serviceType, amount, description, itemId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handlePayherePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/payments/payhere/create-checkout', {
        serviceType,
        amount,
        description,
        itemId
      });
      
      // Redirect to PayHere using the utility function
      redirectToPayhere(response.data);
      
    } catch (error) {
      console.error('Payment initialization failed:', error);
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
          <p className="text-sm text-gray-500 mt-1">Secure payment via PayHere</p>
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
          onClick={handlePayherePayment}
          disabled={loading}
          className={`w-full bg-tan text-white py-3 rounded-lg flex items-center justify-center ${
            loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gold'
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
              Pay with PayHere
            </>
          )}
        </button>
        
        {/* Security badges */}
        <div className="flex justify-center items-center space-x-4 mb-4">
          <div className="flex items-center text-gray-500 text-xs">
            <FaLock className="mr-1 text-green-600" />
            <span>Secure Checkout</span>
          </div>
          <div className="flex items-center text-gray-500 text-xs">
            <FaShieldAlt className="mr-1 text-blue-600" />
            <span>PCI Compliant</span>
          </div>
        </div>
        
        {/* Payment information and compliance notice */}
        <div className="mt-2 text-center text-xs text-gray-500 border-t border-gray-100 pt-4">
          <div className="mb-3 bg-blue-50 p-3 rounded-lg text-blue-700 flex">
            <FaInfoCircle className="mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-left">You'll be redirected to PayHere's secure payment page to complete your transaction.</p>
          </div>
          
          <div className="space-y-2 text-left text-gray-600">
            <p>
              <strong>Email:</strong> slexplora@hotmail.com
            </p>
            
            <p className="font-medium mt-3">Payment Terms:</p>
            <ul className="list-disc list-inside">
              <li>All payments are processed in LKR (Sri Lankan Rupees)</li>
              <li>International cards may incur conversion fees from your bank</li>
              <li>Your payment information is protected with industry-standard encryption</li>
              <li>Transaction data is retained for 7 years for accounting purposes</li>
              <li>No full card details are stored on our servers</li>
            </ul>
            
            <p className="mt-3">
              By proceeding, you agree to our <a href="/terms-of-service" className="text-tan hover:underline" target="_blank">Terms of Service</a> and <a href="/privacy-policy" className="text-tan hover:underline" target="_blank">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;