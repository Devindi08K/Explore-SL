import React, { useState, useEffect } from "react";
import api from '../../utils/api';

const ManageDestinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [newDestination, setNewDestination] = useState({
        name: "",
        description: "",
        image: "",
        source: "",
        district: "Colombo", // Add default district
        attractions: [] // Add attractions array
    });
    const [editingDestination, setEditingDestination] = useState(null);

    const districts = [
        'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
        'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
        'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
        'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
        'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
    ];

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        try {
            const response = await api.get("/destinations");
            setDestinations(response.data);
        } catch (error) {
            console.error("Error fetching destinations:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDestination(prev => ({
            ...prev,
            [name]: name === 'attractions' ? value.split(',').map(item => item.trim()) : value
        }));
    };

    const handleAddDestination = async () => {
        try {
            const response = await api.post("/destinations", newDestination);
            setDestinations([...destinations, response.data]);
            setNewDestination({
                name: "",
                description: "",
                image: "",
                source: "",
                district: "Colombo",
                attractions: []
            });
        } catch (error) {
            console.error("Error adding destination:", error);
        }
    };

    const handleDeleteDestination = async (id) => {
        try {
            await api.delete(`/destinations/${id}`);
            setDestinations(destinations.filter((dest) => dest._id !== id));
        } catch (error) {
            console.error("Error deleting destination:", error);
        }
    };

    const handleEditDestination = async () => {
        try {
            const formattedDestination = {
                ...editingDestination,
                attractions: Array.isArray(editingDestination.attractions) 
                    ? editingDestination.attractions 
                    : editingDestination.attractions?.split(',').map(item => item.trim()) || [],
                district: editingDestination.district || 'Colombo' // Ensure district is always present
            };

            const response = await api.put(
                `/destinations/${editingDestination._id}`, 
                formattedDestination
            );
            
            if (response.data) {
                setDestinations(destinations.map((destination) =>
                    destination._id === editingDestination._id ? response.data : destination
                ));
                setEditingDestination(null);
            }
        } catch (error) {
            console.error("Error editing destination:", error);
            alert("Failed to update destination: " + (error.response?.data?.message || error.message));
        }
    };

    const openEditForm = (destination) => {
        setEditingDestination(destination);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingDestination(prev => ({
            ...prev,
            [name]: name === 'attractions' ? value.split(',').map(item => item.trim()) : value
        }));
    };

    return (
        <div className="container mx-auto p-6 bg-cream">
            <h1 className="text-3xl font-bold text-charcoal mb-6">Manage Destinations</h1>

            {/* Add New Destination Form */}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-2xl font-semibold text-charcoal mb-4">Add New Destination</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Destination Name</label>
                        <input
                            type="text"
                            name="name"
                            value={newDestination.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-tan rounded-md focus:ring-2 focus:ring-gold focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                        <select
                            name="district"
                            value={newDestination.district}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-tan rounded-md focus:ring-2 focus:ring-gold focus:outline-none"
                            required
                        >
                            {districts.map(district => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={newDestination.description}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full p-2 border border-tan rounded-md focus:ring-2 focus:ring-gold focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                            type="url"
                            name="image"
                            value={newDestination.image}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-tan rounded-md focus:ring-2 focus:ring-gold focus:outline-none"
                            required
                        />
                        {newDestination.image && (
                            <img
                                src={newDestination.image}
                                alt="Preview"
                                className="mt-2 w-32 h-32 object-cover rounded-md"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/600x400?text=Invalid+Image";
                                }}
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Key Attractions</label>
                        <textarea
                            name="attractions"
                            value={newDestination.attractions.join(', ')}
                            onChange={handleInputChange}
                            placeholder="Enter attractions separated by commas"
                            className="w-full p-2 border border-tan rounded-md focus:ring-2 focus:ring-gold focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">More Info URL</label>
                        <input
                            type="url"
                            name="source"
                            value={newDestination.source}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-tan rounded-md focus:ring-2 focus:ring-gold focus:outline-none"
                        />
                    </div>

                    <button
                        onClick={handleAddDestination}
                        className="w-full bg-tan text-cream py-2 rounded-md hover:bg-gold transition duration-200"
                    >
                        Add Destination
                    </button>
                </div>
            </div>

            {/* Destinations List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((destination) => (
                    <div key={destination._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img
                            src={destination.image}
                            alt={destination.name}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder.png";
                            }}
                        />
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-semibold text-charcoal">{destination.name}</h3>
                                <span className="text-sm bg-tan text-cream px-2 py-1 rounded-full">
                                    {destination.district}
                                </span>
                            </div>
                            <p className="mt-2 text-gray-600">{destination.description}</p>
                            {destination.attractions?.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-charcoal">Key Attractions:</h4>
                                    <ul className="mt-1 text-sm text-gray-600">
                                        {destination.attractions.map((attraction, index) => (
                                            <li key={index}>• {attraction}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={() => openEditForm(destination)}
                                    className="px-3 py-1 bg-tan text-cream rounded hover:bg-gold transition duration-200"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteDestination(destination._id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal - Similar updates to the edit form */}
            {editingDestination && (
                <div className="modal show fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
                        <div className="modal-header flex justify-between items-center mb-4">
                            <h5 className="text-xl font-semibold">Edit Destination</h5>
                            <button
                                className="text-xl font-bold"
                                onClick={() => setEditingDestination(null)}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <input
                                type="text"
                                className="input-field mb-4 w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Destination Name"
                                name="name"
                                value={editingDestination.name}
                                onChange={handleEditInputChange}
                            />
                            {/* Add district select field */}
                            <select
                                name="district"
                                value={editingDestination.district}
                                onChange={handleEditInputChange}
                                className="input-field mb-4 w-full p-2 border border-gray-300 rounded-md"
                                required
                            >
                                {districts.map(district => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                            </select>
                            <textarea
                                className="input-field mb-4 w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Description"
                                name="description"
                                value={editingDestination.description}
                                onChange={handleEditInputChange}
                            />
                            <input
                                type="text"
                                className="input-field mb-4 w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Image URL"
                                name="image"
                                value={editingDestination.image}
                                onChange={handleEditInputChange}
                            />
                            <input
                                type="text"
                                className="input-field mb-4 w-full p-2 border border-gray-300 rounded-md"
                                placeholder="More Info URL"
                                name="source"
                                value={editingDestination.source}
                                onChange={handleEditInputChange}
                            />
                        </div>
                        <div className="modal-footer flex justify-between">
                            <button
                                className="btn-secondary p-2 bg-gray-400 hover:bg-gray-500 text-white rounded-md"
                                onClick={() => setEditingDestination(null)}
                            >
                                Close
                            </button>
                            <button
                                className="btn-primary p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                                onClick={handleEditDestination}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageDestinations;
