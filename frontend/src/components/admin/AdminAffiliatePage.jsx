import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import api from '../../utils/api';

const AdminAffiliatePage = () => {
    const location = useLocation();
    const [affiliateLinks, setAffiliateLinks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        category: "hotel",
        name: "",
        description: "",
        imageUrl: "",
        priceRange: "",
        isExternal: false,
        listingType: "regular", // Default to regular listing
        contactName: "",
        email: "",
        phone: "",
        address: "",
        openingHours: "",
        specialties: "",
        status: "pending",
        isVerified: false
    });

    useEffect(() => {
        fetchAffiliateLinks();
        
        // Get ID from query params
        const searchParams = new URLSearchParams(location.search);
        const affiliateId = searchParams.get('id');
        if (affiliateId) {
            fetchAffiliateDetails(affiliateId);
        }
    }, [location]);

    const fetchAffiliateLinks = async () => {
        try {
            setAffiliateLinks([]); // Clear existing data while loading
            const response = await api.get("/affiliate-links/all");
            console.log("Fetched all affiliate links:", response.data);
            
            if (Array.isArray(response.data)) {
                setAffiliateLinks(response.data);
            } else {
                console.error("Invalid data format received:", response.data);
                setAffiliateLinks([]);
            }
        } catch (error) {
            console.error("Error fetching affiliate links:", error);
            setAffiliateLinks([]);
        }
    };

    const fetchAffiliateDetails = async (id) => {
        try {
            const response = await api.get(`/affiliate-links/${id}`);
            const affiliate = response.data;
            console.log('Fetched affiliate details:', affiliate);
            setForm(affiliate);
        } catch (error) {
            console.error('Error fetching affiliate details:', error);
            alert('Failed to load business listing details');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                ...form
            };
            
            if (form._id) {
                await api.put(`/affiliate-links/${form._id}`, formData);
            } else {
                await api.post("/affiliate-links", formData);
            }
            fetchAffiliateLinks();
            resetForm();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const resetForm = () => {
        setForm({
            category: "hotel",
            name: "",
            description: "",
            imageUrl: "",
            priceRange: "",
            isExternal: false,
            listingType: "regular", // Default to regular listing
            contactName: "",
            email: "",
            phone: "",
            address: "",
            openingHours: "",
            specialties: "",
            status: "pending",
            isVerified: false
        });
        setEditingId(null);
    };

    const handleEdit = (link) => {
        setForm(link);
        setEditingId(link._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            try {
                await api.delete(`/affiliate-links/${id}`);
                fetchAffiliateLinks();
            } catch (error) {
                console.error("Error deleting affiliate link:", error);
            }
        }
    };

    const handleVerification = async (id, isVerified) => {
        try {
            await api.patch(`/affiliate-links/${id}/verify`, {
                status: isVerified ? 'approved' : 'rejected',
                isVerified
            });
            fetchAffiliateLinks(); // Refresh the list after update
        } catch (error) {
            console.error("Error updating verification status:", error);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-cream">
            {/* Form section */}
            <h2 className="text-2xl font-bold mb-6 text-charcoal">
                {editingId ? "Edit Business Listing" : "Add New Business Listing"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category:</label>
                    <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    >
                        <option value="hotel">Hotel</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="cafe">Café</option>
                        <option value="localEatery">Local Eatery</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Business Name:</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description:</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                        rows="4"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL:</label>
                    <input
                        type="text"
                        value={form.imageUrl}
                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Price Range:</label>
                    <input
                        type="text"
                        value={form.priceRange}
                        onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                        placeholder="e.g., $$$ or Rs.1000-3000"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Person:</label>
                    <input
                        type="text"
                        value={form.contactName}
                        onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email:</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone:</label>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Address:</label>
                    <textarea
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Opening Hours:</label>
                    <input
                        type="text"
                        value={form.openingHours}
                        onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., Mon-Sat: 9AM-9PM, Sun: Closed"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Specialties:</label>
                    <textarea
                        value={form.specialties}
                        onChange={(e) => setForm({ ...form, specialties: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="List special dishes or services"
                    />
                </div>

                {/* Add new field for listing type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Listing Type:</label>
                    <select
                        value={form.listingType}
                        onChange={(e) => setForm({ ...form, listingType: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="regular">Regular Listing</option>
                        <option value="affiliate">Paid Affiliate</option>
                        <option value="free">Free Featured Listing</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                        Regular: User submitted | Affiliate: Paid partner | Free: Complimentary featured listing
                    </p>
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-tan text-cream py-2 rounded-lg hover:bg-gold transition duration-200"
                >
                    {editingId ? "Update" : "Add"} Business
                </button>
            </form>

            {/* Business Listings List */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6 text-charcoal">Business Listings</h2>
                <div className="space-y-6">
                    {affiliateLinks.map((listing) => (
                        <div key={listing._id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold text-charcoal flex items-center">
                                        {listing.name}
                                        {listing.isVerified && (
                                            <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                                Verified
                                            </span>
                                        )}
                                        {listing.listingType === 'affiliate' && (
                                            <span className="ml-2 text-sm bg-gold text-cream px-2 py-1 rounded">
                                                Affiliate
                                            </span>
                                        )}
                                        {listing.listingType === 'free' && (
                                            <span className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded">
                                                Free Featured
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-gray-600 mt-1">Category: {listing.category}</p>
                                    <p className="text-gray-600 mt-1">Contact: {listing.email}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleVerification(listing._id, !listing.isVerified)}
                                        className={`px-4 py-2 rounded-md ${
                                            listing.isVerified 
                                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                : 'bg-green-600 text-white hover:bg-green-700'
                                        }`}
                                    >
                                        {listing.isVerified ? 'Unverify' : 'Verify'}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(listing)}
                                        className="px-4 py-2 bg-tan text-cream rounded-md hover:bg-gold"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(listing._id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <strong>Address:</strong>
                                    <p className="text-gray-600">{listing.address}</p>
                                </div>
                                <div>
                                    <strong>Status:</strong>
                                    <p className={`text-${listing.status === 'approved' ? 'green' : 'red'}-600`}>
                                        {listing.status?.charAt(0).toUpperCase() + listing.status?.slice(1)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminAffiliatePage;
