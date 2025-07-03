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
    bookingUrl: '', // For external tours
    image: null, // For file upload
    imageUrl: '' // For external image URL
  });
  const [isExternalTour, setIsExternalTour] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState({
    loading: true,
    hasPaid: false,
    paymentId: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const { data } = await api.get('/payments/check-voucher/tour_partnership');
        if (data.hasVoucher) {
          setPaymentStatus({ loading: false, hasPaid: true, paymentId: data.paymentId });
        } else {
          setPaymentStatus({ loading: false, hasPaid: false, paymentId: null });
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        setPaymentStatus({ loading: false, hasPaid: false, paymentId: null });
      }
    };
    verifyPayment();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentStatus.paymentId) {
      setError("No valid payment voucher found.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const data = new FormData();
    
    // Append all form data fields to FormData, handling external tour specifics
    Object.keys(formData).forEach(key => {
      if (key === 'image' && isExternalTour) return; // Don't append file for external tours
      if (key === 'imageUrl' && !isExternalTour) return; // Don't append URL for internal tours
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });
    
    data.append('isExternal', isExternalTour);
    data.append('paymentId', paymentStatus.paymentId);

    try {
      await api.post('/tours/partnership', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
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

  if (paymentStatus.loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <FaSpinner className="animate-spin text-tan text-4xl mr-2" />
        <p className="ml-2">Verifying payment...</p>
      </div>
    );
  }

  if (!paymentStatus.hasPaid) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-charcoal mb-4">No Active Payment Found</h2>
          <p className="text-gray-600 mb-6">You must complete a payment before submitting a tour partnership.</p>
          <Link to="/partnership" className="bg-tan text-white px-6 py-2 rounded-lg hover:bg-gold transition">
            View Partnership Options
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-charcoal">Submit Your Tour Partnership</h2>
          <p className="text-gray-500 mt-2">Your payment is confirmed. Please provide your tour details.</p>
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
                <label className="block text-charcoal mb-2 font-medium">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  required 
                  rows="5" 
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Provide a compelling description of your tour."
                ></textarea>
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

              <div>
                <label className="block text-charcoal mb-2 font-medium">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  required 
                  rows="5" 
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                ></textarea>
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
            <label className="block text-charcoal mb-2 font-medium">Additional Message (Optional)</label>
            <textarea 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              rows="3" 
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            ></textarea>
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