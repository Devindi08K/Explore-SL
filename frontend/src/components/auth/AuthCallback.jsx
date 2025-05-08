// filepath: frontend/src/components/auth/AuthCallback.jsx

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';

const AuthCallback = ({ onLoginSuccess }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Get user data
      const fetchUserData = async () => {
        try {
          const response = await api.get('/auth/me');
          const userData = response.data;
          
          localStorage.setItem('user', JSON.stringify(userData));
          onLoginSuccess(userData);
          
          navigate(userData.role === 'admin' ? '/admin' : '/');
        } catch (error) {
          console.error('Error fetching user data:', error);
          navigate('/login');
        }
      };
      
      fetchUserData();
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, onLoginSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-tan border-t-gold mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing login...</p>
      </div>
    </div>
  );
};

export default AuthCallback;