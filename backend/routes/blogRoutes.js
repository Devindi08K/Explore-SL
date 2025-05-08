const express = require("express");
const Blog = require("../models/blog");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all blogs (public route - only show verified/approved blogs)
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({ 
      isVerified: true,
      status: 'approved'
    }).sort({ submittedAt: -1 }); // Show newest first
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Error fetching blogs" });
  }
});

// Add a new route for admin to get all blogs
router.get("/all", protect, authorize(["admin"]), async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ submittedAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    res.status(500).json({ error: "Error fetching blogs" });
  }
});

// Get a single blog post by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new blog post
router.post("/", async (req, res) => {
  try {
     const { title, content, image, author } = req.body;
     const newBlog = new Blog({ title, content, image, author });
     await newBlog.save();
     res.status(201).json(newBlog);
  } catch (err) {
     res.status(500).json({ error: err.message });
  }
});

// Update a blog post
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image, author } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content, image, author },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a blog post
router.delete("/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update blog verification status
router.patch("/:id/verify", protect, authorize(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        status,
        isVerified: status === 'approved',
        verifiedAt: new Date(),
        verifiedBy: req.user._id
      },
      { new: true }
    );

    res.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog status:", error);
    res.status(500).json({ error: "Error updating blog status" });
  }
});

module.exports = router;
