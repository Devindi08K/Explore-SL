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
    const { itemType } = req.body;
    if (itemType === 'blog') {
      return res.status(400).json({ error: 'Blog reviews are disabled.' });
    }

    const { itemId, rating, comment } = req.body;
    const userId = req.user._id;

    console.log(`Creating review: ${itemType} ${itemId} by user ${userId} with rating ${rating}`);

    // 1. Find the correct Model and item based on itemType
    let Model;
    switch (itemType) {
      case 'blog': Model = Blog; break;
      case 'tourGuide': Model = TourGuide; break;
      case 'vehicle': Model = Vehicle; break;
      case 'tour': Model = Tour; break;
      default: return res.status(400).json({ error: 'Invalid item type' });
    }

    const item = await Model.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    // 2. Backend check to prevent self-review
    if (item.submittedBy && item.submittedBy.toString() === userId.toString()) {
      return res.status(403).json({ error: 'You cannot review your own content.' });
    }

    // 3. Check if user has already reviewed this item
    const existingReview = await Review.findOne({ userId, itemId, itemType });
    if (existingReview) {
        return res.status(400).json({ error: 'You have already submitted a review for this item.' });
    }

    // 4. Create and save the new review
    const review = new Review({
      userId, 
      itemId, 
      itemType, 
      rating,
      comment
    });
    
    const savedReview = await review.save();
    console.log(`Review saved: ${savedReview._id}`);

    // 5. Fetch the updated item to return correct averageRating and totalReviews
    const updatedItem = await Model.findById(itemId);

    res.status(201).json({ 
      success: true, 
      review: savedReview,
      averageRating: updatedItem.averageRating,
      totalReviews: updatedItem.totalReviews 
    });

  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Server error while creating review.' });
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