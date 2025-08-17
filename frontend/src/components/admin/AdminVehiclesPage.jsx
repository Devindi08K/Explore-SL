import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { 
  FaCar, 
  FaBus, 
  FaCarSide,
  FaMotorcycle 
} from 'react-icons/fa';
import { 
  MdAirportShuttle,
  MdLocalTaxi,
  MdDirectionsBike 
} from 'react-icons/md';

const AdminVehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    ownerName: "",
    vehicleType: "car",
    vehicleModel: "",
    vehicleYear: "",
    plateNumber: "",
    seatingCapacity: "",
    features: [],
    hasAC: false,
    pricePerDay: "",
    pricePerKm: "",
    availability: "available",
    contactPhone: "",
    contactEmail: "",
    whatsapp: "",
    baseLocation: "",
    willingToTravel: true,
    servingAreas: [],
    vehicleImages: [],
    driverName: "",
    driverExperience: "",
    isVerified: false
  });

  const vehicleTypes = {
    car: { icon: FaCar, label: 'Car' },
    van: { icon: MdAirportShuttle, label: 'Van' },
    minibus: { icon: FaBus, label: 'Mini Bus' },
    largebus: { icon: FaBus, label: 'Large Bus' },
    suv: { icon: FaCarSide, label: 'SUV' },
    taxi: { icon: MdLocalTaxi, label: 'Taxi' },
    threeWheeler: { icon: FaMotorcycle, label: 'Three Wheeler' } // Updated icon
  };

  const features = [
    'Air Conditioning',
    'GPS Navigation',
    'Bluetooth Audio',
    'Leather Seats',
    'Luggage Space',
    'Child Seat Available',
    'First Aid Kit',
    'Wifi',
    'USB Charging'
  ];

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/vehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a new object with explicit type conversion for vehicleType
      const submitData = {
        ...formData,
        vehicleType: String(formData.vehicleType),
        seatingCapacity: parseInt(formData.seatingCapacity || 0),
        pricePerDay: parseInt(formData.pricePerDay || 0),
        pricePerKm: formData.pricePerKm ? parseInt(formData.pricePerKm) : 0,
      };
      
      console.log('Submitting vehicle data with type:', submitData.vehicleType);
      
      if (editingVehicle) {
        console.log('Updating vehicle ID:', editingVehicle._id);
        console.log('Complete form data:', submitData);
        const response = await api.put(`/vehicles/${editingVehicle._id}`, submitData);
        console.log('Update response:', response.data);
      } else {
        await api.post("/vehicles", submitData);
      }
      fetchVehicles();
      resetForm();
    } catch (error) {
      console.error("Error saving vehicle:", error);
      alert(`Error saving vehicle: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleVerification = async (id, isVerified) => {
    try {
      const response = await api.patch(`/vehicles/${id}/verify`, {
        status: isVerified ? 'approved' : 'rejected',
        isVerified
      });
      
      if (response.data) {
        fetchVehicles(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating verification status:", error);
      alert("Failed to update vehicle status. Please try logging in again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await api.delete(`/vehicles/${id}`);
        fetchVehicles();
      } catch (error) {
        console.error("Error deleting vehicle:", error);
      }
    }
  };

  const handleEdit = (vehicle) => {
    console.log('Editing vehicle with type:', vehicle.vehicleType);
    setEditingVehicle(vehicle);
    
    // Clone the vehicle data and ensure all fields exist
    const vehicleData = {
      ...vehicle,
      vehicleType: vehicle.vehicleType || 'car', // Set default if missing
      features: vehicle.features || [],
      servingAreas: vehicle.servingAreas || [],
      vehicleImages: vehicle.vehicleImages || [],
    };
    
    setFormData(vehicleData);
    
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingVehicle(null);
    setFormData({
      ownerName: "",
      vehicleType: "car",
      vehicleModel: "",
      vehicleYear: "",
      plateNumber: "",
      seatingCapacity: "",
      features: [],
      hasAC: false,
      pricePerDay: "",
      pricePerKm: "",
      availability: "available",
      contactPhone: "",
      contactEmail: "",
      whatsapp: "",
      baseLocation: "",
      willingToTravel: true,
      servingAreas: [],
      vehicleImages: [],
      driverName: "",
      driverExperience: "",
      isVerified: false
    });
  };

  return (
    <div className="container mx-auto p-6 bg-cream">
      <h2 className="text-2xl font-bold mb-6 text-charcoal">
        {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-8 space-y-6">
        {/* Vehicle Type Selection */}
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(vehicleTypes).map(([type, { icon: Icon, label }]) => (
            <label 
              key={type}
              className={`
                flex flex-col items-center p-4 rounded-lg cursor-pointer
                ${formData.vehicleType === type ? 'bg-tan text-white' : 'bg-gray-100 hover:bg-gray-200'}
              `}
            >
              <input
                type="radio"
                name="vehicleType"
                value={type}
                checked={formData.vehicleType === type}
                onChange={(e) => {
                  console.log('Selected vehicle type:', e.target.value);
                  setFormData({ ...formData, vehicleType: e.target.value });
                }}
                className="sr-only"
              />
              <Icon className="text-3xl mb-2" />
              <span className="font-medium">{label}</span>
            </label>
          ))}
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Owner Name</label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Vehicle Model</label>
            <input
              type="text"
              value={formData.vehicleModel}
              onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              required
            />
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Features</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map(feature => (
              <label key={feature} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature)}
                  onChange={(e) => {
                    const updatedFeatures = e.target.checked
                      ? [...formData.features, feature]
                      : formData.features.filter(f => f !== feature);
                    setFormData({ ...formData, features: updatedFeatures });
                  }}
                  className="rounded border-tan text-gold focus:ring-gold"
                />
                <span>{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Contact Phone</label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Contact Email</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">WhatsApp (Optional)</label>
            <input
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>

        {/* Location Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Base Location</label>
            <input
              type="text"
              value={formData.baseLocation}
              onChange={(e) => setFormData({ ...formData, baseLocation: e.target.value })}
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Willing to Travel</label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.willingToTravel}
                onChange={(e) => setFormData({ ...formData, willingToTravel: e.target.checked })}
                className="rounded border-tan text-gold focus:ring-gold"
              />
              <span>Available for long-distance travel</span>
            </label>
          </div>
        </div>

        {/* Vehicle Images */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Vehicle Images (URLs)</label>
          {formData.vehicleImages.map((url, index) => (
            <div key={index} className="mb-2 flex items-center space-x-2">
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  const newImages = [...formData.vehicleImages];
                  newImages[index] = e.target.value;
                  setFormData({ ...formData, vehicleImages: newImages });
                }}
                className="flex-1 px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder={`Image URL ${index + 1}`}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFormData({ ...formData, vehicleImages: [...formData.vehicleImages, ""] })}
            className="mt-2 text-gold hover:underline"
          >
            Add another image
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-tan text-cream py-3 rounded-lg hover:bg-gold transition duration-200"
        >
          {editingVehicle ? "Update Vehicle" : "Add Vehicle"}
        </button>
      </form>

      {/* Vehicle List */}
      <div className="space-y-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-charcoal">
                  {vehicle.vehicleModel}
                  {vehicle.isVerified && (
                    <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      Verified
                    </span>
                  )}
                </h3>
                <p className="text-gray-600">{vehicle.ownerName}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleVerification(vehicle._id, !vehicle.isVerified)}
                  className={`px-4 py-2 rounded-md ${
                    vehicle.isVerified 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {vehicle.isVerified ? 'Unverify' : 'Verify'}
                </button>
                <button
                  onClick={() => handleEdit(vehicle)}
                  className="px-4 py-2 bg-tan text-cream rounded-md hover:bg-gold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(vehicle._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminVehiclesPage;