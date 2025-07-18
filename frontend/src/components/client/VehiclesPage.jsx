import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import { 
  FaCar, 
  FaTruck, 
  FaBus,
  FaCarSide,
  FaCarAlt,
  FaMapMarkerAlt,
  FaFilter,
  FaCrown
} from 'react-icons/fa';
import { 
  MdAirportShuttle, 
  MdLocalTaxi, 
  MdAirlineSeatReclineNormal, 
  MdAttachMoney,
  MdFilterAlt,
  MdClose,
  MdDirectionsBike // Import for three-wheeler icon
} from 'react-icons/md';

const vehicleTypes = {
  car: { icon: FaCar, label: 'Car' },
  van: { icon: MdAirportShuttle, label: 'Van' },
  minibus: { icon: FaBus, label: 'Mini Bus' },
  largebus: { icon: FaBus, label: 'Large Bus' },
  suv: { icon: FaCarSide, label: 'SUV' },
  taxi: { icon: MdLocalTaxi, label: 'Taxi' },
  threeWheeler: { icon: MdDirectionsBike, label: 'Three Wheeler' } // Add three-wheeler type
};

const VehiclesPage = () => {
  const { id } = useParams(); // Get vehicle ID from URL
  const { user } = useContext(AuthContext);
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
  const [singleVehicle, setSingleVehicle] = useState(null);

  // Add this state to track the current image
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  useEffect(() => {
    if (id) {
      const fetchSingleVehicle = async () => {
        try {
          const response = await api.get(`/vehicles/${id}`);
          setSingleVehicle(response.data);
        } catch (error) {
          console.error('Error fetching vehicle:', error);
        }
      };
      fetchSingleVehicle();
    }
  }, [id]);

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

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    // Premium vehicles first
    if (a.isPremium && !b.isPremium) return -1;
    if (!a.isPremium && b.isPremium) return 1;
    
    // For same premium status, sort by rating
    if (a.averageRating !== b.averageRating) {
      return b.averageRating - a.averageRating;
    }
    
    // Then sort by newest
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // If viewing a single vehicle, show detailed view
  if (id && singleVehicle) {
    return (
      <div className="min-h-screen bg-cream px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-tan hover:text-gold mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Vehicle Details Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Images */}
            {singleVehicle.vehicleImages && singleVehicle.vehicleImages.length > 0 && (
              <div className="h-64 md:h-96 relative">
                {/* Main image display */}
                <img 
                  src={singleVehicle.vehicleImages[currentImageIndex]} 
                  alt={singleVehicle.vehicleModel}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log("Image load error, using placeholder");
                    e.target.src = '/placeholder-vehicle.jpg'; // Ensure this placeholder exists
                  }}
                />
                
                {/* Premium badge */}
                {singleVehicle.isPremium && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-gold to-tan text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg flex items-center">
                      <FaCrown className="mr-2" />
                      PREMIUM
                    </span>
                  </div>
                )}
                
                {/* Image thumbnail navigation */}
                {singleVehicle.vehicleImages.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                    {singleVehicle.vehicleImages.map((img, idx) => (
                      <button 
                        key={idx}
                        className={`w-3 h-3 rounded-full ${currentImageIndex === idx ? 'bg-gold' : 'bg-white/70 hover:bg-white'}`}
                        onClick={() => setCurrentImageIndex(idx)}
                        aria-label={`View image ${idx + 1}`}
                      ></button>
                    ))}
                  </div>
                )}
                
                {/* Navigation arrows - only show if more than one image */}
                {singleVehicle.vehicleImages.length > 1 && (
                  <>
                    <button 
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full"
                      onClick={() => setCurrentImageIndex(prev => (prev === 0 ? singleVehicle.vehicleImages.length - 1 : prev - 1))}
                      aria-label="Previous image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <button 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full"
                      onClick={() => setCurrentImageIndex(prev => (prev === singleVehicle.vehicleImages.length - 1 ? 0 : prev + 1))}
                      aria-label="Next image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            )}
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-charcoal">
                  {singleVehicle.vehicleModel}
                </h1>
                <span className="bg-tan/90 text-white text-sm px-3 py-2 rounded-full flex items-center">
                  {React.createElement(vehicleTypes[singleVehicle.vehicleType]?.icon || FaCar, { className: "mr-2" })}
                  {vehicleTypes[singleVehicle.vehicleType]?.label || singleVehicle.vehicleType}
                </span>
              </div>
              
              {/* Basic Vehicle Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-charcoal mb-4 text-lg">Vehicle Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seats:</span>
                      <span className="font-medium">{singleVehicle.seatingCapacity}</span>
                    </div>
                    {singleVehicle.vehicleYear && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Year:</span>
                        <span className="font-medium">{singleVehicle.vehicleYear}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Location:</span>
                      <span className="font-medium">{singleVehicle.baseLocation}</span>
                    </div>
                    {singleVehicle.hasAC && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Air Conditioning:</span>
                        <span className="text-green-600 font-medium">✓ Available</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-charcoal mb-4 text-lg">Pricing</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Per Day:</span>
                      <span className="font-bold text-tan text-lg">Rs. {singleVehicle.pricePerDay?.toLocaleString()}</span>
                    </div>
                    {singleVehicle.pricePerKm ? (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Per Km:</span>
                        <span className="font-medium">Rs. {singleVehicle.pricePerKm}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Per Km:</span>
                        <span className="text-gray-500 italic">Not specified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Features */}
              {singleVehicle.features && singleVehicle.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-charcoal mb-4 text-lg">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {singleVehicle.features.map(feature => (
                      <span key={feature} className="bg-tan/10 text-tan px-3 py-2 rounded-lg text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Service Areas */}
              {singleVehicle.servingAreas && singleVehicle.servingAreas.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-charcoal mb-4 text-lg">Service Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {singleVehicle.servingAreas.map(area => (
                      <span key={area} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="border-t pt-8 mt-8">
                <h3 className="font-semibold text-charcoal mb-6 text-lg">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <svg className="h-6 w-6 mr-3 text-tan" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{singleVehicle.contactPhone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <svg className="h-6 w-6 mr-3 text-tan" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{singleVehicle.contactEmail}</p>
                    </div>
                  </div>

                  {singleVehicle.whatsapp && (
                    <div className="flex items-center p-4 bg-green-50 rounded-lg">
                      <svg className="w-6 h-6 mr-3 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">WhatsApp</p>
                        <p className="font-medium">{singleVehicle.whatsapp}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <a 
                    href={`tel:${singleVehicle.contactPhone}`}
                    className="flex-1 bg-tan text-cream py-3 px-6 rounded-lg hover:bg-gold transition duration-200 text-center font-medium"
                  >
                    Call Now
                  </a>
                  <a 
                    href={`mailto:${singleVehicle.contactEmail}`}
                    className="flex-1 border border-tan text-tan py-3 px-6 rounded-lg hover:bg-tan hover:text-cream transition duration-200 text-center font-medium"
                  >
                    Send Email
                  </a>
                  {singleVehicle.whatsapp && (
                    <a 
                      href={`https://wa.me/${singleVehicle.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-200 text-center font-medium"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } // This closing brace ends the if condition block

  // Regular vehicle list view begins here
  return (
    <div className="min-h-screen bg-cream px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-4 md:mb-0">
            Travel Vehicles
          </h1>
          <div className="flex items-center space-x-4">
            <Link 
              to="/partnership/vehicle-premium" 
              className="bg-gold/10 text-gold px-6 py-3 rounded-lg hover:bg-gold/20 transition duration-200 flex items-center gap-2 border border-gold/30"
            >
              <FaCrown className="text-gold" />
              Register Your Vehicle
            </Link>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl shadow mb-8 overflow-hidden">
          <div className="p-4 bg-tan/10 border-b flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <h2 className="font-semibold text-charcoal">Vehicle Type:</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    selectedType === 'all' 
                      ? 'bg-tan text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedType('all')}
                >
                  All Types
                </button>
                
                {Object.entries(vehicleTypes).map(([type, { icon: Icon, label }]) => (
                  <button
                    key={type}
                    className={`px-3 py-1.5 rounded-full text-sm flex items-center ${
                      selectedType === type 
                        ? 'bg-tan text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedType(type)}
                  >
                    <Icon className="mr-1" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-sm px-4 py-2 rounded-full bg-white border hover:bg-gray-50"
            >
              {showFilters ? (
                <>
                  <MdClose className="mr-1" />
                  Hide Filters
                </>
              ) : (
                <>
                  <FaFilter className="mr-1" />
                  More Filters
                </>
              )}
            </button>
          </div>
          
          {showFilters && (
            <div className="p-6 border-b">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2 flex items-center">
                    <MdAirlineSeatReclineNormal className="mr-1" />
                    Minimum Seats
                  </label>
                  <input
                    type="number"
                    value={filters.minSeats}
                    onChange={(e) => setFilters({ ...filters, minSeats: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tan"
                    placeholder="Min. seats"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2 flex items-center">
                    <MdAttachMoney className="mr-1" />
                    Max Price (per day)
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tan"
                    placeholder="Max. price per day"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2 flex items-center">
                    <FaMapMarkerAlt className="mr-1" />
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tan"
                  >
                    <option value="">Any Location</option>
                    {sriLankanProvinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-charcoal mb-2">Features</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {features.map(feature => (
                    <label key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.features.includes(feature)}
                        onChange={() => handleFeatureChange(feature)}
                        className="rounded border-gray-300 text-tan focus:ring-tan"
                      />
                      <span className="text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Results count */}
        <div className="mb-6 text-gray-600">
          Found {sortedVehicles.length} vehicle{sortedVehicles.length !== 1 && 's'} {selectedType !== 'all' && `in "${vehicleTypes[selectedType]?.label || selectedType}" category`}
        </div>
        
        {/* Vehicle Cards */}
        {sortedVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedVehicles.map(vehicle => (
              <div key={vehicle._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40">
                  {vehicle.vehicleImages && vehicle.vehicleImages[0] ? (
                    <img 
                      src={vehicle.vehicleImages[0]} 
                      alt={vehicle.vehicleModel} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-vehicle.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FaCar className="text-4xl text-gray-400" />
                    </div>
                  )}
                  
                  {vehicle.isPremium && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-gradient-to-r from-gold to-tan text-white text-xs px-2 py-1 rounded-full flex items-center shadow-md">
                        <FaCrown className="mr-1" />
                        PREMIUM
                      </span>
                    </div>
                  )}
                  
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-white/80 backdrop-blur-sm text-charcoal text-xs px-2 py-1 rounded-full">
                      {vehicleTypes[vehicle.vehicleType]?.label || vehicle.vehicleType}
                    </span>
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="font-semibold text-lg text-charcoal">{vehicle.vehicleModel}</h3>
                  
                  <div className="mt-1 flex justify-between items-center">
                    <span className="text-sm text-gray-600">{vehicle.seatingCapacity} seats</span>
                    <span className="font-bold text-tan">Rs. {vehicle.pricePerDay?.toLocaleString()}/day</span>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-600 line-clamp-1">
                    <span className="font-medium">Base: </span>
                    {vehicle.baseLocation}
                  </div>
                  
                  {vehicle.features && vehicle.features.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {vehicle.features.slice(0, 2).map(feature => (
                        <span key={feature} className="bg-tan/10 text-tan text-xs px-2 py-0.5 rounded-full">
                          {feature}
                        </span>
                      ))}
                      {vehicle.features.length > 2 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                          +{vehicle.features.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  <Link 
                    to={`/vehicles/${vehicle._id}`}
                    className="mt-3 block text-center bg-tan text-cream py-2 rounded hover:bg-gold transition text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-4xl text-gray-300 mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">No vehicles found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or check back later.</p>
            <button 
              onClick={resetFilters}
              className="bg-tan text-cream px-4 py-2 rounded hover:bg-gold transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; // This semicolon ends the function declaration

export default VehiclesPage;