import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { FaUpload } from 'react-icons/fa';

const BusinessListingForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'restaurant',
    description: '',
    location: '',
    priceRange: '',
    specialties: '',
    openingHours: '',
    imageUrl: '',
    // For businesses with booking systems
    bookingUrl: '',
    // For local businesses
    contactName: '',
    email: '',
    phone: '',
    address: '',
    isExternal: false
  });
  const [hasBookingSystem, setHasBookingSystem] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const submissionData = new FormData();
      
      // Append all form data with the correct keys
      submissionData.append('businessName', formData.businessName);
      submissionData.append('businessType', formData.businessType);
      submissionData.append('description', formData.description);
      submissionData.append('location', formData.location);
      submissionData.append('priceRange', formData.priceRange);
      submissionData.append('specialties', formData.specialties);
      submissionData.append('openingHours', formData.openingHours);
      submissionData.append('contactName', formData.contactName);
      submissionData.append('email', formData.email);
      submissionData.append('phone', formData.phone);
      submissionData.append('address', formData.address);
      submissionData.append('isExternal', hasBookingSystem);
      submissionData.append('listingType', "regular");
      submissionData.append('status', 'pending');

      if (hasBookingSystem) {
        submissionData.append('redirectUrl', formData.bookingUrl);
        submissionData.append('imageUrl', formData.imageUrl);
      } else if (imageFile) {
        submissionData.append('image', imageFile);
      } else {
        throw new Error("An image is required.");
      }

      await api.post("/affiliate-links", submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("Business listing submitted successfully! Awaiting approval.");
      navigate('/profile?tab=submissions');
    } catch (error) {
      console.error("Error submitting business:", error);
      alert("Failed to submit business listing: " + (error.response?.data?.error || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-charcoal mb-6 text-center">
          Submit Your Business
        </h2>
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

          <div>
            <label className="block text-charcoal mb-2">Location / City</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Galle, Colombo, Kandy"
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={hasBookingSystem}
                onChange={(e) => setHasBookingSystem(e.target.checked)}
                className="form-checkbox text-tan"
              />
              <span>I have an external website or booking system</span>
            </label>
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

              <div>
                <label className="block text-charcoal mb-2">Business Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  required
                  className="w-full px-4 py-2 border border-tan rounded-lg"
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

          {!hasBookingSystem && (
            <div>
              <label className="block text-charcoal mb-2">Business Image</label>
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-tan rounded-lg shadow-sm tracking-wide uppercase border border-tan cursor-pointer hover:bg-tan hover:text-white">
                <FaUpload className="w-8 h-8" />
                <span className="mt-2 text-base leading-normal">
                  {imageFile ? imageFile.name : 'Select a file'}
                </span>
                <input type='file' className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
              {preview && <img src={preview} alt="Preview" className="mt-4 rounded-lg w-full max-h-60 object-cover" />}
            </div>
          )}

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