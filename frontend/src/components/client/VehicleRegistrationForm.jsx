import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCar, 
  FaBus,
  FaCarSide,
  FaRegCheckSquare 
} from 'react-icons/fa';
import { 
  MdAirportShuttle,
  MdLocalTaxi 
} from 'react-icons/md';
import api from '../../utils/api';

const VehicleRegistrationForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
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
    driverLicense: "",
    vehiclePermit: "",
    insuranceInfo: "",
    driverName: "",
    driverExperience: "",
    preferredAreas: []
  });

  const vehicleTypes = {
    car: { icon: FaCar, label: 'Car' },
    van: { icon: MdAirportShuttle, label: 'Van' },
    minibus: { icon: FaBus, label: 'Mini Bus' },
    largebus: { icon: FaBus, label: 'Large Bus' },
    suv: { icon: FaCarSide, label: 'SUV' },
    taxi: { icon: MdLocalTaxi, label: 'Taxi' }
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
    'USB Charging',
    'TV/Entertainment System',
    'Wheelchair Accessible'
  ];

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

  const handleFeatureChange = (feature) => {
    const updatedFeatures = formData.features.includes(feature)
      ? formData.features.filter(f => f !== feature)
      : [...formData.features, feature];
    setFormData({ ...formData, features: updatedFeatures });
  };

  const handleAreaChange = (area) => {
    const updatedAreas = formData.servingAreas.includes(area)
      ? formData.servingAreas.filter(a => a !== area)
      : [...formData.servingAreas, area];
    setFormData({ ...formData, servingAreas: updatedAreas });
  };

  const validateForm = () => {
    const requiredFields = [
      'ownerName',
      'vehicleModel',
      'vehicleYear',
      'plateNumber',
      'seatingCapacity',
      'pricePerDay',
      'contactPhone',
      'contactEmail',
      'baseLocation',
      'driverName',
      'driverExperience'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    if (formData.features.length === 0) {
      alert('Please select at least one vehicle feature');
      return false;
    }

    if (formData.servingAreas.length === 0) {
      alert('Please select at least one serving area');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.post("/vehicles", {
        ...formData,
        status: 'pending',
        isVerified: false,
        submittedAt: new Date()
      });

      if (response.data) {
        alert("Vehicle registration submitted successfully! Awaiting admin approval.");
        navigate('/vehicles');
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.error || 
        "Failed to register vehicle. Please check all required fields."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-charcoal text-center mb-8">
          Register Your Vehicle
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={(e) => {
          e.preventDefault();
          if (validateForm()) {
            handleSubmit(e);
          }
        }} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
          {/* Vehicle Type Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(vehicleTypes).map(([type, { icon: Icon, label }]) => (
              <label 
                key={type}
                className={`
                  flex flex-col items-center p-4 rounded-lg cursor-pointer transition-colors
                  ${formData.vehicleType === type ? 'bg-tan text-white' : 'bg-gray-100 hover:bg-gray-200'}
                `}
              >
                <input
                  type="radio"
                  name="vehicleType"
                  value={type}
                  checked={formData.vehicleType === type}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  className="sr-only"
                />
                <Icon className="text-3xl mb-2" />
                <span className="font-medium">{label}</span>
              </label>
            ))}
          </div>

          {/* Owner & Driver Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Owner Name*</label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Driver Name*</label>
              <input
                type="text"
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Contact Phone*</label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Email*</label>
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

          {/* Vehicle Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Vehicle Model*</label>
              <input
                type="text"
                value={formData.vehicleModel}
                onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Vehicle Year*</label>
              <input
                type="number"
                value={formData.vehicleYear}
                onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
                min="1990"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Plate Number*</label>
              <input
                type="text"
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>
          </div>

          {/* Capacity and Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Seating Capacity*</label>
              <input
                type="number"
                value={formData.seatingCapacity}
                onChange={(e) => setFormData({ ...formData, seatingCapacity: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Price per Day (Rs.)*</label>
              <input
                type="number"
                value={formData.pricePerDay}
                onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Price per Km (Rs.)</label>
              <input
                type="number"
                value={formData.pricePerKm}
                onChange={(e) => setFormData({ ...formData, pricePerKm: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                min="0"
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-3">Vehicle Features</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {features.map(feature => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature)}
                    onChange={() => handleFeatureChange(feature)}
                    className="rounded border-tan text-gold focus:ring-gold"
                  />
                  <span className="text-sm">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location and Service Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Base Location*</label>
              <input
                type="text"
                value={formData.baseLocation}
                onChange={(e) => setFormData({ ...formData, baseLocation: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Driver Experience (Years)*</label>
              <input
                type="number"
                value={formData.driverExperience}
                onChange={(e) => setFormData({ ...formData, driverExperience: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
                min="1"
              />
            </div>
          </div>

          {/* Serving Areas */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-3">Serving Areas*</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {sriLankanProvinces.map(province => (
                <label key={province} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.servingAreas.includes(province)}
                    onChange={() => handleAreaChange(province)}
                    className="rounded border-tan text-gold focus:ring-gold"
                  />
                  <span className="text-sm">{province}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-charcoal">Verification Documents</h3>
              <p className="text-sm text-gray-600 mb-4">
                These documents are required for verification purposes only and will not be publicly displayed. 
                We ensure the confidentiality and security of your information.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Driver License Number*
                  <span className="block text-xs text-gray-500">For verification only</span>
                </label>
                <input
                  type="text"
                  value={formData.driverLicense}
                  onChange={(e) => setFormData({ ...formData, driverLicense: e.target.value })}
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Vehicle Permit Number*
                  <span className="block text-xs text-gray-500">For verification only</span>
                </label>
                <input
                  type="text"
                  value={formData.vehiclePermit}
                  onChange={(e) => setFormData({ ...formData, vehiclePermit: e.target.value })}
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Insurance Info*
                  <span className="block text-xs text-gray-500">For verification only</span>
                </label>
                <input
                  type="text"
                  value={formData.insuranceInfo}
                  onChange={(e) => setFormData({ ...formData, insuranceInfo: e.target.value })}
                  className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              <span className="text-tan">🔒</span> Your information is encrypted and securely stored. Only authorized administrators have access to these details.
            </p>
          </div>

          {/* Vehicle Images */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Vehicle Images (URLs)*</label>
            <input
              type="url"
              value={formData.vehicleImages.join(', ')}
              onChange={(e) => setFormData({ ...formData, vehicleImages: e.target.value.split(',').map(url => url.trim()) })}
              className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              required
              placeholder="Enter image URLs separated by commas"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-tan text-cream py-3 rounded-lg hover:bg-gold transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VehicleRegistrationForm;