import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import { FaUpload, FaSpinner } from 'react-icons/fa';

const BusinessEdit = () => {
  const { id } = useParams();
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
    bookingUrl: '',
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/affiliate-links/${id}`);
        const business = response.data;
        
        // Set hasBookingSystem based on business.isExternal
        setHasBookingSystem(business.isExternal);
        
        // Set form data with values from the fetched business listing
        setFormData({
          businessName: business.businessName || '',
          businessType: business.businessType || 'restaurant',
          description: business.description || '',
          location: business.location || '',
          priceRange: business.priceRange || '',
          specialties: business.specialties || '',
          openingHours: business.openingHours || '',
          imageUrl: business.imageUrl || '',
          bookingUrl: business.redirectUrl || '',
          contactName: business.contactName || '',
          email: business.email || '',
          phone: business.phone || '',
          address: business.address || ''
        });

        // Set preview image if available
        if (business.imageUrl) {
          setPreview(business.imageUrl);
        } else if (business.image) {
          if (business.image.startsWith('http')) {
            setPreview(business.image);
          } else {
            setPreview(`${import.meta.env.VITE_BACKEND_URL}/${business.image.replace(/\\/g, '/')}`);
          }
        }

      } catch (err) {
        console.error('Error fetching business data:', err);
        setError('Failed to load business data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [id]);

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

  // Update the handleSubmit function to correctly handle form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const submissionData = new FormData();
      
      // Append all non-file form data fields
      Object.keys(formData).forEach(key => {
        if (key !== 'image' && key !== 'imageUrl') {
          submissionData.append(key, formData[key]);
        }
      });
      
      submissionData.append('isExternal', hasBookingSystem);
      
      // Handle external business data
      if (hasBookingSystem) {
        submissionData.append('redirectUrl', formData.bookingUrl);
        submissionData.append('imageUrl', formData.imageUrl);
      } else {
        // Only append new image if one was selected
        if (imageFile) {
          submissionData.append('image', imageFile);
        }
        // If no new image was selected, keep the existing one
      }
      
      // Add a flag to indicate this is an edit by the owner
      submissionData.append('needsReview', true);
      
      // Use PUT endpoint for updating
      await api.put(`/affiliate-links/${id}`, submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      alert('Business listing updated successfully! Changes will be reviewed by our team.');
      navigate('/profile?tab=submissions');
    } catch (err) {
      console.error('Error updating business listing:', err);
      setError(err.response?.data?.error || 'An error occurred while updating the business listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <FaSpinner className="animate-spin text-tan text-4xl mr-2" />
        <p className="ml-2">Loading business data...</p>
      </div>
    );
  }

  if (error && !formData.businessName) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            onClick={() => navigate('/profile?tab=submissions')}
            className="bg-tan text-cream px-6 py-2 rounded-lg hover:bg-gold transition"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-charcoal mb-6 text-center">
          Edit Business Listing
        </h2>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
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
                disabled // Can't change the external status after creation
              />
              <span>I have an external website or booking system</span>
              {hasBookingSystem && <span className="text-gray-500 text-sm">(Can't be changed after creation)</span>}
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
              <div className="flex items-center space-x-4">
                {preview && (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="w-40 h-24 object-cover rounded-lg" />
                    <p className="text-xs text-gray-500 mt-1">Current image</p>
                  </div>
                )}
                <div className="flex-1">
                  <label className="flex flex-col w-full h-24 border-2 border-tan border-dashed hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaUpload className="w-6 h-6 text-gray-400" />
                      <p className="text-sm text-gray-500">Upload new image (optional)</p>
                    </div>
                    <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/profile?tab=submissions')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-tan text-cream px-6 py-3 rounded-lg hover:bg-gold transition duration-200 flex items-center justify-center"
            >
              {isSubmitting && <FaSpinner className="animate-spin mr-2" />}
              {isSubmitting ? 'Updating...' : 'Update Business'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessEdit;