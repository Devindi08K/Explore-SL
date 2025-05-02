import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../../utils/api';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError("Failed to load blog. Please try again later.");
      }
    };
    
    fetchBlog();
  }, [id]);

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (!blog) {
    return <p className="text-center text-gray-600 mt-4">Loading blog...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-2 text-center text-charcoal">
            {blog.title}
        </h2>
        <p className="text-center text-gray-600 mb-4">Written by {blog.author}</p>

        {/* Image */}
        <div className="flex justify-center mb-6">
            <img
                src={blog.image}
                alt={blog.title}
                className="rounded-lg shadow-md max-h-[400px] object-cover w-full"
            />
        </div>

        {/* Content */}
        <div className="text-lg text-gray-700 text-center">
            {blog.content ? (
                <p>
                    <a
                        href={blog.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-tan hover:text-gold"
                    >
                        Click here to read the blog
                    </a>
                </p>
            ) : (
                <p>No content available.</p>
            )}
        </div>
    </div>
  );
};

export default BlogDetails;
