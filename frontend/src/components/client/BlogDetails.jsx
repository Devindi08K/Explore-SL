import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogRes = await api.get(`/blogs/${id}`);
        setBlog(blogRes.data);
      } catch (error) {
        console.error('Error fetching blog details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
    </div>
  );
};

export default BlogDetails;
