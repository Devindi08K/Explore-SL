const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect } = require('../middleware/authMiddleware');

// Add a review
router.post('/', protect, async (req, res) => {
  try {
    const { itemId, itemType, rating, comment } = req.body;
    
    // Validate that rating exists and is between 1-5
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating is required and must be between 1-5' });
    }
    
    // Check if the user has already reviewed this item
    const existingReview = await Review.findOne({
      userId: req.user._id,
      itemId,
      itemType
    });
    
    if (existingReview) {
      return res.status(400).json({ 
        error: 'You have already submitted a review for this item',
        existingReview // Optionally return the existing review
      });
    }
    
    // Create review object (comment is optional)
    const reviewData = {
      userId: req.user._id,
      itemId,
      itemType,
      rating,
      createdAt: new Date()
    };
    
    // Only add comment if provided
    if (comment && comment.trim()) {
      reviewData.comment = comment;
    }
    
    const review = new Review(reviewData);
    const savedReview = await review.save();
    
    // Update the item with proper rating calculation
    let Model;
    switch (itemType) {
      case 'blog':
        Model = require('../models/blog');
        break;
      case 'tourGuide':
        Model = require('../models/TourGuide');
        break;
      case 'vehicle':
        Model = require('../models/Vehicle');
        break;
      case 'tour':
        Model = require('../models/Tour');
        break;
      default:
        return res.status(400).json({ error: 'Invalid item type' });
    }

    // Find the item first to get current rating data
    const item = await Model.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Calculate new average rating
    const currentTotal = (item.averageRating || 0) * (item.totalReviews || 0);
    const newTotal = currentTotal + rating;
    const newCount = (item.totalReviews || 0) + 1;
    const newAverage = newTotal / newCount;

    // Update the item with new values
    await Model.findByIdAndUpdate(itemId, {
      $push: { reviews: savedReview._id },
      totalReviews: newCount,
      averageRating: newAverage
    });

    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error adding review:', error);
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
    }).populate('userId', 'userName').sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

module.exports = router;