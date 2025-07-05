import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from '../../utils/api';
import { FaLink, FaPlus, FaSpinner, FaArrowUp } from 'react-icons/fa'; // Add FaArrowUp
import { AuthContext } from "../../context/AuthContext";

const BlogList = () => {
    const { currentUser } = useContext(AuthContext);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showScrollButton, setShowScrollButton] = useState(false); // Add this state

    useEffect(() => {
        fetchBlogs();
        
        // Add scroll event listener to show/hide button
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/blogs", { timeout: 10000 });
            setBlogs(response.data);
        } catch (error) {
            setError("Failed to load blogs. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            {/* Replace the header section with this more mobile-friendly version */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
                <h2 className="text-3xl font-bold text-center md:text-left text-charcoal mb-4 md:mb-0">
                    Latest Travel Blogs
                </h2>
                <div className="flex justify-center md:justify-end w-full md:w-auto">
                    <Link 
                        to="/partnership#blog-section"
                        className="w-full md:w-auto inline-flex items-center justify-center bg-tan hover:bg-gold text-cream font-medium py-3 px-6 rounded-lg transition duration-300"
                    >
                        <FaPlus className="mr-2" /> Submit Blog
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <FaSpinner className="animate-spin text-tan text-3xl" />
                    <span className="ml-2 text-lg text-gray-600">Loading blogs...</span>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
                    <p>{error}</p>
                </div>
            ) : blogs.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <p className="text-lg text-gray-600">No blogs available at the moment.</p>
                </div>
            ) : (
                /* Improve blog cards for mobile */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {blogs.map((blog) => (
                        <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                            {/* Make image height consistent on mobile */}
                            <Link to={`/blogs/${blog._id}`}>
                                {blog.image ? (
                                    <div className="h-48 sm:h-40 md:h-48 overflow-hidden">
                                        <img 
                                            src={blog.image.startsWith('http') 
                                                ? blog.image 
                                                : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/${blog.image.replace(/\\/g, '/')}`} 
                                            alt={blog.title} 
                                            className="w-full h-full object-cover" 
                                            onError={(e) => {
                                                e.target.onerror = null; 
                                                e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="h-48 sm:h-40 md:h-48 bg-gray-100 flex items-center justify-center">
                                        <FaLink className="text-gray-400 text-5xl" />
                                    </div>
                                )}
                            </Link>
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-xl font-semibold text-charcoal mb-2 line-clamp-2">{blog.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">By {blog.authorName || blog.author}</p>
                                <p className="text-gray-700 text-sm mb-4 line-clamp-3 flex-grow">{blog.content}</p>
                                <div className="mt-auto pt-2">
                                    <Link to={`/blogs/${blog._id}`} className="inline-block text-tan hover:text-gold font-medium">
                                        Read More →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Scroll to Top Button */}
            {showScrollButton && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-8 right-8 bg-tan text-cream p-3 rounded-full shadow-lg hover:bg-gold transition-colors z-10"
                    aria-label="Scroll to top"
                >
                    <FaArrowUp className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

export default BlogList;
