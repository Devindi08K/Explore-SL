import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaCog, FaSignOutAlt, FaHistory } from "react-icons/fa";

const Navbar = ({ isLoggedIn, onLogout, userRole, user }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <nav className="bg-tan shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link className="text-2xl font-bold text-cream" to="/">
                    Explore Sri Lanka
                </Link>

                <ul className="flex flex-wrap items-center gap-5 text-cream font-medium">
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
                        <div className="relative">
                            <button 
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center space-x-2 text-cream hover:text-gold transition-colors duration-200"
                            >
                                <FaUserCircle className="w-8 h-8" />
                                <span className="font-medium">{user?.userName}</span>
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                                    <Link 
                                        to="/profile" 
                                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-cream hover:text-charcoal"
                                    >
                                        <FaUserCircle className="w-5 h-5 mr-2" />
                                        My Profile
                                    </Link>
                                    <Link 
                                        to="/profile/activity" 
                                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-cream hover:text-charcoal"
                                    >
                                        <FaHistory className="w-5 h-5 mr-2" />
                                        Activity History
                                    </Link>
                                    {userRole === 'admin' && (
                                        <Link 
                                            to="/admin" 
                                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-cream hover:text-charcoal"
                                        >
                                            <FaCog className="w-5 h-5 mr-2" />
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button 
                                        onClick={onLogout}
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
            </div>
        </nav>
    );
};

export default Navbar;
