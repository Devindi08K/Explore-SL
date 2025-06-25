import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { checkPaymentStatus } from '../utils/paymentUtils';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [paymentDetails, setPaymentDetails] = useState(null);
  
  const orderId = searchParams.get('order_id');
  
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!orderId) {
          setStatus('failed');
          return;
        }
        
        const paymentData = await checkPaymentStatus(orderId);
        
        setPaymentDetails(paymentData);
        setStatus(paymentData.status === 'completed' ? 'success' : 'failed');
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('failed');
      }
    };
    
    verifyPayment();
  }, [orderId]);
  
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-tan"></div>
            </div>
            <h1 className="text-2xl font-bold text-charcoal mb-4">Verifying Your Payment</h1>
            <p className="text-gray-600">Please wait a moment while we confirm your payment...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-3">
                <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-charcoal mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your payment. Your transaction has been completed successfully.
              <br /><br />
              <span className="text-sm">
                Order ID: <span className="font-medium">{paymentDetails?.orderId}</span>
              </span>
            </p>
            <div className="space-y-3">
              <Link to="/profile?tab=payments" className="block w-full py-3 bg-tan text-cream rounded-lg hover:bg-gold transition-colors">
                View Payment History
              </Link>
              <Link to="/" className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Return to Home
              </Link>
            </div>
          </>
        )}
        
        {status === 'failed' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-3">
                <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-charcoal mb-4">Payment Verification Failed</h1>
            <p className="text-gray-600 mb-6">
              We couldn't confirm your payment at this time. If you believe this is an error, please contact our support team.
            </p>
            <div className="space-y-3">
              <Link to="/contact" className="block w-full py-3 bg-tan text-cream rounded-lg hover:bg-gold transition-colors">
                Contact Support
              </Link>
              <Link to="/" className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Return to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;