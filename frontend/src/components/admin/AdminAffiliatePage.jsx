import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import api from '../../utils/api';

const AdminAffiliatePage = () => {
    const location = useLocation();
    const [affiliateLinks, setAffiliateLinks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        businessName: '',
        businessType: 'restaurant',
        description: '',
        location: '',
        priceRange: '',
        specialties: '',
        openingHours: '',
        imageUrl: '',
        bookingUrl: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        isExternal: false,
        status: 'pending',
        isVerified: false,
        listingType: 'regular'
    });

    useEffect(() => {
        fetchAffiliateLinks();
        
        const searchParams = new URLSearchParams(location.search);
        const affiliateId = searchParams.get('id');
        if (affiliateId) {
            fetchAffiliateDetails(affiliateId);
        }
    }, [location]);

    const fetchAffiliateLinks = async () => {
        try {
            const response = await api.get("/affiliate-links/all");
            if (Array.isArray(response.data)) {
                setAffiliateLinks(response.data);
            } else {
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
            setForm({ ...form, ...affiliate });
            setEditingId(id);
        } catch (error) {
            console.error('Error fetching affiliate details:', error);
            alert('Failed to load business listing details');
        }
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/affiliate-links/${editingId}`, form);
            } else {
                await api.post("/affiliate-links", form);
            }
            fetchAffiliateLinks();
            resetForm();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const resetForm = () => {
        setForm({
            businessName: '', businessType: 'restaurant', description: '', location: '',
            priceRange: '', specialties: '', openingHours: '', imageUrl: '', bookingUrl: '',
            contactName: '', email: '', phone: '', address: '', isExternal: false,
            status: 'pending', isVerified: false, listingType: 'regular'
        });
        setEditingId(null);
    };

    const handleEdit = (link) => {
        setForm(link);
        setEditingId(link._id);
        window.scrollTo(0, 0);
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
            fetchAffiliateLinks();
        } catch (error) {
            console.error("Error updating verification status:", error);
        }
    };

    const handleMarkAsReviewed = async (id) => {
        try {
            await api.patch(`/affiliate-links/${id}/reviewed`);
            fetchAffiliateLinks();
            alert('Listing marked as reviewed.');
        } catch (error) {
            console.error("Error marking as reviewed:", error);
            alert('Failed to mark as reviewed.');
        }
    };

    const handleFeatureStatusUpdate = async (id, status) => {
        try {
            await api.patch(`/admin/business-listings/${id}/feature`, { status });
            fetchAffiliateLinks();
        } catch (error) {
            console.error("Error updating feature status:", error);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-cream">
            <h2 className="text-3xl font-bold mb-8 text-charcoal">
                {editingId ? "Edit Business Listing" : "Add New Business Listing"}
            </h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1 */}
                <div className="space-y-4">
                    <input type="text" name="businessName" value={form.businessName || ''} onChange={handleFormChange} placeholder="Business Name" className="w-full p-2 border rounded" required />
                    <select name="businessType" value={form.businessType || 'restaurant'} onChange={handleFormChange} className="w-full p-2 border rounded">
                        <option value="restaurant">Restaurant</option>
                        <option value="hotel">Hotel</option>
                        <option value="shop">Shop</option>
                        <option value="cafe">Café</option>
                        <option value="localEatery">Local Eatery</option>
                        <option value="other">Other</option>
                    </select>
                    <textarea name="description" value={form.description || ''} onChange={handleFormChange} placeholder="Description" className="w-full p-2 border rounded" rows="4"></textarea>
                    <input type="text" name="location" value={form.location || ''} onChange={handleFormChange} placeholder="Location / City" className="w-full p-2 border rounded" />
                    <input type="text" name="address" value={form.address || ''} onChange={handleFormChange} placeholder="Full Address" className="w-full p-2 border rounded" />
                    <input type="text" name="imageUrl" value={form.imageUrl || ''} onChange={handleFormChange} placeholder="Image URL" className="w-full p-2 border rounded" />
                    {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="mt-2 rounded-lg w-full max-h-48 object-cover" />}
                </div>
                {/* Column 2 */}
                <div className="space-y-4">
                    <input type="text" name="contactName" value={form.contactName || ''} onChange={handleFormChange} placeholder="Contact Name" className="w-full p-2 border rounded" />
                    <input type="email" name="email" value={form.email || ''} onChange={handleFormChange} placeholder="Contact Email" className="w-full p-2 border rounded" />
                    <input type="tel" name="phone" value={form.phone || ''} onChange={handleFormChange} placeholder="Contact Phone" className="w-full p-2 border rounded" />
                    <input type="text" name="priceRange" value={form.priceRange || ''} onChange={handleFormChange} placeholder="Price Range (e.g., 1000-5000)" className="w-full p-2 border rounded" />
                    <textarea name="openingHours" value={form.openingHours || ''} onChange={handleFormChange} placeholder="Opening Hours" className="w-full p-2 border rounded" rows="2"></textarea>
                    <textarea name="specialties" value={form.specialties || ''} onChange={handleFormChange} placeholder="Specialties" className="w-full p-2 border rounded" rows="2"></textarea>
                    <input type="url" name="bookingUrl" value={form.bookingUrl || ''} onChange={handleFormChange} placeholder="External Booking URL (if any)" className="w-full p-2 border rounded" />
                </div>
                <div className="md:col-span-2">
                    <button type="submit" className="w-full bg-tan text-cream py-2 rounded-lg hover:bg-gold transition">
                        {editingId ? "Update Business" : "Add Business"}
                    </button>
                </div>
            </form>

            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6 text-charcoal">Business Listings</h2>
                <div className="space-y-6">
                    {affiliateLinks.map((listing) => (
                        <div key={listing._id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold text-charcoal flex items-center">
                                        {listing.businessName}
                                        {listing.isVerified && <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>}
                                        {listing.isPremium && <span className="ml-2 text-sm bg-gold text-cream px-2 py-1 rounded">Premium</span>}
                                    </h3>
                                    <p className="text-gray-600 mt-1 capitalize">Type: {listing.businessType}</p>
                                    <p className="text-gray-600 mt-1">Contact: {listing.email}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleVerification(listing._id, !listing.isVerified)} className={`px-4 py-2 rounded-md ${listing.isVerified ? 'bg-gray-200' : 'bg-green-600 text-white'}`}>{listing.isVerified ? 'Unverify' : 'Verify'}</button>
                                    <button onClick={() => handleEdit(listing)} className="px-4 py-2 bg-tan text-cream rounded-md hover:bg-gold">Edit</button>
                                    <button onClick={() => handleDelete(listing._id)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>

                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <strong>Address:</strong>
                                    <p className="text-gray-600">{listing.address}</p>
                                </div>
                                <div>
                                    <strong>Status:</strong>
                                    <p className={`font-semibold ${listing.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                                        {listing.status?.charAt(0).toUpperCase() + listing.status?.slice(1)}
                                        {listing.needsReview && <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 p-1 rounded">Needs Review</span>}
                                    </p>
                                </div>
                            </div>
                            {listing.needsReview && (
                                <div className="mt-3">
                                    <button onClick={() => handleMarkAsReviewed(listing._id)} className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Mark as Reviewed</button>
                                </div>
                            )}
                            {listing.isPremium && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <h4 className="font-bold text-sm text-gold mb-2">Premium Management</h4>
                                    <div className="flex items-center space-x-2">
                                        <select value={listing.featuredStatus || 'none'} onChange={(e) => handleFeatureStatusUpdate(listing._id, e.target.value)} className="text-sm border-gray-300 rounded">
                                            <option value="none">Not Featured</option>
                                            <option value="homepage">Homepage</option>
                                            <option value="destination">Destination</option>
                                        </select>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Expires: {new Date(listing.premiumExpiry).toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminAffiliatePage;
