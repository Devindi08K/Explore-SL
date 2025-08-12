import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import { 
  FaUser, 
  FaEdit, 
  FaCheck, 
  FaTimes, 
  FaCar, 
  FaPenFancy, 
  FaGlobe, 
  FaCreditCard, 
  FaCrown,
  FaEye,
  FaEnvelope,
  FaChartLine,
  FaHistory,
  FaSave,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTrophy,
  FaUsers,
  FaStar,
  FaClock,
  FaBolt,
  FaMapMarkedAlt,
  FaBuilding,
  FaSyncAlt,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

const UserProfile = () => {
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  
  // Submission states
  const [tourGuideSubmissions, setTourGuideSubmissions] = useState([]);
  const [vehicleSubmissions, setVehicleSubmissions] = useState([]);
  const [blogSubmissions, setBlogSubmissions] = useState([]);
  const [affiliateSubmissions, setAffiliateSubmissions] = useState([]);
  const [tourSubmissions, setTourSubmissions] = useState([]);
  
  // Payment history state
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
    if (activeTab === 'submissions') {
      fetchSubmissions();
    } else if (activeTab === 'payments') {
      fetchPaymentHistory();
    }
  }, [activeTab]);

  // Update the second useEffect
  useEffect(() => {
    fetchSubmissions();
    fetchPaymentHistory();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setProfile(response.data);
      setEditedProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Modified fetchSubmissions function that only gets tour guides and vehicles:
  const fetchSubmissions = async () => {
    try {
      console.log('🔍 Fetching user submissions...');
      
      const promises = [
        api.get('/tour-guides/my-submissions').catch(err => {
          console.warn('Tour guides API failed:', err.response?.status);
          return { data: [] };
        }),
        api.get('/vehicles/my-submissions').catch(err => {
          console.warn('Vehicles API failed:', err.response?.status);
          return { data: [] };
        }),
        api.get('/blogs/my-submissions').catch(err => {
          console.warn('Blogs API failed:', err.response?.status);
          return { data: [] };
        }),
        api.get('/affiliate-links/user').catch(err => { // Corrected endpoint
          console.warn('Affiliate links API failed:', err.response?.status);
          return { data: [] };
        }),
        api.get('/tours/my-submissions').catch(err => {
          console.warn('Tours API failed:', err.response?.status);
          return { data: [] };
        })
      ];
      
      // Make sure we get valid responses before proceeding
      const [tourGuideRes, vehicleRes, blogRes, affiliateRes, tourRes] = await Promise.all(promises);
      
      // Ensure we have valid data to work with
      const tourGuideData = Array.isArray(tourGuideRes.data) ? tourGuideRes.data : [];
      const vehicleData = Array.isArray(vehicleRes.data) ? vehicleRes.data : [];
      const blogData = Array.isArray(blogRes.data) ? blogRes.data : [];
      const affiliateData = Array.isArray(affiliateRes.data) ? affiliateRes.data : [];
      const tourData = Array.isArray(tourRes.data) ? tourRes.data : [];
      
      console.log('📊 Fetched data:', {
        tourGuides: tourGuideData.length || 0,
        vehicles: vehicleData.length || 0,
        blogs: blogData.length || 0,
        tours: tourData.length || 0
      });
      
      setTourGuideSubmissions(tourGuideData);
      setVehicleSubmissions(vehicleData);
      setBlogSubmissions(blogData);
      setAffiliateSubmissions(affiliateData);
      setTourSubmissions(tourData);
      
      // Debug for premium items
      const premiumVehicles = vehicleData.filter(v => v.isPremium);
      const premiumGuides = tourGuideData.filter(g => g.isPremium);
      
      console.log('🎯 Premium vehicles found:', premiumVehicles.length);
      console.log('🎯 Premium guides found:', premiumGuides.length);
      
    } catch (error) {
      console.error('❌ Error fetching submissions:', error);
      // Set empty arrays to prevent UI errors
      setTourGuideSubmissions([]);
      setVehicleSubmissions([]);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      setPaymentLoading(true);
      const response = await api.get('/payments/user');
      setPaymentHistory(response.data || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setPaymentHistory([]);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await api.put('/auth/profile', editedProfile);
      setProfile(response.data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium';
      case 'rejected':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium';
    }
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'guide_premium_monthly':
      case 'guide_premium_yearly':
        return <FaUser className="text-blue-500" />;
      case 'vehicle_premium_monthly':
      case 'vehicle_premium_yearly':
        return <FaCar className="text-green-500" />;
      case 'business_listing':
        return <FaGlobe className="text-purple-500" />;
      case 'blog_post':
        return <FaPenFancy className="text-orange-500" />;
      case 'tour_partner':
        return <FaMapMarkerAlt className="text-red-500" />;
      default:
        return <FaCreditCard className="text-gray-500" />;
    }
  };

  const getServiceName = (serviceType) => {
    const serviceNames = {
      'guide_premium_monthly': 'Tour Guide Premium (Monthly)',
      'guide_premium_yearly': 'Tour Guide Premium (Yearly)',
      'vehicle_premium_monthly': 'Vehicle Premium (Monthly)',
      'vehicle_premium_yearly': 'Vehicle Premium (Yearly)',
      'business_listing_monthly': 'Business Listing Premium (Monthly)',
      'business_listing_yearly': 'Business Listing Premium (Yearly)',
      'sponsored_blog_post': 'Sponsored Blog Post',
      'tour_partnership': 'Tour Partnership'
    };
    return serviceNames[serviceType] || serviceType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderPendingActions = () => {
    const pendingBlog = paymentHistory.find(p => p.serviceType === 'sponsored_blog_post' && p.subscriptionDetails?.awaitingSubmission);
    const pendingTour = paymentHistory.find(p => p.serviceType === 'tour_partnership' && p.subscriptionDetails?.awaitingSubmission);

    if (!pendingBlog && !pendingTour) return null;

    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg shadow-md">
        <h4 className="font-bold text-yellow-800">Action Required</h4>
        <p className="text-sm text-yellow-700 mt-1">You have pending submissions for your recent purchases.</p>
        <div className="mt-3 space-y-2">
          {pendingBlog && (
            <Link to="/submit-sponsored-blog" className="inline-block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-sm font-semibold">
              Complete Your Sponsored Blog Submission
            </Link>
          )}
          {pendingTour && (
            <Link to="/submit-tour-partnership" className="inline-block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-sm font-semibold">
              Complete Your Tour Partnership Submission
            </Link>
          )}
        </div>
      </div>
    );
  };

  const VehiclePremiumDetails = ({ vehicle }) => {
    if (!vehicle.isPremium) return null;

    const conversionRate = vehicle.viewCount 
      ? ((vehicle.inquiryCount / vehicle.viewCount) * 100).toFixed(1)
      : '0';

    return (
      <div className="mt-3 space-y-3">
        {/* Premium Badge */}
        <div className="p-3 bg-gradient-to-r from-gold/10 to-tan/10 border border-gold/20 rounded-lg">
          <div className="flex items-center mb-2">
            <FaCrown className="text-gold mr-2 text-sm" />
            <span className="text-sm font-semibold text-charcoal">Premium Features Active</span>
          </div>
          
          {/* Premium Features Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center text-green-600">
              <FaCheck className="mr-1" />
              <span>Priority Listing</span>
            </div>
            <div className="flex items-center text-green-600">
              <FaCheck className="mr-1" />
              <span>3 Photos</span> {/* Changed from {vehicle.maxPhotos || 3} to just 3 */}
            </div>
            <div className="flex items-center text-green-600">
              <FaCheck className="mr-1" />
              <span>Analytics Enabled</span>
            </div>
            <div className="flex items-center text-green-600">
              <FaCheck className="mr-1" />
              <span>Enhanced Visibility</span>
            </div>
            <div className="flex items-center text-green-600">
              <FaCheck className="mr-1" />
              <span>Premium Badge</span>
            </div>
          </div>
          
          {/* Premium Expiry */}
          {vehicle.premiumExpiry && (
            <div className="mt-2 pt-2 border-t border-gold/20 text-xs">
              <span className={getDaysRemaining(vehicle.premiumExpiry) < 14 ? 'text-orange-600 font-medium' : 'text-gray-600'}>
                Premium expires: {formatDate(vehicle.premiumExpiry)}
                {getDaysRemaining(vehicle.premiumExpiry) < 14 && ` (${getDaysRemaining(vehicle.premiumExpiry)} days left)`}
              </span>
              
              {/* Renewal Reminder */}
              {needsRenewalSoon(vehicle.premiumExpiry) && (
                <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-orange-700 text-xs">
                  <div className="flex items-center mb-1">
                    <FaClock className="mr-1" />
                    <span className="font-semibold">Renewal Reminder</span>
                  </div>
                  <p>Your premium subscription will expire soon. Renew now to maintain premium benefits without interruption.</p>
                  <Link 
                    to="/partnership/vehicle-premium" 
                    className="mt-2 inline-block bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700"
                  >
                    Renew Subscription
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Analytics Section */}
        {vehicle.analyticsEnabled && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
              <FaChartLine className="mr-2" />
              Performance Analytics
            </h4>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white p-2 rounded text-center">
                <FaEye className="text-blue-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-blue-600">{vehicle.viewCount || 0}</div>
                <div className="text-xs text-gray-600">Total Views</div>
              </div>
            </div>
          </div>
        )}

        {/* Featured Status */}
        {vehicle.featuredStatus && vehicle.featuredStatus !== 'none' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center">
              <FaCrown className="mr-2" />
              Featured Placement
            </h4>
            <div className="space-y-2">
              {vehicle.featuredStatus === 'homepage' && (
                <div className="flex items-center text-red-700">
                  <FaCheck className="mr-2 text-red-500" />
                  <span className="text-sm">Featured on Homepage</span>
                  <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">ACTIVE</span>
                </div>
              )}
              {vehicle.featuredStatus === 'destination' && (
                <div className="flex items-center text-red-700">
                  <FaCheck className="mr-2 text-red-500" />
                  <span className="text-sm">Featured in Destination Pages</span>
                  <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">ACTIVE</span>
                </div>
              )}
              <div className="text-xs text-gray-600 bg-white p-2 rounded">
                <strong>Benefits:</strong> Featured listings get 3-5x more visibility and appear at the top of search results.
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Benefits Achieved */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
            <FaTrophy className="mr-2" />
            Premium Benefits Unlocked
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center text-yellow-700">
              <FaTrophy className="mr-1 text-yellow-500" />
              <span>Top search placement</span>
            </div>
            <div className="flex items-center text-yellow-700">
              <FaEye className="mr-1 text-yellow-500" />
              <span>3.5x more visibility</span>
            </div>
            <div className="flex items-center text-yellow-700">
              <FaUsers className="mr-1 text-yellow-500" />
              <span>Trust badge display</span>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-600 bg-white p-2 rounded">
            <strong>Next level:</strong> Consider upgrading to yearly plan for 20% savings and additional homepage featuring.
          </div>
        </div>
      </div>
    );
  };

  const VehicleUpgradePrompt = ({ vehicle }) => {
    if (vehicle.isPremium) return null;

    return (
      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2">Free Listing - Premium Processing Unavailable</h4>
        <p className="text-xs text-yellow-700 mb-3">
          Due to payment gateway maintenance, premium features are temporarily unavailable. 
          All listings are currently operating as free plans.
        </p>
      </div>
    );
  };

  // Add this component to show a review message for pending vehicles
  const PendingVehicleMessage = ({ vehicle }) => {
    if (vehicle.status !== 'pending' || vehicle.isVerified) return null;
    
    const submittedDate = new Date(vehicle.submittedAt);
    const waitingDays = Math.floor((new Date() - submittedDate) / (1000 * 60 * 60 * 24));
    
    return (
      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
          <FaClock className="mr-2" />
          Under Review
        </h4>
        
        <div className="text-sm text-yellow-700">
          <p className="mb-2">
            Your vehicle is currently being reviewed by our team and will be published within 48 hours.
          </p>
          
          <ul className="space-y-1 list-disc list-inside">
            <li>Submitted: {submittedDate.toLocaleDateString()}</li>
            <li>Waiting time: {waitingDays} day{waitingDays !== 1 ? 's' : ''}</li>
            <li>Status: <span className="font-semibold">Pending approval</span></li>
          </ul>
          
          <div className="mt-3 text-xs italic">
            Our review process ensures that all vehicles meet our quality and safety standards.
            {waitingDays > 2 && " If your submission has been pending for more than 48 hours, please contact our support team."}
          </div>
        </div>
      </div>
    );
  };

  const BusinessListingPremiumDetails = ({ listing }) => {
    if (!listing.isPremium) return null;
    
    return (
      <div className="mt-3 space-y-3">
        <div className="p-3 bg-gradient-to-r from-gold/10 to-tan/10 border border-gold/20 rounded-lg">
          <div className="flex items-center mb-2">
            <FaCrown className="text-gold mr-2 text-sm" />
            <span className="text-sm font-semibold text-charcoal">Premium Listing Active</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center text-green-600"><FaCheck className="mr-1" /><span>Priority Placement</span></div>
            <div className="flex items-center text-green-600"><FaCheck className="mr-1" /><span>Analytics Enabled</span></div>
            <div className="flex items-center text-green-600"><FaCheck className="mr-1" /><span>Premium Badge</span></div>
            <div className="flex items-center text-green-600"><FaCheck className="mr-1" /><span>Enhanced Visibility</span></div>
          </div>
          {listing.premiumExpiry && (
            <div className="mt-2 pt-2 border-t border-gold/20 text-xs text-gray-600">
              Premium expires: {formatDate(listing.premiumExpiry)}
              
              {/* Renewal Reminder */}
              {needsRenewalSoon(listing.premiumExpiry) && (
                <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-orange-700 text-xs">
                  <div className="flex items-center mb-1">
                    <FaClock className="mr-1" />
                    <span className="font-semibold">Renewal Reminder</span>
                  </div>
                  <p>Your business listing premium will expire soon. Renew now to keep premium features active.</p>
                  <Link 
                    to="/partnership/business-premium" 
                    className="mt-2 inline-block bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700"
                  >
                    Renew Subscription
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
        {listing.analyticsEnabled && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center"><FaChartLine className="mr-2" />Performance Analytics</h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white p-2 rounded text-center">
                <FaEye className="text-blue-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-blue-600">{listing.viewCount || 0}</div>
                <div className="text-xs text-gray-600">Total Views</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const BusinessListingUpgradePrompt = ({ listing }) => {
    if (listing.isPremium) return null;
    return (
      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2">Free Listing - Premium Processing Unavailable</h4>
        <p className="text-xs text-yellow-700 mb-3">
          Due to payment gateway maintenance, premium features are temporarily unavailable.
          All listings are currently operating as free plans.
        </p>
      </div>
    );
  };

  const PendingBusinessListingMessage = ({ listing }) => {
    if (listing.status !== 'pending') return null;
    return (
      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center"><FaClock className="mr-2" />Under Review</h4>
        <p className="text-xs text-yellow-700">Your business listing is being reviewed and will be published within 48 hours.</p>
      </div>
    );
  };

  const TourGuidePremiumDetails = ({ guide }) => {
    if (!guide.isPremium) return null;
    
    return (
      <div className="mt-3 space-y-3">
        {/* Premium Badge */}
        <div className="p-3 bg-gradient-to-r from-gold/10 to-tan/10 border border-gold/20 rounded-lg">
          <div className="flex items-center mb-2">
            <FaCrown className="text-gold mr-2 text-sm" />
            <span className="text-sm font-semibold text-charcoal">Premium Features Active</span>
          </div>
          
          {/* Premium Features Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center text-green-600">
              <FaCheck className="mr-1" />
              <span>Priority Listing</span>
            </div>
            <div className="flex items-center text-green-600">
              <FaCheck className="mr-1" />
              <span>Premium Badge</span>
            </div>
            <div className="flex items-center text-green-600">
              <FaCheck className="mr-1" />
              <span>Analytics Enabled</span>
            </div>
            <div className="flex items-center text-green-600">
              <FaCheck className="mr-1" />
              <span>Enhanced Visibility</span>
            </div>
          </div>
          
          {guide.premiumExpiry && (
            <div className="mt-2 pt-2 border-t border-gold/20 text-xs text-gray-600">
              Premium expires: {formatDate(guide.premiumExpiry)}
              
              {/* Renewal Reminder */}
              {needsRenewalSoon(guide.premiumExpiry) && (
                <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-orange-700 text-xs">
                  <div className="flex items-center mb-1">
                    <FaClock className="mr-1" />
                    <span className="font-semibold">Renewal Reminder</span>
                  </div>
                  <p>Your tour guide premium subscription will expire soon. Renew now to maintain your premium benefits.</p>
                  <Link 
                    to="/partnership/tour-guide-premium" 
                    className="mt-2 inline-block bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700"
                  >
                    Renew Subscription
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Analytics Section */}
        {guide.analyticsEnabled && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
              <FaChartLine className="mr-2" />
              Performance Analytics
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-2 rounded text-center">
                <FaEye className="text-blue-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-blue-600">{guide.viewCount || 0}</div>
                <div className="text-xs text-gray-600">Profile Views</div>
              </div>
              
              <div className="bg-white p-2 rounded text-center">
                <FaCrown className="text-gold mx-auto mb-1" />
                <div className="text-lg font-bold text-gold">Premium</div>
                <div className="text-xs text-gray-600">Status</div>
              </div>
            </div>
            
            <div className="mt-3 p-2 bg-white rounded">
              <h5 className="text-xs font-semibold text-gray-700 mb-1">Insights</h5>
              <div className="text-xs text-gray-600 space-y-1">
                {guide.viewCount > 50 && (
                  <div className="flex items-center text-green-600">
                    <FaCheck className="mr-1" />
                    <span>High visibility - Great exposure!</span>
                  </div>
                )}
                {guide.featuredStatus === 'homepage' && (
                  <div className="flex items-center text-blue-600">
                    <FaCrown className="mr-1" />
                    <span>Featured on homepage</span>
                  </div>
                )}
                {guide.viewCount < 10 && (
                  <div className="flex items-center text-orange-600">
                    <span>💡 Tip: Complete your profile to increase views</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Featured Status */}
        {guide.featuredStatus && guide.featuredStatus !== 'none' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center">
              <FaCrown className="mr-2" />
              Featured Placement
            </h4>
            <div className="space-y-2">
              {guide.featuredStatus === 'homepage' && (
                <div className="flex items-center text-red-700">
                  <FaCheck className="mr-2 text-red-500" />
                  <span className="text-sm">Featured on Homepage</span>
                  <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">ACTIVE</span>
                </div>
              )}
              {guide.featuredStatus === 'destination' && (
                <div className="flex items-center text-red-700">
                  <FaCheck className="mr-2 text-red-500" />
                  <span className="text-sm">Featured in Destination Pages</span>
                  <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">ACTIVE</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Premium Benefits */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
            <FaTrophy className="mr-2" />
            Premium Benefits Unlocked
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center text-yellow-700">
              <FaTrophy className="mr-1 text-yellow-500" />
              <span>Top search placement</span>
            </div>
            <div className="flex items-center text-yellow-700">
              <FaEye className="mr-1 text-yellow-500" />
              <span>4x more visibility</span>
            </div>
            <div className="flex items-center text-yellow-700">
              <FaUsers className="mr-1 text-yellow-500" />
              <span>Trust badge display</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TourGuideUpgradePrompt = ({ guide }) => {
    if (guide.isPremium) return null;

    return (
      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2">Free Listing - Premium Processing Unavailable</h4>
        <p className="text-xs text-yellow-700 mb-3">
          Due to payment gateway maintenance, premium features are temporarily unavailable.
          All listings are currently operating as free plans.
        </p>
      </div>
    );
  };

  // Next, add a pending guide message component
  const PendingGuideMessage = ({ guide }) => {
    if (guide.status !== 'pending' || guide.isVerified) return null;
    
    const submittedDate = new Date(guide.submittedAt);
    const waitingDays = Math.floor((new Date() - submittedDate) / (1000 * 60 * 60 * 24));
    
    return (
      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
          <FaClock className="mr-2" />
          Under Review
        </h4>
        
        <div className="text-sm text-yellow-700">
          <p className="mb-2">
            Your tour guide profile is currently being reviewed by our team and will be published within 48 hours.
          </p>
          
          <ul className="space-y-1 list-disc list-inside">
            <li>Submitted: {submittedDate.toLocaleDateString()}</li>
            <li>Waiting time: {waitingDays} day{waitingDays !== 1 ? 's' : ''}</li>
          </ul>
          
          <div className="mt-3 text-xs italic">
            Our review process ensures that all tour guides meet our quality and professionalism standards.
            {waitingDays > 2 && " If your submission has been pending for more than 48 hours, please contact our support team."}
          </div>
        </div>
      </div>
    );
  };

  const handleEditItem = (itemType, itemId) => {
    // Navigate to appropriate edit form based on item type
    switch(itemType) {
      case 'tourGuide':
        // Redirect to tour guide edit page with ID parameter
        window.location.href = `/tour-guide-edit/${itemId}`;
        break;
        
      case 'vehicle':
        // Redirect to vehicle edit page with ID parameter
        window.location.href = `/vehicle-edit/${itemId}`;
        break;
        
      case 'blog':
        // Redirect to blog edit page with ID parameter
        window.location.href = `/blog-edit/${itemId}`;
        break;
        
      case 'business':
        // Redirect to business listing edit page with ID parameter
        window.location.href = `/business-edit/${itemId}`;
        break;
        
      case 'tour':
        // Redirect to tour edit page with ID parameter
        window.location.href = `/tour-edit/${itemId}`;
        break;
        
      default:
        console.error(`Unknown item type: ${itemType}`);
    }
  };

  const handleDeleteItem = async (itemType, itemId) => {
    // Ask for confirmation before deleting
    if (!window.confirm(`Are you sure you want to delete this ${itemType}? This action cannot be undone.`)) {
      return;
    }

    try {
      let endpoint;
      
      // Determine the correct API endpoint based on item type
      switch(itemType) {
        case 'tourGuide':
          endpoint = `/tour-guides/${itemId}`;
          break;
        case 'vehicle':
          endpoint = `/vehicles/${itemId}`;
          break;
        case 'blog':
          endpoint = `/blogs/${itemId}`;
          break;
        case 'business':
          endpoint = `/affiliate-links/${itemId}`;
          break;
        case 'tour':
          endpoint = `/tours/${itemId}`;
          break;
        default:
          console.error(`Unknown item type: ${itemType}`);
          return;
      }
      
      // Make the delete API call
      await api.delete(endpoint);
      
      // Show success message
      alert(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} has been deleted successfully.`);
      
      // Refresh the submissions data
      fetchSubmissions();
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
      alert(`Failed to delete ${itemType}. Please try again.`);
    }
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-sm ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysRemaining = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const needsRenewalSoon = (expiryDate) => {
    const daysRemaining = getDaysRemaining(expiryDate);
    return daysRemaining > 0 && daysRemaining <= 14; // Show renewal notice for subscriptions expiring in next 14 days
  };

  // Add the new countRenewalReminders function here
  const countRenewalReminders = () => {
    let count = 0;
    
    // Check vehicle subscriptions
    vehicleSubmissions.forEach(vehicle => {
      if (vehicle.isPremium && vehicle.premiumExpiry && needsRenewalSoon(vehicle.premiumExpiry)) {
        count++;
      }
    });
    
    // Check tour guide subscriptions
    tourGuideSubmissions.forEach(guide => {
      if (guide.isPremium && guide.premiumExpiry && needsRenewalSoon(guide.premiumExpiry)) {
        count++;
      }
    });
    
    // Check business listing subscriptions
    affiliateSubmissions.forEach(listing => {
      if (listing.isPremium && listing.premiumExpiry && needsRenewalSoon(listing.premiumExpiry)) {
        count++;
      }
    });
    
    return count;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tan mx-auto"></div>
          <p className="mt-4 text-charcoal">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Enhanced Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
              <div className="bg-gradient-to-r from-tan to-gold text-cream w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg mx-auto sm:mx-0">
                {profile?.userName?.charAt(0).toUpperCase()}
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-3xl font-bold text-charcoal break-all">{profile?.userName}</h1>
                <p className="text-gray-600 text-lg break-all">{profile?.email}</p>
                <div className="flex flex-col sm:flex-row items-center sm:items-baseline justify-center sm:justify-start gap-1 sm:gap-2 mt-2">
                  <span className="text-sm text-gray-500">Member since</span>
                  <span className="text-sm font-medium text-charcoal">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              className="bg-tan text-cream px-6 py-3 rounded-lg hover:bg-gold transition flex items-center justify-center shadow-md w-full sm:w-auto"
            >
              {editing ? <FaSave className="mr-2" /> : <FaEdit className="mr-2" />}
              {editing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          {editing && (
            <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Username</label>
                <input
                  type="text"
                  name="userName"
                  value={editedProfile.userName || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tan focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editedProfile.email || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tan focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  To change your password, please go to the <b>Login</b> page, click <b>Forgot password?</b>, and follow the instructions to reset your password via email.
                </p>
              </div>

              <div className="md:col-span-2 flex space-x-4 mt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold text-cream px-6 py-2 rounded-lg hover:bg-tan transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Render Pending Actions */}
        {renderPendingActions()}

        {/* Renewal Notifications */}
        {countRenewalReminders() > 0 && (
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8 rounded-r-lg shadow-md">
            <h4 className="font-bold text-orange-800">Subscription Renewal</h4>
            <p className="text-sm text-orange-700 mt-1">
              You have {countRenewalReminders()} premium subscription{countRenewalReminders() > 1 ? 's' : ''} expiring soon.
            </p>
            <div className="mt-3">
              <Link to="#renewal-section" className="inline-block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm font-semibold" onClick={() => {
                setActiveTab('submissions');
                setTimeout(() => {
                  const renewalItems = document.querySelectorAll('.bg-orange-50.border-orange-200');
                  if (renewalItems.length > 0) {
                    renewalItems[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 100);
              }}>
                Review Expiring Subscriptions
              </Link>
            </div>
          </div>
        )}

        {/* Enhanced Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col sm:flex-row border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full sm:w-auto px-6 py-4 flex items-center font-medium transition-colors ${
                activeTab === 'profile' 
                  ? 'border-b-2 sm:border-b-0 sm:border-r-2 border-tan text-tan bg-tan/5' 
                  : 'text-gray-600 hover:text-tan hover:bg-gray-50'
              }`}
            >
              <FaUser className="mr-2" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`w-full sm:w-auto px-6 py-4 flex items-center font-medium transition-colors ${
                activeTab === 'submissions' 
                  ? 'border-b-2 sm:border-b-0 sm:border-r-2 border-tan text-tan bg-tan/5' 
                  : 'text-gray-600 hover:text-tan hover:bg-gray-50'
              }`}
            >
              <FaHistory className="mr-2" />
              My Submissions
              {(tourGuideSubmissions.length + vehicleSubmissions.length + blogSubmissions.length + affiliateSubmissions.length + tourSubmissions.length) > 0 && (
                <span className="ml-2 bg-tan text-cream text-xs px-2 py-1 rounded-full">
                  {tourGuideSubmissions.length + vehicleSubmissions.length + blogSubmissions.length + affiliateSubmissions.length + tourSubmissions.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full sm:w-auto px-6 py-4 flex items-center font-medium transition-colors ${
                activeTab === 'payments' 
                  ? 'border-b-2 sm:border-b-0 border-tan text-tan bg-tan/5' 
                  : 'text-gray-600 hover:text-tan hover:bg-gray-50'
              }`}
            >
              <FaCreditCard className="mr-2" />
              Payment History
              {paymentHistory.length > 0 && (
                <span className="ml-2 bg-tan text-cream text-xs px-2 py-1 rounded-full">
                  {paymentHistory.length}
                </span>
              )}
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <h2 className="font-semibold text-xl text-charcoal">Profile Information</h2>
                  
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Username</label>
                      <p className="text-lg font-medium text-charcoal">{profile?.userName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-lg font-medium text-charcoal">{profile?.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h2 className="font-semibold text-xl text-charcoal">Account Statistics</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {tourGuideSubmissions.length + vehicleSubmissions.length + blogSubmissions.length + affiliateSubmissions.length + tourSubmissions.length}
                      </div>
                      <div className="text-sm text-blue-600">Total Submissions</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{paymentHistory.length}</div>
                      <div className="text-sm text-green-600">Payments Made</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {[...tourGuideSubmissions, ...vehicleSubmissions, ...blogSubmissions, ...affiliateSubmissions, ...tourSubmissions]
                          .filter(item => item.isPremium).length}
                      </div>
                      <div className="text-sm text-yellow-600">Premium Services</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {[...tourGuideSubmissions, ...vehicleSubmissions, ...blogSubmissions, ...affiliateSubmissions, ...tourSubmissions]
                          .filter(item => item.status === 'approved').length}
                      </div>
                      <div className="text-sm text-purple-600">Approved Items</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="space-y-8">
                {/* Tour Guide Submissions */}
                {tourGuideSubmissions.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FaUser className="mr-2 text-blue-500" />
                      Tour Guide Submissions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tourGuideSubmissions.map((guide) => (
                        <div key={guide._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-lg">{guide.name}</h4>
                            {guide.isPremium && (
                              <span className="bg-gradient-to-r from-gold to-tan text-white text-xs px-2 py-1 rounded-full flex items-center shadow-md">
                                <FaCrown className="mr-1" />
                                PREMIUM
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{guide.languages?.join(', ')}</p>
                          <p className="text-sm text-gray-600 mb-3">{guide.bio?.substring(0, 100)}...</p>
                          
                          {/* Premium features display */}
                          {guide.isPremium ? (
                            <TourGuidePremiumDetails guide={guide} />
                          ) : (
                            <>
                              <TourGuideUpgradePrompt guide={guide} />
                              
                              {/* Add premium refresh button for guides that should be premium */}
                              <div className="mt-2">
                                <button
                                  onClick={() => refreshPremiumStatus(guide._id)}
                                  className="w-full bg-gradient-to-r from-gold to-tan text-white text-xs px-3 py-2 rounded hover:from-tan hover:to-gold transition flex items-center justify-center"
                                >
                                  <FaCrown className="mr-1" />
                                  Refresh Premium Status
                                </button>
                              </div>
                            </>
                          )}
                          
                          {/* Show pending message for non-premium pending guides */}
                          {!guide.isPremium && <PendingGuideMessage guide={guide} />}
                          
                          <div className="flex justify-between items-center mt-3">
                            <span className={getStatusBadge(guide.status)}>
                              {guide.status}
                            </span>
                            <div className="flex space-x-2 mt-2">
                              <Link
                                to={`/tour-guides/${guide._id}`}
                                className="text-green-600 text-xs hover:underline flex items-center"
                              >
                                <FaEye className="mr-1" /> View
                              </Link>
                              
                              <button
                                onClick={() => handleEditItem('tourGuide', guide._id)}
                                className="text-blue-600 text-xs hover:underline flex items-center"
                              >
                                <FaEdit className="mr-1" /> Edit
                              </button>
                              
                              <button
                                onClick={() => handleDeleteItem('tourGuide', guide._id)}
                                className="text-red-600 text-xs hover:underline flex items-center"
                              >
                                <FaTrash className="mr-1" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vehicle Submissions */}
                {vehicleSubmissions.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FaCar className="mr-2 text-green-500" />
                      Vehicle Submissions
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {vehicleSubmissions.map((vehicle) => (
                        <div key={vehicle._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          {/* Vehicle images preview */}
                          {vehicle.vehicleImages && vehicle.vehicleImages.length > 0 && (
                            <div className="mb-3">
                              <div className="grid grid-cols-3 gap-1">
                                {vehicle.vehicleImages.slice(0, 3).map((image, index) => (
                                  <div key={index} className="relative">
                                    <img 
                                      src={image} 
                                      alt={`${vehicle.vehicleModel} ${index + 1}`}
                                      className="w-full h-16 object-cover rounded border"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                    <span className="absolute top-0 right-0 bg-black/70 text-white text-xs px-1 rounded-bl">
                                      {index + 1}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {vehicle.vehicleImages.length} of {vehicle.isPremium ? 3 : 1} photos used
                              </p>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-lg">{vehicle.vehicleModel}</h4>
                            {vehicle.isPremium && <FaCrown className="text-yellow-500" />}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{vehicle.vehicleType} • {vehicle.seatingCapacity} seats</p>
                          <p className="text-sm text-gray-600 mb-3">LKR {vehicle.pricePerDay?.toLocaleString()}/day</p>
                          
                          {/* Premium features display */}
                          {vehicle.isPremium ? (
                            <VehiclePremiumDetails vehicle={vehicle} />
                          ) : (
                            <VehicleUpgradePrompt vehicle={vehicle} />
                          )}
                          
                          {/* Show pending message for non-premium pending vehicles */}
                          {!vehicle.isPremium && <PendingVehicleMessage vehicle={vehicle} />}
                          
                          <div className="flex justify-between items-center mt-3">
                            <span className={getStatusBadge(vehicle.status)}>
                              {vehicle.status}
                            </span>
                            <div className="flex space-x-2">
                              <Link
                                to={`/vehicles/${vehicle._id}`}
                                className="text-green-600 text-xs hover:underline flex items-center"
                              >
                                <FaEye className="mr-1" /> View
                              </Link>
                              
                              <button
                                onClick={() => handleEditItem('vehicle', vehicle._id)}
                                className="text-blue-600 text-xs hover:underline flex items-center"
                              >
                                <FaEdit className="mr-1" /> Edit
                              </button>
                              
                              <button
                                onClick={() => handleDeleteItem('vehicle', vehicle._id)}
                                className="text-red-600 text-xs hover:underline flex items-center"
                              >
                                <FaTrash className="mr-1" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blog Submissions */}
                {blogSubmissions.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FaPenFancy className="mr-2 text-orange-500" />
                      Blog Submissions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {blogSubmissions.map((blog) => (
                        <div key={blog._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-lg">{blog.title}</h4>
                            {blog.isSponsored && (
                              <span className="text-yellow-500" title="Sponsored">
                                <FaCrown />
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-3">
                            {blog.isExternal ? 'External Link' : 'On-site Post'}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className={getStatusBadge(blog.status)}>
                              {blog.status}
                            </span>
                            <div className="flex space-x-2">
                              <Link
                                to={`/blogs/${blog._id}`}
                                className="text-green-600 text-xs hover:underline flex items-center"
                              >
                                <FaEye className="mr-1" /> View
                              </Link>
                              
                              <button
                                onClick={() => handleEditItem('blog', blog._id)}
                                className="text-blue-600 text-xs hover:underline flex items-center"
                              >
                                <FaEdit className="mr-1" /> Edit
                              </button>
                              
                              <button
                                onClick={() => handleDeleteItem('blog', blog._id)}
                                className="text-red-600 text-xs hover:underline flex items-center"
                              >
                                <FaTrash className="mr-1" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tour Submissions - Add this section */}
                {tourSubmissions.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FaMapMarkedAlt className="mr-2 text-green-600" />
                      Tour Submissions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tourSubmissions.map((tour) => (
                        <div key={tour._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-lg">{tour.name}</h4>
                            {tour.isPremium && (
                              <span className="bg-gradient-to-r from-gold to-tan text-white text-xs px-2 py-1 rounded-full flex items-center shadow-md">
                                <FaCrown className="mr-1" />
                                PREMIUM
                              </span>
                            )}
                          </div>
                          
                          {tour.image && (
                            <div className="mb-2">
                              <img 
                                src={tour.image.startsWith('http') 
                                  ? tour.image 
                                  : `${import.meta.env.VITE_BACKEND_URL}/${tour.image.replace(/\\/g, '/')}`}
                                alt={tour.name}
                                className="w-full h-32 object-cover rounded-md"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/placeholder.png";
                                }}
                              />
                            </div>
                          )}
                          
                          <p className="text-sm text-gray-600 mb-2">{tour.type}</p>
                          <p className="text-sm text-gray-600 mb-2">Duration: {tour.duration || 'Not specified'}</p>
                          <p className="text-sm text-gray-600 mb-3">{tour.description?.substring(0, 80)}...</p>
                          
                          <div className="flex justify-between items-center mt-3">
                            <span className={getStatusBadge(tour.status)}>
                              {tour.status}
                            </span>
                            <div className="flex space-x-2">
                              <Link
                                to={`/tours`}
                                className="text-green-600 text-xs hover:underline flex items-center"
                              >
                                <FaEye className="mr-1" /> View
                              </Link>
                              
                              <button
                                onClick={() => handleEditItem('tour', tour._id)}
                                className="text-blue-600 text-xs hover:underline flex items-center"
                              >
                                <FaEdit className="mr-1" /> Edit
                              </button>
                              
                              <button
                                onClick={() => handleDeleteItem('tour', tour._id)}
                                className="text-red-600 text-xs hover:underline flex items-center"
                              >
                                <FaTrash className="mr-1" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Business Listing Submissions */}
                {affiliateSubmissions.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FaBuilding className="mr-2 text-purple-500" />
                      Business Listings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {affiliateSubmissions.map((listing) => (
                        <div key={listing._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-lg">{listing.businessName}</h4>
                            {listing.isPremium && <FaCrown className="text-yellow-500" />}
                          </div>
                          {listing.imageUrl && (
                            <div className="mb-2">
                              <img 
                                src={listing.imageUrl.startsWith('http') ? listing.imageUrl : `${import.meta.env.VITE_BACKEND_URL}${listing.imageUrl}`}
                                alt={listing.businessName}
                                className="w-full h-32 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/placeholder.png';
                                }}
                              />
                            </div>
                          )}
                          <div className="text-sm text-gray-600 mb-3 capitalize">
                            <p>{listing.businessType} • {listing.location}</p>
                            <p className="mt-1">{listing.status === 'approved' ? 'Approved' : 'Pending Approval'}</p>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <StatusBadge status={listing.status} />
                            <div className="flex space-x-2">
                              <Link
                                to={`/business-listings/${listing._id}`}
                                className="text-green-600 text-xs hover:underline flex items-center"
                              >
                                <FaEye className="mr-1" /> View
                              </Link>
                              
                              <button
                                onClick={() => handleEditItem('business', listing._id)}
                                className="text-blue-600 text-xs hover:underline flex items-center"
                              >
                                <FaEdit className="mr-1" /> Edit
                              </button>
                              
                              <button
                                onClick={() => handleDeleteItem('business', listing._id)}
                                className="text-red-600 text-xs hover:underline flex items-center"
                              >
                                <FaTrash className="mr-1" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No submissions message - update to include tours */}
                {tourGuideSubmissions.length === 0 && 
                 vehicleSubmissions.length === 0 && 
                 blogSubmissions.length === 0 && 
                 affiliateSubmissions.length === 0 && 
                 tourSubmissions.length === 0 && (
                  <div className="bg-gray-50 rounded-lg p-12 text-center">
                    <div className="text-6xl text-gray-300 mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-4">No Submissions Yet</h3>
                    <p className="text-gray-500 mb-6">
                      Start your journey by registering as a tour guide, adding your vehicle, or submitting a tour!
                    </p>
                    <div className="flex justify-center space-x-4">
                      <Link
                        to="/partnership/tour-guide-premium"
                        className="bg-tan text-cream px-4 py-2 rounded-lg hover:bg-gold transition"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        Become a Tour Guide
                      </Link>
                      <Link
                        to="/partnership/vehicle-premium"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        Add Vehicle
                      </Link>
                      <Link
                        to="/partnership/business-premium"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        Upgrade Business Listing
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                {paymentLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tan"></div>
                    <span className="ml-4 text-lg text-gray-600">Loading payment history...</span>
                  </div>
                ) : paymentHistory && paymentHistory.length > 0 ? (
                  <div className="space-y-4">
                    {paymentHistory.map((payment) => (
                      <div key={payment._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 rounded-full">
                              {getServiceIcon(payment.serviceType)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-charcoal">{payment.description}</h3>
                              <p className="text-sm text-gray-600">{getServiceName(payment.serviceType)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-charcoal">
                              LKR {payment.amount.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              <div className="flex items-center space-x-4">
                                {payment.subscriptionDetails?.endDate && (
                                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                    Active Subscription
                                    <span className="ml-2">
                                      • Expires: {new Date(payment.subscriptionDetails.endDate).toLocaleDateString()}
                                    </span>
                                  </span>
                                )}
                              </div>
                              
                              <div className="text-sm text-gray-500">
                                Order ID: {payment.orderId}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-12 text-center">
                    <div className="text-6xl text-gray-300 mb-4">💳</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-4">No Payment History</h3>
                    <p className="text-gray-500 mb-6">You haven't made any payments yet.</p>
                    <Link to="/partnership" className="bg-tan text-cream px-6 py-3 rounded-lg hover:bg-gold transition inline-flex items-center">
                      <FaCreditCard className="mr-2" />
                      View Partnership Options
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;