import React, { useState, useEffect } from "react";
import api from '../../utils/api';
import { useNavigate, Link } from 'react-router-dom';

const AdminBlogForm = () => {
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    image: "",
    author: "",
  });
  const [blogs, setBlogs] = useState([]); // State to hold all blogs
  const [editingId, setEditingId] = useState(null); // Track the blog being edited
  const navigate = useNavigate();

  // Fetch blogs from backend
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

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  // Add or update blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/blogs/${editingId}`, blog);
        alert("Blog updated successfully!");
        setEditingId(null);
      } else {
        await api.post("/blogs", blog);
        alert("Blog added successfully!");
      }
      setBlog({ title: "", content: "", image: "", author: "" });
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  // Load blog details into form for editing
  const handleEdit = (blog) => {
    setBlog(blog);
    setEditingId(blog._id);
  };

  // Delete a blog post
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await api.delete(`/blogs/${id}`);
        alert("Blog deleted!");
        fetchBlogs();
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 bg-cream">
      <h2 className="text-2xl font-bold mb-4 text-charcoal">
        {editingId ? "Edit Blog" : "Add a New Blog"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={blog.title}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={blog.image}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />

        {blog.image && (
          <img src={blog.image} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded-md" />
        )}

        <input
          type="text"
          name="author"
          placeholder="Author Name"
          value={blog.author}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-tan"
        />
        <textarea
          name="content"
          placeholder="Content"
          value={blog.content}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="w-full bg-tan text-cream py-2 rounded-md hover:bg-gold transition duration-300"
        >
          {editingId ? "Update Blog" : "Add Blog"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-8 text-charcoal">All Blogs</h2>
      <div className="mt-4 space-y-6">
        {blogs.map((b) => (
          <div key={b._id} className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-charcoal">{b.title}</h3>
            <p className="text-sm text-gray-600 mt-1">Author: {b.author}</p>
            <img src={b.image} alt={b.title} className="mt-2 rounded-md w-32 h-32 object-cover" />
            <p className="mt-2 text-gray-600">
              {b.content.length > 100 ? b.content.substring(0, 100) + "..." : b.content}
            </p>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => handleEdit(b)}
                className="px-4 py-2 bg-tan text-cream rounded-md hover:bg-gold"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(b._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlogForm;
