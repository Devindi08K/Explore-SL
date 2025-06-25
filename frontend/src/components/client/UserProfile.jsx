import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { 
  FaUserCircle, FaEnvelope, FaCalendar, FaEdit, 
  FaUserTie, FaBlog, FaCar, FaRoute 
} from 'react-icons/fa';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [tourGuideSubmissions, setTourGuideSubmissions] = useState([]);
  const [vehicleSubmissions, setVehicleSubmissions] = useState([]);
  const [blogSubmissions, setBlogSubmissions] = useState([]);
  const [tourSubmissions, setTourSubmissions] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    userName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (activeTab === 'payments') {
      const fetchPaymentHistory = async () => {
        try {
          const response = await api.get('/payments/history');
          setPaymentHistory(response.data);
        } catch (error) {
          console.error('Error fetching payment history:', error);
        }
      };
      
      fetchPaymentHistory();
    }
  }, [activeTab]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Get user data from localStorage first
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData) {
        setProfile(userData);
        setEditForm(prev => ({
          ...prev,
          userName: userData.userName || '',
          email: userData.email || ''
        }));
      }

      const [
        profileRes, 
        tourGuideRes,
        vehicleRes,
        blogRes,
        tourRes
      ] = await Promise.all([
        api.get('/users/profile'),
        api.get('/tour-guides/my-submissions'),
        api.get('/vehicles/my-submissions'),
        api.get('/blogs/my-submissions'),
        api.get('/tours/my-submissions')
      ]);

      setTourGuideSubmissions(tourGuideRes.data);
      setVehicleSubmissions(vehicleRes.data);
      setBlogSubmissions(blogRes.data);
      setTourSubmissions(tourRes.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        userName: editForm.userName,
        email: editForm.email
      };

      // Only include password data if user is trying to change password
      if (editForm.currentPassword && editForm.newPassword) {
        if (editForm.newPassword !== editForm.confirmPassword) {
          alert('New passwords do not match');
          return;
        }
        updateData.currentPassword = editForm.currentPassword;
        updateData.newPassword = editForm.newPassword;
      }

      const response = await api.put('/users/profile', updateData);
      setProfile(response.data);
      
      // Update localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({
        ...userData,
        userName: response.data.userName,
        email: response.data.email
      }));

      setIsEditing(false);
      // Clear password fields
      setEditForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.error || 'Error updating profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-tan border-t-gold"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-tan rounded-full flex items-center justify-center">
              <FaUserCircle className="w-16 h-16 text-cream" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-charcoal">{profile?.userName}</h1>
              <p className="text-gray-600">{profile?.email}</p>
              {profile?.createdAt && (
                <p className="text-sm text-gray-500">
                  <FaCalendar className="inline mr-2" />
                  Member since {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="ml-auto bg-tan text-cream px-4 py-2 rounded-lg hover:bg-gold transition"
            >
              <FaEdit className="inline mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing && (
            <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={editForm.userName}
                  onChange={(e) => setEditForm({ ...editForm, userName: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-tan rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-tan rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                />
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                      type="password"
                      value={editForm.currentPassword}
                      onChange={(e) => setEditForm({ ...editForm, currentPassword: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-tan rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      value={editForm.newPassword}
                      onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-tan rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      value={editForm.confirmPassword}
                      onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-tan rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="bg-gold text-cream px-4 py-2 rounded-lg hover:bg-tan transition"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 ${activeTab === 'profile' ? 'border-b-2 border-tan text-tan' : 'text-gray-600'}`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-6 py-3 ${activeTab === 'submissions' ? 'border-b-2 border-tan text-tan' : 'text-gray-600'}`}
            >
              My Submissions
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'payments' ? 'bg-tan text-cream' : 'text-charcoal hover:bg-gray-100'
              }`}
            >
              Payments
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="font-semibold text-lg text-charcoal">Profile Information</h2>
                  <div className="space-y-2">
                    <p><span className="font-medium">Username:</span> {profile?.userName}</p>
                    <p><span className="font-medium">Email:</span> {profile?.email}</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'submissions' && (
              <div className="space-y-8">
                {/* Tour Guide Submissions */}
                {tourGuideSubmissions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center">
                      <FaUserTie className="mr-2" />
                      Tour Guide Registrations
                    </h3>
                    <div className="space-y-4">
                      {tourGuideSubmissions.map((guide) => (
                        <div key={guide._id} className="bg-cream p-4 rounded-lg shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-charcoal">{guide.name}</h4>
                              <p className="text-sm text-gray-600">Experience: {guide.yearsOfExperience} years</p>
                              <p className="text-sm text-gray-600">Languages: {guide.languages.join(', ')}</p>
                              <p className="text-sm text-gray-600">
                                Status: <span className={`font-medium ${guide.status === 'approved' ? 'text-green-600' : guide.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                                  {guide.status.charAt(0).toUpperCase() + guide.status.slice(1)}
                                </span>
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">{new Date(guide.submittedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vehicle Submissions */}
                {vehicleSubmissions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center">
                      <FaCar className="mr-2" />
                      Vehicle Registrations
                    </h3>
                    <div className="space-y-4">
                      {vehicleSubmissions.map((vehicle) => (
                        <div key={vehicle._id} className="bg-cream p-4 rounded-lg shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-charcoal">{vehicle.vehicleModel}</h4>
                              <p className="text-sm text-gray-600">Type: {vehicle.vehicleType}</p>
                              <p className="text-sm text-gray-600">Plate: {vehicle.plateNumber}</p>
                              <p className="text-sm text-gray-600">
                                Status: <span className={`font-medium ${vehicle.status === 'approved' ? 'text-green-600' : vehicle.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                                  {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                                </span>
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">{new Date(vehicle.submittedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blog Submissions */}
                {blogSubmissions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center">
                      <FaBlog className="mr-2" />
                      Blog Submissions
                    </h3>
                    <div className="space-y-4">
                      {blogSubmissions.map((blog) => (
                        <div key={blog._id} className="bg-cream p-4 rounded-lg shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-charcoal">{blog.authorName}</h4>
                              <a href={blog.blogUrl} target="_blank" rel="noopener noreferrer" 
                                 className="text-tan hover:text-gold text-sm">
                                View Blog
                              </a>
                              <p className="text-sm text-gray-600">
                                Status: <span className={`font-medium ${blog.status === 'approved' ? 'text-green-600' : blog.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                                  {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                                </span>
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">{new Date(blog.submittedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tour Submissions */}
                {tourSubmissions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center">
                      <FaRoute className="mr-2" />
                      Tour Submissions
                    </h3>
                    <div className="space-y-4">
                      {tourSubmissions.map((tour) => (
                        <div key={tour._id} className="bg-cream p-4 rounded-lg shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-charcoal">{tour.name}</h4>
                              <p className="text-sm text-gray-600">Type: {tour.type}</p>
                              <p className="text-sm text-gray-600">Price Range: {tour.priceRange}</p>
                              <p className="text-sm text-gray-600">
                                Status: <span className={`font-medium ${tour.status === 'approved' ? 'text-green-600' : tour.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                                  {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                                </span>
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">{new Date(tour.submittedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Submissions Message */}
                {tourGuideSubmissions.length === 0 && 
                 vehicleSubmissions.length === 0 && 
                 blogSubmissions.length === 0 && 
                 tourSubmissions.length === 0 && (
                  <div className="text-center py-8 text-gray-600">
                    <p>You haven't made any submissions yet.</p>
                    <p className="mt-2">
                      Try registering as a tour guide, adding your vehicle, or submitting a blog post!
                    </p>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'payments' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-charcoal mb-4">Payment History</h2>
                
                {paymentHistory && paymentHistory.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {paymentHistory.map((payment) => (
                            <tr key={payment._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(payment.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{payment.description}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                LKR {payment.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-red-100 text-red-800'}`}
                                >
                                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-600">You don't have any payment history yet.</p>
                    <Link to="/partnership" className="mt-4 inline-block bg-tan text-cream px-4 py-2 rounded-lg hover:bg-gold transition">
                      View Partnership Options
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;