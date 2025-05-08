import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from '../../utils/api';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await api.get("/blogs"); // This will only get verified blogs
                setBlogs(response.data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-center text-charcoal mb-8">
                Latest Travel Blogs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                    <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-charcoal mb-2">{blog.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">By {blog.author}</p>
                            <Link to={`/blogs/${blog._id}`} className="inline-block mt-2 text-tan hover:text-gold font-medium">
                                Read More →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogList;
