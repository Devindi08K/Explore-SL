import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaUpload } from 'react-icons/fa';

const SubmitSponsoredBlogPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
  });
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
        const { data } = await api.get('/payments/check-voucher/sponsored_blog_post');
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
      setFormData({ ...formData, image: file });
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
    data.append('title', formData.title);
    data.append('content', formData.content);
    if (formData.image) {
      data.append('image', formData.image);
    }
    data.append('paymentId', paymentStatus.paymentId);

    try {
      await api.post('/blogs/sponsored', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Sponsored blog submitted successfully! It will be reviewed by our team.');
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
        <FaSpinner className="animate-spin text-tan text-4xl" />
        <p className="ml-4">Verifying payment...</p>
      </div>
    );
  }

  if (!paymentStatus.hasPaid) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-charcoal mb-4">No Active Payment Found</h2>
          <p className="text-gray-600 mb-6">You must complete a payment before submitting a sponsored blog post.</p>
          <Link to="/partnership" className="bg-tan text-white px-6 py-2 rounded-lg hover:bg-gold transition">
            View Partnership Options
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-charcoal">Submit Your Sponsored Blog</h2>
          <p className="text-gray-500 mt-2">Your payment has been confirmed. Please fill out the details below.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-charcoal mb-2 font-medium">Blog Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-charcoal mb-2 font-medium">Blog Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="10"
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            ></textarea>
          </div>

          <div>
            <label className="block text-charcoal mb-2 font-medium">Featured Image (Optional)</label>
            <div className="mt-2 flex items-center justify-center w-full">
              <label className="flex flex-col w-full h-32 border-2 border-tan border-dashed hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FaUpload className="w-10 h-10 text-gray-400" />
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                </div>
                <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
              </label>
            </div>
            {preview && <img src={preview} alt="Preview" className="mt-4 rounded-lg w-full object-cover" />}
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-tan text-cream py-3 rounded-lg hover:bg-gold transition duration-200 flex items-center justify-center"
          >
            {isSubmitting && <FaSpinner className="animate-spin mr-2" />}
            {isSubmitting ? 'Submitting...' : 'Submit Blog Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitSponsoredBlogPage;