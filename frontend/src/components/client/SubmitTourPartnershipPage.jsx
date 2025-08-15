import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaUpload } from 'react-icons/fa';

const SubmitTourPartnershipPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Cultural',
    location: '',
    priceRange: 'Rs ',
    duration: '',
    groupSize: '',
    highlights: '',
    included: '',
    notIncluded: '',
    startingPoint: 'To be determined',
    endingPoint: 'To be determined',
    contactEmail: '',
    contactPhone: '',
    message: '',
    bookingUrl: '',
    image: null,
    imageUrl: ''
  });
  const [isExternalTour, setIsExternalTour] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  
  // UPDATED: Remove payment check and just set as free tier
  const [paymentStatus] = useState({
    loading: false,
    hasPaid: true, // Always consider as paid for free tier
    paymentId: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file, imageUrl: '' });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    let data;
    if (isExternalTour) {
      data = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        type: formData.type,
        isExternal: true,
        bookingUrl: formData.bookingUrl,
        imageUrl: formData.imageUrl,
        priceRange: formData.priceRange,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone
      };
    } else {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          submitData.append('image', formData[key]);
        } else if (key !== 'image' && key !== 'imageUrl') {
          submitData.append(key, formData[key]);
        }
      });
      
      submitData.append('isExternal', false);
      data = submitData;
    }

    try {
      await api.post('/tours/partnership', data, {
        headers: { 
          'Content-Type': isExternalTour ? 'application/json' : 'multipart/form-data' 
        },
      });
      alert('Tour partnership submitted successfully! It will be reviewed by our team.');
      navigate('/profile?tab=submissions');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during submission.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-charcoal">Submit Your Tour Partnership</h2>
          <p className="text-gray-500 mt-2">Please provide your tour details below.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* External Tour Option */}
          <div className="mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isExternalTour}
                onChange={(e) => setIsExternalTour(e.target.checked)}
                className="form-checkbox text-tan"
              />
              <span>I have a website for managing tour bookings</span>
            </label>
          </div>

          {isExternalTour ? (
            <>
              <div className="mb-4">
                <label className="block text-charcoal mb-2 font-medium">Tour Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Enter the name of your tour"
                />
              </div>
              
              {/* Add this location field */}
              <div className="mb-4">
                <label className="block text-charcoal mb-2 font-medium">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="e.g., Colombo, Kandy, Galle"
                />
              </div>

              <div className="mb-4">
                <label className="block text-charcoal mb-2 font-medium">Booking Website URL</label>
                <input
                  type="url"
                  name="bookingUrl"
                  value={formData.bookingUrl}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="https://..."
                />
              </div>
              <div className="mb-4">
                <label className="block text-charcoal mb-2 font-medium">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {/* Add the description field for external tours */}
              <div>
                <label className="block text-charcoal mb-2 font-medium">
                  Description
                  <span className="text-xs text-gray-500 ml-2">(Max 300 characters)</span>
                </label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={(e) => {
                    if (e.target.value.length <= 300) {
                      handleChange(e);
                    }
                  }} 
                  required 
                  rows="5" 
                  maxLength="300"
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Provide a compelling description of your tour."
                ></textarea>
                <div className="text-xs text-gray-500 text-right">
                  {formData.description.length}/300
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Regular tour fields continue below */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-charcoal mb-2 font-medium">Tour Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" 
                  />
                </div>
                <div>
                  <label className="block text-charcoal mb-2 font-medium">Tour Type</label>
                  <select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="Cultural">Cultural</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Safari">Safari</option>
                    <option value="Nature">Nature</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Add this location field */}
              <div>
                <label className="block text-charcoal mb-2 font-medium">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="e.g., Colombo, Kandy, Galle"
                />
              </div>

              <div>
                <label className="block text-charcoal mb-2 font-medium">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={(e) => {
                    if (e.target.value.length <= 300) {
                      handleChange(e);
                    }
                  }} 
                  required 
                  rows="5" 
                  maxLength="300"
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                ></textarea>
                <div className="text-xs text-gray-500 text-right">
                  {formData.description.length}/300
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-charcoal mb-2 font-medium">Duration</label>
                  <input 
                    type="text" 
                    name="duration" 
                    placeholder="e.g., 3 Days" 
                    value={formData.duration} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" 
                  />
                </div>
                <div>
                  <label className="block text-charcoal mb-2 font-medium">Group Size</label>
                  <input 
                    type="text" 
                    name="groupSize" 
                    placeholder="e.g., 2-10" 
                    value={formData.groupSize} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" 
                  />
                </div>
                <div>
                  <label className="block text-charcoal mb-2 font-medium">Price Range</label>
                  <div className="relative">
                    <select
                      name="currency"
                      value={formData.priceRange.startsWith('$') ? '$' : 'Rs'}
                      onChange={(e) => {
                        const numericPart = formData.priceRange.replace(/[^0-9-]/g, '');
                        setFormData({
                          ...formData,
                          priceRange: `${e.target.value}${numericPart}`
                        });
                      }}
                      className="absolute left-0 top-0 h-full px-2 border-r border-tan"
                    >
                      <option value="Rs">Rs</option>
                      <option value="$">$</option>
                    </select>
                    <input
                      type="text"
                      name="priceRange"
                      placeholder="e.g., 1000-2000"
                      value={formData.priceRange.replace(/^(Rs|\$)/, '')}
                      onChange={(e) => {
                        const currency = formData.priceRange.startsWith('$') ? '$' : 'Rs';
                        setFormData({
                          ...formData,
                          priceRange: `${currency}${e.target.value}`
                        });
                      }}
                      required
                      className="w-full pl-16 px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-charcoal mb-2 font-medium">Highlights</label>
                <span className="text-xs text-gray-500 ml-2">(Max 200 characters)</span>
                <textarea 
                  name="highlights" 
                  value={formData.highlights} 
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      handleChange(e);
                    }
                  }} 
                  rows="3" 
                  maxLength="200"
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                ></textarea>
                <div className="text-xs text-gray-500 text-right">
                  {formData.highlights.length}/200
                </div>
              </div>
              
              <div>
                <label className="block text-charcoal mb-2 font-medium">What's Included</label>
                <span className="text-xs text-gray-500 ml-2">(Max 200 characters)</span>
                <textarea 
                  name="included" 
                  value={formData.included} 
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      handleChange(e);
                    }
                  }} 
                  rows="3" 
                  maxLength="200"
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                ></textarea>
                <div className="text-xs text-gray-500 text-right">
                  {formData.included.length}/200
                </div>
              </div>
              
              <div>
                <label className="block text-charcoal mb-2 font-medium">What's Not Included</label>
                <span className="text-xs text-gray-500 ml-2">(Max 200 characters)</span>
                <textarea 
                  name="notIncluded" 
                  value={formData.notIncluded} 
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      handleChange(e);
                    }
                  }} 
                  rows="3" 
                  maxLength="200"
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                ></textarea>
                <div className="text-xs text-gray-500 text-right">
                  {formData.notIncluded.length}/200
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-charcoal mb-2 font-medium">Contact Email</label>
                  <input 
                    type="email" 
                    name="contactEmail" 
                    value={formData.contactEmail} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" 
                  />
                </div>
                <div>
                  <label className="block text-charcoal mb-2 font-medium">Contact Phone</label>
                  <input 
                    type="tel" 
                    name="contactPhone" 
                    value={formData.contactPhone} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" 
                  />
                </div>
              </div>
            </>
          )}
          
          {/* These fields are common to both external and non-external tours */}
          <div>
            <label className="block text-charcoal mb-2 font-medium">
              Additional Message (Optional)
              <span className="text-xs text-gray-500 ml-2">(Max 200 characters)</span>
            </label>
            <textarea 
              name="message" 
              value={formData.message} 
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  handleChange(e);
                }
              }} 
              rows="3" 
              maxLength="200"
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            ></textarea>
            <div className="text-xs text-gray-500 text-right">
              {formData.message.length}/200
            </div>
          </div>

          {!isExternalTour && (
            <div>
              <label className="block text-charcoal mb-2 font-medium">Featured Image</label>
              <div className="mt-2 flex items-center justify-center w-full">
                <label className="flex flex-col w-full h-32 border-2 border-tan border-dashed hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaUpload className="w-10 h-10 text-gray-400" />
                    <p className="text-sm text-gray-500">Click to upload an image for your tour</p>
                  </div>
                  <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                </label>
              </div>
              {preview && <img src={preview} alt="Preview" className="mt-4 rounded-lg w-full max-h-60 object-cover" />}
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-tan text-cream py-3 rounded-lg hover:bg-gold transition duration-200 flex items-center justify-center"
          >
            {isSubmitting && <FaSpinner className="animate-spin mr-2" />}
            {isSubmitting ? 'Submitting...' : 'Submit Tour'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitTourPartnershipPage;