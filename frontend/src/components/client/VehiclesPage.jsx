import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { 
  FaCar, 
  FaTruck, 
  FaBus,
  FaCarSide,
  FaCarAlt,
  FaMapMarkerAlt,
  FaFilter
} from 'react-icons/fa';
import { 
  MdAirportShuttle, 
  MdLocalTaxi, 
  MdAirlineSeatReclineNormal, 
  MdAttachMoney,
  MdFilterAlt,
  MdClose
} from 'react-icons/md';

const vehicleTypes = {
  car: { icon: FaCar, label: 'Car' },
  van: { icon: MdAirportShuttle, label: 'Van' },
  minibus: { icon: FaBus, label: 'Mini Bus' },
  largebus: { icon: FaBus, label: 'Large Bus' },
  suv: { icon: FaCarSide, label: 'SUV' },
  taxi: { icon: MdLocalTaxi, label: 'Taxi' }
};

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    hasAC: false,
    minSeats: '',
    maxPrice: '',
    location: '',
    features: []
  });

  const sriLankanProvinces = [
    'Western Province',
    'Central Province',
    'Southern Province',
    'Northern Province',
    'Eastern Province',
    'North Western Province',
    'North Central Province',
    'Uva Province',
    'Sabaragamuwa Province'
  ];

  const features = [
    'Air Conditioning',
    'GPS Navigation',
    'Bluetooth Audio',
    'Leather Seats',
    'Luggage Space',
    'Child Seat Available',
    'First Aid Kit',
    'Wifi',
    'USB Charging',
    'TV/Entertainment System',
    'Wheelchair Accessible'
  ];

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

  const handleFeatureChange = (feature) => {
    const updatedFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    setFilters({ ...filters, features: updatedFeatures });
  };

  const resetFilters = () => {
    setSelectedType('all');
    setFilters({
      hasAC: false,
      minSeats: '',
      maxPrice: '',
      location: '',
      features: []
    });
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    if (selectedType !== 'all' && vehicle.vehicleType !== selectedType) return false;
    if (filters.hasAC && !vehicle.hasAC) return false;
    if (filters.minSeats && vehicle.seatingCapacity < parseInt(filters.minSeats)) return false;
    if (filters.maxPrice && vehicle.pricePerDay > parseInt(filters.maxPrice)) return false;
    if (filters.location && !vehicle.servingAreas.includes(filters.location)) return false;
    if (filters.features.length > 0 && !filters.features.every(f => vehicle.features.includes(f))) return false;
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

        {/* Filter UI */}
        <div className="mb-8">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center mb-4 bg-tan text-cream px-4 py-2 rounded-lg hover:bg-gold transition duration-200"
          >
            <MdFilterAlt className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {showFilters && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-charcoal">Filter Vehicles</h2>
                <button 
                  onClick={resetFilters}
                  className="text-tan hover:text-gold"
                >
                  Reset All Filters
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Vehicle Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Vehicle Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedType('all')}
                      className={`py-2 px-3 rounded-md text-sm ${
                        selectedType === 'all' ? 'bg-tan text-cream' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All Types
                    </button>
                    {Object.entries(vehicleTypes).map(([type, { label }]) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`py-2 px-3 rounded-md text-sm ${
                          selectedType === type ? 'bg-tan text-cream' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seating Capacity */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Minimum Seats</label>
                  <input
                    type="number"
                    value={filters.minSeats}
                    onChange={(e) => setFilters({ ...filters, minSeats: e.target.value })}
                    className="w-full px-3 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Min seats"
                    min="1"
                    max="60"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Max Price per Day (Rs.)</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Max price"
                    min="0"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Service Area</label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full px-3 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="">Any location</option>
                    {sriLankanProvinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* AC and Features */}
              <div className="mt-4">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="has-ac"
                    checked={filters.hasAC}
                    onChange={(e) => setFilters({ ...filters, hasAC: e.target.checked })}
                    className="rounded border-tan text-gold focus:ring-gold h-4 w-4"
                  />
                  <label htmlFor="has-ac" className="ml-2 text-sm text-charcoal">Air Conditioning</label>
                </div>

                <label className="block text-sm font-medium text-charcoal mb-2">Features</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {features.map(feature => (
                    <label key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.features.includes(feature)}
                        onChange={() => handleFeatureChange(feature)}
                        className="rounded border-tan text-gold focus:ring-gold h-4 w-4"
                      />
                      <span className="text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Current filter summary */}
              <div className="mt-6 text-sm">
                <div className="flex flex-wrap items-center">
                  <span className="font-medium mr-2">Active filters:</span>
                  {selectedType !== 'all' && (
                    <span className="bg-tan text-cream px-2 py-1 rounded-full text-xs mr-2 mb-2 flex items-center">
                      {vehicleTypes[selectedType]?.label}
                      <button onClick={() => setSelectedType('all')} className="ml-1">
                        <MdClose />
                      </button>
                    </span>
                  )}
                  {filters.hasAC && (
                    <span className="bg-tan text-cream px-2 py-1 rounded-full text-xs mr-2 mb-2 flex items-center">
                      AC
                      <button onClick={() => setFilters({...filters, hasAC: false})} className="ml-1">
                        <MdClose />
                      </button>
                    </span>
                  )}
                  {filters.minSeats && (
                    <span className="bg-tan text-cream px-2 py-1 rounded-full text-xs mr-2 mb-2 flex items-center">
                      Min {filters.minSeats} seats
                      <button onClick={() => setFilters({...filters, minSeats: ''})} className="ml-1">
                        <MdClose />
                      </button>
                    </span>
                  )}
                  {filters.maxPrice && (
                    <span className="bg-tan text-cream px-2 py-1 rounded-full text-xs mr-2 mb-2 flex items-center">
                      Max Rs.{filters.maxPrice}/day
                      <button onClick={() => setFilters({...filters, maxPrice: ''})} className="ml-1">
                        <MdClose />
                      </button>
                    </span>
                  )}
                  {filters.location && (
                    <span className="bg-tan text-cream px-2 py-1 rounded-full text-xs mr-2 mb-2 flex items-center">
                      {filters.location}
                      <button onClick={() => setFilters({...filters, location: ''})} className="ml-1">
                        <MdClose />
                      </button>
                    </span>
                  )}
                  {filters.features.map(feature => (
                    <span key={feature} className="bg-tan text-cream px-2 py-1 rounded-full text-xs mr-2 mb-2 flex items-center">
                      {feature}
                      <button onClick={() => handleFeatureChange(feature)} className="ml-1">
                        <MdClose />
                      </button>
                    </span>
                  ))}
                  {selectedType === 'all' && !filters.hasAC && !filters.minSeats && !filters.maxPrice && !filters.location && filters.features.length === 0 && (
                    <span className="text-gray-500">None</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600 mb-2">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </div>
        </div>

        {/* Vehicle cards */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map(vehicle => (
              <div key={vehicle._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                <div className="relative">
                  {vehicle.vehicleImages?.[0] ? (
                    <img
                      src={vehicle.vehicleImages[0]}
                      alt={vehicle.vehicleModel}
                      className="w-full h-52 object-cover"
                    />
                  ) : (
                    <div className="w-full h-52 flex items-center justify-center bg-gray-100">
                      {vehicleTypes[vehicle.vehicleType]?.icon && React.createElement(vehicleTypes[vehicle.vehicleType].icon, {
                        className: "w-20 h-20 text-gray-300"
                      })}
                    </div>
                  )}
                  
                  {/* Tags on image */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {vehicle.hasAC && (
                      <span className="bg-tan text-cream px-2 py-1 rounded-full text-sm font-medium shadow-md">
                        AC
                      </span>
                    )}
                    <span className="bg-white/90 text-charcoal px-2 py-1 rounded-full text-sm font-medium shadow-md">
                      {vehicleTypes[vehicle.vehicleType]?.label || "Vehicle"}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-charcoal">{vehicle.vehicleModel}</h3>
                    <div className="flex items-center mt-1">
                      <span className="bg-gold/10 text-gold text-xs px-2 py-1 rounded-full font-medium">
                        {vehicle.seatingCapacity} Seats
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-600 font-medium">
                        Rs. {vehicle.pricePerDay}/day
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 flex-grow mb-4">
                    <p className="flex items-start text-sm text-gray-600">
                      <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0 text-tan" />
                      <span>{vehicle.baseLocation}</span>
                    </p>
                    
                    {/* Features */}
                    {vehicle.features.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-charcoal mb-1">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {vehicle.features.slice(0, 3).map(feature => (
                            <span key={feature} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              {feature}
                            </span>
                          ))}
                          {vehicle.features.length > 3 && (
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              +{vehicle.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4 mt-auto">
                    <div className="flex flex-wrap justify-center items-center text-sm text-gray-500 gap-3">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-tan" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span className="break-all">{vehicle.contactPhone}</span>
                      </div>
                      
                      {vehicle.whatsapp && (
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-1 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          <span className="break-all">{vehicle.whatsapp}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <FaCarAlt className="mx-auto text-4xl text-tan mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">No vehicles match your filters</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filter criteria</p>
            <button
              onClick={resetFilters}
              className="bg-tan text-cream px-4 py-2 rounded-lg hover:bg-gold transition duration-200"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehiclesPage;