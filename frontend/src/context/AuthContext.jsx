import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import api from '../utils/api';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // This is the single, reliable function for updating the user's auth state.
  const updateUserState = useCallback((userData) => {
    if (userData && userData.token) {
      // 1. Set the user in the application's state
      setCurrentUser(userData);
      // 2. Store the user object and token in localStorage to persist the session
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);
    } else {
      // 1. Clear the user from the application's state
      setCurrentUser(null);
      // 2. Remove the user and token from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, []);

  // This effect runs only once when the app starts to restore the session.
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        // If a user is found in storage, restore their session.
        updateUserState(user);
      }
    } catch (error) {
      console.error("Failed to parse stored user, clearing auth state:", error);
      updateUserState(null); // Clear corrupted data
    } finally {
      // Signal that the authentication check is complete.
      setIsAuthReady(true);
    }
  }, [updateUserState]);

  // The logout function simply clears the user state.
  const logout = useCallback(() => {
    updateUserState(null);
  }, [updateUserState]);

  // The value provided to the rest of the app.
  const value = {
    currentUser,
    isAuthReady,
    setCurrentUser: updateUserState, // Expose the update function as setCurrentUser
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};