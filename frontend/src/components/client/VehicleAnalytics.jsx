
import React, { useState, useEffect } from 'react';
import { FaEye, FaEnvelope, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import api from '../../utils/api';

const VehicleAnalytics = ({ vehicleId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availabilityCalendar, setAvailabilityCalendar] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('available');
  
  useEffect(() => {
    fetchAnalytics();
  }, [vehicleId]);
  
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/vehicles/${vehicleId}/analytics`);
      setAnalytics(response.data);
      
      // Also fetch availability calendar for premium users
      try {
        const calendarResponse = await api.get(`/vehicles/${vehicleId}/availability`);
        if (calendarResponse.data.calendar) {
          setAvailabilityCalendar(calendarResponse.data.calendar);
        }
      } catch (calendarError) {
        console.log('Calendar data not available', calendarError);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Could not load analytics. Premium subscription may be required.');
    } finally {
      setLoading(false);
    }
  };
  
  const updateAvailability = async () => {
    if (!selectedDate) return;
    
    try {
      await api.post(`/vehicles/${vehicleId}/availability`, {
        dateKey: selectedDate,
        status: selectedStatus
      });
      
      // Update local state to reflect the change
      setAvailabilityCalendar(prev => ({
        ...prev,
        [selectedDate]: selectedStatus
      }));
      
      setSelectedDate('');
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };
  
  if (loading) return <div className="animate-pulse p-4 bg-gray-100 rounded-lg">Loading analytics...</div>;
  
  if (error) return (
    <div className="p-4 bg-red-50 rounded-lg border border-red-100 text-red-700">
      {error}
    </div>
  );
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-tan/10 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Views</p>
              <p className="text-xl font-bold text-charcoal">{analytics.viewCount}</p>
            </div>
            <FaEye className="text-tan text-xl" />
          </div>
        </div>
        
        <div className="bg-tan/10 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Inquiries</p>
              <p className="text-xl font-bold text-charcoal">{analytics.inquiryCount}</p>
            </div>
            <FaEnvelope className="text-tan text-xl" />
          </div>
        </div>
        
        <div className="bg-tan/10 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Conversion Rate</p>
              <p className="text-xl font-bold text-charcoal">
                {analytics.viewCount > 0 
                  ? `${((analytics.inquiryCount / analytics.viewCount) * 100).toFixed(1)}%` 
                  : '0%'}
              </p>
            </div>
            <FaChartLine className="text-tan text-xl" />
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex items-center mb-3">
          <FaCalendarAlt className="text-tan mr-2" />
          <h3 className="text-md font-semibold">Availability Calendar</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1">Set Availability</label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-tan/50 rounded p-2 flex-grow text-sm"
                min={new Date().toISOString().split('T')[0]}
              />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-tan/50 rounded p-2 text-sm"
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <button
              onClick={updateAvailability}
              className="mt-2 bg-tan text-white px-3 py-1 rounded text-sm hover:bg-gold"
              disabled={!selectedDate}
            >
              Update
            </button>
          </div>
          
          <div>
            <h4 className="text-xs font-medium mb-1">Current Availability</h4>
            <div className="max-h-32 overflow-y-auto border border-gray-200 rounded p-2">
              {Object.keys(availabilityCalendar).length > 0 ? (
                <ul className="space-y-1">
                  {Object.entries(availabilityCalendar)
                    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
                    .map(([date, status]) => (
                      <li key={date} className="text-xs flex justify-between">
                        <span>{new Date(date).toLocaleDateString()}</span>
                        <span className={`font-medium ${
                          status === 'available' 
                            ? 'text-green-600' 
                            : status === 'booked' 
                              ? 'text-blue-600' 
                              : 'text-red-600'
                        }`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500">No availability set yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleAnalytics;