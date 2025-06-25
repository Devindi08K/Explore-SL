import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const BusinessListingForm = () => {
  const [hasBookingSystem, setHasBookingSystem] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'restaurant',
    description: '',
    location: '',
    priceRange: '',
    specialties: '',
    openingHours: '',
    imageUrl: '',  // Add this field
    // For businesses with booking systems
    bookingUrl: '',
    // For local businesses
    contactName: '',
    email: '',
    phone: '',
    address: '',
    isExternal: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Update formData with booking system info
      const updatedFormData = {
        ...formData,
        isExternal: hasBookingSystem,
        // Transform data to match your backend model
        category: formData.businessType,
        name: formData.businessName,
        // Set as regular listing (user submitted)
        listingType: "regular",
        // Add missing required fields
        imageUrl: formData.imageUrl || 'https://via.placeholder.com/300x200?text=Business+Image',
        // For external listings - set redirectUrl to bookingUrl
        ...(hasBookingSystem && { redirectUrl: formData.bookingUrl }),
        // Set pending status
        status: 'pending',
        isVerified: false,
        submittedAt: new Date()
      };

      // Use the correct API endpoint
      await api.post("/affiliate-links", updatedFormData);
      alert("Business listing submitted successfully! Awaiting approval.");
      navigate('/affiliate-links');
    } catch (error) {
      console.error("Error submitting business:", error);
      // Show more specific error message
      alert("Failed to submit business listing: " + (error.response?.data?.error || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-charcoal mb-6 text-center">List Your Business</h2>
        
        <div className="mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={hasBookingSystem}
              onChange={(e) => setHasBookingSystem(e.target.checked)}
              className="form-checkbox text-tan"
            />
            <span>I have a website for my hotel/restaurant </span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common Fields */}
          <div>
            <label className="block text-charcoal mb-2">Business Type</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="restaurant">Restaurant</option>
              <option value="hotel">Hotel</option>
              <option value="cafe">Café</option>
              <option value="localEatery">Local Eatery</option>
            </select>
          </div>

          <div>
            <label className="block text-charcoal mb-2">Business Name</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-charcoal mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {hasBookingSystem ? (
            // Fields for businesses with booking systems
            <>
              <div>
                <label className="block text-charcoal mb-2">Booking Website URL</label>
                <input
                  type="url"
                  name="bookingUrl"
                  value={formData.bookingUrl}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </>
          ) : (
            // Fields for local businesses
            <>
              <div>
                <label className="block text-charcoal mb-2">Contact Person Name</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-charcoal mb-2">Full Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              {/* Opening Hours Builder */}
              <div>
                <label className="block text-charcoal mb-2">Opening Hours</label>
                <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                  {/* Quick templates */}
                  <div>
                    <p className="text-sm font-medium text-charcoal mb-2">Quick templates:</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ 
                          ...formData, 
                          openingHours: "Mon-Fri: 9:00 AM - 5:00 PM, Sat-Sun: Closed" 
                        })}
                        className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
                      >
                        Weekdays 9-5
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ 
                          ...formData, 
                          openingHours: "Mon-Sun: 10:00 AM - 10:00 PM" 
                        })}
                        className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
                      >
                        Daily 10AM-10PM
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ 
                          ...formData, 
                          openingHours: "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 11:00 PM, Sun: 12:00 PM - 8:00 PM" 
                        })}
                        className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
                      >
                        Restaurant Hours
                      </button>
                    </div>
                  </div>

                  {/* Custom input */}
                  <textarea
                    name="openingHours"
                    value={formData.openingHours}
                    onChange={handleChange}
                    rows="2"
                    placeholder="e.g., Mon-Fri: 9AM-9PM, Sat: 10AM-6PM, Sun: Closed"
                    className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <p className="text-xs text-gray-500">
                    Use the templates above or enter your custom hours. Include day ranges and time ranges.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-charcoal mb-2">Specialties</label>
                <textarea
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleChange}
                  placeholder="List your special dishes or services"
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </>
          )}

          {/* Common contact fields */}
          <div>
            <label className="block text-charcoal mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-charcoal mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {/* Price Range Selector */}
          <div>
            <label className="block text-charcoal mb-2">Price Range (LKR)</label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {['Under 1,000', '1,000-3,000', '3,000-6,000', 'Above 6,000'].map(priceOption => (
                  <button
                    type="button"
                    key={priceOption}
                    onClick={() => setFormData({ ...formData, priceRange: priceOption })}
                    className={`px-4 py-2 rounded-md ${
                      formData.priceRange === priceOption 
                        ? 'bg-tan text-cream' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {priceOption}
                  </button>
                ))}
              </div>
              <div className="mt-2">
                <input
                  type="text"
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleChange}
                  placeholder="Or enter custom range (e.g., 500-1500)"
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-charcoal mb-2">Business Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl || ''}
              onChange={handleChange}
              placeholder="https://example.com/your-business-image.jpg"
              required
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a URL for an image of your business
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-tan text-cream py-3 rounded-lg hover:bg-gold transition duration-200"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Business Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessListingForm;