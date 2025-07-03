import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaCog, FaSignOutAlt, FaUser } from "react-icons/fa";
import { AuthContext } from '../../context/AuthContext';

const Navbar = ({ onLogout }) => {
    const { currentUser, isAuthReady } = useContext(AuthContext);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const navigate = useNavigate();
    
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

    return (
        <nav className="bg-charcoal text-cream py-4 sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link className="text-2xl font-bold text-cream" to="/">
                    Explore Sri Lanka
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
                                className="flex items-center space-x-2 text-cream hover:text-gold transition-colors duration-200"
                                aria-expanded={showProfileMenu}
                                aria-haspopup="true"
                            >
                                <FaUserCircle className="w-8 h-8" />
                                <span className="font-medium">{currentUser?.userName}</span>
                            </button>
                            
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                                    <Link 
                                        to="/profile" 
                                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-cream hover:text-charcoal"
                                        onClick={() => setShowProfileMenu(false)}
                                    >
                                        <FaUser className="w-5 h-5 mr-2" />
                                        My Profile
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
                <div className="px-4 py-2 space-y-1">
                    <Link to="/" className="block py-2 hover:bg-tan-dark text-cream" onClick={() => setShowMobileMenu(false)}>Home</Link>
                    <Link to="/destinations" className="block py-2 hover:bg-tan-dark text-cream" onClick={() => setShowMobileMenu(false)}>Destinations</Link>
                    <Link to="/map" className="block py-2 hover:bg-tan-dark text-cream" onClick={() => setShowMobileMenu(false)}>Map</Link>
                    <Link to="/tours" className="block py-2 hover:bg-tan-dark text-cream" onClick={() => setShowMobileMenu(false)}>Tour List</Link>
                    <Link to="/tour-guides" className="block py-2 hover:bg-tan-dark text-cream" onClick={() => setShowMobileMenu(false)}>Tour Guides</Link>
                    <Link to="/blogs" className="block py-2 hover:bg-tan-dark text-cream" onClick={() => setShowMobileMenu(false)}>Blogs</Link>
                    <Link to="/affiliate-links" className="block py-2 hover:bg-tan-dark text-cream" onClick={() => setShowMobileMenu(false)}>Bookings</Link>
                    <Link to="/partnership" className="block py-2 hover:bg-tan-dark text-cream" onClick={() => setShowMobileMenu(false)}>Partnership</Link>
                    <Link to="/vehicles" className="block py-2 hover:bg-tan-dark text-cream" onClick={() => setShowMobileMenu(false)}>Vehicles</Link>

                    {isLoggedIn ? (
                        <div className="relative profile-menu-container">
                            <button 
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center space-x-2 text-cream hover:text-gold transition-colors duration-200 w-full"
                                aria-expanded={showProfileMenu}
                                aria-haspopup="true"
                            >
                                <FaUserCircle className="w-8 h-8" />
                                <span className="font-medium">{currentUser?.userName}</span>
                            </button>
                            
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                                    <Link 
                                        to="/profile" 
                                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-cream hover:text-charcoal"
                                        onClick={() => setShowProfileMenu(false)}
                                    >
                                        <FaUser className="w-5 h-5 mr-2" />
                                        My Profile
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
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
