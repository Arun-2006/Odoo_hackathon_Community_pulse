import api from './api';
import { Event, NewEvent, EventAttendee, NewEventAttendee, EventCategory, EventStatus } from '../types';
import { format } from 'date-fns';

// Mock data for demo purposes
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Community Garage Sale',
    description: 'Join us for a community-wide garage sale! Find treasures and meet your neighbors.',
    category: 'garage-sale',
    imageUrl: 'https://images.pexels.com/photos/5759935/pexels-photo-5759935.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    startDate: '2025-06-15T09:00:00Z',
    endDate: '2025-06-15T16:00:00Z',
    location: {
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      latitude: 37.7749,
      longitude: -122.4194,
    },
    organizer: {
      id: '1',
      name: 'John Doe',
      isVerified: false,
    },
    status: 'approved',
    createdAt: '2025-05-15T12:00:00Z',
    updatedAt: '2025-05-15T12:00:00Z',
  },
  {
    id: '2',
    title: 'Neighborhood Soccer Tournament',
    description: 'Annual soccer tournament for all ages. Form teams or join existing ones!',
    category: 'sports',
    imageUrl: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    startDate: '2025-07-10T10:00:00Z',
    endDate: '2025-07-10T18:00:00Z',
    location: {
      address: '456 Park Ave',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      latitude: 37.7739,
      longitude: -122.4312,
    },
    organizer: {
      id: '2',
      name: 'Admin User',
      isVerified: true,
    },
    status: 'approved',
    createdAt: '2025-06-01T12:00:00Z',
    updatedAt: '2025-06-01T12:00:00Z',
  },
  {
    id: '3',
    title: 'Community Yoga Class',
    description: 'Free yoga class for all levels. Bring your own mat!',
    category: 'community-class',
    imageUrl: 'https://images.pexels.com/photos/8436586/pexels-photo-8436586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    startDate: '2025-06-20T18:00:00Z',
    endDate: '2025-06-20T19:30:00Z',
    location: {
      address: '789 Oak St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      latitude: 37.7729,
      longitude: -122.4292,
    },
    organizer: {
      id: '1',
      name: 'John Doe',
      isVerified: false,
    },
    status: 'pending',
    createdAt: '2025-06-05T12:00:00Z',
    updatedAt: '2025-06-05T12:00:00Z',
  },
];

const MOCK_ATTENDEES: EventAttendee[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: '555-123-7890',
    additionalAttendees: 2,
    eventId: '1',
    userId: '3',
    createdAt: '2025-05-20T10:30:00Z',
  },
  {
    id: '2',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phoneNumber: '555-987-1234',
    additionalAttendees: 0,
    eventId: '1',
    createdAt: '2025-05-22T14:15:00Z',
  },
];

// In a real app, these would make actual API calls
export const getEvents = async (
  category?: EventCategory,
  status?: EventStatus
): Promise<Event[]> => {
  try {
    // Simulate API call
    // const response = await api.get('/events', { params: { category, status } });
    // return response.data;
    
    // For demo purposes
    let filteredEvents = [...MOCK_EVENTS];
    
    if (category) {
      filteredEvents = filteredEvents.filter(event => event.category === category);
    }
    
    if (status) {
      filteredEvents = filteredEvents.filter(event => event.status === status);
    }
    
    return filteredEvents;
  } catch (error) {
    console.error('Get events error:', error);
    throw error;
  }
};

export const getEvent = async (id: string): Promise<Event> => {
  try {
    // Simulate API call
    // const response = await api.get(`/events/${id}`);
    // return response.data;
    
    // For demo purposes
    const event = MOCK_EVENTS.find(e => e.id === id);
    if (!event) {
      throw new Error('Event not found');
    }
    return event;
  } catch (error) {
    console.error(`Get event ${id} error:`, error);
    throw error;
  }
};

