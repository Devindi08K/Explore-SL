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
    priceRange: 'Rs ',  // Initialize with currency
    highlights: '',      // Optional
    included: '',        // Optional
    notIncluded: '',     // Optional
    email: '',
    phone: '',
    message: '',         // Optional
    isExternal: false,
    bookingUrl: '',
    startingPoint: 'To be determined',
    endingPoint: 'To be determined'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const tourData = {
        name: formData.tourName,
        type: formData.tourType,
        description: formData.description,
        image: "https://placehold.co/600x400?text=Tour+Image", // Default placeholder
        isExternal: hasWebsite,
        bookingUrl: hasWebsite ? formData.bookingUrl : "",
        priceRange: formData.priceRange,
        duration: formData.duration || "",
        groupSize: formData.groupSize || "",
        highlights: formData.highlights || "",
        included: formData.included || "",
        notIncluded: formData.notIncluded || "",
        startingPoint: "To be determined", // Default value for required field
        endingPoint: "To be determined", // Default value for required field
        itinerary: [{ day: "Day 1", description: "Detailed itinerary will be provided" }],
        contactEmail: formData.email,
        contactPhone: formData.phone,
        status: 'pending',
        isVerified: false,
        submittedAt: new Date()
      };

      const response = await api.post("/tours", tourData);
      alert("Tour submitted successfully! Awaiting admin approval.");
      navigate('/tours');
    } catch (error) {
      console.error("Error submitting tour:", error);
      alert("Failed to submit tour: " + (error.response?.data?.error || error.message));
    } finally {
      setIsSubmitting(false);
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
                <div className="relative">
                  <select
                    name="currency"
                    value={formData.priceRange.startsWith('$') ? '$' : 'Rs'}
                    onChange={(e) => {
                      const numericPart = formData.priceRange.replace(/[^0-9-]/g, '');
                      setFormData({
                        ...formData,
                        priceRange: `${e.target.value}${numericPart}`
                      });
                    }}
                    className="absolute left-0 top-0 h-full px-2 border-r border-tan"
                  >
                    <option value="Rs">Rs</option>
                    <option value="$">$</option>
                  </select>
                  <input
                    type="text"
                    name="priceRange"
                    placeholder="e.g., 1000-2000 per person"
                    value={formData.priceRange.replace(/^(Rs|\$)/, '')}
                    onChange={(e) => {
                      const currency = formData.priceRange.startsWith('$') ? '$' : 'Rs';
                      setFormData({
                        ...formData,
                        priceRange: `${currency}${e.target.value}`
                      });
                    }}
                    required
                    className="w-full pl-16 px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-charcoal mb-2">Tour Highlights (Optional)</label>
                <textarea
                  name="highlights"
                  value={formData.highlights}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Key attractions and activities"
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                ></textarea>
              </div>

              <div>
                <label className="block text-charcoal mb-2">What's Included (Optional)</label>
                <textarea
                  name="included"
                  value={formData.included}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Transportation, accommodation, meals, etc."
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                ></textarea>
              </div>

              <div>
                <label className="block text-charcoal mb-2">What's Not Included (Optional)</label>
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
                <label className="block text-charcoal mb-2">Additional Message (Optional)</label>
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