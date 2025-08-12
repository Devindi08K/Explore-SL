import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaStar, FaHandshake, FaUser, FaTag, FaMapMarkedAlt, FaPlus, FaCrown, FaArrowUp, FaBuilding, FaUtensils, FaCoffee, FaStore } from 'react-icons/fa';

const AffiliatePage = () => {
    const [affiliateLinks, setAffiliateLinks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("hotel");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

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

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Filter links by category
    const filterBusinesses = (category) => {
        return affiliateLinks.filter(link => link.businessType === category);
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

    // Add this function to your component
    const getCategoryIcon = (category) => {
        switch(category) {
            case 'hotel':
                return <FaBuilding />;
            case 'restaurant':
                return <FaUtensils />;
            case 'cafe':
                return <FaCoffee />;
            case 'localEatery':
                return <FaStore />;
            default:
                return <FaStore />;
        }
    };

    // Replace your BusinessCard component with this enhanced version
    const BusinessCard = ({ business }) => {
        return (
            <Link to={`/business-listings/${business._id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col group">
                <div className="relative">
                    <img
                        src={business.imageUrl.startsWith('http') ? business.imageUrl : `${import.meta.env.VITE_BACKEND_URL}${business.imageUrl}`}
                        alt={business.businessName}
                        className="w-full h-40 sm:h-48 object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.png";
                        }}
                    />
                    {business.isPremium && (
                        <div className="absolute top-2 right-2 bg-gold text-cream px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                            <FaCrown className="mr-1" />
                            <span>PREMIUM</span>
                        </div>
                    )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <h4 className="text-lg font-semibold text-charcoal group-hover:text-tan transition-colors">{business.businessName}</h4>
                    <p className="text-sm text-gray-500 capitalize mb-2">{business.businessType}</p>
                    <div className="flex items-start mb-2">
                        <FaMapMarkerAlt className="text-tan mt-1 flex-shrink-0" />
                        <p className="text-sm text-gray-600 ml-2">{business.location}</p>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">{business.description}</p>
                    
                    <div className="mt-auto pt-3 border-t border-gray-100 text-center text-sm font-medium text-tan">
                        View Details
                    </div>
                </div>
            </Link>
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
                        to="/partnership/business-premium" 
                        className="bg-tan text-cream px-6 py-3 rounded-lg hover:bg-gold transition duration-200 flex items-center gap-2"
                    >
                        <FaPlus className="text-sm" />
                        <span>Add Your Business</span>
                    </Link>
                </div>

                {/* Category Selection */}
                <div className="mb-8 overflow-x-auto">
                    <div className="flex justify-center min-w-max mx-auto">
                        <div className="inline-flex bg-white rounded-lg shadow p-1">
                            {["hotel", "restaurant", "cafe", "localEatery"].map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-md flex items-center ${
                                        selectedCategory === category 
                                        ? 'bg-tan text-cream' 
                                        : 'text-charcoal hover:bg-cream'
                                    } transition duration-200`}
                                >
                                    <span className="mr-2">{getCategoryIcon(category)}</span>
                                    {category === "localEatery" 
                                        ? "Local Eateries"
                                        : category.charAt(0).toUpperCase() + category.slice(1) + (category === "cafe" ? "s" : "s")}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-tan border-t-gold mb-4"></div>
                        <p className="text-gray-600">Loading business listings...</p>
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
                        {/* Replace the grid layout with this responsive version */}
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {filterBusinesses(selectedCategory).length > 0 ? (
                                filterBusinesses(selectedCategory).map((business) => (
                                    <BusinessCard key={business._id} business={business} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
                                    <h3 className="text-xl font-medium text-charcoal mb-2">No listings found</h3>
                                    <p className="text-gray-600 mb-4">There are currently no businesses listed in this category.</p>
                                    <Link 
                                        to="/partnership/business-premium"
                                        className="inline-block bg-tan text-cream px-4 py-2 rounded-lg hover:bg-gold transition duration-200"
                                    >
                                        Add Your {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Business
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Promotional Section for No Listings State */}
                {!loading && filterBusinesses(selectedCategory).length === 0 && (
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg p-6 mb-8 shadow-md">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="mb-4 md:mb-0 md:mr-6">
                                <div className="bg-white text-cyan-600 rounded-full w-16 h-16 flex items-center justify-center mb-2 mx-auto md:mx-0">
                                    <FaBuilding className="text-3xl" />
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-xl font-bold mb-2">Be the First Business on SLExplora! 🏢</h3>
                                <p className="mb-4">List your accommodation, restaurant, or tourism business and gain early visibility!</p>
                                <Link 
                                    to="/partnership/business-premium" 
                                    className="inline-block bg-white text-cyan-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow-md font-medium"
                                >
                                    List Your Business
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {showScrollButton && (
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="fixed bottom-8 right-8 bg-tan text-cream p-3 rounded-full shadow-lg hover:bg-gold transition-colors z-10"
                        aria-label="Scroll to top"
                    >
                        <FaArrowUp className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default AffiliatePage;
