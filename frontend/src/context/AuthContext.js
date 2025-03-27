import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  
  // using UseEffect to prevent from logging out when refreshing the page
  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      setToken(token);
    }
  }, []);

  const login = (userData) => {
    setToken(userData.token);
    Cookies.set('access_token', userData.token, { expires: 1 });
  };

  const logout = () => {
    setToken(null);
    Cookies.remove('access_token')
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
