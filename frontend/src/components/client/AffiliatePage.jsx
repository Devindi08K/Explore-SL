import React, { useEffect, useState } from "react";
import api from '../../utils/api';

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
                setAffiliateLinks(response.data);
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

    const BusinessCard = ({ business }) => (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-105 transition duration-300">
            <img
                src={business.imageUrl}
                alt={business.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-tan">{business.name}</h4>
                    <span className="px-2 py-1 bg-tan text-cream text-xs rounded-full">
                        {business.category.charAt(0).toUpperCase() + business.category.slice(1)}
                    </span>
                </div>
                <p className="text-sm text-charcoal mb-2">{business.description}</p>
                <p className="text-sm text-gray-600 mb-4">{business.priceRange}</p>

                {business.isExternal ? (
                    <a
                        href={business.redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-gold text-white font-medium px-4 py-2 rounded hover:bg-charcoal hover:text-gold transition"
                    >
                        Book Now
                    </a>
                ) : (
                    <div className="space-y-2">
                        <div className="text-sm">
                            <p><span className="font-medium">Opening Hours:</span> {business.openingHours}</p>
                            {business.specialties && (
                                <p><span className="font-medium">
                                    {business.category === 'cafe' ? 'Popular Items' : 'Specialties'}:
                                </span> {business.specialties}</p>
                            )}
                            <p><span className="font-medium">Location:</span> {business.address}</p>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                            <p className="text-sm">{business.contactName}</p>
                            <p className="text-sm">{business.phone}</p>
                            <button
                                onClick={() => window.location.href = `mailto:${business.email}`}
                                className="mt-2 bg-tan text-cream px-4 py-2 rounded hover:bg-gold transition w-full"
                            >
                                Contact Business
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-cream p-6 sm:p-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-6 text-center">
                Explore Local & Partner Businesses
            </h2>

            {/* Category Selection */}
            <div className="flex justify-center mb-8">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 rounded-md border border-tan text-charcoal bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gold"
                >
                    <option value="hotel">Hotels</option>
                    <option value="restaurant">Restaurants</option>
                    <option value="cafe">Cafés</option>
                    <option value="localEatery">Local Eateries</option>
                </select>
            </div>

            {loading && <p className="text-center text-tan">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
                <div>
                    <h3 className="text-2xl font-semibold text-charcoal mb-4 text-center">
                        {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace(/([A-Z])/g, ' $1')}
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filterBusinesses(selectedCategory).length > 0 ? (
                            filterBusinesses(selectedCategory).map((business) => (
                                <BusinessCard key={business._id} business={business} />
                            ))
                        ) : (
                            <p className="text-center text-gray-500 col-span-full">
                                No listings available in this category.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AffiliatePage;
