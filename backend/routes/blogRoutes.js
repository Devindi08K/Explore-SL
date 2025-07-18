const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const Blog = require("../models/blog");
const Payment = require("../models/Payment");
const User = require("../models/User");
const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig'); // Add this import

// Note: Assuming a simple multer setup. Adjust if yours is different.
const upload = multer({ dest: 'uploads/blogs/' });

// --- Specific, non-parameterized routes first ---

// Get all blogs for public listing (for admin)
router.get("/all", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ submittedAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    res.status(500).json({ error: "Error fetching blogs" });
  }
});

// Get all approved blogs for public view
router.get("/", async (req, res) => {
  try {
    // Use .lean() to get plain JavaScript objects that can be modified
    const blogs = await Blog.find({ status: 'approved' })
      .populate('submittedBy', 'userName')
      .sort({ submittedAt: -1 })
      .lean();

    // Process the blogs to create a simple author ID for checks and a name for display
    const processedBlogs = blogs.map(blog => {
      if (blog.submittedBy) {
        blog.authorName = blog.submittedBy.userName; // Add authorName for display
        blog.submittedBy = blog.submittedBy._id.toString(); // Keep submittedBy as a simple ID
      }
      return blog;
    });

    res.json(processedBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Error fetching blogs" });
  }
});

// Get blog submissions for the currently logged-in user
router.get('/my-submissions', protect, async (req, res) => {
  try {
    const blogs = await Blog.find({ submittedBy: req.user._id }).sort({ submittedAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({ error: 'Error fetching blogs' });
  }
});

// --- Routes for creating new blogs ---

// Submit a sponsored blog post
router.post('/sponsored', protect, upload.single('image'), async (req, res) => {
  try {
    const { paymentId, isExternal, title, content, author, blogUrl, imageUrl } = req.body;
    const user = await User.findById(req.user._id);

    const payment = await Payment.findById(paymentId);
    if (!payment || payment.userId.toString() !== req.user._id.toString() || payment.serviceType !== 'sponsored_blog_post' || !payment.subscriptionDetails.awaitingSubmission) {
      return res.status(403).json({ error: 'Invalid or used payment voucher.' });
    }

    const blogData = {
      isSponsored: true,
      paymentId: payment._id,
      submittedBy: req.user._id,
      status: 'pending',
      isVerified: false,
      isExternal: isExternal === 'true'
    };

    if (blogData.isExternal) {
      blogData.title = title;
      blogData.author = author;
      blogData.blogUrl = blogUrl;
      blogData.image = imageUrl;
    } else {
      blogData.title = title;
      blogData.content = content;
      blogData.author = user.userName;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'blogs' });
        blogData.image = result.secure_url;
      }
    }

    const newBlog = new Blog(blogData);
    await newBlog.save();

    payment.subscriptionDetails.awaitingSubmission = false;
    payment.itemId = newBlog._id;
    await payment.save();

    res.status(201).json(newBlog);
  } catch (error) {
    console.error('Error submitting sponsored blog:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: `Validation Error: ${error.message}` });
    }
    res.status(500).json({ error: 'Failed to submit sponsored blog post.' });
  }
});

// Create a new blog post (general, for admin)
router.post("/", protect, authorize(["admin"]), upload.single('image'), async (req, res) => {
  try {
     const { title, content, author } = req.body;
     const blogData = { title, content, author, status: 'approved', isVerified: true };
     if (req.file) {
       const result = await cloudinary.uploader.upload(req.file.path, { folder: 'blogs' });
       blogData.image = result.secure_url;
     }
     const newBlog = new Blog(blogData);
     await newBlog.save();
     res.status(201).json(newBlog);
  } catch (err) {
     res.status(500).json({ error: err.message });
  }
});

// --- Parameterized routes last ---

// Get a single blog post by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('submittedBy', 'userName')
      .lean(); // Use .lean() here as well

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Apply the same processing for the single blog view
    if (blog.submittedBy) {
      blog.authorName = blog.submittedBy.userName;
      blog.submittedBy = blog.submittedBy._id.toString();
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a blog post
router.put("/:id", protect, authorize(["admin"]), upload.single('image'), async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const updateData = { title, content, author };
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'blogs' });
      updateData.image = result.secure_url;
    }
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });
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
    const { status } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { status, isVerified: status === 'approved', verifiedAt: new Date(), verifiedBy: req.user._id },
      { new: true }
    );
    if (!updatedBlog) return res.status(404).json({ error: "Blog not found" });
    res.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog status:", error);
    res.status(500).json({ error: "Error updating blog status" });
  }
});

// Allow users to update their own blog posts
router.put("/user/:id", protect, upload.single('image'), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You can only edit your own blog posts" });
    }

    const updateData = { ...req.body };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'blogs' });
      updateData.image = result.secure_url;
    }

    updateData.isExternal = blog.isExternal;
    updateData.status = blog.status;
    updateData.isVerified = blog.isVerified;
    updateData.lastUpdated = new Date();
    updateData.needsReview = true;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
