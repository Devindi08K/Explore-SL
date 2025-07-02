import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from './context/AuthContext';
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
import ReviewList from './components/client/ReviewForm';
import TourGuidePremiumPage from './components/client/TourGuidePremiumPage';
import VehiclePremiumPage from './components/client/VehiclePremiumPage';
import TourGuideProfilePage from './components/client/TourGuideProfilePage';

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

// Payment Components
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';

// Sponsored Content Components
import SubmitSponsoredBlogPage from './components/client/SubmitSponsoredBlogPage';
import SubmitTourPartnershipPage from './components/client/SubmitTourPartnershipPage';

// Create a separate component for the app content
const AppContent = () => {
  const { user, login: authLogin } = useContext(AuthContext); // Now this is inside the provider
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  const handleLoginSuccess = (userData) => {
    console.log('App: Login success with data:', userData);
    setIsLoggedIn(true);
    authLogin(userData, userData.token); // Use AuthContext login
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
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} userRole={user?.role} user={user} />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/blogs" element={<BlogList user={user} />} />
            <Route path="/blogs/:id" element={<BlogDetails user={user} />} />
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
            <Route path="/reviews" element={<ReviewList />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/cancel" element={<PaymentCancelPage />} />
            <Route path="/partnership/tour-guide-premium" element={<TourGuidePremiumPage />} />
            <Route path="/partnership/vehicle-premium" element={<VehiclePremiumPage />} />
            <Route path="/vehicles/:id" element={<VehiclesPage />} />
            <Route path="/tour-guides/:id" element={<TourGuideProfilePage />} />
            <Route path="/submit-sponsored-blog" element={<SubmitSponsoredBlogPage />} />
            <Route path="/submit-tour-partnership" element={<SubmitTourPartnershipPage />} />
            
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
};

// Main App component that provides the context
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
