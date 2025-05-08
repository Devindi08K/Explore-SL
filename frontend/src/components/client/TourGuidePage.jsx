import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from '../../utils/api';

const TourGuidePage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Language categories
  const languageCategories = {
    local: ['English', 'Sinhala', 'Tamil'],
    european: ['French', 'German', 'Italian', 'Spanish', 'Dutch', 'Russian', 'Polish'],
    asian: ['Mandarin Chinese', 'Cantonese', 'Japanese', 'Korean', 'Thai', 'Vietnamese', 'Malay'],
    other: ['Arabic', 'Hebrew', 'Persian', 'Hindi', 'Malayalam', 'Bengali', 'Urdu']
  };

  // Specialization categories
  const specializations = [
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
  ];

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const response = await api.get("/tour-guides");
      // Ensure all guides have the required array properties
      const processedGuides = response.data.filter(guide => guide.isVerified).map(guide => ({
        ...guide,
        languages: guide.languages || [],
        specialization: guide.specialization || [],
        preferredAreas: guide.preferredAreas || [],
        certifications: guide.certifications || []
      }));
      setGuides(processedGuides);
    } catch (error) {
      console.error("Error fetching guides:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecializationToggle = (specialization) => {
    setSelectedSpecializations(prev => 
      prev.includes(specialization)
        ? prev.filter(s => s !== specialization)
        : [...prev, specialization]
    );
  };

  const handleLanguageToggle = (language) => {
    setSelectedLanguages(prev => 
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = searchTerm === "" || 
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecializations = selectedSpecializations.length === 0 || 
      guide.specialization.some(spec => selectedSpecializations.includes(spec));
    
    const matchesLanguages = selectedLanguages.length === 0 || 
      guide.languages.some(lang => selectedLanguages.includes(lang));
    
    return matchesSearch && matchesSpecializations && matchesLanguages;
  });

  return (
    <div className="min-h-screen bg-cream px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-4 md:mb-0">
            Professional Tour Guides
          </h1>
          <Link 
            to="/tour-guide-registration" 
            className="bg-tan text-cream px-6 py-3 rounded-lg hover:bg-gold transition duration-200 flex items-center gap-2"
          >
            <span>Register as Tour Guide</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search guides by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-2xl mx-auto block px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold bg-white"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar with Filters */}
          <div className="md:w-1/4 space-y-6">
            {/* Specializations Filter */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Specializations</h3>
              <div className="space-y-2">
                {specializations.map((spec) => (
                  <label key={spec} className="flex items-center space-x-2 p-2 hover:bg-cream rounded">
                    <input
                      type="checkbox"
                      checked={selectedSpecializations.includes(spec)}
                      onChange={() => handleSpecializationToggle(spec)}
                      className="rounded border-tan text-gold focus:ring-gold"
                    />
                    <span className="text-sm">{spec}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Languages Filter */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Languages</h3>
              {Object.entries(languageCategories).map(([category, languages]) => (
                <div key={category} className="mb-4">
                  <h4 className="text-sm font-medium text-charcoal capitalize mb-2">
                    {category} Languages
                  </h4>
                  <div className="space-y-1">
                    {languages.map((lang) => (
                      <label key={lang} className="flex items-center space-x-2 p-2 hover:bg-cream rounded">
                        <input
                          type="checkbox"
                          checked={selectedLanguages.includes(lang)}
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

          {/* Right Content Area */}
          <div className="md:w-3/4">
            {/* Selected Filters Display */}
            {(selectedSpecializations.length > 0 || selectedLanguages.length > 0) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedSpecializations.map(spec => (
                  <span key={spec} 
                    className="bg-tan text-cream px-3 py-1 rounded-full text-sm flex items-center">
                    {spec}
                    <button 
                      onClick={() => handleSpecializationToggle(spec)}
                      className="ml-2 hover:text-gold"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedLanguages.map(lang => (
                  <span key={lang} 
                    className="bg-gold text-cream px-3 py-1 rounded-full text-sm flex items-center">
                    {lang}
                    <button 
                      onClick={() => handleLanguageToggle(lang)}
                      className="ml-2 hover:text-tan"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Guide Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                <p className="text-center col-span-full">Loading guides...</p>
              ) : filteredGuides.map((guide) => (
                <div key={guide._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={guide.image}
                    alt={guide.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-charcoal">{guide.name}</h3>
                      <span className="bg-tan text-cream px-3 py-1 rounded-full text-sm">
                        {guide.yearsOfExperience} Years Exp.
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-600 line-clamp-3">{guide.bio}</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm">
                        <span className="font-medium">Specializations:</span>{' '}
                        <span className="text-gray-600">
                          {guide.specialization?.join(', ') || 'Not specified'}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Languages:</span>{' '}
                        <span className="text-gray-600">
                          {guide.languages?.join(', ') || 'Not specified'}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Areas:</span>{' '}
                        <span className="text-gray-600">
                          {guide.preferredAreas?.join(', ') || 'Not specified'}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Rate:</span>{' '}
                        <span className="text-gray-600">{guide.ratePerDay || 'Not specified'}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Availability:</span>{' '}
                        <span className="text-gray-600">{guide.availability || 'Not specified'}</span>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => window.location.href = `mailto:${guide.contactEmail}`}
                        className="w-full bg-tan text-cream py-2 rounded-lg hover:bg-gold transition duration-200"
                      >
                        Contact Guide
                      </button>
                      {guide.licenseNumber && (
                        <p className="text-sm text-center text-gray-500">
                          License No: {guide.licenseNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!loading && filteredGuides.length === 0 && (
              <p className="text-center text-gray-600 py-8">
                No guides found matching your criteria. Try adjusting your filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuidePage;