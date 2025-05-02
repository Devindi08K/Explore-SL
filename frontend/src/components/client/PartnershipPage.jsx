import React from 'react';
import { Link } from 'react-router-dom';

const PartnershipPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-charcoal bg-cream">
      <h1 className="text-4xl font-bold mb-8 text-tan text-center">Partnership Opportunities</h1>

      {/* Section 1: Sponsored Blog Posts */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-charcoal">Sponsored Blog Posts</h2>
        <div className="space-y-4">
          <p>Share your travel experiences and reach our engaged audience.</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Professional blog post creation</li>
            <li>Social media promotion</li>
            <li>Permanent placement on our platform</li>
          </ul>
          <p className="font-semibold text-tan">Price: $500 per post</p>
          <Link 
            to="/partnership/blog-submission"
            className="inline-block bg-tan text-cream px-6 py-2 rounded-lg hover:bg-gold transition duration-200"
          >
            Submit a Blog Post
          </Link>
        </div>
      </div>

      {/* Section 2: Business Listings */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-charcoal">Business Listings</h2>
        <div className="space-y-4">
          <p>List your hotel, restaurant, café, or local eatery on our platform.</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Premium placement on our platform</li>
            <li>Detailed business profile</li>
            <li>Direct booking links (for hotels)</li>
            <li>Showcase your specialties</li>
          </ul>
          <p className="font-semibold text-tan">Price: $300 per month</p>
          <Link 
            to="/partnership/business-listing"
            className="inline-block bg-tan text-cream px-6 py-2 rounded-lg hover:bg-gold transition duration-200"
          >
            List Your Business
          </Link>
        </div>
      </div>

      {/* Section 3: Tour Operators */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-charcoal">Tour Partnership Program</h2>
        <div className="space-y-4">
          <p>Join our network of trusted tour operators.</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Safari Tours</li>
            <li>Cultural Tours</li>
            <li>Adventure Tours</li>
            <li>Specialized Experiences</li>
          </ul>
          <p className="font-semibold text-tan">Price: Contact for custom packages</p>
          <Link 
            to="/partnership/tour-operator"
            className="inline-block bg-tan text-cream px-6 py-2 rounded-lg hover:bg-gold transition duration-200"
          >
            Become a Tour Partner
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PartnershipPage;
