import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaArrowUp, FaMedal, FaChartLine, FaCrown, FaEye, FaEnvelope } from 'react-icons/fa';
import PaymentModal from './PaymentModal';
import api from '../../utils/api';

const VehiclePremiumPage = () => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({
    type: '',
    amount: 0,
    description: '',
    duration: ''
  });
  const [premiumStatus, setPremiumStatus] = useState(null);

  useEffect(() => {
    api.get('/vehicles/my-premium-status')
      .then(res => setPremiumStatus(res.data))
      .catch(err => {
        console.error('Failed to fetch vehicle premium status:', err);
        setPremiumStatus({
          hasActivePremiumSubscription: false,
          activePlanType: null,
        });
      });
  }, []);

  const handlePremiumPurchase = (type, amount, description, duration) => {
    setSelectedPlan({ type, amount, description, duration });
    setPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-charcoal">
            Premium Vehicle <span className="text-tan">Listings</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-600">
            Get more bookings and stand out from the competition with our premium vehicle features.
          </p>
        </div>

        {/* Pricing Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-2 text-center">Premium Plans</h2>
          <p className="text-center text-gray-600 mb-8">Choose the plan that works for your business</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 flex flex-col">
              <div className="mb-4">
                <h3 className="font-bold text-charcoal text-xl mb-2">Basic</h3>
                <div className="text-3xl font-bold text-charcoal mb-2">Free <span className="text-sm font-normal text-gray-500">forever</span></div>
                <p className="text-gray-600 text-sm">For vehicle owners just starting out</p>
              </div>
              
              <ul className="mb-6 flex-grow space-y-2">
                <li className="flex items-start text-sm">
                  <svg className="h-5 w-5 text-tan mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Standard vehicle listing</span>
                </li>
                <li className="flex items-start text-sm">
                  <svg className="h-5 w-5 text-tan mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Basic contact information</span>
                </li>
                <li className="flex items-start text-sm">
                  <svg className="h-5 w-5 text-tan mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>1 photo only</span> {/* Changed from "Up to 3 photos" */}
                </li>
              </ul>
              
              <Link to="/vehicle-registration" className="bg-gray-200 text-gray-700 py-2 px-4 rounded text-center hover:bg-gray-300 transition">
                Current Plan
              </Link>
            </div>
            
            {/* Plus Plan - Highlighted as Best Value */}
            <div className="border-2 border-tan rounded-lg p-6 bg-white flex flex-col relative">
              <div className="absolute top-0 right-0 bg-tan text-cream text-xs py-1 px-3 rounded-bl-lg rounded-tr-lg font-medium">
                MOST POPULAR
              </div>
              <div className="mb-4">
                <h3 className="font-bold text-charcoal text-xl mb-2">Premium</h3>
                <div className="text-3xl font-bold text-charcoal mb-2">LKR 500 <span className="text-sm font-normal text-gray-500">/month</span></div>
                <p className="text-gray-600 text-sm">First 2 months free!</p>
              </div>
              
              <ul className="mb-6 flex-grow space-y-2">
                <li className="flex items-start text-sm">
                  <svg className="h-5 w-5 text-tan mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Premium badge on vehicle listing</span>
                </li>
                <li className="flex items-start text-sm">
                  <svg className="h-5 w-5 text-tan mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Priority placement in search results</span>
                </li>
                <li className="flex items-start text-sm">
                  <svg className="h-5 w-5 text-tan mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Up to 3 high-quality photos</span>
                </li>
                <li className="flex items-start text-sm">
                  <svg className="h-5 w-5 text-tan mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Performance analytics</span>
                </li>
              </ul>
              
              <button 
                onClick={() => handlePremiumPurchase('vehicle_premium_monthly', 500, 'Vehicle Premium Monthly', 'monthly')}
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
            
            {/* Pro Plan */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white flex flex-col">
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
                  <span>Homepage featured spot rotation</span>
                </li>
                <li className="flex items-start text-sm">
                  <svg className="h-5 w-5 text-tan mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Featured in destination guides</span>
                </li>
                <li className="flex items-start text-sm">
                  <svg className="h-5 w-5 text-tan mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>20% savings vs monthly</span>
                </li>
              </ul>
              
              <button 
                onClick={() => handlePremiumPurchase('vehicle_premium_yearly', 4800, 'Vehicle Premium Yearly', 'yearly')}
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

        {/* Benefits Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Premium Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-center p-6 border border-tan/20 rounded-lg bg-tan/5">
              <FaArrowUp className="text-3xl text-tan mx-auto mb-4" />
              <h3 className="font-semibold text-charcoal">Priority Placement</h3>
              <p className="text-gray-600 text-sm mt-2">Your vehicles appear at the top of search results and category pages</p>
            </div>
            
            <div className="text-center p-6 border border-tan/20 rounded-lg bg-tan/5">
              <FaMedal className="text-3xl text-tan mx-auto mb-4" />
              <h3 className="font-semibold text-charcoal">Premium Badge</h3>
              <p className="text-gray-600 text-sm mt-2">Stand out with a verified premium badge that builds trust</p>
            </div>
            
            <div className="text-center p-6 border border-tan/20 rounded-lg bg-tan/5">
              <FaChartLine className="text-3xl text-tan mx-auto mb-4" />
              <h3 className="font-semibold text-charcoal">Performance Analytics</h3>
              <p className="text-gray-600 text-sm mt-2">Track views and monitor your listing performance</p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-tan/5 border border-tan/20 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-tan mb-3">🚗 How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-charcoal mb-2">Option 1: Vehicle First (Recommended)</h4>
              <ol className="text-gray-700 space-y-1">
                <li>1️⃣ Register your vehicle(s) first</li>
                <li>2️⃣ Purchase premium subscription</li>
                <li>3️⃣ Your vehicles get instant premium upgrade</li>
              </ol>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-charcoal mb-2">Option 2: Premium First</h4>
              <ol className="text-gray-700 space-y-1">
                <li>1️⃣ Purchase premium subscription</li>
                <li>2️⃣ Register your vehicle(s)</li>
                <li>3️⃣ Vehicles automatically get premium features</li>
              </ol>
            </div>
          </div>
          <p className="text-tan text-sm mt-3">
            💡 <strong>Tip:</strong> Both options work perfectly! Your premium benefits will apply to all vehicles you register.
          </p>
        </div>

        {/* Stats/Testimonial Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Upgrade?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center mb-8">
            <div className="p-6">
              <div className="text-3xl font-bold text-tan mb-2">3.5x</div>
              <p className="text-gray-600">More visibility for premium vehicles</p>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-tan mb-2">78%</div>
              <p className="text-gray-600">Of travelers prefer premium verified vehicles</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-600 italic">"Since upgrading to a premium listing, we've seen a dramatic increase in bookings. The premium badge adds credibility, and the priority placement means more people find our vehicles."</p>
            
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

const VehiclePremiumDetails = ({ vehicle }) => {
  if (!vehicle.isPremium) return null;
  return (
    <div className="mt-3 space-y-3">
      <div className="p-3 bg-gradient-to-r from-gold/10 to-tan/10 border border-gold/20 rounded-lg">
        <div className="flex items-center mb-2">
          <FaCrown className="text-gold mr-2 text-sm" />
          <span className="text-sm font-semibold text-charcoal">Premium Features Active</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center text-green-600">
            <FaEye className="mr-1" />
            <span>Total Views: {vehicle.viewCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclePremiumPage;