import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaUsers, FaMapMarkedAlt, FaCar, FaUserTie, FaBlog, 
  FaLink, FaRoute, FaBuilding, FaCheck, FaTimes,
  FaCreditCard, FaClock, FaChartLine, FaEdit, FaSync
} from 'react-icons/fa';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    destinations: 0,
    vehicles: 0,
    tourGuides: 0,
    blogs: 0,
    affiliates: 0,
    tours: 0
  });

  const [pendingSubmissions, setPendingSubmissions] = useState({
    tourGuides: [],
    vehicles: [],
    blogs: [],
    businessListings: [],
    tours: [],
    users: []
  });

  // Payment-related state
  const [payments, setPayments] = useState([]);
  const [paymentStats, setPaymentStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    completedPayments: 0,
    monthlyRevenue: 0
  });

  const [activeTab, setActiveTab] = useState('tourGuides');

  useEffect(() => {
    fetchDashboardStats();
    fetchPendingSubmissions();
    fetchPayments();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/admin/dashboard-stats');
      setStats({
        ...response.data,
        // Add derived stats for premium counts
        premiumVehicles: response.data.premiumVehicles || 0,
        premiumGuides: response.data.premiumGuides || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchPendingSubmissions = async () => {
    try {
      const [tourGuides, vehicles, blogs, businessListings, tours, usersResponse] = await Promise.all([
        api.get('/admin/pending/tourGuides'),
        api.get('/admin/pending/vehicles'),
        api.get('/admin/pending/blogs'),
        api.get('/admin/pending/businessListings'),
        api.get('/admin/pending/tours'),
        api.get('/admin/users')
      ]);

      setPendingSubmissions({
        tourGuides: tourGuides.data || [],
        vehicles: vehicles.data || [],
        blogs: blogs.data || [],
        businessListings: businessListings.data || [],
        tours: tours.data || [],
        users: Array.isArray(usersResponse.data) ? usersResponse.data : []
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchPayments = async () => {
    try {
      console.log('🔄 Fetching payments data...');
      const response = await api.get('/admin/payments');
      const paymentsData = response.data || [];
      console.log('📊 Payments data received:', paymentsData.length, 'payments');
      
      setPayments(paymentsData);
      
      // Calculate payment statistics with better logging
      const completedPayments = paymentsData.filter(p => p.status === 'completed');
      const pendingPayments = paymentsData.filter(p => p.status === 'pending');
      
      console.log('✅ Completed payments:', completedPayments.length);
      console.log('⏳ Pending payments:', pendingPayments.length);
      
      const totalRevenue = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      console.log('💰 Total revenue:', totalRevenue);
      
      // Calculate monthly revenue (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = completedPayments
        .filter(p => {
          const paymentDate = new Date(p.createdAt);
          return paymentDate.getMonth() === currentMonth && 
                 paymentDate.getFullYear() === currentYear;
        })
        .reduce((sum, p) => sum + (p.amount || 0), 0);
      
      console.log('📅 Monthly revenue:', monthlyRevenue);
      
      const newPaymentStats = {
        totalRevenue,
        pendingPayments: pendingPayments.length,
        completedPayments: completedPayments.length,
        monthlyRevenue
      };
      
      console.log('📈 Setting payment stats:', newPaymentStats);
      setPaymentStats(newPaymentStats);
      
    } catch (error) {
      console.error('❌ Error fetching payments:', error);
      // Set default values if there's an error
      setPaymentStats({
        totalRevenue: 0,
        pendingPayments: 0,
        completedPayments: 0,
        monthlyRevenue: 0
      });
    }
  };

  // Add this useEffect to watch for payments changes
  useEffect(() => {
    if (payments.length > 0) {
      console.log('🔄 Payments data changed, recalculating stats...');
      
      const completedPayments = payments.filter(p => p.status === 'completed');
      const pendingPayments = payments.filter(p => p.status === 'pending');
      
      const totalRevenue = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = completedPayments
        .filter(p => {
          const paymentDate = new Date(p.createdAt);
          return paymentDate.getMonth() === currentMonth && 
                 paymentDate.getFullYear() === currentYear;
        })
        .reduce((sum, p) => sum + (p.amount || 0), 0);
      
      setPaymentStats({
        totalRevenue,
        pendingPayments: pendingPayments.length,
        completedPayments: completedPayments.length,
        monthlyRevenue
      });
    }
  }, [payments]); // This will trigger when payments array changes

  const handleStatusUpdate = async (type, id, status) => {
    try {
      let response;
      
      switch(type) {
        case 'businessListings':
          response = await api.patch(`/affiliate-links/${id}/verify`, {
            status,
            isVerified: status === 'approved'
          });
          break;
        case 'blogs':
          response = await api.patch(`/blogs/${id}/verify`, {
            status,
            isVerified: status === 'approved'
          });
          break;
        default:
          response = await api.patch(`/admin/${type}/${id}/verify`, {
            status,
            isVerified: status === 'approved'
          });
      }

      if (response.data) {
        fetchPendingSubmissions();
      }
    } catch (error) {
      console.error(`Error updating ${type} status:`, error);
      alert(`Failed to update ${type} status`);
    }
  };

  const handleUserRoleUpdate = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      fetchPendingSubmissions();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const handleCompletePayment = async (paymentId) => {
    try {
      await api.patch(`/payments/${paymentId}/complete`, {
        paymentMethod: 'admin_manual',
        transactionId: `ADMIN_${Date.now()}`
      });
      fetchPayments();
      alert('Payment completed successfully');
    } catch (error) {
      console.error('Error completing payment:', error);
      alert('Failed to complete payment');
    }
  };

  // Add this function to handle payment debugging
  const handlePaymentDebug = async (orderId) => {
    try {
      // First check status directly
      const statusResponse = await api.get(`/payments/payhere/status/${orderId}`);
      console.log('Payment status check:', statusResponse.data);
      
      // Then try manual completion
      const completeResponse = await api.post(`/payments/test/complete/${orderId}`);
      console.log('Manual completion result:', completeResponse.data);
      
      alert('Payment processed successfully. Check console for details.');
      fetchPayments();
    } catch (error) {
      console.error('Payment debug error:', error);
      alert('Error processing payment: ' + (error.response?.data?.error || error.message));
    }
  };

  const handlePaymentReconciliation = async () => {
    try {
      const response = await api.post('/admin/payments/reconcile');
      alert(`Reconciliation complete. Updated ${response.data.updatedCount} payments.`);
      fetchPayments();
    } catch (error) {
      console.error('Payment reconciliation error:', error);
      alert('Failed to reconcile payments');
    }
  };

  const DashboardCard = ({ title, count, icon: Icon, link, bgColor }) => (
    <Link to={link} className="block">
      <div className={`${bgColor} rounded-lg p-6 transition-transform duration-300 hover:transform hover:scale-105 hover:shadow-lg`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white text-sm mb-1 opacity-80">Total</p>
            <h3 className="text-white text-2xl font-bold">{title}</h3>
            <p className="text-white text-3xl font-bold mt-2">{count}</p>
          </div>
          <Icon className="text-white/50 text-4xl" />
        </div>
      </div>
    </Link>
  );

  const PaymentStatsCard = ({ title, value, icon: Icon, bgColor, isAmount = false }) => (
    <div className={`${bgColor} rounded-lg p-6`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-white text-sm mb-1 opacity-80">{title}</p>
          <p className="text-white text-2xl font-bold">
            {isAmount ? `LKR ${value.toLocaleString()}` : value}
          </p>
        </div>
        <Icon className="text-white/50 text-3xl" />
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderPendingSubmissionsTable = () => {
    const submissions = pendingSubmissions[activeTab] || [];
    
    const getTableHeaders = () => {
      switch(activeTab) {
        case 'tourGuides':
          return ['Name', 'Experience', 'Languages', 'Contact', 'Status', 'Actions'];
        case 'vehicles':
          return ['Owner Name', 'Vehicle Type', 'Model', 'Contact', 'Status', 'Actions'];
        case 'blogs':
          return ['Author', 'Title', 'Date', 'Status', 'Actions'];
        case 'businessListings':
          return ['Business Name', 'Type', 'Location', 'Contact', 'Status', 'Actions'];
        case 'tours':
          return ['Tour Name', 'Type', 'Duration', 'Contact', 'Status', 'Actions'];
        case 'users':
          return ['Username', 'Email', 'Role', 'Joined Date'];
        case 'payments':
          return ['User', 'Service', 'Amount', 'Date', 'Status', 'Actions'];
        default:
          return [];
      }
    };

    const renderTableRow = (item) => {
      switch(activeTab) {
        case 'tourGuides':
          return (
            <tr key={item._id} className="hover:bg-cream">
              <td className="px-6 py-4">{item.name}</td>
              <td className="px-6 py-4">{item.yearsOfExperience} years</td>
              <td className="px-6 py-4">{item.languages.join(', ')}</td>
              <td className="px-6 py-4">{item.contactEmail}</td>
              <td className="px-4 py-2">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-6 py-4 flex space-x-2">
                <Link
                  to={`/admin/tour-guides?id=${item._id}`}
                  className="bg-tan text-cream px-3 py-1 rounded hover:bg-gold"
                >
                  Review
                </Link>
              </td>
            </tr>
          );
        case 'vehicles':
          return (
            <tr key={item._id} className="hover:bg-cream">
              <td className="px-6 py-4">{item.ownerName || 'N/A'}</td>
              <td className="px-6 py-4">{item.vehicleType || 'N/A'}</td>
              <td className="px-6 py-4">{item.vehicleModel || 'N/A'}</td>
              <td className="px-6 py-4">{item.contactPhone || 'N/A'}</td>
              <td className="px-4 py-2">
                <StatusBadge status={item.status || 'pending'} />
              </td>
              <td className="px-6 py-4 flex space-x-2">
                <Link
                  to={`/admin/vehicles?id=${item._id}`}
                  className="bg-tan text-cream px-3 py-1 rounded hover:bg-gold"
                >
                  Review
                </Link>
              </td>
            </tr>
          );
        case 'blogs':
          return (
            <tr key={item._id} className="hover:bg-cream">
              <td className="px-6 py-4">{item.authorName}</td>
              <td className="px-6 py-4">{item.title || item.blogUrl}</td>
              <td className="px-6 py-4">{new Date(item.submittedAt).toLocaleDateString()}</td>
              <td className="px-4 py-2">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-6 py-4 flex space-x-2">
                <Link
                  to={`/admin/blogs?id=${item._id}`}
                  className="bg-tan text-cream px-3 py-1 rounded hover:bg-gold"
                >
                  Review
                </Link>
              </td>
            </tr>
          );
        case 'businessListings':
          return (
            <tr key={item._id} className="hover:bg-cream">
              <td className="px-6 py-4">{item.businessName}</td>
              <td className="px-6 py-4">{item.businessType}</td>
              <td className="px-6 py-4">{item.location}</td>
              <td className="px-6 py-4">{item.contactEmail}</td>
              <td className="px-4 py-2">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-6 py-4 flex space-x-2">
                <Link
                  to={`/admin/affiliate-links?id=${item._id}`}
                  className="bg-tan text-cream px-3 py-1 rounded hover:bg-gold"
                >
                  Review
                </Link>
              </td>
            </tr>
          );
        case 'tours':
          return (
            <tr key={item._id} className="hover:bg-cream">
              <td className="px-6 py-4">{item.name}</td>
              <td className="px-6 py-4">{item.type}</td>
              <td className="px-6 py-4">{item.duration}</td>
              <td className="px-6 py-4">{item.contactEmail}</td>
              <td className="px-4 py-2">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-6 py-4 flex space-x-2">
                <Link
                  to={`/admin/tours?id=${item._id}`}
                  className="bg-tan text-cream px-3 py-1 rounded hover:bg-gold"
                >
                  Review
                </Link>
              </td>
            </tr>
          );
        case 'users':
          return (
            <tr key={item._id} className="hover:bg-cream">
              <td className="px-6 py-4">{item.userName}</td>
              <td className="px-6 py-4">{item.email}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {item.role}
                </span>
              </td>
              <td className="px-6 py-4">
                {new Date(item.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </td>
            </tr>
          );
        case 'payments':
          return (
            <tr key={item._id} className="hover:bg-cream">
              <td className="px-6 py-4">{item.customerDetails?.name || 'N/A'}</td>
              <td className="px-6 py-4">{item.description}</td>
              <td className="px-6 py-4 font-medium">LKR {item.amount.toLocaleString()}</td>
              <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'completed' ? 'bg-green-100 text-green-800' :
                  item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-sm space-x-2">
                {item.status === 'pending' && (
                  <button
                    onClick={() => handleCompletePayment(item._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                  >
                    Complete
                  </button>
                )}
                <button
                  onClick={() => alert(`Payment ID: ${item.orderId}`)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                >
                  View
                </button>
              </td>
            </tr>
          );
        default:
          return null;
      }
    };

    return (
      <div className="mt-6">
        <div className="flex space-x-4 mb-4 overflow-x-auto">
          <TabButton 
            active={activeTab === 'tourGuides'} 
            onClick={() => setActiveTab('tourGuides')}
            icon={FaUserTie}
            label="Tour Guides"
            count={pendingSubmissions.tourGuides.length}
          />
          <TabButton 
            active={activeTab === 'vehicles'} 
            onClick={() => setActiveTab('vehicles')}
            icon={FaCar}
            label="Vehicles"
            count={pendingSubmissions.vehicles.length}
          />
          <TabButton 
            active={activeTab === 'blogs'} 
            onClick={() => setActiveTab('blogs')}
            icon={FaBlog}
            label="Blogs"
            count={pendingSubmissions.blogs.length}
          />
          <TabButton 
            active={activeTab === 'businessListings'} 
            onClick={() => setActiveTab('businessListings')}
            icon={FaBuilding}
            label="Business Listings"
            count={pendingSubmissions.businessListings.length}
          />
          <TabButton 
            active={activeTab === 'tours'} 
            onClick={() => setActiveTab('tours')}
            icon={FaRoute}
            label="Tours"
            count={pendingSubmissions.tours.length}
          />
          <TabButton 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')}
            icon={FaUsers}
            label="Users"
            count={stats.users}
          />
          <TabButton 
            active={activeTab === 'payments'} 
            onClick={() => setActiveTab('payments')}
            icon={FaCreditCard}
            label="Payments"
            count={paymentStats.pendingPayments}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {getTableHeaders().map(header => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeTab === 'payments' ? payments.map(renderTableRow) : submissions.map(renderTableRow)}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
        active 
          ? 'bg-tan text-cream' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Icon />
      <span>{label}</span>
      {count > 0 && (
        <span className="bg-cream text-charcoal px-2 py-1 rounded-full text-xs">
          {count}
        </span>
      )}
    </button>
  );

  const handleViewPaymentDetails = (orderId) => {
    // Currently this function doesn't exist
    // Implement with proper security measures and avoid logging full payment details
    window.open(`/admin/payments/view/${orderId}`, '_blank');
  }

  return (
    <div className="min-h-screen bg-cream py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome to the admin control panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <DashboardCard 
            title="Destinations"
            count={stats.destinations}
            icon={FaMapMarkedAlt}
            link="/admin/destinations"
            bgColor="bg-blue-600"
          />
          <DashboardCard 
            title="Vehicles"
            count={stats.vehicles}
            icon={FaCar}
            link="/admin/vehicles"
            bgColor="bg-green-600"
          />
          <DashboardCard 
            title="Tour Guides"
            count={stats.tourGuides}
            icon={FaUserTie}
            link="/admin/tour-guides"
            bgColor="bg-purple-600"
          />
          <DashboardCard 
            title="Tours"
            count={stats.tours}
            icon={FaRoute}
            link="/admin/tours"
            bgColor="bg-orange-600"
          />
          <DashboardCard 
            title="Blogs"
            count={stats.blogs}
            icon={FaBlog}
            link="/admin/blogs"
            bgColor="bg-red-600"
          />
          <DashboardCard 
            title="Affiliates"
            count={stats.affiliates}
            icon={FaLink}
            link="/admin/affiliate-links"
            bgColor="bg-indigo-600"
          />
          <DashboardCard 
            title="Users"
            count={stats.users}
            icon={FaUsers}
            link="/admin/users"
            bgColor="bg-teal-600"
          />
        </div>

        {/* Payment Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <PaymentStatsCard 
            title="Total Revenue"
            value={paymentStats.totalRevenue}
            icon={FaCreditCard}
            bgColor="bg-green-600"
            isAmount={true}
          />
          <PaymentStatsCard 
            title="Monthly Revenue"
            value={paymentStats.monthlyRevenue}
            icon={FaChartLine}
            bgColor="bg-blue-600"
            isAmount={true}
          />
          <PaymentStatsCard 
            title="Pending Payments"
            value={paymentStats.pendingPayments}
            icon={FaClock}
            bgColor="bg-yellow-600"
          />
          <PaymentStatsCard 
            title="Completed Payments"
            value={paymentStats.completedPayments}
            icon={FaCheck}
            bgColor="bg-green-700"
          />
        </div>

        {/* Management Dashboard Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold text-charcoal mb-4">
            Management Dashboard
          </h2>
          {renderPendingSubmissionsTable()}
        </div>

        {/* Pending Payments Section - Newly Added */}
        {paymentStats.pendingPayments > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-charcoal">Pending Payments</h2>
              <button
                onClick={handlePaymentReconciliation}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FaSync className="mr-2" />
                Reconcile Old Payments
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-2">Order ID</th>
                    <th className="px-4 py-2">Service</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.filter(p => p.status === 'pending').map(payment => (
                    <tr key={payment._id} className="border-b">
                      <td className="px-4 py-2 font-mono text-sm">{payment.orderId}</td>
                      <td className="px-4 py-2">{payment.description}</td>
                      <td className="px-4 py-2">LKR {payment.amount.toLocaleString()}</td>
                      <td className="px-4 py-2">{new Date(payment.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        {/* Replace debug button with a more appropriate action for production */}
                        <button
                          onClick={() => handleViewPaymentDetails(payment.orderId)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 mr-2"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleCompletePayment(payment._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Complete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
