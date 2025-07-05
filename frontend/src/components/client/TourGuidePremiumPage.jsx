import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaSearch, FaArrowUp, FaMedal, FaChartLine } from 'react-icons/fa';
import PaymentModal from './PaymentModal';
import api from '../../utils/api';

const TourGuidePremiumPage = () => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({
    type: '',
    amount: 0,
    description: '',
    duration: ''
  });
  const [premiumStatus, setPremiumStatus] = useState(null);

  useEffect(() => {
    // This simplified logic matches the working VehiclePremiumPage.jsx
    api.get('/tour-guides/my-premium-status')
      .then(res => {
        console.log('Received premium status:', res.data);
        setPremiumStatus(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch premium status:', err);
        // Set a default state on error to prevent crashes
        setPremiumStatus({
          hasActivePremiumSubscription: false,
          activePlanType: null,
          premiumExpiry: null
        });
      });
  }, []);

  // For debugging: 
  useEffect(() => {
    console.log("Current premium status state:", premiumStatus);
    console.log("activePlanType value:", premiumStatus?.activePlanType);
    console.log("Monthly condition check:", premiumStatus?.activePlanType === 'monthly');
  }, [premiumStatus]);

  const handlePremiumPurchase = (type, amount, description, duration) => {
    setSelectedPlan({ type, amount, description, duration });
    setPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-charcoal">
            Tour Guide <span className="text-tan">Premium</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-600">
            Boost your visibility and attract more clients with our premium tour guide features.
          </p>
        </div>
        
        {/* Pricing Section - MOVED TO TOP */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-2 text-center">Premium Plans</h2>
          <p className="text-center text-gray-600 mb-8">Choose the plan that best fits your needs</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Free Plan - Full width on mobile */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-gray-50 flex flex-col sm:col-span-2 lg:col-span-1">
              <div className="mb-4">
                <h3 className="font-bold text-charcoal text-xl mb-2">Basic</h3>
                <div className="text-3xl font-bold text-charcoal mb-2">Free <span className="text-sm font-normal text-gray-500">forever</span></div>
                <p className="text-gray-600 text-sm">For new guides just starting out</p>
              </div>
              
              <ul className="mb-6 flex-grow space-y-2">
                <li className="flex items-start text-sm">
                  <svg className="h-5 w-5 text-tan mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Standard profile listing</span>
                </li>
                <li className="flex items-start text-sm">
                  <svg className="h-5 w-5 text-tan mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Basic contact info</span>
                </li>
                <li className="flex items-start text-sm">
                  <svg className="h-5 w-5 text-tan mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Standard search visibility</span>
                </li>
              </ul>
              
              <Link to="/tour-guide-registration" className="bg-gray-200 text-gray-700 py-2 px-4 rounded text-center hover:bg-gray-300 transition">
                Current Plan
              </Link>
            </div>
            
            {/* Monthly Premium Plan */}
            <div className="border-2 border-tan rounded-lg p-4 sm:p-6 bg-white flex flex-col relative">
              <div className="absolute top-0 right-0 bg-tan text-cream text-xs py-1 px-3 rounded-bl-lg rounded-tr-lg font-medium">
                POPULAR
              </div>
              <div className="mb-3">
                <h3 className="font-bold text-charcoal text-lg sm:text-xl mb-1">Premium</h3>
                <div className="text-2xl sm:text-3xl font-bold text-charcoal mb-1 sm:mb-2">LKR 500 <span className="text-xs sm:text-sm font-normal text-gray-500">/month</span></div>
                <p className="text-gray-600 text-xs sm:text-sm">First 2 months free!</p>
              </div>
              
              <ul className="mb-4 sm:mb-6 flex-grow space-y-1 sm:space-y-2">
                <li className="flex items-start text-xs sm:text-sm">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-tan mr-1 sm:mr-2 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Priority ranking in search</span>
                </li>
                <li className="flex items-start text-xs sm:text-sm">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-tan mr-1 sm:mr-2 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Premium badge on profile</span>
                </li>
                <li className="flex items-start text-xs sm:text-sm">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-tan mr-1 sm:mr-2 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Analytics dashboard</span>
                </li>
                <li className="flex items-start text-xs sm:text-sm">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-tan mr-1 sm:mr-2 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Featured on home page</span>
                </li>
              </ul>
              
              <button 
                onClick={() => handlePremiumPurchase('guide_premium_monthly', 500, 'Tour Guide Premium Monthly', 'monthly')}
                disabled={premiumStatus?.activePlanType === 'monthly' || premiumStatus?.activePlanType === 'yearly'}
                className={`w-full py-2 px-4 rounded text-center transition ${
                  premiumStatus?.activePlanType === 'monthly'
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : premiumStatus?.activePlanType === 'yearly'
                      ? 'bg-green-700 text-white cursor-not-allowed'
                      : 'bg-tan text-cream hover:bg-gold'
                }`}
              >
                {premiumStatus?.activePlanType === 'monthly'
                  ? 'Already Subscribed'
                  : premiumStatus?.activePlanType === 'yearly'
                    ? 'Annual Plan Active'
                    : 'Subscribe Now'}
              </button>
            </div>
            
            {/* Annual Premium Plan */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white flex flex-col">
              <div className="mb-4">
                <h3 className="font-bold text-charcoal text-xl mb-2">Annual Premium</h3>
                <div className="text-3xl font-bold text-charcoal mb-2">LKR 4,800 <span className="text-sm font-normal text-gray-500">/year</span></div>
                <p className="text-gray-600 text-sm">Save 20% + first 2 months free!</p>
              </div>
              
              <ul className="mb-6 flex-grow space-y-2">
                <li className="flex items-start text-sm">
                  <svg className="h-5 w-5 text-tan mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>All Premium features</span>
                </li>
                <li className="flex items-start text-sm">
                  <svg className="h-5 w-5 text-tan mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Homepage featured spot</span>
                </li>
                <li className="flex items-start text-sm">
                  <svg className="h-5 w-5 text-tan mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>20% savings vs monthly</span>
                </li>
              </ul>
              
              <button 
                onClick={() => handlePremiumPurchase('guide_premium_yearly', 4800, 'Tour Guide Premium Yearly', 'yearly')}
                disabled={premiumStatus?.activePlanType === 'yearly'}
                className={`w-full py-2 px-4 rounded text-center transition ${
                  premiumStatus?.activePlanType === 'yearly'
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : premiumStatus?.activePlanType === 'monthly'
                      ? 'bg-gold text-charcoal hover:bg-yellow-500'
                      : 'bg-tan/80 text-cream hover:bg-gold'
                }`}
              >
                {premiumStatus?.activePlanType === 'yearly'
                  ? 'Already Subscribed'
                  : premiumStatus?.activePlanType === 'monthly'
                    ? 'Upgrade to Annual'
                    : 'Subscribe Annually'}
              </button>
            </div>
          </div>

          <div className="mt-8 bg-gold/10 rounded-lg p-4 border border-gold/20">
            <p className="text-center font-medium text-sm">
              <span className="text-gold">🎉 Special Launch Offer:</span> First 2 months free with any premium plan subscription!
            </p>
          </div>
        </div>
        
        {/* Benefits Section - MOVED AFTER PRICING */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Upgrade to Premium?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-center p-6 border border-tan/20 rounded-lg bg-tan/5">
              <FaArrowUp className="text-3xl text-tan mx-auto mb-4" />
              <h3 className="font-semibold text-charcoal">Top Placement</h3>
              <p className="text-gray-600 text-sm mt-2">Your profile appears at the top of search results and guide listings</p>
            </div>
            
            <div className="text-center p-6 border border-tan/20 rounded-lg bg-tan/5">
              <FaMedal className="text-3xl text-tan mx-auto mb-4" />
              <h3 className="font-semibold text-charcoal">Premium Badge</h3>
              <p className="text-gray-600 text-sm mt-2">Stand out with an exclusive badge that builds trust with travelers</p>
            </div>
            
            <div className="text-center p-6 border border-tan/20 rounded-lg bg-tan/5">
              <FaChartLine className="text-3xl text-tan mx-auto mb-4" />
              <h3 className="font-semibold text-charcoal">Analytics Access</h3>
              <p className="text-gray-600 text-sm mt-2">Track your profile views, inquiries, and booking requests</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h3>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h4 className="font-semibold text-charcoal mb-2">When will I be charged after my free months?</h4>
              <p className="text-gray-600">Your first payment will be collected exactly 60 days after you sign up. We'll send you a reminder email 7 days before your free period ends.</p>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal mb-2">Can I cancel my premium subscription?</h4>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time from your profile dashboard. Your premium benefits will remain active until the end of your billing period.</p>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal mb-2">How much more visibility will I get as a premium guide?</h4>
              <p className="text-gray-600">On average, premium guides receive 4x more profile views and 3x more inquiries compared to basic listings. Your profile will appear at the top of search results and destination pages.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Modal */}
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

export default TourGuidePremiumPage;