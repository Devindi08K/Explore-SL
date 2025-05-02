import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isLoggedIn, onLogout, userRole }) => {
    return (
        <nav className="bg-tan shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link className="text-2xl font-bold text-cream" to="/">
                    Explore Sri Lanka
                </Link>

                <ul className="flex flex-wrap items-center gap-5 text-cream font-medium">
                    <li><Link to="/" className="hover:text-gold transition">Home</Link></li>
                    <li><Link to="/blogs" className="hover:text-gold transition">Blogs</Link></li>
                    <li><Link to="/map" className="hover:text-gold transition">Map</Link></li>
                    <li><Link to="/tours" className="hover:text-gold transition">Tour List</Link></li>
                    <li><Link to="/tour-guides" className="hover:text-gold transition">Tour Guides</Link></li>
                    <li><Link to="/affiliate-links" className="hover:text-gold transition">Bookings</Link></li>
                    <li><Link to="/partnership" className="hover:text-gold transition">Partnership</Link></li>

                    {isLoggedIn ? (
                        <>
                            {userRole === 'admin' && (
                                <>
                                    <li><Link to="/admin/destinations">Manage Destinations</Link></li>
                                    <li><Link to="/admin/affiliate-links">Manage Bookings</Link></li>
                                    <li><Link to="/admin/blogs">Manage Blogs</Link></li>
                                    <li><Link to="/admin/tours">Manage Tours</Link></li>
                                    <li><Link to="/admin/tour-guides">Manage Guides</Link></li>
                                </>
                            )}
                            <li>
                                <button onClick={onLogout}>
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/signup">Signup</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
