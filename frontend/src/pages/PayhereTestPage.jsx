import React, { useState } from 'react';
import api from '../utils/api';
import { redirectToPayhere } from '../utils/paymentUtils';

const PayhereTestPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(100);
  
  const handleTestPayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/payments/payhere/create-checkout', {
        serviceType: 'test_payment',
        amount,
        description: 'Test Payment',
      });
      
      redirectToPayhere(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to initialize payment');
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">PayHere Test Payment</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Test Amount (LKR)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tan"
            min="1"
          />
        </div>
        
        <button
          onClick={handleTestPayment}
          disabled={loading}
          className={`w-full bg-tan text-white py-3 rounded-lg text-center ${
            loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gold'
          } transition`}
        >
          {loading ? 'Processing...' : 'Test PayHere Payment'}
        </button>
        
        <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <p className="font-medium mb-2">Testing Instructions:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>This will redirect you to the PayHere sandbox environment</li>
            <li>Use the following test card: 4916217501611292</li>
            <li>Any future date for expiry, any 3 digits for CVV</li>
            <li>For OTP, use 123456</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PayhereTestPage;