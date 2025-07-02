import React, { useState, useEffect } from "react";
import api from '../../utils/api';
import { useNavigate, Link } from 'react-router-dom';

const AdminBlogForm = () => {
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Add state for resetting file input
  const navigate = useNavigate();

  // Fetch blogs from backend
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get("/blogs/all");
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Add or update blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', blog.title);
    formData.append('content', blog.content);
    formData.append('author', blog.author);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editingId) {
        await api.put(`/blogs/${editingId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        alert("Blog updated successfully!");
        setEditingId(null);
      } else {
        await api.post("/blogs", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        alert("Blog added successfully!");
      }
      setBlog({ title: "", content: "", author: "" });
      setImageFile(null);
      setImagePreview("");
      setFileInputKey(Date.now()); // Reset the file input by changing its key
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  // Load blog details into form for editing
  const handleEdit = (blogToEdit) => {
    setBlog(blogToEdit);
    setEditingId(blogToEdit._id);
    if (blogToEdit.image) {
      const imageUrl = blogToEdit.image.startsWith('http')
        ? blogToEdit.image
        : `${import.meta.env.VITE_BACKEND_URL}/${blogToEdit.image.replace(/\\/g, '/')}`;
      setImagePreview(imageUrl);
    } else {
      setImagePreview("");
    }
    setImageFile(null);
    setFileInputKey(Date.now()); // Reset the file input by changing its key
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

  const handleVerification = async (id, isVerified) => {
    try {
      await api.patch(`/blogs/${id}/verify`, { 
        status: isVerified ? 'approved' : 'rejected',
        isVerified
      });
      fetchBlogs();
    } catch (error) {
      console.error("Error updating verification status:", error);
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
          key={fileInputKey} // Add the key here
          type="file"
          name="image"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />

        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded-md" />
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
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-charcoal">
                  {b.title}
                  {b.isVerified && (
                    <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      Verified
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Author: {b.author}</p>
                {b.image && (
                  <img 
                    src={b.image.startsWith('http') ? b.image : `${import.meta.env.VITE_BACKEND_URL}/${b.image.replace(/\\/g, '/')}`} 
                    alt={b.title} 
                    className="mt-2 rounded-md w-32 h-32 object-cover" 
                  />
                )}
                <p className="mt-2 text-gray-600">
                  {b.content?.length > 100 ? b.content.substring(0, 100) + "..." : b.content}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleVerification(b._id, !b.isVerified)}
                  className={`px-4 py-2 rounded-md ${
                    b.isVerified 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {b.isVerified ? 'Unverify' : 'Verify'}
                </button>
                <button
                  onClick={() => handleEdit(b)}
                  className="px-4 py-2 bg-tan text-cream rounded-md hover:bg-gold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                b.status === 'approved' 
                  ? 'bg-green-100 text-green-800'
                  : b.status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {b.status?.charAt(0).toUpperCase() + b.status?.slice(1) || 'Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlogForm;
