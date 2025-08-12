import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowUp, FaMedal, FaChartLine, FaCheck } from 'react-icons/fa';
import PaymentModal from './PaymentModal';
import api from '../../utils/api';

const BusinessPremiumPage = () => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ type: '', amount: 0, description: '' });
  const [premiumStatus, setPremiumStatus] = useState(null);

  useEffect(() => {
    api.get('/affiliate-links/my-premium-status')
      .then(res => setPremiumStatus(res.data))
      .catch(err => {
        console.error('Failed to fetch business premium status:', err);
        setPremiumStatus({
          hasActivePremiumSubscription: false,
          activePlanType: null,
        });
      });
  }, []);

  const handlePremiumPurchase = (type, amount, description) => {
    setSelectedPlan({ type, amount, description });
    setPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-charcoal">
            Premium Business <span className="text-tan">Listings</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-600">
            Drive more customers to your business. Get priority placement, a verified badge, and access to analytics.
          </p>
        </div>

        {/* Payment Gateway Alert - ADD THIS */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-lg shadow-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">
                Payment Processing Temporarily Unavailable
              </h3>
              <div className="mt-2 text-yellow-700">
                <p>
                  Due to maintenance with our payment gateway, premium subscriptions are temporarily unavailable. 
                  Please continue with a free listing for now. We appreciate your understanding.
                </p>
                <p className="mt-3">
                  <Link to="/partnership/business-listing?tier=free" className="font-medium underline">
                    Continue with free business listing →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 opacity-50 pointer-events-none">
          {/* Existing pricing section - made unclickable */}
          <h2 className="text-2xl font-bold mb-2 text-center">Premium Plans</h2>
          <p className="text-center text-gray-600 mb-8">Choose the plan that best fits your business needs</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {/* Free Plan - Spans 2 columns on small screens */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6 flex flex-col bg-gray-50 sm:col-span-2 lg:col-span-1">
              <h3 className="font-bold text-charcoal text-xl mb-2">Basic Listing</h3>
              <div className="text-3xl font-bold text-charcoal mb-2">Free <span className="text-sm font-normal text-gray-500">forever</span></div>
              <ul className="mb-6 flex-grow space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><FaCheck className="text-tan mr-2" /> Basic Business Profile</li>
                <li className="flex items-center"><FaCheck className="text-tan mr-2" /> Contact Information</li>
                <li className="flex items-center"><FaCheck className="text-tan mr-2" /> Standard Listing</li>
              </ul>
              <Link to="/partnership/business-listing?tier=free" className="w-full py-2 px-4 rounded text-center transition bg-gray-200 text-gray-700 hover:bg-gray-300">
                Get Started
              </Link>
            </div>

            {/* Monthly Premium Plan */}
            <div className="border-2 border-tan rounded-lg p-4 sm:p-6 flex flex-col relative">
              <div className="absolute top-0 right-0 bg-tan text-cream text-xs py-1 px-3 rounded-bl-lg rounded-tr-lg font-medium">POPULAR</div>
              <h3 className="font-bold text-charcoal text-lg sm:text-xl mb-1 sm:mb-2">Monthly Premium</h3>
              <div className="text-2xl sm:text-3xl font-bold text-charcoal mb-1 sm:mb-2">LKR 1,500 <span className="text-xs sm:text-sm font-normal text-gray-500">/month</span></div>
              <ul className="mb-4 sm:mb-6 flex-grow space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-center"><FaMedal className="text-tan mr-2 flex-shrink-0" /> Premium Badge</li>
                <li className="flex items-center"><FaArrowUp className="text-tan mr-2 flex-shrink-0" /> Priority Placement</li>
                <li className="flex items-center"><FaChartLine className="text-tan mr-2 flex-shrink-0" /> Performance Analytics</li>
              </ul>
              <button
                onClick={() => handlePremiumPurchase('business_listing_monthly', 1500, 'Premium Business Listing (Monthly)')}
                disabled={premiumStatus?.activePlanType === 'monthly' || premiumStatus?.activePlanType === 'yearly'}
                className={`w-full py-2 px-4 rounded text-center transition ${
                  premiumStatus?.activePlanType === 'monthly' 
                    ? 'bg-green-600 text-white cursor-not-allowed' 
                    : premiumStatus?.activePlanType === 'yearly' 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-tan text-cream hover:bg-gold'
                }`}
              >
                {premiumStatus?.activePlanType === 'monthly' 
                  ? 'Plan Active' 
                  : premiumStatus?.activePlanType === 'yearly' 
                    ? 'Annual Plan Active' 
                    : 'Subscribe Monthly'}
              </button>
            </div>

            {/* Annual Plan */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6 flex flex-col">
              <h3 className="font-bold text-charcoal text-lg sm:text-xl mb-1 sm:mb-2">Annual Premium</h3>
              <div className="text-2xl sm:text-3xl font-bold text-charcoal mb-1 sm:mb-2">LKR 15,000 <span className="text-xs sm:text-sm font-normal text-gray-500">/year</span></div>
              <p className="text-xs sm:text-sm text-gray-600">Save 2 months!</p>
              <ul className="mb-4 sm:mb-6 flex-grow space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-center"><FaMedal className="text-tan mr-2 flex-shrink-0" /> Premium Badge</li>
                <li className="flex items-center"><FaArrowUp className="text-tan mr-2 flex-shrink-0" /> Priority Placement</li>
                <li className="flex items-center"><FaChartLine className="text-tan mr-2 flex-shrink-0" /> Performance Analytics</li>
              </ul>
              <button
                onClick={() => handlePremiumPurchase('business_listing_yearly', 15000, 'Premium Business Listing (Yearly)')}
                disabled={premiumStatus?.activePlanType === 'yearly'}
                className={`w-full py-2 px-4 rounded text-center transition ${
                  premiumStatus?.activePlanType === 'yearly' 
                    ? 'bg-green-600 text-white cursor-not-allowed' 
                    : premiumStatus?.activePlanType === 'monthly' 
                      ? 'bg-gold text-charcoal hover:bg-yellow-500' 
                      : 'bg-tan text-cream hover:bg-gold'
                }`}
              >
                {premiumStatus?.activePlanType === 'yearly' 
                  ? 'Plan Active' 
                  : premiumStatus?.activePlanType === 'monthly' 
                    ? 'Upgrade to Annual' 
                    : 'Subscribe Annually'}
              </button>
            </div>
          </div>
        </div>

        {/* Benefits Section - MOVED AFTER PRICING */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Premium Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-center p-6 border border-tan/20 rounded-lg bg-tan/5">
              <FaArrowUp className="text-3xl text-tan mx-auto mb-4" />
              <h3 className="font-semibold text-charcoal">Top Placement</h3>
              <p className="text-gray-600 text-sm mt-2">Your business appears at the top of relevant search results and pages.</p>
            </div>
            <div className="text-center p-6 border border-tan/20 rounded-lg bg-tan/5">
              <FaMedal className="text-3xl text-tan mx-auto mb-4" />
              <h3 className="font-semibold text-charcoal">Premium Badge</h3>
              <p className="text-gray-600 text-sm mt-2">Stand out with an exclusive badge that builds customer trust.</p>
            </div>
            <div className="text-center p-6 border border-tan/20 rounded-lg bg-tan/5">
              <FaChartLine className="text-3xl text-tan mx-auto mb-4" />
              <h3 className="font-semibold text-charcoal">Analytics Access</h3>
              <p className="text-gray-600 text-sm mt-2">Track your listing views and clicks to understand your audience.</p>
            </div>
          </div>
        </div>
      </div>
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        serviceType={selectedPlan.type}
        amount={selectedPlan.amount}
        description={selectedPlan.description}
      />
    </div>
  );
};

export default BusinessPremiumPage;