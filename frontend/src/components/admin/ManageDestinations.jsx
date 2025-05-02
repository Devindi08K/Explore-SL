import React, { useState, useEffect } from "react";
import api from '../../utils/api';

const ManageDestinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [newDestination, setNewDestination] = useState({ name: "", description: "", image: "", source: "" });
    const [editingDestination, setEditingDestination] = useState(null);

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
        setNewDestination({ ...newDestination, [e.target.name]: e.target.value });
    };

    const handleAddDestination = async () => {
        try {
            const response = await api.post("/destinations", newDestination);
            setDestinations([...destinations, response.data]);
            setNewDestination({ name: "", description: "", image: "", source: "" });
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
            const response = await api.put(`/destinations/${editingDestination._id}`, editingDestination);
            setDestinations(destinations.map((destination) =>
                destination._id === editingDestination._id ? response.data : destination
            ));
            setEditingDestination(null);
        } catch (error) {
            console.error("Error editing destination:", error);
        }
    };

    const openEditForm = (destination) => {
        setEditingDestination(destination);
    };

    const handleEditInputChange = (e) => {
        setEditingDestination({ ...editingDestination, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Manage Destinations</h1>

            {/* Add New Destination Form */}
            <div className="bg-white p-4 shadow-lg rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">Add New Destination</h2>
                <input
                    type="text"
                    className="input-field mb-4 w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Destination Name"
                    name="name"
                    value={newDestination.name}
                    onChange={handleInputChange}
                />
                <textarea
                    className="input-field mb-4 w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Description"
                    name="description"
                    value={newDestination.description}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    className="input-field mb-4 w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Image URL"
                    name="image"
                    value={newDestination.image}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    className="input-field mb-4 w-full p-2 border border-gray-300 rounded-md"
                    placeholder="More Info URL"
                    name="source"
                    value={newDestination.source} // Bind the new source state
                    onChange={handleInputChange}
                />
                <button
                    className="btn-primary w-full p-3 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                    onClick={handleAddDestination}
                >
                    Add Destination
                </button>
            </div>

            {/* Edit Destination Modal (When editing) */}
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

            {/* List of Destinations */}
            <ul className="destination-list">
                {destinations.map((destination) => (
                    <li key={destination._id} className="destination-item flex justify-between bg-gray-100 p-4 rounded-lg mb-4">
                        <div className="destination-info">
                            <span className="destination-name text-xl font-semibold">{destination.name}</span>
                            <p className="destination-description text-gray-600">{destination.description}</p>
                            {destination.image && (
                                <img
                                    src={destination.image}
                                    alt={destination.name}
                                    className="destination-image w-32 h-32 object-cover mt-2"
                                />
                            )}
                            {destination.source && (
                                <p className="mt-2">
                                    <a
                                        href={destination.source}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500"
                                    >
                                        More Info
                                    </a>
                                </p>
                            )}
                        </div>
                        <div className="destination-actions flex flex-col justify-between">
                            <button
                                className="btn-warning p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md mb-2"
                                onClick={() => openEditForm(destination)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn-danger p-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                                onClick={() => handleDeleteDestination(destination._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageDestinations;
