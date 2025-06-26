import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCar, 
  FaBus,
  FaCarSide,
  FaRegCheckSquare 
} from 'react-icons/fa';
import { 
  MdAirportShuttle,
  MdLocalTaxi,
  MdDirectionsBike 
} from 'react-icons/md';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

const VehicleRegistrationForm = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext); // Make sure this is properly imported
  
  // Add loading state for currentUser
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [checkingPremium, setCheckingPremium] = useState(true);
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
    vehicleImages: [""], // Initialize with one empty string
    driverLicense: "",
    vehiclePermit: "",
    insuranceInfo: "",
    driverName: "",
    driverExperience: "",
    preferredAreas: []
  });

  useEffect(() => {
    let didTimeout = false;
    const timeout = setTimeout(() => {
      didTimeout = true;
      setCheckingPremium(false);
      setIsPremiumUser(false);
      console.error('Premium status check timed out');
    }, 5000);

    const initializeComponent = async () => {
      if (currentUser === undefined) {
        console.log('currentUser is undefined, waiting...');
        return;
      }
      if (!currentUser) {
        setIsUserLoaded(false);
        setCheckingPremium(false);
        return;
      }
      setIsUserLoaded(true);
      try {
        console.log('Calling /vehicles/my-premium-status...');
        const response = await api.get('/vehicles/my-premium-status');
        console.log('Premium status API response:', response.data);
        if (!didTimeout) {
          setIsPremiumUser(response.data.hasActivePremiumSubscription);
        }
      } catch (error) {
        console.error('Premium status API error:', error);
        if (!didTimeout) {
          setIsPremiumUser(false);
        }
      } finally {
        if (!didTimeout) {
          setCheckingPremium(false);
        }
        clearTimeout(timeout);
      }
    };

    initializeComponent();
    return () => clearTimeout(timeout);
  }, [currentUser]);

  // Update the loading check:
  if (currentUser === undefined || checkingPremium) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tan mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login required message if user is null (not logged in)
  if (currentUser === null) {
    return (
      <div className="min-h-screen bg-cream py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Login Required</h2>
            <p className="mb-4">You must be logged in to register a vehicle.</p>
            <a href="/login" className="bg-tan text-cream px-6 py-3 rounded-lg hover:bg-gold transition">
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  const vehicleTypes = {
    car: { icon: FaCar, label: 'Car' },
    van: { icon: MdAirportShuttle, label: 'Van' },
    minibus: { icon: FaBus, label: 'Mini Bus' },
    largebus: { icon: FaBus, label: 'Large Bus' },
    suv: { icon: FaCarSide, label: 'SUV' },
    taxi: { icon: MdLocalTaxi, label: 'Taxi' },
    threeWheeler: { icon: MdDirectionsBike, label: 'Three Wheeler' }
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
    // Check if user is logged in
    if (!currentUser) {
      setError('You must be logged in to register a vehicle');
      return false;
    }

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
      'driverExperience',
      'driverLicense',
      'vehiclePermit',
      'insuranceInfo'
    ];

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        setError(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    if (formData.features.length === 0) {
      setError('Please select at least one vehicle feature');
      return false;
    }

    if (formData.servingAreas.length === 0) {
      setError('Please select at least one serving area');
      return false;
    }

    if (formData.vehicleImages.length === 0 || formData.vehicleImages[0].trim() === '') {
      setError('Please provide at least one vehicle image URL');
      return false;
    }

    // Validate numeric fields
    if (parseInt(formData.seatingCapacity) < 1) {
      setError('Seating capacity must be at least 1');
      return false;
    }

    if (parseInt(formData.pricePerDay) < 1) {
      setError('Price per day must be at least 1');
      return false;
    }

    if (parseInt(formData.driverExperience) < 1) {
      setError('Driver experience must be at least 1 year');
      return false;
    }

    const currentYear = new Date().getFullYear();
    if (parseInt(formData.vehicleYear) < 1990 || parseInt(formData.vehicleYear) > currentYear) {
      setError(`Vehicle year must be between 1990 and ${currentYear}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    console.log('Form submission - Current user:', currentUser);
    console.log('Form submission - User ID:', currentUser?._id);

    // Check if user is available
    if (!currentUser || !currentUser._id) {
      setError('You must be logged in to register a vehicle. Please log in again.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      // Filter out empty images
      const filteredImages = formData.vehicleImages.filter(url => url.trim() !== '');
      
      // Validate image count based on premium status
      const maxImages = isPremiumUser ? 3 : 1;
      if (filteredImages.length === 0) {
        alert('Please add at least one vehicle image');
        return;
      }
      
      if (filteredImages.length > maxImages) {
        alert(`Maximum ${maxImages} images allowed for ${isPremiumUser ? 'premium' : 'free'} accounts`);
        return;
      }

      const submitData = {
        ...formData,
        seatingCapacity: parseInt(formData.seatingCapacity),
        pricePerDay: parseInt(formData.pricePerDay),
        pricePerKm: formData.pricePerKm ? parseInt(formData.pricePerKm) : 0,
        vehicleYear: parseInt(formData.vehicleYear),
        driverExperience: parseInt(formData.driverExperience),
        vehicleImages: filteredImages,
        submittedBy: currentUser._id,
        status: 'pending',
        isVerified: false,
        submittedAt: new Date()
      };

      console.log('Final submit data:', submitData);
      console.log('submittedBy field:', submitData.submittedBy);

      const response = await api.post("/vehicles", submitData);

      if (response.data) {
        if (response.data.premiumUpgraded) {
          alert("🎉 Vehicle registered and automatically upgraded to premium! Your listing is now live.");
        } else {
          alert("Vehicle registration submitted successfully! Your listing will be reviewed within 48 hours.");
        }
        // Redirect to the user's profile submissions section
        navigate('/profile?tab=submissions');
      }
    } catch (error) {
      console.error('Error submitting vehicle:', error);
      alert(error.response?.data?.error || 'Error registering vehicle');
    }
  };

  // Rest of your component JSX...
  return (
    <div className="min-h-screen bg-cream py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-charcoal text-center mb-8">
          Register Your Vehicle
        </h1>

        {/* User check */}
        {!currentUser && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm mb-6">
            You must be logged in to register a vehicle. Please <a href="/login" className="underline">login</a> first.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
          {/* Vehicle Type Selection */}
          <div>
            <h3 className="text-lg font-semibold text-charcoal mb-3">Vehicle Type*</h3>
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
                placeholder="e.g., Toyota Prius, Honda Civic"
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
                placeholder="e.g., ABC-1234"
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
                max="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Price per Day (LKR)*</label>
              <input
                type="number"
                value={formData.pricePerDay}
                onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
                min="1"
                placeholder="e.g., 5000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Price per Km (LKR)</label>
              <input
                type="number"
                value={formData.pricePerKm}
                onChange={(e) => setFormData({ ...formData, pricePerKm: e.target.value })}
                className="w-full px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                min="0"
                placeholder="e.g., 50"
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-3">Vehicle Features*</label>
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
                placeholder="e.g., Colombo, Kandy, Galle"
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
                max="50"
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
            <label className="block text-sm font-medium text-charcoal mb-2">
              Vehicle Images (URLs)*
              <span className="text-xs text-gray-500 ml-1">
                ({isPremiumUser ? 'Premium: up to 3 images' : 'Free: 1 image only'})
              </span>
            </label>
            
            {/* Premium status indicator */}
            {checkingPremium ? (
              <div className="mb-2 text-sm text-gray-500">Checking premium status...</div>
            ) : (
              <div className={`mb-2 text-sm ${isPremiumUser ? 'text-green-600' : 'text-blue-600'}`}>
                {isPremiumUser ? '✅ Premium account - Upload up to 3 images' : 'ℹ️ Free account - 1 image limit'}
              </div>
            )}
            
            {/* Display current images */}
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
                  required={index === 0}
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.vehicleImages.filter((_, i) => i !== index);
                      setFormData({ ...formData, vehicleImages: newImages });
                    }}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            
            {/* Add more images button */}
            {formData.vehicleImages.length < (isPremiumUser ? 3 : 1) && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ 
                    ...formData, 
                    vehicleImages: [...formData.vehicleImages, ''] 
                  });
                }}
                className={`mb-2 px-4 py-2 rounded text-sm ${
                  isPremiumUser 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!isPremiumUser && formData.vehicleImages.length >= 1}
              >
                + Add Another Image {!isPremiumUser && formData.vehicleImages.length >= 1 && '(Premium Required)'}
              </button>
            )}
            
            {!isPremiumUser && formData.vehicleImages.length >= 1 && (
              <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                🔒 Upgrade to premium to add more images. 
                <a href="/vehicle-premium" className="underline font-medium">Upgrade now</a>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-1">
              {isPremiumUser 
                ? 'Premium accounts can upload up to 3 images.' 
                : 'Free accounts can upload 1 image. Upgrade to premium for up to 3 images.'
              }
            </p>
            
            {/* Image previews */}
            {formData.vehicleImages.some(url => url.trim()) && (
              <div className="mt-3">
                <p className="text-sm font-medium text-charcoal mb-2">Image Previews:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {formData.vehicleImages.filter(url => url.trim()).map((url, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={url} 
                        alt={`Vehicle preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <span className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-tan text-cream py-3 rounded-lg hover:bg-gold transition duration-200"
          >
            Submit Registration
          </button>
        </form>
      </div>
    </div>
  );
};

export default VehicleRegistrationForm;