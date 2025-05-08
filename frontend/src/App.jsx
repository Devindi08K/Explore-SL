import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from './utils/api';

// Client Components
import HomePage from './components/client/HomePage';
import Navbar from './components/client/Navbar';
import Footer from './components/client/Footer';
import Login from './components/client/Login';
import Signup from './components/client/Signup';
import BlogList from './components/client/BlogList';
import BlogDetails from './components/client/BlogDetails';
import MapComponent from './components/client/MapComponent';
import TourPage from './components/client/TourPage';
import AffiliatePage from './components/client/AffiliatePage';
import PartnershipPage from './components/client/PartnershipPage';
import DestinationDetails from './components/client/DestinationDetails';
import BlogSubmissionForm from './components/client/BlogSubmissionForm';
import BusinessListingForm from './components/client/BusinessListingForm';
import TourOperatorForm from './components/client/TourOperatorForm';
import TourGuidePage from './components/client/TourGuidePage';
import TourGuideRegistrationForm from './components/client/TourGuideRegistrationForm';
import DestinationsPage from './components/client/DestinationsPage';
import VehiclesPage from './components/client/VehiclesPage';
import VehicleRegistrationForm from './components/client/VehicleRegistrationForm';
import UserProfile from './components/client/UserProfile';

// Admin Components
import AdminDashboard from './components/client/AdminDashboard';
import ManageDestinations from './components/admin/ManageDestinations';
import AdminAffiliatePage from './components/admin/AdminAffiliatePage';
import AdminBlogForm from './components/admin/AdminBlogForm';
import AdminTour from './components/admin/AdminTour';
import AdminTourGuidePage from './components/admin/AdminTourGuidePage';
import AdminVehiclesPage from './components/admin/AdminVehiclesPage';

// Auth Component
import AuthCallback from './components/auth/AuthCallback';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for stored authentication on app load
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  // Protected Route component
  const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || !storedUser) {
      return <Navigate to="/login" replace />;
    }

    if (adminOnly && storedUser.role !== 'admin') {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} userRole={user?.role} />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/map" element={<MapComponent />} />
            <Route path="/tours" element={<TourPage />} />
            <Route path="/affiliate-links" element={<AffiliatePage />} />
            <Route path="/partnership" element={<PartnershipPage />} />
            <Route path="/destination/:id" element={<DestinationDetails />} />
            <Route path="/partnership/blog-submission" element={<BlogSubmissionForm />} />
            <Route path="/partnership/business-listing" element={<BusinessListingForm />} />
            <Route path="/partnership/tour-operator" element={<TourOperatorForm />} />
            <Route path="/tour-guides" element={<TourGuidePage />} />
            <Route path="/tour-guide-registration" element={<TourGuideRegistrationForm />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/vehicle-registration" element={<VehicleRegistrationForm />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/auth/callback" element={
              <AuthCallback onLoginSuccess={handleLoginSuccess} />
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/destinations" element={
              <ProtectedRoute adminOnly>
                <ManageDestinations />
              </ProtectedRoute>
            } />
            <Route path="/admin/affiliate-links" element={
              <ProtectedRoute adminOnly>
                <AdminAffiliatePage />
              </ProtectedRoute>
            } />
            <Route path="/admin/blogs" element={
              <ProtectedRoute adminOnly>
                <AdminBlogForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/tours" element={
              <ProtectedRoute adminOnly>
                <AdminTour />
              </ProtectedRoute>
            } />
            <Route path="/admin/tour-guides" element={
              <ProtectedRoute adminOnly>
                <AdminTourGuidePage />
              </ProtectedRoute>
            } />
            <Route path="/admin/vehicles" element={
              <ProtectedRoute adminOnly>
                <AdminVehiclesPage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
