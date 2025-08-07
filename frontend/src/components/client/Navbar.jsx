import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaCog, FaSignOutAlt, FaUser } from "react-icons/fa";
import { AuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api'; // Adjust the import based on your project structure

const Navbar = ({ onLogout }) => {
    const { currentUser, isAuthReady } = useContext(AuthContext);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    
    // Determine if user is logged in based on context
    const isLoggedIn = Boolean(currentUser);
    
    useEffect(() => {
        console.log("Navbar auth state:", { isLoggedIn, userName: currentUser?.userName });
    }, [currentUser, isLoggedIn]);
    
    // Handle logout with proper cleanup
    const handleLogout = () => {
        setShowProfileMenu(false);
        onLogout();
    };

    // Close the menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
                setShowProfileMenu(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showProfileMenu]);

    // Count subscription renewals and pending actions
    useEffect(() => {
        const fetchNotificationCounts = async () => {
            if (!currentUser) return;
            
            try {
                // Get vehicles, tour guides, and business listings that need renewal
                const [vehiclesRes, guidesRes, listingsRes, paymentsRes] = await Promise.all([
                    api.get('/vehicles/my-submissions').catch(() => ({ data: [] })),
                    api.get('/tour-guides/my-submissions').catch(() => ({ data: [] })),
                    api.get('/affiliate-links/user').catch(() => ({ data: [] })),
                    api.get('/payments/user').catch(() => ({ data: [] }))
                ]);
                
                // Count items needing renewal (expiring in next 14 days)
                const needsRenewalSoon = (expiryDate) => {
                    if (!expiryDate) return false;
                    const now = new Date();
                    const expiry = new Date(expiryDate);
                    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
                    return diffDays > 0 && diffDays <= 14;
                };
                
                let count = 0;
                
                // Count vehicle renewals
                const vehicles = Array.isArray(vehiclesRes.data) ? vehiclesRes.data : [];
                vehicles.forEach(vehicle => {
                    if (vehicle.isPremium && vehicle.premiumExpiry && needsRenewalSoon(vehicle.premiumExpiry)) {
                        count++;
                    }
                });
                
                // Count guide renewals
                const guides = Array.isArray(guidesRes.data) ? guidesRes.data : [];
                guides.forEach(guide => {
                    if (guide.isPremium && guide.premiumExpiry && needsRenewalSoon(guide.premiumExpiry)) {
                        count++;
                    }
                });
                
                // Count business listing renewals
                const listings = Array.isArray(listingsRes.data) ? listingsRes.data : [];
                listings.forEach(listing => {
                    if (listing.isPremium && listing.premiumExpiry && needsRenewalSoon(listing.premiumExpiry)) {
                        count++;
                    }
                });
                
                // Count pending actions from payments
                const payments = Array.isArray(paymentsRes.data) ? paymentsRes.data : [];
                payments.forEach(payment => {
                    if (payment.subscriptionDetails?.awaitingSubmission) {
                        count++;
                    }
                });
                
                setNotificationCount(count);
            } catch (error) {
                console.error('Error fetching notification counts:', error);
            }
        };
        
        fetchNotificationCounts();
        
        // Refresh notification count every 5 minutes
        const interval = setInterval(fetchNotificationCounts, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [currentUser]);

    return (
        <nav className="bg-charcoal text-cream py-4 sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link className="flex items-center text-2xl font-bold text-cream" to="/">
                  <img
                    src="https://res.cloudinary.com/dxydsx0kf/image/upload/v1752847316/225844264_gsjo7w.png"
                    alt="SLExplora Logo"
                    className="h-16 w-16 rounded-full mr-2 object-cover" // big and round
                    style={{ maxHeight: '64px' }}
                  />
                  SLExplora
                </Link>

                <ul className="hidden md:flex flex-wrap items-center gap-5 text-cream font-medium">
                    <li><Link to="/" className="hover:text-gold transition">Home</Link></li>
                    <li><Link to="/destinations" className="hover:text-gold transition">Destinations</Link></li>
                    <li><Link to="/map" className="hover:text-gold transition">Map</Link></li>
                    <li><Link to="/tours" className="hover:text-gold transition">Tour List</Link></li>
                    <li><Link to="/tour-guides" className="hover:text-gold transition">Tour Guides</Link></li>
                    <li><Link to="/blogs" className="hover:text-gold transition">Blogs</Link></li>
                    <li><Link to="/affiliate-links" className="hover:text-gold transition">Bookings</Link></li>
                    <li><Link to="/partnership" className="hover:text-gold transition">Partnership</Link></li>
                    <li><Link to="/vehicles" className="hover:text-gold transition">Vehicles</Link></li>

                    {isLoggedIn ? (
                        <div className="relative profile-menu-container">
                            <button 
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center space-x-2 text-cream hover:text-gold transition-colors duration-200 relative"
                                aria-expanded={showProfileMenu}
                                aria-haspopup="true"
                            >
                                <FaUserCircle className="w-8 h-8" />
                                <span className="font-medium">{currentUser?.userName}</span>
                                
                                {/* Notification indicator */}
                                {notificationCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {notificationCount}
                                    </span>
                                )}
                            </button>
                            
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                                    <Link 
                                        to="/profile" 
                                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-cream hover:text-charcoal relative"
                                        onClick={() => setShowProfileMenu(false)}
                                    >
                                        <FaUser className="w-5 h-5 mr-2" />
                                        My Profile
                                        {notificationCount > 0 && (
                                            <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                {notificationCount}
                                            </span>
                                        )}
                                    </Link>
                                    
                                    {currentUser.role === 'admin' && (
                                        <Link 
                                            to="/admin" 
                                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-cream hover:text-charcoal"
                                            onClick={() => setShowProfileMenu(false)}
                                        >
                                            <FaCog className="w-5 h-5 mr-2" />
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    
                                    <div className="border-t border-gray-100 my-1"></div>
                                    
                                    <button 
                                        onClick={() => {
                                            handleLogout();
                                            setShowProfileMenu(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-cream hover:text-charcoal"
                                    >
                                        <FaSignOutAlt className="w-5 h-5 mr-2" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <li>
                            <Link 
                                to="/login" 
                                className="bg-cream text-tan hover:bg-gold hover:text-cream px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
                            >
                                Sign in
                            </Link>
                        </li>
                    )}
                </ul>

                {/* Add a mobile menu button */}
                <div className="md:hidden">
                    <button 
                        onClick={() => setShowMobileMenu(!showMobileMenu)} 
                        className="text-cream focus:outline-none"
                    >
                        {showMobileMenu ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`${showMobileMenu ? 'block' : 'hidden'} md:hidden absolute top-full left-0 right-0 bg-tan shadow-lg z-50`}>
              <ul className="px-4 py-2 space-y-1">
                <li>
                  <Link
                    to="/"
                    className="block py-2 px-3 rounded transition-colors duration-200 hover:bg-gold hover:text-white"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/destinations"
                    className="block py-2 px-3 rounded transition-colors duration-200 hover:bg-gold hover:text-white"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Destinations
                  </Link>
                </li>
                <li>
                  <Link
                    to="/map"
                    className="block py-2 px-3 rounded transition-colors duration-200 hover:bg-gold hover:text-white"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Map
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tours"
                    className="block py-2 px-3 rounded transition-colors duration-200 hover:bg-gold hover:text-white"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Tour List
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tour-guides"
                    className="block py-2 px-3 rounded transition-colors duration-200 hover:bg-gold hover:text-white"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Tour Guides
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blogs"
                    className="block py-2 px-3 rounded transition-colors duration-200 hover:bg-gold hover:text-white"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/affiliate-links"
                    className="block py-2 px-3 rounded transition-colors duration-200 hover:bg-gold hover:text-white"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Bookings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/partnership"
                    className="block py-2 px-3 rounded transition-colors duration-200 hover:bg-gold hover:text-white"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Partnership
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vehicles"
                    className="block py-2 px-3 rounded transition-colors duration-200 hover:bg-gold hover:text-white"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Vehicles
                  </Link>
                </li>
                {isLoggedIn ? (
                  <li>
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center space-x-2 w-full py-2 px-3 rounded transition-colors duration-200 text-cream hover:bg-gold hover:text-white"
                      aria-expanded={showProfileMenu}
                      aria-haspopup="true"
                    >
                      <FaUserCircle className="w-8 h-8" />
                      <span className="font-medium">{currentUser?.userName}</span>
                    </button>
                    {showProfileMenu && (
                      <div className="bg-white rounded-lg shadow-xl py-2 mt-2">
                        <Link
                          to="/profile"
                          className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gold hover:text-white rounded"
                          onClick={() => {
                            setShowProfileMenu(false);
                            setShowMobileMenu(false);
                          }}
                        >
                          <div className="flex items-center">
                            <FaUser className="w-5 h-5 mr-2" />
                            My Profile
                          </div>
                          {notificationCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {notificationCount}
                            </span>
                          )}
                        </Link>
                        {currentUser.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gold hover:text-white rounded"
                            onClick={() => {
                              setShowProfileMenu(false);
                              setShowMobileMenu(false);
                            }}
                          >
                            <FaCog className="w-5 h-5 mr-2" />
                            Admin Dashboard
                          </Link>
                        )}
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowProfileMenu(false);
                            setShowMobileMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gold hover:text-white rounded"
                        >
                          <FaSignOutAlt className="w-5 h-5 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </li>
                ) : (
                  <li>
                    <Link
                      to="/login"
                      className="bg-cream text-tan hover:bg-gold hover:text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Sign in
                    </Link>
                  </li>
                )}
              </ul>
            </div>
        </nav>
    );
};

export default Navbar;
