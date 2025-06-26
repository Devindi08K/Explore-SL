import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { FaCheckCircle, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasVehicles, setHasVehicles] = useState(false);
  
  const orderId = searchParams.get('orderId');
  const sessionId = searchParams.get('session_id');
  
  const checkPaymentStatus = async (retryAttempt = 0) => {
    try {
      if (!orderId) {
        setError('Missing order information');
        setLoading(false);
        return;
      }
      
      console.log(`Checking payment status (attempt ${retryAttempt + 1})...`);
      const response = await api.get(`/payments/stripe/status/${orderId}`);
      const paymentData = response.data;
      
      setPayment(paymentData);
      
      // If payment is still pending and we haven't retried too many times, retry
      if (paymentData.status === 'pending' && retryAttempt < 3) {
        console.log('Payment still pending, retrying in 3 seconds...');
        setTimeout(() => {
          setRetryCount(retryAttempt + 1);
          checkPaymentStatus(retryAttempt + 1);
        }, 3000);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      if (retryAttempt < 2) {
        setTimeout(() => {
          setRetryCount(retryAttempt + 1);
          checkPaymentStatus(retryAttempt + 1);
        }, 2000);
      } else {
        setError('Failed to verify payment status');
        setLoading(false);
      }
    }
  };

  const checkUserVehicles = async () => {
    try {
      const response = await api.get('/vehicles/my-submissions');
      setHasVehicles(response.data.length > 0);
    } catch (error) {
      console.error('Error checking vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait a moment before first check to allow webhook processing
    setTimeout(() => {
      checkPaymentStatus(0);
    }, 2000);
    checkUserVehicles();
  }, [orderId]);
  
  const handleCompletePayment = async () => {
    if (!orderId) return;
    
    try {
      setLoading(true);
      console.log('Manually completing payment...');
      const response = await api.post(`/payments/test/complete/${orderId}`);
      if (response.data) {
        setPayment(response.data.payment);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error completing payment:', error);
      setError('Failed to complete payment');
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
          <FaSpinner className="animate-spin text-tan text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Processing Your Payment</h2>
          <p className="text-gray-600 mb-4">Please wait while we confirm your payment...</p>
          {retryCount > 0 && (
            <p className="text-sm text-gray-500">
              Verification attempt {retryCount + 1} of 4
            </p>
          )}
        </div>
      </div>
    );
  }
  
  if (error || !payment) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
          <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Payment Verification Failed</h2>
          <p className="text-gray-600 mb-6">{error || 'There was an issue confirming your payment. Please contact support.'}</p>
          <div className="flex flex-col space-y-3">
            <Link to="/partnership" className="bg-tan text-white px-6 py-3 rounded-lg inline-block hover:bg-gold transition">
              Return to Partnership Page
            </Link>
            <Link to="/profile?tab=payments" className="text-tan hover:text-gold">
              Check Payment History
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <div className="text-center mb-6">
          {payment.status === 'completed' ? (
            <>
              <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2 text-green-600">Payment Successful!</h2>
              <p className="text-gray-600">Thank you for your purchase.</p>
            </>
          ) : (
            <>
              <FaExclamationTriangle className="text-yellow-500 text-6xl mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2 text-yellow-600">Payment Pending</h2>
              <p className="text-gray-600">Your payment is being processed.</p>
            </>
          )}
        </div>
        
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="font-semibold mb-4 text-lg">Payment Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono text-sm">{payment.orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium">{payment.description}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-lg">LKR {payment.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Date:</span>
              <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        {payment && payment.status === 'pending' && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-3">
              <FaExclamationTriangle className="text-yellow-600 mt-1" />
              <div>
                <p className="text-yellow-800 text-sm font-medium mb-2">
                  Payment is still processing
                </p>
                <p className="text-yellow-700 text-sm mb-3">
                  This might be due to webhook processing delays. You can try completing it manually or wait a few more minutes.
                </p>
                <button
                  onClick={handleCompletePayment}
                  className="bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700 transition"
                >
                  Complete Payment Manually
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex flex-col space-y-3">
          <Link to="/profile?tab=payments" className="bg-tan text-white px-6 py-3 rounded-lg text-center hover:bg-gold transition font-medium">
            View Payment History
          </Link>
          <Link to="/" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-center hover:bg-gray-50 transition">
            Return to Homepage
          </Link>
          {payment.status === 'completed' && (
            <Link to="/partnership" className="text-tan hover:text-gold text-center">
              Explore More Services
            </Link>
          )}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            {hasVehicles ? (
              <>
                <li>• All your registered vehicles have been upgraded to premium status</li>
                <li>• Enjoy priority placement and enhanced analytics</li>
              </>
            ) : (
              <>
                <li>• Register your vehicles to enjoy premium benefits</li>
                <li>• Your vehicles will automatically get premium features</li>
              </>
            )}
          </ul>
        </div>
        
        {!hasVehicles && payment.status === 'completed' && (
          <div className="mt-4">
            <Link 
              to="/vehicle-registration" 
              className="block bg-tan text-cream px-6 py-3 rounded-lg hover:bg-gold transition font-medium text-center"
            >
              Register Your First Vehicle
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;