export const createEvent = async (event: NewEvent): Promise<Event> => {
  try {
    // Simulate API call
    // const response = await api.post('/events', event);
    // return response.data;
    
    // For demo purposes
    const newEvent: Event = {
      id: String(MOCK_EVENTS.length + 1),
      ...event,
      organizer: {
        id: '1', // Assuming current user
        name: 'John Doe',
        isVerified: false,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_EVENTS.push(newEvent);
    return newEvent;
  } catch (error) {
    console.error('Create event error:', error);
    throw error;
  }
};

export const updateEvent = async (id: string, event: Partial<NewEvent>): Promise<Event> => {
  try {
    // Simulate API call
    // const response = await api.put(`/events/${id}`, event);
    // return response.data;
    
    // For demo purposes
    const eventIndex = MOCK_EVENTS.findIndex(e => e.id === id);
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }
    
    const updatedEvent = {
      ...MOCK_EVENTS[eventIndex],
      ...event,
      status: 'pending', // Reset to pending on update
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_EVENTS[eventIndex] = updatedEvent;
    return updatedEvent;
  } catch (error) {
    console.error(`Update event ${id} error:`, error);
    throw error;
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    // Simulate API call
    // await api.delete(`/events/${id}`);
    
    // For demo purposes
    const eventIndex = MOCK_EVENTS.findIndex(e => e.id === id);
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }
    
    MOCK_EVENTS.splice(eventIndex, 1);
  } catch (error) {
    console.error(`Delete event ${id} error:`, error);
    throw error;
  }
};

export const updateEventStatus = async (id: string, status: EventStatus): Promise<Event> => {
  try {
    // Simulate API call
    // const response = await api.patch(`/events/${id}/status`, { status });
    // return response.data;
    
    // For demo purposes
    const eventIndex = MOCK_EVENTS.findIndex(e => e.id === id);
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }
    
    const updatedEvent = {
      ...MOCK_EVENTS[eventIndex],
      status,
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_EVENTS[eventIndex] = updatedEvent;
    return updatedEvent;
  } catch (error) {
    console.error(`Update event ${id} status error:`, error);
    throw error;
  }
};

export const getEventAttendees = async (eventId: string): Promise<EventAttendee[]> => {
  try {
    // Simulate API call
    // const response = await api.get(`/events/${eventId}/attendees`);
    // return response.data;
    
    // For demo purposes
    return MOCK_ATTENDEES.filter(attendee => attendee.eventId === eventId);
  } catch (error) {
    console.error(`Get event ${eventId} attendees error:`, error);
    throw error;
  }
};

export const registerForEvent = async (
  eventId: string, 
  attendee: NewEventAttendee
): Promise<EventAttendee> => {
  try {
    // Simulate API call
    // const response = await api.post(`/events/${eventId}/attendees`, attendee);
    // return response.data;
    
    // For demo purposes
    const newAttendee: EventAttendee = {
      id: String(MOCK_ATTENDEES.length + 1),
      ...attendee,
      eventId,
      createdAt: new Date().toISOString(),
    };
    
    MOCK_ATTENDEES.push(newAttendee);
    
    // Simulate sending notification
    console.log(`Notification sent to ${attendee.email} for event registration`);
    
    return newAttendee;
  } catch (error) {
    console.error(`Register for event ${eventId} error:`, error);
    throw error;
  }
};

export const sendEventNotification = async (
  eventId: string, 
  type: 'reminder' | 'update' | 'cancellation'
): Promise<void> => {
  try {
    // Simulate API call
    // await api.post(`/events/${eventId}/notifications`, { type });
    
    // For demo purposes
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    
    const attendees = MOCK_ATTENDEES.filter(a => a.eventId === eventId);
    
    console.log(`Sent ${type} notification for event "${event.title}" to ${attendees.length} attendees`);
  } catch (error) {
    console.error(`Send event ${eventId} notification error:`, error);
    throw error;
  }
};

// Helper function to format date for display
export const formatEventDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM d, yyyy h:mm a');
};