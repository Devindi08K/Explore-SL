import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaExternalLinkAlt, FaStar } from 'react-icons/fa';

const BusinessDetailPage = () => {
    const { id } = useParams();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBusinessDetails = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/affiliate-links/${id}`);
                setBusiness(response.data);
            } catch (err) {
                setError('Failed to load business details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessDetails();
    }, [id]);

    const handleExternalLinkClick = async () => {
        try {
            // Track the click without waiting for the response
            api.post(`/affiliate-links/${id}/track-click`);
            window.open(business.redirectUrl, '_blank', 'noopener,noreferrer');
        } catch (err) {
            console.error('Failed to track click:', err);
            // Still open the link even if tracking fails
            window.open(business.redirectUrl, '_blank', 'noopener,noreferrer');
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!business) return <div className="text-center py-20">Business not found.</div>;

    return (
        <div className="min-h-screen bg-cream py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="relative">
                    <img src={business.imageUrl.startsWith('http') ? business.imageUrl : `${import.meta.env.VITE_BACKEND_URL}${business.imageUrl}`} alt={business.businessName} className="w-full h-64 object-cover" />
                    {business.isPremium && (
                        <div className="absolute top-4 right-4 bg-gold text-cream px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-lg">
                            <FaStar className="mr-2" /> PREMIUM
                        </div>
                    )}
                </div>
                <div className="p-8">
                    <h1 className="text-4xl font-bold text-charcoal mb-2">{business.businessName}</h1>
                    <p className="text-lg text-tan font-semibold mb-4 capitalize">{business.businessType}</p>
                    <p className="text-gray-700 mb-6">{business.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            {business.location && <InfoItem icon={<FaMapMarkerAlt />} label="Location" value={business.location} />}
                            {business.address && <InfoItem icon={<FaMapMarkerAlt />} label="Address" value={business.address} />}
                            {business.phone && <InfoItem icon={<FaPhone />} label="Phone" value={business.phone} />}
                            {business.email && <InfoItem icon={<FaEnvelope />} label="Email" value={business.email} isLink={`mailto:${business.email}`} />}
                            {business.openingHours && <InfoItem icon={<FaClock />} label="Hours" value={business.openingHours} />}
                        </div>
                        <div className="space-y-4 flex flex-col justify-between">
                            {business.specialties && (
                                <div>
                                    <h3 className="font-semibold text-charcoal mb-2">Specialties</h3>
                                    <p className="text-gray-600">{business.specialties}</p>
                                </div>
                            )}
                            {business.isExternal && business.redirectUrl && (
                                <button onClick={handleExternalLinkClick} className="w-full mt-auto bg-tan text-cream py-3 rounded-lg hover:bg-gold transition duration-200 flex items-center justify-center text-lg font-semibold">
                                    Visit Website <FaExternalLinkAlt className="ml-2" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon, label, value, isLink = null }) => (
    <div className="flex items-start">
        <div className="text-tan mr-4 mt-1">{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            {isLink ? (
                <a href={isLink} className="font-semibold text-charcoal hover:text-tan break-all">{value}</a>
            ) : (
                <p className="font-semibold text-charcoal break-words">{value}</p>
            )}
        </div>
    </div>
);

export default BusinessDetailPage;