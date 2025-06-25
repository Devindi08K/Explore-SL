import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaStar, FaHandshake, FaUser, FaTag, FaMapMarkedAlt, FaPlus } from 'react-icons/fa';

const AffiliatePage = () => {
    const [affiliateLinks, setAffiliateLinks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("hotel");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAffiliateLinks = async () => {
            try {
                setLoading(true);
                const response = await api.get("/affiliate-links");
                setAffiliateLinks(response.data.filter(link => link.isVerified));
                setError(null);
            } catch (error) {
                console.error("Error fetching affiliate links:", error);
                setError("Failed to load business listings");
            } finally {
                setLoading(false);
            }
        };
        fetchAffiliateLinks();
    }, []);

    // Filter links by category
    const filterBusinesses = (category) => {
        return affiliateLinks.filter(link => link.category === category);
    };

    // Helper function to get listing type badge properties
    const getListingBadge = (listingType) => {
        switch(listingType) {
            case 'affiliate':
                return {
                    label: 'Affiliate Partner',
                    className: 'bg-gold text-cream',
                    icon: <FaStar className="mr-1" />
                };
            case 'free':
                return {
                    label: 'Featured Listing',
                    className: 'bg-green-500 text-white',
                    icon: <FaHandshake className="mr-1" />
                };
            default:
                return null; // No badge for regular listings
        }
    };

    const BusinessCard = ({ business }) => {
        // Get badge properties if this is an affiliate or free listing
        const badge = getListingBadge(business.listingType);
        
        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <div className="relative">
                    <img
                        src={business.imageUrl}
                        alt={business.name}
                        className="w-full h-52 object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/600x400?text=Business+Image";
                        }}
                    />
                    {/* Add listing type badge if applicable */}
                    {badge && (
                        <div className="absolute top-3 left-3">
                            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
                                {badge.icon}
                                {badge.label}
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                    {/* Header with name and category */}
                    <div className="flex justify-between items-start mb-3">
                        <h4 className="text-xl font-semibold text-charcoal">{business.name}</h4>
                        <span className="px-2 py-1 bg-tan text-cream text-xs rounded-full font-medium">
                            {business.category.charAt(0).toUpperCase() + business.category.slice(1)}
                        </span>
                    </div>
                    
                    {/* Description and price */}
                    <p className="text-gray-600 mb-3 text-sm line-clamp-2">{business.description}</p>
                    <p className="text-sm font-medium text-gold mb-3">
                        <FaTag className="inline-block mr-1" />
                        {business.priceRange || 'Price not specified'}
                    </p>

                    {/* Location */}
                    {business.location && (
                        <div className="mb-3 flex items-start">
                            <FaMapMarkedAlt className="text-tan mt-1 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{business.location}</span>
                        </div>
                    )}

                    {/* External linking businesses get a book now button */}
                    {business.isExternal ? (
                        <a
                            href={business.redirectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto block w-full bg-tan text-cream py-2 text-center rounded-lg hover:bg-gold transition duration-200"
                        >
                            Book Now
                        </a>
                    ) : (
                        <div className="space-y-3 mt-auto">
                            {/* Contact and hours info */}
                            <div className="pt-3 border-t border-gray-100">
                                {business.openingHours && (
                                    <div className="flex items-start space-x-2 text-sm mb-2">
                                        <FaClock className="text-tan mt-1 flex-shrink-0" />
                                        <span className="text-gray-700">{business.openingHours}</span>
                                    </div>
                                )}
                                
                                {business.address && (
                                    <div className="flex items-start space-x-2 text-sm mb-2">
                                        <FaMapMarkerAlt className="text-tan mt-1 flex-shrink-0" />
                                        <span className="text-gray-700">{business.address}</span>
                                    </div>
                                )}
                                
                                {business.contactName && (
                                    <div className="flex items-start space-x-2 text-sm mb-2">
                                        <FaUser className="text-tan mt-1 flex-shrink-0" />
                                        <span className="text-gray-700">Contact: {business.contactName}</span>
                                    </div>
                                )}
                                
                                {business.phone && (
                                    <div className="flex items-center space-x-2 text-sm mb-2">
                                        <FaPhone className="text-tan flex-shrink-0" />
                                        <span className="text-gray-700">{business.phone}</span>
                                    </div>
                                )}
                                
                                {business.email && (
                                    <div className="flex items-center space-x-2 text-sm">
                                        <FaEnvelope className="text-tan flex-shrink-0" />
                                        <a 
                                            href={`mailto:${business.email}`} 
                                            className="text-gray-700 hover:text-tan break-words"
                                        >
                                            {business.email}
                                        </a>
                                    </div>
                                )}
                            </div>
                            
                            {/* Specialties section */}
                            {business.specialties && (
                                <div className="pt-2 border-t border-gray-100">
                                    <p className="text-sm font-medium text-charcoal mb-1">
                                        {business.category === 'cafe' ? 'Popular Items:' : 'Specialties:'}
                                    </p>
                                    <p className="text-sm text-gray-600">{business.specialties}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-cream px-4 py-10">
            <div className="max-w-7xl mx-auto">
                {/* Header with Add Business Button */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4 md:mb-0">
                        Explore Local & Partner Businesses
                    </h2>
                    <Link 
                        to="/partnership/business-listing" 
                        className="bg-tan text-cream px-6 py-3 rounded-lg hover:bg-gold transition duration-200 flex items-center gap-2"
                    >
                        <FaPlus className="text-sm" />
                        <span>Add Your Business</span>
                    </Link>
                </div>

                {/* Category Selection */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex bg-white rounded-lg shadow p-1">
                        {["hotel", "restaurant", "cafe", "localEatery"].map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-md ${
                                    selectedCategory === category 
                                    ? 'bg-tan text-cream' 
                                    : 'text-charcoal hover:bg-cream'
                                } transition duration-200`}
                            >
                                {category === "localEatery" 
                                    ? "Local Eateries"
                                    : category.charAt(0).toUpperCase() + category.slice(1) + (category === "cafe" ? "s" : "s")}
                            </button>
                        ))}
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-tan border-t-gold"></div>
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div>
                        <h3 className="text-2xl font-semibold text-charcoal mb-6 text-center">
                            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace(/([A-Z])/g, ' $1')}
                            {(selectedCategory === "cafe" ? "s" : "s")}
                        </h3>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {filterBusinesses(selectedCategory).length > 0 ? (
                                filterBusinesses(selectedCategory).map((business) => (
                                    <BusinessCard key={business._id} business={business} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
                                    <h3 className="text-xl font-medium text-charcoal mb-2">No listings found</h3>
                                    <p className="text-gray-600 mb-4">There are currently no businesses listed in this category.</p>
                                    <Link 
                                        to="/partnership/business-listing"
                                        className="inline-block bg-tan text-cream px-4 py-2 rounded-lg hover:bg-gold transition duration-200"
                                    >
                                        Add Your {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Business
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AffiliatePage;
