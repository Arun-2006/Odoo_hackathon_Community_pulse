import api from './api';
import { User } from '../types';

// For demo purposes, using mock data and localStorage
const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phoneNumber: '555-123-4567',
    role: 'user',
    isVerifiedOrganizer: false,
    isBanned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    phoneNumber: '555-987-6543',
    role: 'admin',
    isVerifiedOrganizer: true,
    isBanned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// In a real app, these would make actual API calls
export const login = async (email: string, password: string): Promise<User> => {
  try {
    // Simulate API call
    // const response = await api.post('/auth/login', { email, password });
    // return response.data;
    
    // For demo purposes
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    return userWithoutPassword as User;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (
  name: string, 
  email: string, 
  password: string, 
  phoneNumber?: string
): Promise<User> => {
  try {
    // Simulate API call
    // const response = await api.post('/auth/register', { name, email, password, phoneNumber });
    // return response.data;
    
    // For demo purposes
    if (MOCK_USERS.some(u => u.email === email)) {
      throw new Error('Email already in use');
    }
    
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      name,
      email,
      password,
      phoneNumber,
      role: 'user' as const,
      isVerifiedOrganizer: false,
      isBanned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_USERS.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    return userWithoutPassword as User;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    // Simulate API call
    // await api.post('/auth/logout');
    
    // For demo purposes
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};