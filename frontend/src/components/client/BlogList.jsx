import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from '../../utils/api';
import { FaStar, FaLink, FaPlus } from 'react-icons/fa'; // Import FaLink

const BlogList = (props) => {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [reviewData, setReviewData] = useState({
        rating: 5,
        comment: '' // This can now be empty
    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await api.get("/blogs");
            setBlogs(response.data);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

    // Display static star ratings
    const renderStars = (rating) => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                    <FaStar 
                        key={index} 
                        className={`${index < rating ? 'text-yellow-500' : 'text-gray-300'} w-4 h-4`} 
                    />
                ))}
                <span className="ml-1 text-sm text-gray-600">({rating || 0})</span>
            </div>
        );
    };

    // Interactive star rating for review form
    const renderInteractiveStars = () => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                    <FaStar 
                        key={index}
                        className={`${index < reviewData.rating ? 'text-yellow-500' : 'text-gray-300'} w-5 h-5 cursor-pointer`}
                        onClick={() => setReviewData({...reviewData, rating: index + 1})}
                    />
                ))}
            </div>
        );
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!props.user) {
            alert("Please login to leave a review");
            return;
        }

        try {
            console.log("Submitting review:", {
                itemId: selectedBlog._id,
                itemType: 'blog',
                rating: reviewData.rating,
                comment: reviewData.comment
            });
            
            const response = await api.post('/reviews', {
                itemId: selectedBlog._id,
                itemType: 'blog',
                rating: reviewData.rating,
                comment: reviewData.comment
            });
            
            console.log("Review submission response:", response.data);
            
            // Update the blog in our state with new review count and rating
            const updatedBlogs = blogs.map(blog => {
                if(blog._id === selectedBlog._id) {
                    return {
                        ...blog,
                        totalReviews: (blog.totalReviews || 0) + 1,
                        averageRating: (((blog.averageRating || 0) * (blog.totalReviews || 0)) + reviewData.rating) / ((blog.totalReviews || 0) + 1)
                    };
                }
                return blog;
            });
            
            setBlogs(updatedBlogs);
            setSelectedBlog(null);
            setReviewData({ rating: 5, comment: '' });
        } catch (error) {
            if (error.response?.data?.error === 'You have already submitted a review for this item') {
                alert("You've already reviewed this item. You can only submit one review per item.");
            } else {
                console.error("Error submitting review:", error.response?.data || error.message);
                alert("Failed to submit review: " + (error.response?.data?.error || error.message));
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
                <h2 className="text-3xl font-bold text-center md:text-left text-charcoal mb-4 md:mb-0">
                    Latest Travel Blogs
                </h2>
                <div className="flex justify-center md:justify-end">
                    <Link 
                        to="/partnership#blog-section"
                        className="inline-flex items-center bg-tan hover:bg-gold text-cream font-medium py-2 px-4 rounded-lg transition duration-300"
                    >
                        <FaPlus className="mr-2" /> Submit Blog
                    </Link>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                    <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                        {/* Conditionally render image or a placeholder */}
                        <Link to={`/blogs/${blog._id}`}>
                            {blog.image ? (
                                <>
                                    {/* Debug output - will show in browser console */}
                                    {console.log('Blog Image Debug:', {
                                        blogId: blog._id,
                                        rawPath: blog.image,
                                        constructedUrl: blog.image.startsWith('http') 
                                            ? blog.image 
                                            : `${import.meta.env.VITE_BACKEND_URL}/${blog.image.replace(/\\/g, '/')}`
                                    })}
                                    <img 
                                        src={blog.image.startsWith('http') 
                                            ? blog.image 
                                            : `http://localhost:5000/${blog.image.replace(/\\/g, '/')}`} 
                                        alt={blog.title} 
                                        className="w-full h-48 object-cover" 
                                        onError={(e) => {
                                            console.log('Image load error for blog:', blog._id, blog.title);
                                            console.log('Failed URL:', e.target.src);
                                            e.target.onerror = null; 
                                            e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                                        }}
                                    />
                                </>
                            ) : (
                                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                                    <FaLink className="text-gray-400 text-5xl" />
                                </div>
                            )}
                        </Link>
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-xl font-semibold text-charcoal mb-2">{blog.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">By {blog.author}</p>
                            
                            {/* Display ratings */}
                            <div className="mb-3">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar 
                                            key={index} 
                                            className={`${index < (blog.averageRating || 0) ? 'text-yellow-500' : 'text-gray-300'} w-4 h-4 cursor-pointer`}
                                            onClick={() => {
                                                setReviewData({...reviewData, rating: index + 1});
                                                setSelectedBlog(blog);
                                            }}
                                        />
                                    ))}
                                    <span className="ml-1 text-sm text-gray-600">({blog.averageRating || 0})</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {blog.totalReviews || 0} {blog.totalReviews === 1 ? 'review' : 'reviews'}
                                </p>
                                <button 
                                    onClick={() => setSelectedBlog(blog)}
                                    className="text-sm text-tan hover:text-gold mt-1"
                                >
                                    Add Review
                                </button>
                            </div>
                            
                            <div className="mt-auto pt-2">
                                <Link to={`/blogs/${blog._id}`} className="inline-block text-tan hover:text-gold font-medium">
                                    Read More →
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Review Modal */}
            {selectedBlog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-charcoal">Rate this article</h3>
                            <button onClick={() => setSelectedBlog(null)} className="text-gray-500 hover:text-gray-700">
                                &times;
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">Your Rating</label>
                                <div className="flex items-center">
                                    {renderInteractiveStars()}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">Your Review (Optional)</label>
                                <textarea
                                    value={reviewData.comment}
                                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tan focus:border-transparent"
                                    placeholder="Share your thoughts about this item (optional)"
                                />
                            </div>
                            
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedBlog(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-tan text-cream rounded-lg hover:bg-gold"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogList;
