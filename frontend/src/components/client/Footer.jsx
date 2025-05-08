import React from "react";
import { Link } from "react-router-dom";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaTripadvisor,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt 
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-charcoal text-cream">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Explore Sri Lanka</h3>
            <p className="text-cream/80 mb-4">
              Your trusted partner in discovering the pearl of the Indian Ocean. We connect travelers with authentic experiences and local expertise.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-gold transition">
                <FaFacebookF size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-gold transition">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-gold transition">
                <FaInstagram size={20} />
              </a>
              <a href="https://tripadvisor.com" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-gold transition">
                <FaTripadvisor size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/destinations" className="text-cream/80 hover:text-gold transition">
                  Popular Destinations
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-cream/80 hover:text-gold transition">
                  Tour Packages
                </Link>
              </li>
              <li>
                <Link to="/tour-guides" className="text-cream/80 hover:text-gold transition">
                  Tour Guides
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="text-cream/80 hover:text-gold transition">
                  Transport Services
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-cream/80 hover:text-gold transition">
                  Interactive Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Partner With Us */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Partner With Us</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/tour-guide-registration" className="text-cream/80 hover:text-gold transition">
                  Become a Tour Guide
                </Link>
              </li>
              <li>
                <Link to="/vehicle-registration" className="text-cream/80 hover:text-gold transition">
                  Register Your Vehicle
                </Link>
              </li>
              <li>
                <Link to="/partnership/business-listing" className="text-cream/80 hover:text-gold transition">
                  Business Listings
                </Link>
              </li>
              <li>
                <Link to="/partnership/tour-operator" className="text-cream/80 hover:text-gold transition">
                  Tour Operators
                </Link>
              </li>
              <li>
                <Link to="/affiliate-links" className="text-cream/80 hover:text-gold transition">
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-cream/80">
                <FaMapMarkerAlt className="text-gold" />
                <span>123 Tourism Street, Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-center space-x-3 text-cream/80">
                <FaPhoneAlt className="text-gold" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center space-x-3 text-cream/80">
                <FaEnvelope className="text-gold" />
                <span>info@exploresrilanka.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-cream/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-cream/80">
              &copy; {new Date().getFullYear()} Explore Sri Lanka. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-cream/80">
              <Link to="/privacy-policy" className="hover:text-gold transition">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="hover:text-gold transition">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="hover:text-gold transition">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
