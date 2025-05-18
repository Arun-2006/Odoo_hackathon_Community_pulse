import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList,
  PermissionsAndroid,
  Platform
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

// Type definitions
type Event = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  distance?: number;
  creator: string;
  status: 'pending' | 'approved' | 'rejected';
  interestedUsers: Array<{
    name: string;
    email: string;
    phone: string;
    people: number;
  }>;
};

type UserRole = 'user' | 'admin' | 'verified-organizer';

type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isBanned: boolean;
};

const CommunityPulse = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'post' | 'admin'>('events');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser] = useState<AppUser>({
    id: '1',
    name: 'Arun',
    email: 'arun@example.com',
    role: 'admin',
    isBanned: false
  });
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    location: ''
  });

  const [interestForm, setInterestForm] = useState({
    name: '',
    email: '',
    phone: '',
    people: '1'
  });

  useEffect(() => {
    getLocation();

    const sampleEvents: Event[] = [
      {
        id: '1',
        title: 'Community Cleanup',
        description: 'Help clean up the local park!',
        category: 'volunteer',
        date: '2023-07-15',
        time: '09:00',
        location: 'Central Park',
        creator: 'Dhipin',
        status: 'approved',
        interestedUsers: []
      },
      {
        id: '2',
        title: 'Yoga in the Park',
        description: 'Morning yoga session',
        category: 'fitness',
        date: '2023-07-16',
        time: '08:00',
        location: 'Riverside Park',
        creator: 'Arun',
        status: 'pending',
        interestedUsers: []
      }
    ];

    const sampleUsers: AppUser[] = [
      {
        id: '1',
        name: 'Arun',
        email: 'arun@example.com',
        role: 'user',
        isBanned: false
      },
      {
        id: '2',
        name: 'Dhipin',
        email: 'dhipin@example.com',
        role: 'verified-organizer',
        isBanned: false
      },
      {
        id: '3',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        isBanned: false
      }
    ];

    setEvents(sampleEvents);
    setUsers(sampleUsers);
    setIsAdmin(currentUser.role === 'admin');
  }, []);

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Needed',
          message: 'This app needs to access your location to show nearby events.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setError('Location permission denied');
      setLoading(false);
      return;
    }

    setLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLoading(false);
      },
      error => {
        setError(error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 100;
  };

  const handleEventSubmit = () => {
    const newEvent: Event = {
      id: Date.now().toString(),
      ...eventForm,
      creator: currentUser.name,
      status: currentUser.role === 'verified-organizer' ? 'approved' : 'pending',
      interestedUsers: []
    };
    setEvents([...events, newEvent]);
    setEventForm({
      title: '',
      description: '',
      category: '',
      date: '',
      time: '',
      location: ''
    });
    setActiveTab('events');
    Alert.alert('Success', 'Your event has been submitted!');
  };

  const handleInterestSubmit = () => {
    if (!selectedEvent) return;

    const updatedEvent = {
      ...selectedEvent,
      interestedUsers: [...selectedEvent.interestedUsers, {
        ...interestForm,
        people: parseInt(interestForm.people) || 1
      }]
    };

    setEvents(events.map(e => e.id === selectedEvent.id ? updatedEvent : e));
    setSelectedEvent(updatedEvent);
    setInterestForm({
      name: '',
      email: '',
      phone: '',
      people: '1'
    });
    Alert.alert('Success', 'Thanks for your interest!');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Getting your location...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location Error</Text>
          <View style={styles.divider} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={getLocation}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}
        >
          <Text style={styles.tabText}>Browse Events</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'post' && styles.activeTab]}
          onPress={() => setActiveTab('post')}
        >
          <Text style={styles.tabText}>Post Event</Text>
        </TouchableOpacity>
        {isAdmin && (
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'admin' && styles.activeTab]}
            onPress={() => setActiveTab('admin')}
          >
            <Text style={styles.tabText}>Admin</Text>
          </TouchableOpacity>
        )}
      </View>

      {activeTab === 'events' && !selectedEvent && (
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.headerText}>Events Near You</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={getLocation}>
              <Text style={styles.buttonText}>Refresh</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={events.filter(e => e.status === 'approved')}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedEvent(item)}>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View style={styles.divider} />
                  <Text style={styles.description}>{item.description}</Text>
                  <View style={styles.eventFooter}>
                    <Text>{item.date} • {item.location}</Text>
                    <Text>{item.interestedUsers.length} interested</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        </ScrollView>
      )}

      {/* Add other tab views like post, admin etc. here if needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 5
  },
  tabButton: {
    padding: 10,
    borderRadius: 5
  },
  activeTab: {
    backgroundColor: '#4a8cff'
  },
  tabText: {
    color: '#333'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10
  },
  errorText: {
    color: 'red',
    marginBottom: 10
  },
  button: {
    backgroundColor: '#4a8cff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  refreshButton: {
    backgroundColor: '#4a8cff',
    padding: 8,
    borderRadius: 5
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  }
});

export default CommunityPulse;
