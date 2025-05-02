import React, { useState, useEffect } from "react";
import api from '../../utils/api';

const AdminAffiliatePage = () => {
    const [affiliateLinks, setAffiliateLinks] = useState([]);
    const [isExternal, setIsExternal] = useState(false);
    const [form, setForm] = useState({
        category: "hotel",
        name: "",
        description: "",
        imageUrl: "",
        priceRange: "",
        isExternal: false,
        // External business fields
        redirectUrl: "",
        // Local business fields
        contactName: "",
        email: "",
        phone: "",
        address: "",
        openingHours: "",
        specialties: ""
    });

    useEffect(() => {
        fetchAffiliateLinks();
    }, []);

    const fetchAffiliateLinks = async () => {
        try {
            const response = await api.get("/affiliate-links");
            setAffiliateLinks(response.data);
        } catch (error) {
            console.error("Error fetching affiliate links:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                ...form,
                isExternal
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
            redirectUrl: "",
            contactName: "",
            email: "",
            phone: "",
            address: "",
            openingHours: "",
            specialties: ""
        });
        setIsExternal(false);
    };

    const handleEdit = (link) => {
        setForm(link);
        setIsExternal(link.isExternal);
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

    return (
        <div className="min-h-screen bg-cream py-8 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-charcoal mb-6 text-center">
                    {form._id ? "Update" : "Add"} Business Listing
                </h2>

                <div className="mb-6">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={isExternal}
                            onChange={(e) => setIsExternal(e.target.checked)}
                            className="form-checkbox text-tan"
                        />
                        <span>Business has online booking system</span>
                    </label>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Common Fields */}
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

                    {isExternal ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Booking URL:</label>
                            <input
                                type="url"
                                value={form.redirectUrl}
                                onChange={(e) => setForm({ ...form, redirectUrl: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                    ) : (
                        <>
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
                        </>
                    )}

                    <button 
                        type="submit" 
                        className="w-full bg-tan text-cream py-2 rounded-lg hover:bg-gold transition duration-200"
                    >
                        {form._id ? "Update" : "Add"} Business
                    </button>
                </form>

                {/* Existing Business Listings */}
                <h3 className="text-xl font-semibold text-charcoal mt-8 mb-4">Existing Business Listings</h3>
                <div className="space-y-4">
                    {affiliateLinks.map((link) => (
                        <div key={link._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                            <div className="md:w-1/3">
                                <img 
                                    src={link.imageUrl} 
                                    alt={link.name} 
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                            <div className="md:w-2/3 p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-xl font-semibold text-charcoal">{link.name}</h4>
                                        <p className="text-sm text-gray-600">Category: {link.category}</p>
                                        <p className="text-sm text-gray-600">Price Range: {link.priceRange}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(link)}
                                            className="px-4 py-2 bg-tan text-cream rounded-md hover:bg-gold"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(link._id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-700 mt-2">{link.description}</p>
                                {link.isExternal ? (
                                    <a 
                                        href={link.redirectUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-4 text-tan hover:text-gold"
                                    >
                                        View Booking Page →
                                    </a>
                                ) : (
                                    <div className="mt-4 text-sm text-gray-600">
                                        <p>Contact: {link.contactName}</p>
                                        <p>Hours: {link.openingHours}</p>
                                        <p>Address: {link.address}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminAffiliatePage;
