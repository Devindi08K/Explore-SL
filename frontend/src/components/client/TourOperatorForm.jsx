import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api'; // Correct import path

const TourSubmissionForm = () => {
  const [hasWebsite, setHasWebsite] = useState(false);
  const [formData, setFormData] = useState({
    tourName: '',
    tourType: 'safari',
    description: '',
    duration: '',
    groupSize: '',
    priceRange: '',
    highlights: '',
    included: '',
    notIncluded: '',
    email: '',
    phone: '',
    message: '',
    isExternal: false,
    bookingUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tours", {
        ...formData,
        isExternal: hasWebsite
      });
      alert("Tour submitted successfully!");
      navigate('/tours');
    } catch (error) {
      console.error("Error submitting tour:", error);
      alert("Failed to submit tour");
    }
  };

  return (
    <div className="min-h-screen bg-cream py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-charcoal mb-6 text-center">Submit Your Tour</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={hasWebsite}
                onChange={(e) => setHasWebsite(e.target.checked)}
                className="form-checkbox text-tan"
              />
              <span>I have a website for managing tours</span>
            </label>
          </div>

          {hasWebsite ? (
            <div className="mb-4">
              <label className="block text-charcoal mb-2">Booking Website URL</label>
              <input
                type="url"
                name="bookingUrl"
                value={formData.bookingUrl}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="https://..."
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-charcoal mb-2">Tour Name</label>
                <input
                  type="text"
                  name="tourName"
                  value={formData.tourName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-charcoal mb-2">Tour Type</label>
                <select
                  name="tourType"
                  value={formData.tourType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="safari">Safari Tour</option>
                  <option value="cultural">Cultural Tour</option>
                  <option value="adventure">Adventure Tour</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-charcoal mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                ></textarea>
              </div>

              <div>
                <label className="block text-charcoal mb-2">Duration</label>
                <input
                  type="text"
                  name="duration"
                  placeholder="e.g., 3 days, 2 nights"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-charcoal mb-2">Group Size</label>
                <input
                  type="text"
                  name="groupSize"
                  placeholder="e.g., 2-10 people"
                  value={formData.groupSize}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-charcoal mb-2">Price Range</label>
                <input
                  type="text"
                  name="priceRange"
                  placeholder="e.g., $100-$200 per person"
                  value={formData.priceRange}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-charcoal mb-2">Tour Highlights</label>
                <textarea
                  name="highlights"
                  value={formData.highlights}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Key attractions and activities"
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                ></textarea>
              </div>

              <div>
                <label className="block text-charcoal mb-2">What's Included</label>
                <textarea
                  name="included"
                  value={formData.included}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Transportation, accommodation, meals, etc."
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                ></textarea>
              </div>

              <div>
                <label className="block text-charcoal mb-2">What's Not Included</label>
                <textarea
                  name="notIncluded"
                  value={formData.notIncluded}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Flights, personal expenses, etc."
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                ></textarea>
              </div>

              <div>
                <label className="block text-charcoal mb-2">Contact Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-charcoal mb-2">Contact Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-charcoal mb-2">Additional Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                ></textarea>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-tan text-cream py-3 rounded-lg hover:bg-gold transition duration-200"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Tour'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TourSubmissionForm;