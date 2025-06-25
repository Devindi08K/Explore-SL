const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Blog = require('../models/blog');
const TourGuide = require('../models/TourGuide'); 
const Vehicle = require('../models/Vehicle');
const Tour = require('../models/Tour');
const { protect } = require('../middleware/authMiddleware');

// Create a new review
router.post('/', protect, async (req, res) => {
  try {
    const { itemId, itemType, rating, comment } = req.body;
    console.log("Review submission:", { itemId, itemType, rating, comment, userId: req.user?._id });
    
    // Create new review
    const review = new Review({
      userId: req.user._id,
      itemId,
      itemType,
      rating,
      comment,
      createdAt: new Date()
    });
    
    // Save review
    const savedReview = await review.save();
    
    // Update the corresponding item with review reference and recalculate average
    let Model;
    switch (itemType) {
      case 'blog':
        Model = Blog;
        break;
      case 'tourGuide':
        Model = TourGuide;
        break;
      case 'vehicle':
        Model = Vehicle;
        break;
      case 'tour':
        Model = Tour;
        break;
      default:
        return res.status(400).json({ error: 'Invalid item type' });
    }
    
    // Get the item
    const item = await Model.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Add review to item
    item.reviews.push(savedReview._id);
    
    // Calculate new average
    const totalRating = (item.averageRating * item.totalReviews) + rating;
    item.totalReviews += 1;
    item.averageRating = totalRating / item.totalReviews;
    
    // Save item
    await item.save();
    
    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error adding review - DETAILS:', error); // More detailed error logging
    res.status(500).json({ error: 'Error adding review' });
  }
});

// Get reviews for an item
router.get('/:itemType/:itemId', async (req, res) => {
  try {
    const { itemType, itemId } = req.params;
    
    const reviews = await Review.find({ 
      itemType, 
      itemId 
    }).populate('userId', 'userName');
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

module.exports = router;