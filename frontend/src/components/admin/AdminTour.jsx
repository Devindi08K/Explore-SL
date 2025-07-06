import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import api from '../../utils/api';

const AdminTour = () => {
    const location = useLocation();
    const [tours, setTours] = useState([]);
    const [isExternalTour, setIsExternalTour] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
    const [tourData, setTourData] = useState({
        name: "",
        description: "",
        image: "",
        type: "safari",
        location: "", // Add this line
        isExternal: false,
        bookingUrl: "",
        priceRange: "Rs ", // Initialize with currency
        duration: "",
        groupSize: "",
        highlights: "",
        included: "",
        notIncluded: "",
        message: "",
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
            const response = await api.get(`/admin/tours/${id}`);
            const tour = response.data;
            setEditingTour(tour);
            setTourData({
                ...tour,
                priceRange: tour.priceRange || 'Rs ', // Ensure price range has currency
                message: tour.message || '',
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
        setTourData(prev => ({
            ...prev,
            [name]: value
        }));
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
                image: tourData.image || "https://placehold.co/600x400?text=Tour+Image", // Default if empty
                isExternal: isExternalTour,
            };

            if (editingTour) {
                await api.put(`/tours/${editingTour._id}`, formattedTourData);
                alert("Tour updated successfully!");
            } else {
                await api.post("/tours", {
                    ...formattedTourData,
                    status: 'pending',
                    submittedAt: new Date()
                });
                alert("Tour created successfully!");
            }
            fetchTours();
            
            // Reset form
            setTourData({
                name: "",
                description: "",
                image: "",
                type: "safari",
                location: "", // Reset location
                isExternal: false,
                bookingUrl: "",
                priceRange: "Rs ", // Initialize with currency
                duration: "",
                groupSize: "",
                highlights: "",
                included: "",
                notIncluded: "",
                message: "",
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
            alert("Error saving tour: " + (error.response?.data?.error || error.message));
        }
    };

    const handleEdit = (tour) => {
        setEditingTour(tour);
        setTourData({
            ...tour,
            priceRange: tour.priceRange || 'Rs ',
            highlights: tour.highlights || '',
            included: tour.included || '',
            notIncluded: tour.notIncluded || '',
            message: tour.message || '',
            itinerary: tour.itinerary && tour.itinerary.length > 0 
                ? tour.itinerary 
                : [{ day: "Day 1", description: "" }]
        });
        setIsExternalTour(tour.isExternal);
        
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this tour?")) {
            try {
                await api.delete(`/tours/${id}`);
                fetchTours();
                alert("Tour deleted successfully!");
            } catch (error) {
                console.error("Error deleting tour:", error);
                alert("Error deleting tour: " + (error.response?.data?.error || error.message));
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
            alert(`Tour ${isVerified ? 'approved' : 'rejected'} successfully!`);
        } catch (error) {
            console.error("Error updating verification status:", error);
            alert("Error updating status: " + (error.response?.data?.error || error.message));
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
                        <span>This tour has an external booking website</span>
                    </label>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                        type="text"
                        name="image"
                        value={tourData.image}
                        onChange={handleChange}
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
                                    e.target.src = "https://placehold.co/600x400?text=Tour+Image";
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
                                <option value="nature">Nature Tour</option>
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
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-charcoal mb-2">Duration</label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={tourData.duration}
                                    onChange={handleChange}
                                    placeholder="e.g., 3 days, 2 nights"
                                    className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                                />
                            </div>

                            <div>
                                <label className="block text-charcoal mb-2">Group Size</label>
                                <input
                                    type="text"
                                    name="groupSize"
                                    value={tourData.groupSize}
                                    onChange={handleChange}
                                    placeholder="e.g., 2-10 people"
                                    className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-charcoal mb-2">Price Range</label>
                            <input
                                type="text"
                                name="priceRange"
                                value={tourData.priceRange}
                                onChange={handleChange}
                                placeholder="e.g., Rs 1000-2000 per person"
                                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                            />
                        </div>

                        <div>
                            <label className="block text-charcoal mb-2">Tour Highlights</label>
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
                            <label className="block text-charcoal mb-2">What's Included</label>
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
                            <label className="block text-charcoal mb-2">What's Not Included</label>
                            <textarea
                                name="notIncluded"
                                value={tourData.notIncluded}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Flights, personal expenses, etc."
                                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-charcoal mb-2">Starting Point</label>
                                <input
                                    type="text"
                                    name="startingPoint"
                                    value={tourData.startingPoint}
                                    onChange={handleChange}
                                    placeholder="e.g., Colombo"
                                    className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                                />
                            </div>
                            <div>
                                <label className="block text-charcoal mb-2">Ending Point</label>
                                <input
                                    type="text"
                                    name="endingPoint"
                                    value={tourData.endingPoint}
                                    onChange={handleChange}
                                    placeholder="e.g., Colombo"
                                    className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-charcoal mb-2">Itinerary</label>
                            {tourData.itinerary.map((day, index) => (
                                <div key={index} className="mb-2 grid grid-cols-4 gap-2">
                                    <input
                                        type="text"
                                        value={day.day}
                                        onChange={(e) => handleItineraryChange(index, 'day', e.target.value)}
                                        className="col-span-1 px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                                    />
                                    <textarea
                                        value={day.description}
                                        onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                                        className="col-span-3 px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                                        placeholder="Description for this day"
                                    ></textarea>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addItineraryDay}
                                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                                + Add Day
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                        
                        <div>
                            <label className="block text-charcoal mb-2">Additional Message</label>
                            <textarea
                                name="message"
                                value={tourData.message}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                            />
                        </div>
                        
                        {/* Status & verification fields (admin only) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    name="status"
                                    value={tourData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Verification</label>
                                <div className="mt-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={tourData.isVerified}
                                            onChange={(e) => setTourData({...tourData, isVerified: e.target.checked})}
                                            className="form-checkbox text-tan"
                                        />
                                        <span className="ml-2">Verified</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    className="w-full bg-tan text-cream py-3 rounded-lg hover:bg-gold transition duration-200 mt-6"
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
                                    <h3 className="text-xl font-semibold text-charcoal flex items-center">
                                        {tour.name}
                                        {tour.isVerified && (
                                            <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                                Verified
                                            </span>
                                        )}
                                        {!tour.isVerified && tour.status === 'pending' && (
                                            <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                                Pending
                                            </span>
                                        )}
                                        {!tour.isVerified && tour.status === 'rejected' && (
                                            <span className="ml-2 text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                                                Rejected
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-gray-600 mt-1">Type: {tour.type}</p>
                                    {tour.submittedAt && (
                                        <p className="text-gray-500 text-sm mt-1">
                                            Submitted: {new Date(tour.submittedAt).toLocaleDateString()}
                                        </p>
                                    )}
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
                                    <p className="text-gray-600">{tour.duration || 'Not specified'}</p>
                                </div>
                                <div>
                                    <strong>Price Range:</strong>
                                    <p className="text-gray-600">{tour.priceRange || 'Not specified'}</p>
                                </div>
                                <div>
                                    <strong>Contact:</strong>
                                    <p className="text-gray-600">{tour.contactEmail || 'Not specified'}</p>
                                </div>
                                <div>
                                    <strong>Status:</strong>
                                    <p className={`text-${tour.status === 'approved' ? 'green' : tour.status === 'pending' ? 'yellow' : 'red'}-600`}>
                                        {tour.status?.charAt(0).toUpperCase() + tour.status?.slice(1) || 'Pending'}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Preview image */}
                            {tour.image && (
                                <div className="mt-4">
                                    <strong>Image:</strong>
                                    <img 
                                        src={tour.image.startsWith('http') 
                                            ? tour.image 
                                            : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/${tour.image.replace(/\\/g, '/')}`
                                        } 
                                        alt={tour.name}
                                        className="mt-2 w-40 h-24 object-cover rounded-md"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://placehold.co/600x400?text=Tour+Image";
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminTour;
