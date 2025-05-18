import api from './api';
import { Event, User, EventStatus } from '../types';
import { MOCK_EVENTS, MOCK_USERS } from './mockData';

// In a real app, these would make actual API calls
export const getPendingEvents = async (): Promise<Event[]> => {
  try {
    // Simulate API call
    // const response = await api.get('/admin/events/pending');
    // return response.data;
    
    // For demo purposes
    return MOCK_EVENTS.filter(event => event.status === 'pending');
  } catch (error) {
    console.error('Get pending events error:', error);
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    // Simulate API call
    // const response = await api.get('/admin/users');
    // return response.data;
    
    // For demo purposes
    return MOCK_USERS.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    });
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

export const getUserEventHistory = async (userId: string): Promise<Event[]> => {
  try {
    // Simulate API call
    // const response = await api.get(`/admin/users/${userId}/events`);
    // return response.data;
    
    // For demo purposes
    return MOCK_EVENTS.filter(event => event.organizer.id === userId);
  } catch (error) {
    console.error(`Get user ${userId} event history error:`, error);
    throw error;
  }
};

export const setUserVerifiedStatus = async (userId: string, isVerified: boolean): Promise<User> => {
  try {
    // Simulate API call
    // const response = await api.patch(`/admin/users/${userId}/verified`, { isVerified });
    // return response.data;
    
    // For demo purposes
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    MOCK_USERS[userIndex].isVerifiedOrganizer = isVerified;
    
    const { password, ...userWithoutPassword } = MOCK_USERS[userIndex];
    return userWithoutPassword as User;
  } catch (error) {
    console.error(`Set user ${userId} verified status error:`, error);
    throw error;
  }
};

export const toggleUserBan = async (userId: string): Promise<User> => {
  try {
    // Simulate API call
    // const response = await api.patch(`/admin/users/${userId}/ban`);
    // return response.data;
    
    // For demo purposes
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    MOCK_USERS[userIndex].isBanned = !MOCK_USERS[userIndex].isBanned;
    
    const { password, ...userWithoutPassword } = MOCK_USERS[userIndex];
    return userWithoutPassword as User;
  } catch (error) {
    console.error(`Toggle user ${userId} ban status error:`, error);
    throw error;
  }
};

export const updateEventStatus = async (eventId: string, status: EventStatus): Promise<Event> => {
  try {
    // Simulate API call
    // const response = await api.patch(`/admin/events/${eventId}/status`, { status });
    // return response.data;
    
    // For demo purposes
    const eventIndex = MOCK_EVENTS.findIndex(e => e.id === eventId);
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }
    
    MOCK_EVENTS[eventIndex].status = status;
    MOCK_EVENTS[eventIndex].updatedAt = new Date().toISOString();
    
    return MOCK_EVENTS[eventIndex];
  } catch (error) {
    console.error(`Update event ${eventId} status error:`, error);
    throw error;
  }
};