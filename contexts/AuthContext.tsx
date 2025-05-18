import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phoneNumber?: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const initAuth = () => {
      try {
        const user = getCurrentUser();
        setState({ user, isLoading: false, error: null });
      } catch (error) {
        setState({ user: null, isLoading: false, error: 'Failed to initialize auth' });
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setState({ ...state, isLoading: true, error: null });
    try {
      const user = await apiLogin(email, password);
      setState({ user, isLoading: false, error: null });
    } catch (error) {
      setState({ ...state, isLoading: false, error: 'Invalid email or password' });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, phoneNumber?: string) => {
    setState({ ...state, isLoading: true, error: null });
    try {
      const user = await apiRegister(name, email, password, phoneNumber);
      setState({ user, isLoading: false, error: null });
    } catch (error) {
      setState({ ...state, isLoading: false, error: 'Registration failed' });
      throw error;
    }
  };

  const logout = async () => {
    setState({ ...state, isLoading: true, error: null });
    try {
      await apiLogout();
      setState({ user: null, isLoading: false, error: null });
    } catch (error) {
      setState({ ...state, isLoading: false, error: 'Logout failed' });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};