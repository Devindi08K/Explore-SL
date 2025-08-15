import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaUpload } from 'react-icons/fa';

const SubmitSponsoredBlogPage = () => {
  const navigate = useNavigate();
  const [hasWebsite, setHasWebsite] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    authorName: '',
    blogUrl: '',
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // UPDATED: Remove payment check and just set as paid
  const [paymentStatus] = useState({
    loading: false,
    hasPaid: true, // Always consider as paid
    paymentId: 'free-submission', // Dummy ID
  });
  
  const [preview, setPreview] = useState(null);

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
    data.append('paymentId', paymentStatus.paymentId);
    data.append('isExternal', hasWebsite);

    if (hasWebsite) {
      data.append('title', formData.title);
      data.append('author', formData.authorName);
      data.append('blogUrl', formData.blogUrl);
      data.append('imageUrl', formData.imageUrl);
    } else {
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('author', formData.authorName || 'Guest Author'); // Allow custom author name
      if (formData.image) {
        data.append('image', formData.image);
      }
    }

    try {
      await api.post('/blogs/sponsored', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Blog submitted successfully! It will be reviewed by our team.');
      navigate('/profile?tab=submissions');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-charcoal">Submit Your Blog</h2>
        </div>
        
        <div className="mb-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasWebsite}
              onChange={(e) => setHasWebsite(e.target.checked)}
              className="form-checkbox text-tan h-5 w-5"
            />
            <span>I want to link to my existing blog website</span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {hasWebsite ? (
            <>
              <div>
                <label className="block text-charcoal mb-2 font-medium">Blog Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border border-tan rounded-lg"/>
              </div>
              <div>
                <label className="block text-charcoal mb-2">Author Name</label>
                <input type="text" name="authorName" value={formData.authorName} onChange={handleChange} required className="w-full px-4 py-2 border border-tan rounded-lg"/>
              </div>
              <div>
                <label className="block text-charcoal mb-2">Blog URL</label>
                <input type="url" name="blogUrl" value={formData.blogUrl} onChange={handleChange} required className="w-full px-4 py-2 border border-tan rounded-lg"/>
              </div>
              <div>
                <label className="block text-charcoal mb-2">Image URL</label>
                <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="w-full px-4 py-2 border border-tan rounded-lg"/>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-charcoal mb-2 font-medium">Blog Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border border-tan rounded-lg"/>
              </div>
              <div>
                <label className="block text-charcoal mb-2">Author Name</label>
                <input type="text" name="authorName" value={formData.authorName} onChange={handleChange} required className="w-full px-4 py-2 border border-tan rounded-lg"/>
              </div>
              <div>
                <label className="block text-charcoal mb-2 font-medium">Blog Content</label>
                <textarea name="content" value={formData.content} onChange={handleChange} required rows="10" className="w-full px-4 py-2 border border-tan rounded-lg"></textarea>
              </div>
              <div>
                <label className="block text-charcoal mb-2 font-medium">
                  Featured Image <span className="text-sm text-gray-500">(optional)</span>
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg flex items-center"
                  >
                    <FaUpload className="mr-2" />
                    <span>{formData.image ? 'Change Image' : 'Select Image'}</span>
                  </label>
                </div>
                {preview && (
                  <div className="mt-3">
                    <img src={preview} alt="Preview" className="h-40 object-cover rounded-lg" />
                  </div>
                )}
              </div>
            </>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-tan text-cream px-6 py-3 rounded-lg hover:bg-gold transition flex items-center justify-center"
            >
              {isSubmitting && <FaSpinner className="animate-spin mr-2" />}
              {isSubmitting ? 'Submitting...' : 'Submit Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitSponsoredBlogPage;