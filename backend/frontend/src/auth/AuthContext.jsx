import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axiosInstance';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    let storedRole = localStorage.getItem('role');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedRole && storedUser) {
      // Normalize role on app load
      storedRole = storedRole.charAt(0).toUpperCase() + storedRole.slice(1).toLowerCase();

      setToken(storedToken);
      setRole(storedRole);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/Auth/login', { username, password });
      console.log('Login response:', response.data);

      // Backend returns 'id', not 'userId'
      let { token, role, id, fullName } = response.data;

      if (!token || !role) {
        console.error('Missing token or role in response');
        return { success: false, error: 'Invalid server response' };
      }

      // Normalize role: capitalize first letter (doctor -> Doctor, admin -> Admin)
      role = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

      // Map 'id' to 'userId' for consistency
      const userData = { userId: id, fullName, username, role };

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(token);
      setRole(role);
      setUser(userData);

      console.log('Login successful, role set to:', role);
      console.log('User data:', userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setToken(null);
    setRole(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    role,
    login,
    logout,
    loading,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};