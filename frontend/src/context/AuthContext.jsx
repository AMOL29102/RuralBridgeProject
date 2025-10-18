import { createContext, useState, useEffect } from 'react';
import API, { setToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const login = async (loginIdentifier, password) => {
    // The key here must match what the backend expects.
    const { data } = await API.post('/api/auth/login', { loginIdentifier, password });
    console.log(data)
    
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    setToken(data.token);
  };

  const register = async (userData) => {
    const { data } = await API.post('/api/auth/register', userData);
    // **THE FIX IS HERE**
    // Check if the response includes a token. Only buyers will get one.
    if (data.token) {
      // This is a buyer, log them in.
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      setToken(data.token);
    }
    // If there's no token, it's a seller. Do nothing here.
    // The RegisterPage will handle showing the success message.
    return data;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;