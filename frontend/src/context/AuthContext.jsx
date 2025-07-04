import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import api from '../utils/api';

export const AuthContext = createContext();

// Add this export - it makes the context easily usable
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const updateUserState = useCallback((user) => {
    if (user && user.token) {
      // Set the user state
      setCurrentUser(user);
      // Synchronize localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.token);
    } else {
      // Clear the user state
      setCurrentUser(null);
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, []);

  useEffect(() => {
    // This effect runs only once on app start
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        updateUserState(user);
      } else {
        updateUserState(null);
      }
    } catch (error) {
      console.error("Failed to initialize auth state:", error);
      updateUserState(null);
    } finally {
      setIsAuthReady(true);
    }
  }, [updateUserState]);

  const logout = useCallback(() => {
    updateUserState(null);
  }, [updateUserState]);

  const value = {
    currentUser,
    isAuthReady,
    logout,
    user: currentUser,
    setCurrentUser: updateUserState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};