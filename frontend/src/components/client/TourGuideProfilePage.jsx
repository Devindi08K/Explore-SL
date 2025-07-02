import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { FaUser, FaCrown, FaEnvelope, FaPhone, FaGlobe, FaStar, FaLanguage, FaBriefcase, FaCertificate } from 'react-icons/fa';

const TourGuideProfilePage = () => {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuideDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/tour-guides/${id}`);
        setGuide(response.data);
        
        // Track the view for this guide profile
        api.post(`/tour-guides/${id}/view`).catch(err => console.error("Failed to track view:", err));

      } catch (err) {
        setError('Failed to load tour guide details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuideDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-tan"></div>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error || 'Tour Guide Not Found'}</h2>
          <Link to="/tour-guides" className="bg-tan text-cream px-6 py-2 rounded-lg hover:bg-gold transition">
            Back to All Guides
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-tan/10 p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <img 
                src={guide.image || 'https://via.placeholder.com/300x300?text=Guide'} 
                alt={guide.name}
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {guide.isPremium && (
                <span className="absolute top-2 right-2 bg-gradient-to-r from-gold to-tan text-white p-2 rounded-full shadow-md">
                  <FaCrown />
                </span>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-charcoal">{guide.name}</h1>
              <p className="text-lg text-gray-600 mt-1">{guide.yearsOfExperience} years of experience</p>
              {/* Contact info moved to the main body */}
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-center">
            <div className="bg-gray-50 p-4 rounded-lg">
              <FaEnvelope className="mx-auto text-tan mb-2" size={24} />
              <p className="font-bold text-charcoal break-all">{guide.contactEmail}</p>
              <p className="text-sm text-gray-500">Email</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <FaPhone className="mx-auto text-tan mb-2" size={24} />
              <p className="font-bold text-charcoal">{guide.contactPhone}</p>
              <p className="text-sm text-gray-500">Phone</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-xl text-charcoal border-b-2 border-tan/20 pb-2 mb-3">About Me</h3>
              <p className="text-gray-700 leading-relaxed">{guide.bio || 'No biography provided.'}</p>
            </div>
            
            <div>
              <h3 className="font-bold text-xl text-charcoal border-b-2 border-tan/20 pb-2 mb-3">Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-gray-700">
                <p><strong>Languages:</strong> {guide.languages?.join(', ') || 'Not specified'}</p>
                <p><strong>Specializations:</strong> {guide.specialization?.join(', ') || 'Not specified'}</p>
                <p><strong>Preferred Areas:</strong> {guide.preferredAreas?.join(', ') || 'Not specified'}</p>
                <p><strong>Rate Per Day:</strong> {guide.ratePerDay ? `${guide.ratePerDay}` : 'Not specified'}</p>
                <p><strong>Availability:</strong> {guide.availability || 'Not specified'}</p>
                <p><strong>License Number:</strong> {guide.licenseNumber || 'Not provided'}</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xl text-charcoal border-b-2 border-tan/20 pb-2 mb-3">Certifications</h3>
              {guide.certifications && guide.certifications.length > 0 ? (
                <div className="space-y-3">
                  {guide.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                      <FaCertificate className="text-gold mr-4" size={20} />
                      <div>
                        <p className="font-semibold text-charcoal">{cert.name}</p>
                        <p className="text-sm text-gray-600">Issued by {cert.issuedBy} in {cert.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-600">
                  No certifications have been provided.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuideProfilePage;