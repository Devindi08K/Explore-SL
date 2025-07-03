import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { FaStar, FaTrash } from 'react-icons/fa';

const BlogDetails = ({ user }) => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogRes, reviewsRes] = await Promise.all([
          api.get(`/blogs/${id}`),
          api.get(`/reviews/blog/${id}`)
        ]);
        setBlog(blogRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error('Error fetching blog details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (blog) {
      console.log("Blog details:", {
        title: blog.title,
        url: blog.blogUrl,
        hasContent: !!blog.content,
      });
    }
  }, [blog]);

  const handleDeleteReview = async (reviewId) => {
    if (!user || user.role !== 'admin') {
      return;
    }

    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/admin/reviews/${reviewId}`);

        // Update reviews list
        setReviews(reviews.filter(review => review._id !== reviewId));

        // Update blog stats if we have that info
        if (blog && blog.totalReviews > 0) {
          const deletedReview = reviews.find(review => review._id === reviewId);
          const newTotalReviews = blog.totalReviews - 1;

          let newAvgRating = 0;
          if (newTotalReviews > 0) {
            // Recalculate average excluding the deleted review
            const totalRatingPoints = blog.averageRating * blog.totalReviews;
            const newTotalPoints = totalRatingPoints - deletedReview.rating;
            newAvgRating = newTotalPoints / newTotalReviews;
          }

          setBlog({
            ...blog,
            totalReviews: newTotalReviews,
            averageRating: newAvgRating
          });
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!blog) return <div className="text-center py-10">Blog not found</div>;

  const formattedUrl = blog.blogUrl && !blog.blogUrl.startsWith('http') 
    ? `https://${blog.blogUrl}` 
    : blog.blogUrl;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Blog content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-charcoal mb-4">{blog.title || 'Blog Details'}</h1>
        <div className="flex items-center mb-4">
          <div className="flex mr-2">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} 
                className={`${i < (blog.averageRating || 0) ? 'text-yellow-500' : 'text-gray-300'} w-5 h-5`} 
              />
            ))}
          </div>
          <span className="text-gray-600">
            {blog.averageRating ? blog.averageRating.toFixed(1) : '0'} ({blog.totalReviews || 0} reviews)
          </span>
        </div>
        <p className="text-gray-600 mb-4">By {blog.author}</p>
        
        {/* Display blog image only if it's an internal post and has an image */}
        {!blog.isExternal && blog.image && (
          <div className="mb-6">
            <img 
              src={blog.image.startsWith('http') ? blog.image : `${import.meta.env.VITE_BACKEND_URL}/${blog.image.replace(/\\/g, '/')}`} 
              alt={blog.title} 
              className="w-full h-auto max-h-96 object-cover rounded-lg"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        )}
        
        {/* Display blog content or external link */}
        <div className="prose max-w-none mb-6">
          {blog.isExternal ? (
            <div>
              <p>This is an external blog post. Please visit the original source to read the full article.</p>
              <a 
                href={formattedUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-4 bg-tan text-cream px-6 py-2 rounded-lg hover:bg-gold transition duration-200 no-underline"
              >
                Visit Original Blog
              </a>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          )}
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
        
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review._id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-medium">{review.userId?.userName || 'Anonymous User'}</span>
                    <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    {/* Add delete button for admins */}
                    {user?.role === 'admin' && (
                      <button 
                        onClick={() => handleDeleteReview(review._id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        title="Delete review"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
                {review.comment && <p className="text-gray-700">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
