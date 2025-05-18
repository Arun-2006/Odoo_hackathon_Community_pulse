export type UserRole = 'user' | 'admin' | 'organizer';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  isVerifiedOrganizer: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EventCategory = 
  | 'garage-sale'
  | 'sports'
  | 'community-class'
  | 'volunteer'
  | 'exhibition'
  | 'festival';

export type EventStatus = 'pending' | 'approved' | 'rejected';

export interface EventLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  location: EventLocation;
  organizer: {
    id: string;
    name: string;
    isVerified: boolean;
  };
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EventAttendee {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  additionalAttendees: number;
  eventId: string;
  userId?: string;
  createdAt: string;
}

export interface NewEventAttendee {
  name: string;
  email: string;
  phoneNumber: string;
  additionalAttendees: number;
}

export interface NewEvent {
  title: string;
  description: string;
  category: EventCategory;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  location: EventLocation;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
}