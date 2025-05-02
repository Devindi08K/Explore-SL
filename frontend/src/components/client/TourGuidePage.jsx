import React, { useState, useEffect } from "react";
import api from '../../utils/api';

const TourGuidePage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const response = await api.get("/tour-guides");
      setGuides(response.data.filter(guide => guide.isVerified));
    } catch (error) {
      console.error("Error fetching guides:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuides = guides.filter(guide => {
    const matchesSpecialization = selectedSpecialization === "all" || 
      guide.specialization.includes(selectedSpecialization);
    const matchesLanguage = selectedLanguage === "all" || 
      guide.languages.includes(selectedLanguage);
    return matchesSpecialization && matchesLanguage;
  });

  return (
    <div className="min-h-screen bg-cream px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-charcoal text-center mb-8">
          Professional Tour Guides
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold bg-white"
          >
            <option value="all">All Specializations</option>
            <option value="Cultural">Cultural Tours</option>
            <option value="Wildlife">Wildlife Tours</option>
            <option value="Adventure">Adventure Tours</option>
            <option value="Historical">Historical Tours</option>
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold bg-white"
          >
            <option value="all">All Languages</option>
            <option value="English">English</option>
            <option value="Sinhala">Sinhala</option>
            <option value="Tamil">Tamil</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </div>

        {/* Guide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGuides.map((guide) => (
            <div key={guide._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
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
                  <p className="text-gray-600">{guide.bio}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm">
                    <span className="font-medium">Specializations:</span>{' '}
                    {guide.specialization.join(', ')}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Languages:</span>{' '}
                    {guide.languages.join(', ')}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Areas Covered:</span>{' '}
                    {guide.tourAreas.join(', ')}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Rate:</span>{' '}
                    {guide.ratePerDay}
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => window.location.href = `mailto:${guide.contactEmail}`}
                    className="w-full bg-tan text-cream py-2 rounded-lg hover:bg-gold transition duration-200"
                  >
                    Contact Guide
                  </button>
                  <p className="text-sm text-center text-gray-500">
                    License No: {guide.licenseNumber}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <p className="text-center text-gray-600">
            No guides found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default TourGuidePage;