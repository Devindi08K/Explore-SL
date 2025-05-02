import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from './utils/api';

// Client Components
import HomePage from './components/client/HomePage';
import Navbar from './components/client/Navbar';
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

// Admin Components
import AdminDashboard from './components/client/AdminDashboard';
import ManageDestinations from './components/admin/ManageDestinations';
import AdminAffiliatePage from './components/admin/AdminAffiliatePage';
import AdminBlogForm from './components/admin/AdminBlogForm';
import AdminTour from './components/admin/AdminTour';
import AdminTourGuidePage from './components/admin/AdminTourGuidePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status when app loads
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/check-auth');
        if (response.data.role) {
          setIsLoggedIn(true);
          setUser(response.data);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  // Protected Route component
  const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    if (adminOnly && user?.role !== 'admin') {
      console.log('Access denied: User role:', user?.role);
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} userRole={user?.role} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
