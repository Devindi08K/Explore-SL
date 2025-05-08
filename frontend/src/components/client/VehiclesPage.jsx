import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { 
  FaCar, 
  FaTruck, 
  FaBus,
  FaCarSide,
  FaCarAlt,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { 
  MdAirportShuttle, 
  MdLocalTaxi, 
  MdAirlineSeatReclineNormal, 
  MdAttachMoney 
} from 'react-icons/md';

const vehicleTypes = {
  car: { icon: FaCar, label: 'Car' },
  van: { icon: MdAirportShuttle, label: 'Van' },
  minibus: { icon: FaBus, label: 'Mini Bus' },
  bus: { icon: FaBus, label: 'Large Bus' },
  suv: { icon: FaCarSide, label: 'SUV' },
  taxi: { icon: MdLocalTaxi, label: 'Taxi' }
};

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [filters, setFilters] = useState({
    hasAC: false,
    minSeats: '',
    maxPrice: '',
    location: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/vehicles");
      setVehicles(response.data.filter(vehicle => vehicle.isVerified));
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    if (selectedType !== 'all' && vehicle.type !== selectedType) return false;
    if (filters.hasAC && !vehicle.hasAC) return false;
    if (filters.minSeats && vehicle.seatingCapacity < filters.minSeats) return false;
    if (filters.maxPrice && vehicle.pricePerDay > filters.maxPrice) return false;
    if (filters.location && !vehicle.servingAreas.includes(filters.location)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-cream px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-4 md:mb-0">
            Travel Vehicles
          </h1>
          <Link 
            to="/vehicle-registration" 
            className="bg-tan text-cream px-6 py-3 rounded-lg hover:bg-gold transition duration-200"
          >
            Register Your Vehicle
          </Link>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map(vehicle => (
            <div key={vehicle._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {vehicle.vehicleImages?.[0] && (
                <img
                  src={vehicle.vehicleImages[0]}
                  alt={vehicle.vehicleModel}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-charcoal">{vehicle.vehicleModel}</h3>
                    <p className="text-gray-600">{vehicleTypes[vehicle.vehicleType]?.label}</p>
                  </div>
                  {vehicle.hasAC && (
                    <span className="bg-tan text-cream px-2 py-1 rounded-full text-sm">AC</span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <p className="flex items-center text-sm text-gray-600">
                    <MdAirlineSeatReclineNormal className="mr-2" />
                    {vehicle.seatingCapacity} Seats
                  </p>
                  <p className="flex items-center text-sm text-gray-600">
                    <MdAttachMoney className="mr-2" />
                    {vehicle.pricePerDay}/day
                  </p>
                  <p className="flex items-center text-sm text-gray-600">
                    <FaMapMarkerAlt className="mr-2" />
                    {vehicle.baseLocation}
                  </p>
                  {vehicle.features.length > 0 && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Features:</span> {vehicle.features.join(', ')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => window.location.href = `mailto:${vehicle.contactEmail}`}
                    className="w-full bg-tan text-cream py-2 rounded-lg hover:bg-gold transition duration-200"
                  >
                    Contact Owner
                  </button>
                  <p className="text-sm text-center text-gray-500">
                    Call: {vehicle.contactPhone}
                    {vehicle.whatsapp && <span className="ml-2">| WhatsApp: {vehicle.whatsapp}</span>}
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

export default VehiclesPage;