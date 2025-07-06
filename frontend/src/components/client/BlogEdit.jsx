import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import { FaSpinner, FaUpload } from 'react-icons/fa';

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    image: null,
    imageUrl: '',
    blogUrl: ''
  });
  const [isExternalBlog, setIsExternalBlog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/blogs/${id}`);
        const blog = response.data;

        setIsExternalBlog(blog.isExternal);
        
        // Set form data with values from the fetched blog
        setFormData({
          title: blog.title || '',
          content: blog.content || '',
          author: blog.author || '',
          blogUrl: blog.blogUrl || '',
          imageUrl: blog.image || ''
        });

        // Set preview image if available
        if (blog.image) {
          if (blog.image.startsWith('http')) {
            setPreview(blog.image);
          } else {
            setPreview(`${import.meta.env.VITE_BACKEND_URL}/${blog.image.replace(/\\/g, '/')}`);
          }
        }

      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError('Failed to load blog data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

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

    const data = new FormData();
    
    // Append all form data fields to FormData
    Object.keys(formData).forEach(key => {
      if (key === 'image' && (isExternalBlog || !formData[key])) return; // Don't append file for external blogs
      if (key === 'imageUrl' && !isExternalBlog) return; // Don't append URL for internal blogs
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });
    
    data.append('isExternal', isExternalBlog);

    try {
      // Use PUT endpoint for updating
      await api.put(`/blogs/user/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Update the success message to be clearer about the status
      alert('Blog updated successfully! Your blog remains published and visible to readers.');
      navigate('/profile?tab=submissions');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while updating the blog.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <FaSpinner className="animate-spin text-tan text-4xl mr-2" />
        <p className="ml-2">Loading blog data...</p>
      </div>
    );
  }

  if (error && !formData.title) {
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
          <h2 className="text-3xl font-bold text-charcoal">Edit Blog</h2>
          <p className="text-gray-500 mt-2">Update your blog information below</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* External Blog Option (disabled because can't be changed after creation) */}
          <div className="mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isExternalBlog}
                onChange={(e) => setIsExternalBlog(e.target.checked)}
                className="form-checkbox text-tan"
                disabled // Can't change blog type after creation
              />
              <span>This is a link to an external blog</span>
              {isExternalBlog && <span className="text-gray-500 text-sm">(Can't be changed after creation)</span>}
            </label>
          </div>

          {isExternalBlog ? (
            <>
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
                <label className="block text-charcoal mb-2 font-medium">Author Name</label>
                <input 
                  type="text" 
                  name="author" 
                  value={formData.author} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" 
                />
              </div>
              
              <div>
                <label className="block text-charcoal mb-2 font-medium">Blog URL</label>
                <input 
                  type="url" 
                  name="blogUrl" 
                  value={formData.blogUrl} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" 
                />
              </div>
              
              <div>
                <label className="block text-charcoal mb-2 font-medium">Image URL</label>
                <input 
                  type="url" 
                  name="imageUrl" 
                  value={formData.imageUrl} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" 
                />
              </div>
            </>
          ) : (
            <>
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
            </>
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
              {isSubmitting ? 'Updating...' : 'Update Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogEdit;