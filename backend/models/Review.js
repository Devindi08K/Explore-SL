const mongoose = require('mongoose');
const Blog = require('./blog');

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please provide a rating'],
    },
    comment: {
        type: String,
        trim: true,
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    itemId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    itemType: {
        type: String,
        required: true,
        enum: ['blog', 'tourGuide', 'vehicle', 'tour']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Prevent a user from submitting more than one review per item
reviewSchema.index({ itemId: 1, userId: 1 }, { unique: true });

// Static method to update average rating and total reviews for blogs
reviewSchema.statics.updateBlogStats = async function(blogId) {
  const stats = await this.aggregate([
    { $match: { itemId: mongoose.Types.ObjectId(blogId), itemType: 'blog' } },
    { $group: {
      _id: '$itemId',
      averageRating: { $avg: '$rating' },
      totalReviews: { $sum: 1 }
    }}
  ]);
  if (stats.length > 0) {
    await Blog.findByIdAndUpdate(blogId, {
      averageRating: stats[0].averageRating,
      totalReviews: stats[0].totalReviews
    });
  } else {
    await Blog.findByIdAndUpdate(blogId, {
      averageRating: 0,
      totalReviews: 0
    });
  }
};

// After saving a review, update the blog stats
reviewSchema.post('save', function() {
  if (this.itemType === 'blog') {
    this.constructor.updateBlogStats(this.itemId);
  }
});

// After removing a review, update the blog stats
reviewSchema.post('remove', function() {
  if (this.itemType === 'blog') {
    this.constructor.updateBlogStats(this.itemId);
  }
});

module.exports = mongoose.model('Review', reviewSchema);