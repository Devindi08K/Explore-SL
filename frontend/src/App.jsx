import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
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

import BusinessListingForm from './components/client/BusinessListingForm';

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
import BusinessPremiumPage from './components/client/BusinessPremiumPage';
import BusinessDetailPage from './components/client/BusinessDetailPage';
import TourEdit from './components/client/TourEdit';
import BlogEdit from './components/client/BlogEdit';
import BusinessEdit from './components/client/BusinessEdit';
import TourGuideEdit from './components/client/TourGuideEdit';
import VehicleEdit from './components/client/VehicleEdit';

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

import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

import PrivacyPolicy from './components/client/PrivacyPolicy';
import TermsOfService from './components/client/TermsOfService';

// Add this to your imports if it's not already there
import PayhereTestPage from './pages/PayhereTestPage';
import RefundPolicy from "./pages/RefundPolicy";

// Create a separate component for the app content that needs router hooks
const AppContent = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLoginSuccess = () => {
    // This function is now primarily for callbacks if needed,
    // as AuthContext handles the state update.
    console.log("Login successful.");
  };

  // This is the definitive ProtectedRoute component.
  const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { currentUser, isAuthReady } = useContext(AuthContext);

    if (!isAuthReady) {
      // While context is checking localStorage, show a loading indicator.
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tan"></div>
        </div>
      );
    }

    if (!currentUser) {
      // If the check is done and there's no user, redirect to login.
      return <Navigate to="/login" replace />;
    }

    if (adminOnly && currentUser.role !== 'admin') {
      // If route is for admins only and user is not an admin, redirect.
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onLogout={handleLogout} />
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
          
          <Route path="/partnership/business-listing" element={<BusinessListingForm />} />
          <Route path="/partnership/business-premium" element={<BusinessPremiumPage />} />
          
          <Route path="/tour-guides" element={<TourGuidePage />} />
          <Route path="/tour-guide-registration" element={<TourGuideRegistrationForm />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/vehicle-registration" element={<VehicleRegistrationForm />} />
          <Route path="/business-listings/:id" element={<BusinessDetailPage />} />
          <Route path="/vehicles/:id" element={<VehiclesPage />} />
          <Route path="/tour-guides/:id" element={<TourGuideProfilePage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/reviews" element={<ReviewList />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/cancel" element={<PaymentCancelPage />} />
          <Route path="/partnership/tour-guide-premium" element={<TourGuidePremiumPage />} />
          <Route path="/partnership/vehicle-premium" element={<VehiclePremiumPage />} />
          
          <Route path="/submit-sponsored-blog" element={<SubmitSponsoredBlogPage />} />
          <Route path="/submit-tour-partnership" element={<SubmitTourPartnershipPage />} />
          
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          
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
          <Route path="/vehicle-edit/:id" element={<VehicleEdit />} />
          <Route path="/tour-guide-edit/:id" element={<TourGuideEdit />} />
          <Route path="/blog-edit/:id" element={<BlogEdit />} />
          <Route path="/business-edit/:id" element={<BusinessEdit />} />
          <Route path="/tour-edit/:id" element={<TourEdit />} />
          <Route path="/test/payhere" element={<PayhereTestPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

// Main App component that provides the context
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
