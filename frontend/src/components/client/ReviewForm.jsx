import React, { useState } from 'react';
import api from '../../utils/api';

const ReviewForm = ({ itemId, itemType, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/reviews', {
        itemId,
        itemType,
        rating,
        comment
      });
      onReviewAdded(response.data);
      setRating(5);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-charcoal">Rating</label>
        <select 
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300"
        >
          {[5,4,3,2,1].map(num => (
            <option key={num} value={num}>{num} Stars</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows="4"
          className="mt-1 block w-full rounded-md border-gray-300"
        />
      </div>
      <button type="submit" className="bg-tan text-cream px-4 py-2 rounded-lg">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;