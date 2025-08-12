import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPencilAlt, FaBuilding, FaRoute, FaArrowRight, FaCheck, FaStar, FaHandshake, FaRocket } from 'react-icons/fa';
import PaymentModal from './PaymentModal';

const PartnershipPage = () => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState({
    type: '',
    amount: 0,
    description: '',
    itemId: null
  });

  const handlePaymentClick = (type, amount, description, itemId = null) => {
    setSelectedService({ type, amount, description, itemId });
    setPaymentModalOpen(true);
  };

  useEffect(() => {
    // Check if there's a hash in the URL
    if (window.location.hash) {
      // Get the element by the hash without the #
      const element = document.getElementById(window.location.hash.substring(1));
      
      // If the element exists, scroll to it with a slight delay to ensure page is fully loaded
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  // Add this component to show at the top of the page
  const PaymentGatewayAlert = () => (
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
              All premium features are accessible as free listings for now. We appreciate your understanding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Add this announcement banner component
  const LaunchAnnouncement = () => (
    <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 mb-8 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row items-center">
        <div className="bg-white text-green-600 rounded-full w-20 h-20 flex items-center justify-center mb-4 md:mb-0 md:mr-6 mx-auto md:mx-0">
          <FaRocket className="text-4xl" />
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold mb-2">🎉 SLExplora is Now Officially Launched!</h3>
          <p className="mb-2 text-white/90 text-lg">Early partners enjoy premium visibility and positioning.</p>
          <p className="text-white/80">As we grow, early listings will build authority and establish presence before competition arrives.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-charcoal">
            Partner with <span className="text-tan">SLExplora</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-600">
            Expand your reach and grow your business by partnering with Sri Lanka's premier travel platform
          </p>
        </div>

        {/* Add the launch announcement banner */}
        <LaunchAnnouncement />

        {/* Add the payment gateway alert at the top */}
        <PaymentGatewayAlert />

        {/* Partnership Cards - modify to disable payment options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Blog Sponsorship */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:transform hover:scale-[1.02]">
            <div className="bg-tan h-2"></div>
            <div className="p-6">
              <div className="mb-4 flex justify-center">
                <div className="bg-tan/10 p-3 rounded-full">
                  <FaPencilAlt className="text-tan text-2xl" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-charcoal mb-4">Sponsored Blog Posts</h3>
              <div className="space-y-3 mb-6">
                <p className="text-center text-gray-600">Share your travel experiences with our engaged audience.</p>
                
                <div className="border-t border-b border-gray-100 py-4 my-6">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-tan mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Professional blog post creation</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-tan mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Social media promotion</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-tan mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Permanent placement on our platform</span>
                    </li>
                  </ul>
                </div>
                
                <p className="text-center font-bold text-tan text-lg">LKR 700 per post</p>
              </div>
              
              <div className="flex space-x-3 mt-6">
                {/* Replace this button with a free submission link */}
                <Link 
                  to="/submit-sponsored-blog"
                  className="flex-1 flex justify-center items-center bg-tan text-cream py-3 px-4 rounded-md hover:bg-gold transition duration-200"
                >
                  Submit Free Blog
                </Link>
              </div>
            </div>
          </div>

          {/* Business Listings */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:transform hover:scale-[1.02]">
            <div className="bg-tan h-2"></div>
            <div className="p-6 flex flex-col h-full">
              <div className="mb-4 flex justify-center">
                <div className="bg-tan/10 p-3 rounded-full">
                  <FaBuilding className="text-tan text-2xl" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-charcoal mb-4">Business Listings</h3>
              
              {/* Pricing Tiers */}
              <div className="flex mb-6 flex-grow">
                <div className="w-1/2 border-r border-gray-100 pr-3">
                  <h4 className="font-bold text-center text-charcoal mb-2">Free</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <FaCheck className="h-4 w-4 text-tan mt-0.5 mr-2 flex-shrink-0" />
                      <span>Basic business profile</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="h-4 w-4 text-tan mt-0.5 mr-2 flex-shrink-0" />
                      <span>Contact information</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="h-4 w-4 text-tan mt-0.5 mr-2 flex-shrink-0" />
                      <span>Standard listing</span>
                    </li>
                  </ul>
                  <p className="text-center font-bold text-tan text-lg mt-4">LKR 0</p>
                </div>
                <div className="w-1/2 pl-3">
                  <h4 className="font-bold text-center text-charcoal mb-2">Premium</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <FaStar className="h-4 w-4 text-gold mt-0.5 mr-2 flex-shrink-0" />
                      <span>Priority placement</span>
                    </li>
                    <li className="flex items-start">
                      <FaStar className="h-4 w-4 text-gold mt-0.5 mr-2 flex-shrink-0" />
                      <span>Featured status</span>
                    </li>
                    <li className="flex items-start">
                      <FaStar className="h-4 w-4 text-gold mt-0.5 mr-2 flex-shrink-0" />
                      <span>Analytics & reports</span>
                    </li>
                  </ul>
                  <p className="text-center font-bold text-tan text-lg mt-4">from LKR 1,500/mo</p>
                </div>
              </div>
              
              <div className="mt-auto">
                <Link 
                  to="/partnership/business-listing?tier=free"
                  className="flex justify-center items-center bg-tan text-cream py-3 px-6 rounded-md hover:bg-gold transition duration-200 w-full"
                >
                  Start Free Listing
                </Link>
              </div>
            </div>
          </div>

          {/* Tour Operators */}
          <div id="tour-partnership" className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:transform hover:scale-[1.02]">
            <div className="bg-tan h-2"></div>
            <div className="p-6">
              <div className="mb-4 flex justify-center">
                <div className="bg-tan/10 p-3 rounded-full">
                  <FaRoute className="text-tan text-2xl" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-charcoal mb-4">Tour Partnership</h3>
              <div className="space-y-3 mb-6">
                <p className="text-center text-gray-600">Join our network of trusted tour operators.</p>
                
                <div className="border-t border-b border-gray-100 py-4 my-6">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-tan mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Safari Tours</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-tan mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Cultural Tours</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-tan mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Adventure Tours</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-tan mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Specialized Experiences</span>
                    </li>
                  </ul>
                </div>
                
                <p className="text-center font-bold text-tan text-lg">Starting from LKR 2000/mo</p>
              </div>
              
              <div className="flex space-x-3 mt-6">
                {/* Replace with free submission link */}
                <Link 
                  to="/submit-tour-partnership"
                  className="flex-1 flex justify-center items-center bg-tan text-cream py-3 px-4 rounded-md hover:bg-gold transition duration-200"
                >
                  Submit Free Tour
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Why Partner With Us section - Now after partnership cards */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Why Partner With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="bg-tan/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-tan" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-charcoal">Increased Visibility</h3>
                <p className="text-gray-600 text-sm mt-2">Reach thousands of travelers planning their Sri Lankan adventure</p>
              </div>
              
              <div className="text-center">
                <div className="bg-tan/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-tan" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-charcoal">Targeted Audience</h3>
                <p className="text-gray-600 text-sm mt-2">Connect with travelers specifically interested in Sri Lankan experiences</p>
              </div>
              
              <div className="text-center">
                <div className="bg-tan/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-tan" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-charcoal">Growth Opportunities</h3>
                <p className="text-gray-600 text-sm mt-2">Expand your business with our growing platform of tourism services</p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center text-charcoal">Getting Started is Easy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="bg-tan/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="h-10 w-10 text-tan" />
              </div>
              <h3 className="font-semibold text-charcoal text-lg mb-2">1. Choose Your Plan</h3>
              <p className="text-gray-600 text-sm">Select the partnership type that fits your business, from free listings to premium features.</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="bg-tan/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPencilAlt className="h-9 w-9 text-tan" />
              </div>
              <h3 className="font-semibold text-charcoal text-lg mb-2">2. Submit Your Details</h3>
              <p className="text-gray-600 text-sm">Fill out our simple submission form with your business information and photos.</p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="bg-tan/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRocket className="h-9 w-9 text-tan" />
              </div>
              <h3 className="font-semibold text-charcoal text-lg mb-2">3. Reach New Customers</h3>
              <p className="text-gray-600 text-sm">Once approved, your listing goes live, connecting you with thousands of travelers.</p>
            </div>
          </div>
        </div>

        {/* Subscription Management Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">Manage Your Partnership</h3>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
            Already a partner? Access your dashboard to manage your subscription, view analytics, or make changes to your listing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="bg-tan/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-tan" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h4 className="font-semibold text-charcoal mb-2">Update Listing</h4>
              <p className="text-gray-600 text-sm mb-4">Make changes to your listing information and details</p>
              <Link to="/profile?tab=listings" className="inline-block text-tan hover:text-gold">
                Manage Listing
              </Link>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="bg-tan/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-tan" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h4 className="font-semibold text-charcoal mb-2">Billing & Plans</h4>
              <p className="text-gray-600 text-sm mb-4">Manage your subscription, upgrade or change plans</p>
              <Link to="/profile?tab=subscriptions" className="inline-block text-tan hover:text-gold">
                Manage Subscription
              </Link>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="bg-tan/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-tan" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                </div>
              </div>
              <h4 className="font-semibold text-charcoal mb-2">Analytics</h4>
              <p className="text-gray-600 text-sm mb-4">View performance metrics and visitor statistics</p>
              <Link to="/profile?tab=analytics" className="inline-block text-tan hover:text-gold">
                View Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* Testimonials/Contact Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Ready to Grow Your Business?</h3>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
            Join our network of tourism partners and increase your visibility to travelers exploring Sri Lanka. 
            For custom partnership opportunities or questions, contact us directly.
          </p>
          <div className="flex justify-center">
            <Link 
              
              className="bg-tan text-cream px-8 py-3 rounded-lg hover:bg-gold transition duration-200 inline-flex items-center"
            >
              Contact Us
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        serviceType={selectedService.type}
        amount={selectedService.amount}
        description={selectedService.description}
        itemId={selectedService.itemId}
      />
    </div>
  );
};

export default PartnershipPage;
