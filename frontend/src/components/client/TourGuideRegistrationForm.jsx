import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const TourGuideRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    bio: '',
    languages: [],
    specialization: [],
    yearsOfExperience: '',
    certifications: [], // Optional
    licenseNumber: '', // Optional
    contactEmail: '',
    contactPhone: '',
    whatsapp: '', // Optional
    availability: 'All Week',
    ratePerDay: '',
    preferredAreas: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const languageCategories = {
    local: ['English', 'Sinhala', 'Tamil'],
    european: ['French', 'German', 'Italian', 'Spanish', 'Dutch', 'Russian', 'Polish'],
    asian: ['Mandarin Chinese', 'Cantonese', 'Japanese', 'Korean', 'Thai', 'Vietnamese', 'Malay'],
    other: ['Arabic', 'Hebrew', 'Persian', 'Hindi', 'Malayalam', 'Bengali', 'Urdu']
  };

  const specializations = [
    'Cultural Tours', 'Adventure Tours', 'Wildlife Tours', 'Historical Tours',
    'Hiking', 'Photography Tours', 'Food Tours', 'Religious Tours',
    'Beach Tours', 'City Tours', 'Nature Tours', 'Architectural Tours'
  ];

  const districts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
    'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
    'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
    'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate required fields
    const requiredFields = {
      name: formData.name,
      image: formData.image,
      bio: formData.bio,
      yearsOfExperience: formData.yearsOfExperience,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      availability: formData.availability,
      ratePerDay: formData.ratePerDay,
      preferredAreas: formData.preferredAreas.length > 0
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    try {
      const validCertifications = formData.certifications.filter(cert => 
        cert.name || cert.issuedBy || cert.year
      );

      const dataToSubmit = {
        ...formData,
        certifications: validCertifications,
        languages: formData.languages || [],
        specialization: formData.specialization || [],
        preferredAreas: formData.preferredAreas || [],
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        status: 'pending',
        isVerified: false,
        submittedAt: new Date()
      };

      const response = await api.post("/tour-guides", dataToSubmit);
      
      if (response.data) {
        alert("Tour guide registration submitted successfully! Awaiting admin approval.");
        navigate('/tour-guides');
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.error || 
        "Error submitting registration. Please check all required fields."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLanguageToggle = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleSpecializationToggle = (spec) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter(s => s !== spec)
        : [...prev.specialization, spec]
    }));
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [...formData.certifications, { name: "", issuedBy: "", year: "" }]
    });
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-charcoal text-center mb-8">
          Register as a Tour Guide
        </h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Profile Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Phone</label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Existing email and phone fields */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">WhatsApp (Optional)</label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="WhatsApp number (if different from phone)"
              />
            </div>
          </div>

          {/* Experience and Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Years of Experience</label>
              <input
                type="number"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Rate per Day</label>
              <input
                type="text"
                value={formData.ratePerDay}
                onChange={(e) => setFormData({ ...formData, ratePerDay: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
                placeholder="e.g., Rs. 5000"
              />
            </div>
          </div>

          {/* Bio and Availability */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Availability</label>
            <input
              type="text"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              required
              placeholder="e.g., Weekdays, All week, Weekends only"
            />
          </div>

          {/* Preferred Areas */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Preferred Areas
              <span className="text-sm text-gray-500 ml-1">(Select at least one)</span>
            </label>
            <div className="max-h-60 overflow-y-auto border border-tan rounded-lg p-4">
              <div className="grid grid-cols-2 gap-2">
                {districts.map((district) => (
                  <label key={district} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.preferredAreas.includes(district)}
                      onChange={() => {
                        const updatedAreas = formData.preferredAreas.includes(district)
                          ? formData.preferredAreas.filter(area => area !== district)
                          : [...formData.preferredAreas, district];
                        setFormData({ ...formData, preferredAreas: updatedAreas });
                      }}
                      className="rounded border-tan text-gold focus:ring-gold"
                    />
                    <span className="text-sm">{district}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Languages and Specializations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Languages</label>
              <div className="max-h-60 overflow-y-auto border border-tan rounded-lg p-4">
                {Object.entries(languageCategories).map(([category, languages]) => (
                  <div key={category} className="mb-4">
                    <h4 className="text-sm font-medium text-charcoal capitalize mb-2">{category} Languages</h4>
                    <div className="space-y-2">
                      {languages.map((lang) => (
                        <label key={lang} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.languages.includes(lang)}
                            onChange={() => handleLanguageToggle(lang)}
                            className="rounded border-tan text-gold focus:ring-gold"
                          />
                          <span className="text-sm">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Specializations</label>
              <div className="max-h-60 overflow-y-auto border border-tan rounded-lg p-4">
                {specializations.map((spec) => (
                  <label key={spec} className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      checked={formData.specialization.includes(spec)}
                      onChange={() => handleSpecializationToggle(spec)}
                      className="rounded border-tan text-gold focus:ring-gold"
                    />
                    <span className="text-sm">{spec}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications Section */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Certifications (Optional)
            </label>
            {formData.certifications.map((cert, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => {
                    const newCertifications = [...formData.certifications];
                    newCertifications[index] = { 
                      ...newCertifications[index], 
                      name: e.target.value 
                    };
                    setFormData({ ...formData, certifications: newCertifications });
                  }}
                  placeholder="Certification Name"
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <input
                  type="text"
                  value={cert.issuedBy}
                  onChange={(e) => {
                    const newCertifications = [...formData.certifications];
                    newCertifications[index] = { 
                      ...newCertifications[index], 
                      issuedBy: e.target.value 
                    };
                    setFormData({ ...formData, certifications: newCertifications });
                  }}
                  placeholder="Issuing Organization"
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <input
                  type="number"
                  value={cert.year}
                  onChange={(e) => {
                    const newCertifications = [...formData.certifications];
                    newCertifications[index] = { 
                      ...newCertifications[index], 
                      year: e.target.value 
                    };
                    setFormData({ ...formData, certifications: newCertifications });
                  }}
                  placeholder="Year"
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addCertification}
              className="text-tan hover:text-gold text-sm"
            >
              + Add Another Certification
            </button>
          </div>

          {/* Optional Information */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">License Number (Optional)</label>
            <input
              type="text"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="Government-issued license number if available"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-tan text-cream py-3 rounded-lg hover:bg-gold transition duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Registration"}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default TourGuideRegistrationForm;