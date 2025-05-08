import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import api from '../../utils/api';

const AdminTour = () => {
    const location = useLocation();
    const [tours, setTours] = useState([]);
    const [isExternalTour, setIsExternalTour] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
    const [hasWebsite, setHasWebsite] = useState(false);
    const [tourData, setTourData] = useState({
        name: "",
        description: "",
        image: "",
        type: "safari",
        isExternal: false,
        bookingUrl: "",
        priceRange: "Rs ", // Initialize with currency
        duration: "",
        groupSize: "",
        highlights: "",
        included: "",
        notIncluded: "",
        message: "", // Add message field
        startingPoint: "",
        endingPoint: "",
        itinerary: [{ day: "Day 1", description: "" }],
        contactEmail: "",
        contactPhone: "",
        status: "pending",
        isVerified: false
    });

    useEffect(() => {
        fetchTours();
        
        // Get ID from query params
        const searchParams = new URLSearchParams(location.search);
        const tourId = searchParams.get('id');
        if (tourId) {
            fetchTourDetails(tourId);
        }
    }, [location]);

    const fetchTours = async () => {
        try {
            const response = await api.get("/tours/all");
            setTours(response.data);
        } catch (error) {
            console.error("Error fetching tours:", error);
        }
    };

    const fetchTourDetails = async (id) => {
        try {
            const response = await api.get(`/tours/${id}`);
            const tour = response.data;
            setEditingTour(tour);
            setTourData({
                ...tour,
                priceRange: tour.priceRange || 'Rs ', // Ensure price range has currency
                message: tour.message || '', // Include message field
                highlights: tour.highlights || '',
                included: tour.included || '',
                notIncluded: tour.notIncluded || '',
                itinerary: tour.itinerary || [{ day: "Day 1", description: "" }]
            });
            setIsExternalTour(tour.isExternal);
        } catch (error) {
            console.error("Error fetching tour details:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'priceRange') {
            const currency = tourData.priceRange.startsWith('$') ? '$' : 'Rs';
            setTourData(prev => ({
                ...prev,
                [name]: `${currency}${value}`
            }));
        } else {
            setTourData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleItineraryChange = (index, field, value) => {
        const newItinerary = [...tourData.itinerary];
        newItinerary[index] = { ...newItinerary[index], [field]: value };
        setTourData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const addItineraryDay = () => {
        setTourData(prev => ({
            ...prev,
            itinerary: [...prev.itinerary, { day: `Day ${prev.itinerary.length + 1}`, description: "" }]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedTourData = {
                ...tourData,
                image: tourData.image || "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?cs=srgb&dl=pexels-te-lensfix-380994-1371360.jpg&fm=jpg", // Provide default if empty
                isExternal: isExternalTour,
                status: 'pending',
                submittedAt: new Date()
            };

            if (editingTour) {
                await api.put(`/tours/${editingTour._id}`, formattedTourData);
            } else {
                await api.post("/tours", formattedTourData);
            }
            fetchTours();
            // Reset form
            setTourData({
                name: "",
                description: "",
                image: "",
                type: "safari",
                isExternal: false,
                bookingUrl: "",
                priceRange: "Rs ", // Initialize with currency
                duration: "",
                groupSize: "",
                highlights: "",
                included: "",
                notIncluded: "",
                message: "", // Add message field
                startingPoint: "",
                endingPoint: "",
                itinerary: [{ day: "Day 1", description: "" }],
                contactEmail: "",
                contactPhone: "",
                status: "pending",
                isVerified: false
            });
            setEditingTour(null);
        } catch (error) {
            console.error("Error saving tour:", error);
        }
    };

    const handleEdit = (tour) => {
        setEditingTour(tour);
        setTourData({
            name: tour.name,
            description: tour.description,
            image: tour.image,
            type: tour.type,
            isExternal: tour.isExternal,
            bookingUrl: tour.bookingUrl,
            priceRange: tour.priceRange || 'Rs ', // Ensure price range has currency
            duration: tour.duration,
            groupSize: tour.groupSize,
            highlights: tour.highlights || '',
            included: tour.included || '',
            notIncluded: tour.notIncluded || '',
            message: tour.message || '', // Include message field
            startingPoint: tour.startingPoint,
            endingPoint: tour.endingPoint,
            itinerary: tour.itinerary || [{ day: "Day 1", description: "" }],
            contactEmail: tour.contactEmail,
            contactPhone: tour.contactPhone,
            status: tour.status,
            isVerified: tour.isVerified
        });
        setIsExternalTour(tour.isExternal);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this tour?")) {
            try {
                await api.delete(`/tours/${id}`);
                fetchTours();
            } catch (error) {
                console.error("Error deleting tour:", error);
            }
        }
    };

    const handleVerification = async (id, isVerified) => {
        try {
            await api.patch(`/tours/${id}/verify`, {
                status: isVerified ? 'approved' : 'rejected',
                isVerified
            });
            fetchTours();
        } catch (error) {
            console.error("Error updating verification status:", error);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-cream">
            <h2 className="text-2xl font-bold mb-6 text-charcoal">
                {editingTour ? "Edit Tour" : "Add New Tour"}
            </h2>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <div className="mb-6">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={isExternalTour}
                            onChange={(e) => setIsExternalTour(e.target.checked)}
                            className="form-checkbox text-tan"
                        />
                        <span>I have a website for managing tours</span>
                    </label>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                        type="text"
                        name="image"
                        value={tourData.image}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 mt-2 border border-tan rounded-md"
                        placeholder="Enter image URL"
                    />
                    {tourData.image && (
                        <div className="mt-2">
                            <img 
                                src={tourData.image} 
                                alt="Tour preview" 
                                className="w-32 h-32 object-cover rounded-md"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?cs=srgb&dl=pexels-te-lensfix-380994-1371360.jpg&fm=jpg";
                                }}
                            />
                        </div>
                    )}
                </div>

                {isExternalTour ? (
                    <div className="mb-4">
                        <label className="block text-charcoal mb-2">Booking Website URL</label>
                        <input
                            type="url"
                            name="bookingUrl"
                            value={tourData.bookingUrl}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                            placeholder="https://..."
                        />
                    </div>
                ) : (
                    <>
                        <div>
                            <label className="block text-charcoal mb-2">Tour Name</label>
                            <input
                                type="text"
                                name="name"
                                value={tourData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                            />
                        </div>

                        <div>
                            <label className="block text-charcoal mb-2">Tour Type</label>
                            <select
                                name="type"
                                value={tourData.type}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                            >
                                <option value="safari">Safari Tour</option>
                                <option value="cultural">Cultural Tour</option>
                                <option value="adventure">Adventure Tour</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-charcoal mb-2">Description</label>
                            <textarea
                                name="description"
                                value={tourData.description}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                            />
                        </div>

                        <div>
                            <label className="block text-charcoal mb-2">Duration</label>
                            <input
                                type="text"
                                name="duration"
                                placeholder="e.g., 3 days, 2 nights"
                                value={tourData.duration}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                            />
                        </div>

                        <div>
                            <label className="block text-charcoal mb-2">Group Size</label>
                            <input
                                type="text"
                                name="groupSize"
                                placeholder="e.g., 2-10 people"
                                value={tourData.groupSize}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                            />
                        </div>

                        <div>
                            <label className="block text-charcoal mb-2">Price Range</label>
                            <div className="relative">
                                <select
                                    name="currency"
                                    value={tourData.priceRange.startsWith('$') ? '$' : 'Rs'}
                                    onChange={(e) => {
                                        const numericPart = tourData.priceRange.replace(/[^0-9-]/g, '');
                                        setTourData(prev => ({
                                            ...prev,
                                            priceRange: `${e.target.value}${numericPart}`
                                        }));
                                    }}
                                    className="absolute left-0 top-0 h-full px-2 border-r border-tan"
                                >
                                    <option value="Rs">Rs</option>
                                    <option value="$">$</option>
                                </select>
                                <input
                                    type="text"
                                    name="priceRange"
                                    placeholder="e.g., 1000-2000 per person"
                                    value={tourData.priceRange.replace(/^(Rs|\$)/, '')}
                                    onChange={(e) => {
                                        const currency = tourData.priceRange.startsWith('$') ? '$' : 'Rs';
                                        setTourData(prev => ({
                                            ...prev,
                                            priceRange: `${currency}${e.target.value}`
                                        }));
                                    }}
                                    required
                                    className="w-full pl-16 px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-charcoal mb-2">Tour Highlights (Optional)</label>
                            <textarea
                                name="highlights"
                                value={tourData.highlights}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Key attractions and activities"
                                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                            />
                        </div>

                        <div>
                            <label className="block text-charcoal mb-2">What's Included (Optional)</label>
                            <textarea
                                name="included"
                                value={tourData.included}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Transportation, accommodation, meals, etc."
                                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                            />
                        </div>

                        <div>
                            <label className="block text-charcoal mb-2">What's Not Included (Optional)</label>
                            <textarea
                                name="notIncluded"
                                value={tourData.notIncluded}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Flights, personal expenses, etc."
                                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                            />
                        </div>

                        <div>
                            <label className="block text-charcoal mb-2">Additional Message (Optional)</label>
                            <textarea
                                name="message"
                                value={tourData.message}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                            />
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-charcoal mb-2">Contact Email</label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={tourData.contactEmail}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                                />
                            </div>
                            <div>
                                <label className="block text-charcoal mb-2">Contact Phone</label>
                                <input
                                    type="tel"
                                    name="contactPhone"
                                    value={tourData.contactPhone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                                />
                            </div>
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    className="w-full bg-tan text-cream py-3 rounded-lg hover:bg-gold transition duration-200"
                >
                    {editingTour ? 'Update Tour' : 'Add Tour'}
                </button>
            </form>

            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6 text-charcoal">All Tours</h2>
                <div className="space-y-6">
                    {tours.map((tour) => (
                        <div key={tour._id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold text-charcoal">
                                        {tour.name}
                                        {tour.isVerified && (
                                            <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                                Verified
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-gray-600 mt-1">Type: {tour.type}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleVerification(tour._id, !tour.isVerified)}
                                        className={`px-4 py-2 rounded-md ${
                                            tour.isVerified 
                                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                : 'bg-green-600 text-white hover:bg-green-700'
                                        }`}
                                    >
                                        {tour.isVerified ? 'Unverify' : 'Verify'}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(tour)}
                                        className="px-4 py-2 bg-tan text-cream rounded-md hover:bg-gold"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tour._id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <strong>Duration:</strong>
                                    <p className="text-gray-600">{tour.duration}</p>
                                </div>
                                <div>
                                    <strong>Price Range:</strong>
                                    <p className="text-gray-600">{tour.priceRange}</p>
                                </div>
                                <div>
                                    <strong>Contact:</strong>
                                    <p className="text-gray-600">{tour.contactEmail}</p>
                                </div>
                                <div>
                                    <strong>Status:</strong>
                                    <p className={`text-${tour.status === 'approved' ? 'green' : 'red'}-600`}>
                                        {tour.status?.charAt(0).toUpperCase() + tour.status?.slice(1)}
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

export default AdminTour;
