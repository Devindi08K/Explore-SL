import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import { FaSpinner, FaUpload } from 'react-icons/fa';

const TourEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Cultural',
    location: '', // Ensure this is here
    priceRange: 'Rs ',
    duration: '',
    groupSize: '',
    highlights: '',
    included: '',
    notIncluded: '',
    startingPoint: '',
    endingPoint: '',
    contactEmail: '',
    contactPhone: '',
    message: '',
    bookingUrl: '', // For external tours
    image: null, // For file upload
    imageUrl: '' // For external image URL
  });
  const [isExternalTour, setIsExternalTour] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/tours/${id}`);
        const tour = response.data;

        setIsExternalTour(tour.isExternal);
        
        // Set form data with values from the fetched tour
        setFormData({
          name: tour.name || '',
          description: tour.description || '',
          type: tour.type || 'Cultural',
          location: tour.location || '', // Add this line
          priceRange: tour.priceRange || 'Rs ',
          duration: tour.duration || '',
          groupSize: tour.groupSize || '',
          highlights: tour.highlights || '',
          included: tour.included || '',
          notIncluded: tour.notIncluded || '',
          startingPoint: tour.startingPoint || '',
          endingPoint: tour.endingPoint || '',
          contactEmail: tour.contactEmail || '',
          contactPhone: tour.contactPhone || '',
          message: tour.message || '',
          bookingUrl: tour.bookingUrl || '',
          imageUrl: tour.image || ''
        });

        // Set preview image if available
        if (tour.image) {
          if (tour.image.startsWith('http')) {
            setPreview(tour.image);
          } else {
            setPreview(`${import.meta.env.VITE_BACKEND_URL}/${tour.image.replace(/\\/g, '/')}`);
          }
        }

      } catch (err) {
        console.error('Error fetching tour data:', err);
        setError('Failed to load tour data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file, imageUrl: '' }); // Clear imageUrl if a file is uploaded
      setPreview(URL.createObjectURL(file));
    }
  };

  // Make sure location is included in the data being sent
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let data;
      
      if (isExternalTour) {
        // For external tour, ensure location is included
        data = {
          name: formData.name,
          description: formData.description,
          location: formData.location, // Make sure this is included
          type: formData.type,
          isExternal: true,
          bookingUrl: formData.bookingUrl,
          imageUrl: formData.imageUrl,
          priceRange: formData.priceRange,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          // Other fields...
        };
      } else {
        // For non-external tour, ensure location is included in the FormData
        const submitData = new FormData();
        
        // Add all form fields
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

      // Use PUT endpoint for updating
      await api.put(`/tours/${id}`, data, {
        headers: {
          'Content-Type': isExternalTour ? 'application/json' : 'multipart/form-data'
        }
      });
      
      // Success message and navigation
      alert('Tour updated successfully!');
      navigate('/profile?tab=submissions');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while updating the tour.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <FaSpinner className="animate-spin text-tan text-4xl mr-2" />
        <p className="ml-2">Loading tour data...</p>
      </div>
    );
  }

  if (error && !formData.name) {
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
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-charcoal">Edit Tour</h2>
          <p className="text-gray-500 mt-2">Update your tour information below</p>
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
                disabled // Can't change tour type after creation
              />
              <span>I have a website for managing tour bookings</span>
              {isExternalTour && <span className="text-gray-500 text-sm">(Can't be changed after creation)</span>}
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
                  placeholder="Provide a compelling description of your tour."
                ></textarea>
                <div className="text-xs text-gray-500 text-right">
                  {formData.description.length}/300
                </div>
              </div>
            </>
          ) : (
            <>
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
                <textarea 
                  name="highlights" 
                  value={formData.highlights} 
                  onChange={handleChange} 
                  rows="3" 
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                ></textarea>
                <div className="text-xs text-gray-500 text-right">
                  {formData.highlights.length}/200
                </div>
              </div>
              
              <div>
                <label className="block text-charcoal mb-2 font-medium">What's Included</label>
                <textarea 
                  name="included" 
                  value={formData.included} 
                  onChange={handleChange} 
                  rows="3" 
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                ></textarea>
                <div className="text-xs text-gray-500 text-right">
                  {formData.included.length}/200
                </div>
              </div>
              
              <div>
                <label className="block text-charcoal mb-2 font-medium">What's Not Included</label>
                <textarea 
                  name="notIncluded" 
                  value={formData.notIncluded} 
                  onChange={handleChange} 
                  rows="3" 
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

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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
              {isSubmitting ? 'Updating...' : 'Update Tour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourEdit;