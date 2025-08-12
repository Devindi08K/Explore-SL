import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from '../../utils/api';
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FaCrown } from 'react-icons/fa';

const TourGuidePage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSpecializations, setShowSpecializations] = useState(true);
  const [showLanguages, setShowLanguages] = useState(true);

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
      setLoading(true);
      console.log("Fetching tour guides...");
      
      // Use the enhanced fetchTourGuides function
      const guidesData = await api.fetchTourGuides();
      console.log("Raw guides data:", guidesData); // Log the raw data
      
      // Check how many guides are verified
      const verifiedCount = guidesData.filter(guide => guide.isVerified).length;
      console.log(`Found ${guidesData.length} guides, ${verifiedCount} are verified`);
      
      // Ensure all guides have the required array properties
      const processedGuides = guidesData
        .filter(guide => true) // TEMPORARY: Remove the verification filter to see all guides
        .map(guide => ({
          ...guide,
          languages: guide.languages || [],
          specialization: guide.specialization || [],
          preferredAreas: guide.preferredAreas || [],
          certifications: guide.certifications || []
        }));
      
      console.log(`Processed ${processedGuides.length} guides for display`);
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
  
  const resetFilters = () => {
    setSelectedSpecializations([]);
    setSelectedLanguages([]);
    setSearchTerm("");
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

  const sortedGuides = [...filteredGuides].sort((a, b) => {
    // Premium guides first
    if (a.isPremium && !b.isPremium) return -1;
    if (!a.isPremium && b.isPremium) return 1;
    
    // Then sort by rating
    return b.averageRating - a.averageRating;
  });

  return (
    <div className="min-h-screen bg-cream px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-4 md:mb-0">
            Professional Tour Guides
          </h1>
          <div className="flex items-center">
            <Link 
              to="/partnership/tour-guide-premium" 
              className="bg-tan text-cream px-6 py-3 rounded-lg hover:bg-gold transition duration-200 flex items-center gap-2"
              onClick={() => window.scrollTo(0, 0)}
            >
              Become a Tour Guide
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search guides by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-2xl mx-auto block px-4 py-3 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold bg-white shadow-sm"
          />
        </div>
        
        {/* Mobile Filter Toggle Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center w-full bg-tan text-cream px-4 py-3 rounded-lg hover:bg-gold transition duration-300 shadow-md"
          >
            {showFilters ? (
              <>
                <FaTimes className="mr-2" /> Hide Filters
              </>
            ) : (
              <>
                <FaFilter className="mr-2" /> Show Filters {selectedSpecializations.length + selectedLanguages.length > 0 && 
                  `(${selectedSpecializations.length + selectedLanguages.length})`}
              </>
            )}
          </button>
        </div>

        {/* Selected Filters Display - Always visible */}
        {(selectedSpecializations.length > 0 || selectedLanguages.length > 0) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedSpecializations.map(spec => (
              <span key={spec} 
                className="bg-tan text-cream px-3 py-1 rounded-full text-xs flex items-center mb-1"
              >
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
                className="bg-gold text-cream px-3 py-1 rounded-full text-xs flex items-center mb-1"
              >
                {lang}
                <button 
                  onClick={() => handleLanguageToggle(lang)}
                  className="ml-2 hover:text-tan"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={resetFilters}
              className="text-sm text-gray-600 hover:text-charcoal ml-2"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Main Content Area with Filters and Guide Cards */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters - Hidden on mobile unless toggled */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-1/4 space-y-4 mb-6 md:mb-0 transition-all duration-300`}>
            {/* Specializations Filter */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div 
                onClick={() => setShowSpecializations(!showSpecializations)} 
                className="flex justify-between items-center cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-charcoal">Specializations</h3>
                {showSpecializations ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              
              {showSpecializations && (
                <div className="mt-3 max-h-48 overflow-y-auto">
                  {specializations.map((spec) => (
                    <label key={spec} className="flex items-center space-x-2 py-1 px-2 hover:bg-cream rounded">
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
              )}
            </div>

            {/* Languages Filter */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div 
                onClick={() => setShowLanguages(!showLanguages)} 
                className="flex justify-between items-center cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-charcoal">Languages</h3>
                {showLanguages ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              
              {showLanguages && (
                <div className="mt-3 max-h-48 overflow-y-auto">
                  {Object.entries(languageCategories).map(([category, languages]) => (
                    <div key={category} className="mb-3">
                      <h4 className="text-sm font-medium text-charcoal capitalize mb-1 px-2">
                        {category} Languages
                      </h4>
                      <div>
                        {languages.map((lang) => (
                          <label key={lang} className="flex items-center space-x-2 py-1 px-2 hover:bg-cream rounded">
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
              )}
            </div>
          </div>

          {/* Guide Cards Grid */}
          <div className="md:w-3/4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-tan border-t-gold"></div>
              </div>
            ) : sortedGuides.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedGuides.map((guide) => (
                  <div key={guide._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-auto relative">
                    {/* Premium Badge */}
                    {guide.isPremium && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-gold to-tan text-white text-xs px-3 py-1 rounded-full flex items-center shadow-lg z-10">
                        <FaCrown className="mr-1" />
                        PREMIUM
                      </span>
                    )}
                    
                    
                      <div className="p-3 flex items-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-tan">
                          <img
                            src={
                              guide.image && guide.image.startsWith('http')
                                ? guide.image
                                : "https://placehold.co/400x400?text=Guide+Image"
                            }
                            alt={guide.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-charcoal">{guide.name}</h3>
                          <span className="bg-tan text-cream px-2 py-0.5 rounded-full text-xs">
                            {guide.yearsOfExperience} Yrs Exp
                          </span>
                        </div>
                      </div>
                      
                      <div className="px-4 py-2 border-t border-gray-100 text-sm flex-grow">
                        <p className="text-gray-600 line-clamp-2 mb-2">{guide.bio}</p>
                        
                        <div className="space-y-1 mb-3 text-xs">
                          <p className="flex">
                            <span className="font-medium w-24 text-gray-700">Specializations:</span>
                            <span className="text-gray-600 truncate flex-1">
                              {guide.specialization?.join(', ') || 'Not specified'}
                            </span>
                          </p>
                          <p className="flex">
                            <span className="font-medium w-24 text-gray-700">Languages:</span>
                            <span className="text-gray-600 truncate flex-1">
                              {guide.languages?.join(', ') || 'Not specified'}
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-auto p-4 bg-gray-50 text-center text-sm font-medium text-tan hover:bg-tan/20 transition-colors">
                        <Link
                          to={`/tour-guides/${guide._id}`}
                          className="block mt-2 text-tan hover:text-gold text-sm font-medium text-center"
                        >
                          View Details →
                        </Link>
                      </div>
                    
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow-md">
                <p className="text-lg text-charcoal mb-2">No guides found</p>
                <p className="text-gray-600">Try adjusting your filters.</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 bg-tan text-cream px-4 py-2 rounded-lg hover:bg-gold transition duration-200"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* No Guides Notification - Appears when there are no guides and not loading */}
        {guides.length === 0 && !loading && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-6 mb-8 shadow-md">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6">
                <div className="bg-white text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-2 mx-auto md:mx-0">
                  <FaCrown className="text-3xl" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">Be the First Tour Guide on SLExplora! 🎉</h3>
                <p className="mb-4">Gain early access to clients and establish your presence before competition arrives.</p>
                <Link 
                  to="/partnership/tour-guide-premium" 
                  className="inline-block bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow-md font-medium"
                >
                  Register as a Tour Guide
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourGuidePage;