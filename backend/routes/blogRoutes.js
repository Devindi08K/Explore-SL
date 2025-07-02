const express = require("express");
const Blog = require("../models/blog");
const { protect, authorize } = require("../middleware/authMiddleware");
const multer = require('multer'); // Assuming you use multer for uploads
const Payment = require('../models/Payment');
const User = require('../models/User');

// Configure multer for image uploads
const upload = multer({ dest: 'uploads/' }); 

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

// Submit a sponsored blog post
router.post('/sponsored', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, content, paymentId } = req.body;
    const user = await User.findById(req.user._id);

    // 1. Verify the payment voucher
    const payment = await Payment.findById(paymentId);
    if (!payment || payment.userId.toString() !== req.user._id.toString() || payment.serviceType !== 'sponsored_blog_post' || !payment.subscriptionDetails.awaitingSubmission) {
      return res.status(403).json({ error: 'Invalid or used payment voucher.' });
    }

    // 2. Create the blog post
    const newBlog = new Blog({
      title,
      content,
      image: req.file ? req.file.path : null,
      author: user.userName,
      isSponsored: true,
      sponsorshipDate: new Date(),
      submittedBy: req.user._id,
      status: 'pending',
    });

    const savedBlog = await newBlog.save();

    // 3. Mark the payment voucher as used
    payment.subscriptionDetails.awaitingSubmission = false;
    payment.subscriptionDetails.itemId = savedBlog._id;
    payment.description = `Sponsored Blog Post: ${savedBlog.title}`;
    await payment.save();

    res.status(201).json(savedBlog);
  } catch (error) {
    console.error('Error submitting sponsored blog:', error);
    res.status(500).json({ error: 'Failed to submit sponsored blog post.' });
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

// Get blog submissions for current user
router.get('/my-submissions', protect, async (req, res) => {
  try {
    const blogs = await Blog.find({ 
      submittedBy: req.user._id 
    }).sort({ submittedAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({ error: 'Error fetching blogs' });
  }
});

module.exports = router;
