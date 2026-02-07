import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth mora biti korišten unutar AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const extractAuthPayload = (data) => {
    const payload = data?.data ?? data?.user ?? data;
    const tokenFromResponse = data?.token ?? payload?.token;
    const userFromResponse = payload?.user ?? payload;

    if (userFromResponse && userFromResponse.token) {
      const { token: embeddedToken, ...rest } = userFromResponse;
      return {
        token: tokenFromResponse || embeddedToken,
        user: rest
      };
    }

    return { token: tokenFromResponse, user: userFromResponse };
  };

  // Učitaj korisnika iz localStorage pri mount-u
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

  // Login funkcija
  const login = async (email, password) => {
    try {
      const data = await authAPI.login({ email, password });
      const authPayload = extractAuthPayload(data);

      if (!authPayload?.token || !authPayload?.user) {
        throw new Error('Neispravan odgovor servera');
      }
      
      // Sačuvaj u localStorage
      localStorage.setItem('token', authPayload.token);
      localStorage.setItem('user', JSON.stringify(authPayload.user));
      
      // Postavi u state
      setToken(authPayload.token);
      setUser(authPayload.user);
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register funkcija
  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      const authPayload = extractAuthPayload(data);
      
      // Ako backend automatski loguje korisnika nakon registracije
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

  // Logout funkcija
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Update user info (nakon edit profila)
  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Proveri da li je korisnik ulogovan
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // Proveri rolu korisnika
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Proveri da li je student/alumni
  const isStudent = () => {
    return user?.role === 'student' || user?.role === 'alumni';
  };

  // Proveri da li je kompanija
  const isCompany = () => {
    return user?.role === 'company';
  };

  // Proveri da li je admin
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
