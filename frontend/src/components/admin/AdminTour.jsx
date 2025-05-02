import React, { useState, useEffect } from "react";
import api from '../../utils/api';

const AdminTour = () => {
    const [tours, setTours] = useState([]);
    const [isExternalTour, setIsExternalTour] = useState(false);
    const [tourData, setTourData] = useState({
        name: "",
        description: "",
        image: "",
        type: "safari",
        isExternal: false,
        bookingUrl: "",
        priceRange: "",
        duration: "",
        groupSize: "",
        highlights: "",
        included: "",
        notIncluded: "",
        startingPoint: "",
        endingPoint: "",
        itinerary: [{ day: "Day 1", description: "" }],
        contactEmail: "",
        contactPhone: ""
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            const response = await api.get("/tours");
            setTours(response.data);
        } catch (error) {
            console.error("Error fetching tours:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTourData(prev => ({
            ...prev,
            [name]: value,
            isExternal: isExternalTour
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
            if (editMode) {
                await api.put(`/tours/${editId}`, tourData);
            } else {
                await api.post("/tours", tourData);
            }
            fetchTours();
            setTourData({
                name: "",
                description: "",
                image: "",
                type: "safari",
                isExternal: false,
                bookingUrl: "",
                priceRange: "",
                duration: "",
                groupSize: "",
                highlights: "",
                included: "",
                notIncluded: "",
                startingPoint: "",
                endingPoint: "",
                itinerary: [{ day: "Day 1", description: "" }],
                contactEmail: "",
                contactPhone: ""
            });
        } catch (error) {
            console.error("Error saving tour:", error);
        }
    };

    const handleEdit = (tour) => {
        setEditMode(true);
        setEditId(tour._id);
        setTourData({
            name: tour.name,
            description: tour.description,
            image: tour.image,
            type: tour.type,
            isExternal: tour.isExternal,
            bookingUrl: tour.bookingUrl,
            priceRange: tour.priceRange,
            duration: tour.duration,
            groupSize: tour.groupSize,
            highlights: tour.highlights,
            included: tour.included,
            notIncluded: tour.notIncluded,
            startingPoint: tour.startingPoint,
            endingPoint: tour.endingPoint,
            itinerary: tour.itinerary || [{ day: "Day 1", description: "" }],
            contactEmail: tour.contactEmail,
            contactPhone: tour.contactPhone
        });
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

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4 text-charcoal">Admin: Manage Tours</h2>

            {/* Tour Type Toggle */}
            <div className="mb-6">
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        checked={isExternalTour}
                        onChange={(e) => {
                            setIsExternalTour(e.target.checked);
                            setTourData(prev => ({ ...prev, isExternal: e.target.checked }));
                        }}
                        className="form-checkbox text-tan"
                    />
                    <span className="ml-2">External Tour (with booking URL)</span>
                </label>
            </div>

            {/* Tour Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-6">
                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Tour Name</label>
                        <input
                            type="text"
                            name="name"
                            value={tourData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 mt-2 border border-tan rounded-md"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Tour Type</label>
                        <select
                            name="type"
                            value={tourData.type}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border border-tan rounded-md"
                        >
                            <option value="safari">Safari</option>
                            <option value="cultural">Cultural Tour</option>
                            <option value="adventure">Adventure Tour</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={tourData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full px-4 py-2 mt-2 border border-tan rounded-md"
                    />
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
                    />
                </div>

                {isExternalTour ? (
                    // External Tour Fields
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Booking URL</label>
                            <input
                                type="url"
                                name="bookingUrl"
                                value={tourData.bookingUrl}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 mt-2 border border-tan rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Price Range</label>
                            <input
                                type="text"
                                name="priceRange"
                                value={tourData.priceRange}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 mt-2 border border-tan rounded-md"
                            />
                        </div>
                    </>
                ) : (
                    // Local Tour Fields
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Duration</label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={tourData.duration}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 mt-2 border border-tan rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Group Size</label>
                                <input
                                    type="text"
                                    name="groupSize"
                                    value={tourData.groupSize}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 mt-2 border border-tan rounded-md"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Highlights</label>
                            <textarea
                                name="highlights"
                                value={tourData.highlights}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 mt-2 border border-tan rounded-md"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Starting Point</label>
                                <input
                                    type="text"
                                    name="startingPoint"
                                    value={tourData.startingPoint}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 mt-2 border border-tan rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Ending Point</label>
                                <input
                                    type="text"
                                    name="endingPoint"
                                    value={tourData.endingPoint}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 mt-2 border border-tan rounded-md"
                                />
                            </div>
                        </div>

                        {/* Itinerary Section */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Itinerary</label>
                            {tourData.itinerary.map((day, index) => (
                                <div key={index} className="mb-4 p-4 border border-tan rounded-md">
                                    <input
                                        type="text"
                                        value={day.day}
                                        onChange={(e) => handleItineraryChange(index, 'day', e.target.value)}
                                        className="w-full px-4 py-2 mb-2 border border-tan rounded-md"
                                    />
                                    <textarea
                                        value={day.description}
                                        onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                                        className="w-full px-4 py-2 border border-tan rounded-md"
                                        placeholder="Day description"
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addItineraryDay}
                                className="mt-2 px-4 py-2 bg-tan text-cream rounded-md hover:bg-gold"
                            >
                                Add Day
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={tourData.contactEmail}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 mt-2 border border-tan rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                                <input
                                    type="tel"
                                    name="contactPhone"
                                    value={tourData.contactPhone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 mt-2 border border-tan rounded-md"
                                />
                            </div>
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    className="w-full bg-tan text-cream py-3 rounded-lg hover:bg-gold transition duration-200"
                >
                    {editMode ? 'Update Tour' : 'Add Tour'}
                </button>
            </form>

            {/* Tour List with Horizontal Cards */}
            <div className="space-y-6">
                {tours.map((tour) => (
                    <div key={tour._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                        <div className="md:w-1/3">
                            <img 
                                src={tour.image} 
                                alt={tour.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="md:w-2/3 p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold text-charcoal">{tour.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1">Type: {tour.type}</p>
                                </div>
                                <div className="flex space-x-2">
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
                            
                            <p className="text-gray-600 mt-4">{tour.description}</p>
                            
                            {tour.isExternal ? (
                                <div className="mt-4">
                                    <p className="font-medium">Price Range: {tour.priceRange}</p>
                                    <a 
                                        href={tour.bookingUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-tan hover:text-gold mt-2 inline-block"
                                    >
                                        Booking Link →
                                    </a>
                                </div>
                            ) : (
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <p><span className="font-medium">Duration:</span> {tour.duration}</p>
                                        <p><span className="font-medium">Group Size:</span> {tour.groupSize}</p>
                                    </div>
                                    <div>
                                        <p><span className="font-medium">Starting:</span> {tour.startingPoint}</p>
                                        <p><span className="font-medium">Ending:</span> {tour.endingPoint}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminTour;
