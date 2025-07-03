// filepath: frontend/src/components/auth/AuthCallback.jsx

import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      navigate('/login?error=auth_failed');
      return;
    }
    
    const fetchUserData = async () => {
      try {
        // Temporarily set header to fetch user data
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const response = await api.get('/auth/me');
        
        if (response.data) {
          const userData = {
            ...response.data,
            token: token
          };
          
          // This will handle setting state, localStorage, and axios headers correctly
          setCurrentUser(userData);
          
          navigate(userData.role === 'admin' ? '/admin' : '/');
        } else {
          throw new Error("Invalid user data received from /auth/me");
        }
      } catch (error) {
        console.error('❌ Error in auth callback:', error);
        setCurrentUser(null); // Clear any partial auth state
        navigate('/login?error=callback_failed');
      }
    };
    
    fetchUserData();
  }, [searchParams, navigate, setCurrentUser]);

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