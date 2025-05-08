import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import api from '../../utils/api';

const AdminTourGuidePage = () => {
  const [guides, setGuides] = useState([]);
  const [editingGuide, setEditingGuide] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    languages: [],
    specialization: [],
    yearsOfExperience: "",
    certifications: [{ name: "", issuedBy: "", year: "" }],
    licenseNumber: "",
    contactEmail: "",
    contactPhone: "",
    bio: "",
    availability: "",
    ratePerDay: "",
    tourAreas: [],
    isVerified: false
  });
  const location = useLocation();

  const fetchGuides = async () => {
    try {
      const response = await api.get("/tour-guides/all");
      console.log("Fetched guides:", response.data); // Add this for debugging
      setGuides(response.data);
    } catch (error) {
      console.error("Error fetching guides:", error);
    }
  };

  const fetchGuideDetails = async (id) => {
    try {
      const response = await api.get(`/tour-guides/${id}`);
      const guide = response.data;
      setEditingGuide(guide);
      setFormData({
        name: guide.name || '',
        image: guide.image || '',
        languages: guide.languages || [],
        specialization: guide.specialization || [],
        yearsOfExperience: guide.yearsOfExperience || '',
        certifications: guide.certifications || [{ name: '', issuedBy: '', year: '' }],
        licenseNumber: guide.licenseNumber || '',
        contactEmail: guide.contactEmail || '',
        contactPhone: guide.contactPhone || '',
        bio: guide.bio || '',
        availability: guide.availability || '',
        ratePerDay: guide.ratePerDay || '',
        tourAreas: guide.tourAreas || [],
        isVerified: guide.isVerified || false,
        status: guide.status || 'pending'
      });
    } catch (error) {
      console.error('Error fetching guide details:', error);
    }
  };

  useEffect(() => {
    fetchGuides();
    
    // If there's an ID in the URL, fetch that specific guide
    const searchParams = new URLSearchParams(location.search);
    const guideId = searchParams.get('id');
    if (guideId) {
      fetchGuideDetails(guideId);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGuide) {
        await api.put(`/tour-guides/${editingGuide._id}`, formData);
      } else {
        await api.post("/tour-guides", formData);
      }
      fetchGuides();
      resetForm();
    } catch (error) {
      console.error("Error saving guide:", error);
    }
  };

  const handleEdit = (guide) => {
    setEditingGuide(guide);
    setFormData(guide);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this guide?")) {
      try {
        await api.delete(`/tour-guides/${id}`);
        fetchGuides();
      } catch (error) {
        console.error("Error deleting guide:", error);
      }
    }
  };

  const handleVerification = async (id, isVerified) => {
    try {
      await api.patch(`/tour-guides/${id}/verify`, { 
        isVerified,
        status: isVerified ? 'approved' : 'rejected'
      });
      fetchGuides();
    } catch (error) {
      console.error("Error updating verification status:", error);
    }
  };

  const handleCertificationChange = (index, field, value) => {
    const newCertifications = [...formData.certifications];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    setFormData({ ...formData, certifications: newCertifications });
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [...formData.certifications, { name: "", issuedBy: "", year: "" }]
    });
  };

  const resetForm = () => {
    setEditingGuide(null);
    setFormData({
      name: "",
      image: "",
      languages: [],
      specialization: [],
      yearsOfExperience: "",
      certifications: [{ name: "", issuedBy: "", year: "" }],
      licenseNumber: "",
      contactEmail: "",
      contactPhone: "",
      bio: "",
      availability: "",
      ratePerDay: "",
      tourAreas: [],
      isVerified: false
    });
  };

  return (
    <div className="container mx-auto p-6 bg-cream">
      <h2 className="text-2xl font-bold mb-6 text-charcoal">
        {editingGuide ? "Edit Tour Guide" : "Add New Tour Guide"}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border border-tan rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full p-2 border border-tan rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">License Number (Optional)</label>
            <input
              type="text"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              className="w-full p-2 border border-tan rounded-md"
              placeholder="Government-issued license number if available"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
            <input
              type="number"
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
              className="w-full p-2 border border-tan rounded-md"
              required
              min="0"
            />
          </div>
        </div>

        {/* Languages and Specializations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Languages Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Languages</label>
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto p-3 border border-tan rounded-md">
              {/* Local Languages */}
              <div className="col-span-2 mb-2">
                <h4 className="font-medium text-sm text-gray-600">Local Languages</h4>
                <div className="space-y-2 mt-1">
                  {['English', 'Sinhala', 'Tamil'].map((lang) => (
                    <label key={lang} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.languages.includes(lang)}
                        onChange={(e) => {
                          const updatedLanguages = e.target.checked
                            ? [...formData.languages, lang]
                            : formData.languages.filter(l => l !== lang);
                          setFormData({ ...formData, languages: updatedLanguages });
                        }}
                        className="rounded border-tan text-gold focus:ring-gold"
                      />
                      <span className="text-sm">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* European Languages */}
              <div className="col-span-2 mb-2">
                <h4 className="font-medium text-sm text-gray-600">European Languages</h4>
                <div className="space-y-2 mt-1">
                  {[
                    'French', 'German', 'Italian', 'Spanish', 
                    'Dutch', 'Russian', 'Polish'
                  ].map((lang) => (
                    <label key={lang} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.languages.includes(lang)}
                        onChange={(e) => {
                          const updatedLanguages = e.target.checked
                            ? [...formData.languages, lang]
                            : formData.languages.filter(l => l !== lang);
                          setFormData({ ...formData, languages: updatedLanguages });
                        }}
                        className="rounded border-tan text-gold focus:ring-gold"
                      />
                      <span className="text-sm">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Asian Languages */}
              <div className="col-span-2 mb-2">
                <h4 className="font-medium text-sm text-gray-600">Asian Languages</h4>
                <div className="space-y-2 mt-1">
                  {[
                    'Mandarin Chinese', 'Cantonese', 'Japanese', 'Korean',
                    'Thai', 'Vietnamese', 'Malay'
                  ].map((lang) => (
                    <label key={lang} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.languages.includes(lang)}
                        onChange={(e) => {
                          const updatedLanguages = e.target.checked
                            ? [...formData.languages, lang]
                            : formData.languages.filter(l => l !== lang);
                          setFormData({ ...formData, languages: updatedLanguages });
                        }}
                        className="rounded border-tan text-gold focus:ring-gold"
                      />
                      <span className="text-sm">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Middle Eastern & South Asian Languages */}
              <div className="col-span-2">
                <h4 className="font-medium text-sm text-gray-600">Other Languages</h4>
                <div className="space-y-2 mt-1">
                  {[
                    'Arabic', 'Hebrew', 'Persian', 'Hindi', 
                    'Malayalam', 'Bengali', 'Urdu'
                  ].map((lang) => (
                    <label key={lang} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.languages.includes(lang)}
                        onChange={(e) => {
                          const updatedLanguages = e.target.checked
                            ? [...formData.languages, lang]
                            : formData.languages.filter(l => l !== lang);
                          setFormData({ ...formData, languages: updatedLanguages });
                        }}
                        className="rounded border-tan text-gold focus:ring-gold"
                      />
                      <span className="text-sm">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Specializations Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Specializations</label>
            <div className="space-y-2 p-3 border border-tan rounded-md">
              {[
                'Cultural Tours',
                'Adventure Tours',
                'Wildlife Tours',
                'Historical Tours',
                'Hiking',
                'Photography Tours',
                'Food Tours',
                'Religious Tours',
                'Beach Tours',
                'City Tours',
                'Nature Tours',
                'Architectural Tours'
              ].map((spec) => (
                <label key={spec} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.specialization.includes(spec)}
                    onChange={(e) => {
                      const updatedSpecs = e.target.checked
                        ? [...formData.specialization, spec]
                        : formData.specialization.filter(s => s !== spec);
                      setFormData({ ...formData, specialization: updatedSpecs });
                    }}
                    className="rounded border-tan text-gold focus:ring-gold"
                  />
                  <span className="text-sm">{spec}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full p-2 border border-tan rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full p-2 border border-tan rounded-md"
              required
            />
          </div>
        </div>

        {/* Bio and Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full p-2 border border-tan rounded-md"
            required
            rows="4"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Availability</label>
            <input
              type="text"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full p-2 border border-tan rounded-md"
              required
              placeholder="e.g., Weekdays, All week, Weekends only"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rate per Day</label>
            <input
              type="text"
              value={formData.ratePerDay}
              onChange={(e) => setFormData({ ...formData, ratePerDay: e.target.value })}
              className="w-full p-2 border border-tan rounded-md"
              required
              placeholder="e.g., $100, Rs. 5000"
            />
          </div>
        </div>

        {/* Certifications */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certifications (Optional)
          </label>
          {formData.certifications.map((cert, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                value={cert.name}
                onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                placeholder="Certification Name"
                className="p-2 border border-tan rounded-md"
              />
              <input
                type="text"
                value={cert.issuedBy}
                onChange={(e) => handleCertificationChange(index, 'issuedBy', e.target.value)}
                placeholder="Issuing Organization"
                className="p-2 border border-tan rounded-md"
              />
              <input
                type="number"
                value={cert.year}
                onChange={(e) => handleCertificationChange(index, 'year', e.target.value)}
                placeholder="Year"
                className="p-2 border border-tan rounded-md"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addCertification}
            className="text-tan hover:text-gold"
          >
            + Add Certification
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-tan text-cream py-3 rounded-lg hover:bg-gold transition duration-200"
        >
          {editingGuide ? "Update Guide" : "Add Guide"}
        </button>
      </form>

      {/* Guide List Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-charcoal">Tour Guides List</h2>
        <div className="space-y-6">
          {guides.map((guide) => (
            <div key={guide._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-charcoal">
                    {guide.name}
                    {guide.isVerified && (
                      <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        Verified
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600 mt-1">{guide.yearsOfExperience} years experience</p>
                  <p className="text-gray-600 mt-1">Languages: {guide.languages.join(', ')}</p>
                  <p className="text-gray-600 mt-1">Contact: {guide.contactEmail}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleVerification(guide._id, !guide.isVerified)}
                    className={`px-4 py-2 rounded-md ${
                      guide.isVerified 
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {guide.isVerified ? 'Unverify' : 'Verify'}
                  </button>
                  <button
                    onClick={() => handleEdit(guide)}
                    className="px-4 py-2 bg-tan text-cream rounded-md hover:bg-gold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(guide._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {/* Additional Guide Details */}
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Specializations:</strong>
                  <p className="text-gray-600">{guide.specialization.join(', ')}</p>
                </div>
                <div>
                  <strong>Preferred Areas:</strong>
                  <p className="text-gray-600">{guide.preferredAreas.join(', ')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTourGuidePage;