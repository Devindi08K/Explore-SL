import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { FaUserCircle, FaEnvelope, FaCalendar, FaMapMarkerAlt, FaHistory } from 'react-icons/fa';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [activities, setActivities] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const [profileRes, activitiesRes] = await Promise.all([
                api.get('/users/profile'),
                api.get('/users/activities')
            ]);
            setProfile(profileRes.data);
            setActivities(activitiesRes.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-cream flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-tan border-t-gold"/>
        </div>;
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
                            <p className="text-sm text-gray-500">
                                <FaCalendar className="inline mr-2" />
                                Joined {new Date(profile?.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-tan mb-6">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-3 ${activeTab === 'profile' ? 'border-b-2 border-gold text-gold' : 'text-charcoal'}`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('activity')}
                        className={`px-6 py-3 ${activeTab === 'activity' ? 'border-b-2 border-gold text-gold' : 'text-charcoal'}`}
                    >
                        Activity History
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'profile' ? (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-charcoal mb-6">Profile Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Username</label>
                                <p className="mt-1 text-charcoal">{profile?.userName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                <p className="mt-1 text-charcoal">{profile?.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Role</label>
                                <p className="mt-1 text-charcoal capitalize">{profile?.role}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-charcoal mb-6">Recent Activity</h2>
                        {activities.length > 0 ? (
                            <div className="space-y-4">
                                {activities.map((activity, index) => (
                                    <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                                        <p className="text-charcoal">{activity.description}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {new Date(activity.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center py-4">No recent activity</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;