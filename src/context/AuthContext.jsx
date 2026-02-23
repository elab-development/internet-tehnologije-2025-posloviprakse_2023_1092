import React, { createContext, useState, useEffect } from 'react';
import { extractAuthPayload } from './authHelpers.js';
import { authAPI } from '../services/api';


const AuthContext = createContext();

//


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);


  
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Greška pri učitavanju korisnika:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  
  const login = async (email, password) => {
    try {
      const data = await authAPI.login({ email, password });
      const authPayload = extractAuthPayload(data);

      if (!authPayload?.token || !authPayload?.user) {
        throw new Error('Neispravan odgovor servera');
      }
      
      
      localStorage.setItem('token', authPayload.token);
      localStorage.setItem('user', JSON.stringify(authPayload.user));
      
      
      setToken(authPayload.token);
      setUser(authPayload.user);
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  
  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      const authPayload = extractAuthPayload(data);
      
      
      if (authPayload?.token && authPayload?.user) {
        localStorage.setItem('token', authPayload.token);
        localStorage.setItem('user', JSON.stringify(authPayload.user));
        setToken(authPayload.token);
        setUser(authPayload.user);
      }
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  
  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  
  const hasRole = (role) => {
    return user?.role === role;
  };

  
  const isStudent = () => {
    return user?.role === 'student' || user?.role === 'alumni';
  };

  
  const isCompany = () => {
    return user?.role === 'company';
  };

  
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    hasRole,
    isStudent,
    isCompany,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
