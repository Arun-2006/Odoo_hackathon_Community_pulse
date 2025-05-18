import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  creator: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isBanned: boolean;
};

export default function CommunityPulseApp() {
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'events' | 'submit' | 'admin'>('events');
  const [newEvent, setNewEvent] = useState<Partial<Event>>({});

  useEffect(() => {
    // Dummy data for testing
    setEvents([
      {
        id: '1',
        title: 'Beach Cleanup',
        description: 'Join us to clean the beach!',
        date: '2025-05-20',
        time: '10:00 AM',
        location: 'Marina Beach',
        status: 'approved',
        creator: 'user1@example.com',
      },
      {
        id: '2',
        title: 'Tree Planting',
        description: 'Let’s plant some trees together.',
        date: '2025-05-21',
        time: '09:00 AM',
        location: 'City Park',
        status: 'pending',
        creator: 'user2@example.com',
      },
    ]);

    setUsers([
      {
        id: 'u1',
        name: 'Alice',
        email: 'user1@example.com',
        role: 'user',
        isBanned: false,
      },
      {
        id: 'u2',
        name: 'Bob',
        email: 'user2@example.com',
        role: 'user',
        isBanned: false,
      },
    ]);

    setLoading(false);
  }, []);

  const renderEvent = ({ item }: { item: Event }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>{item.date} • {item.time}</Text>
      <Text>{item.location}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );

  const handleSubmit = () => {
    if (
      newEvent.title &&
      newEvent.description &&
      newEvent.date &&
      newEvent.time &&
      newEvent.location
    ) {
      const event: Event = {
        id: Date.now().toString(),
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        time: newEvent.time,
        location: newEvent.location,
        status: 'pending',
        creator: 'user1@example.com',
      };
      setEvents(prev => [...prev, event]);
      setNewEvent({});
      alert('Event submitted for approval!');
    } else {
      alert('Please fill in all fields.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab('events')} style={[styles.tab, activeTab === 'events' && styles.activeTab]}>
          <Text style={styles.tabText}>Browse Events</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('submit')} style={[styles.tab, activeTab === 'submit' && styles.activeTab]}>
          <Text style={styles.tabText}>Post Event</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('admin')} style={[styles.tab, activeTab === 'admin' && styles.activeTab]}>
          <Text style={styles.tabText}>Admin Panel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'events' && (
          <FlatList
            data={events.filter(e => e.status === 'approved')}
            keyExtractor={item => item.id}
            renderItem={renderEvent}
          />
        )}

        {activeTab === 'submit' && (
          <View>
            <TextInput
              placeholder="Title"
              value={newEvent.title}
              onChangeText={text => setNewEvent(prev => ({ ...prev, title: text }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              value={newEvent.description}
              onChangeText={text => setNewEvent(prev => ({ ...prev, description: text }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Date (YYYY-MM-DD)"
              value={newEvent.date}
              onChangeText={text => setNewEvent(prev => ({ ...prev, date: text }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Time (e.g., 10:00 AM)"
              value={newEvent.time}
              onChangeText={text => setNewEvent(prev => ({ ...prev, time: text }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Location"
              value={newEvent.location}
              onChangeText={text => setNewEvent(prev => ({ ...prev, location: text }))}
              style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit Event</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'admin' && (
          <View>
            <Text style={styles.sectionHeader}>Pending Events</Text>
            {events.filter(e => e.status === 'pending').map(event => (
              <View key={event.id} style={styles.card}>
                <Text style={styles.cardTitle}>{event.title}</Text>
                <Text>{event.description}</Text>
                <Text>{event.date} • {event.time} • {event.location}</Text>
                <Text>By: {event.creator}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: 'green' }]}
                    onPress={() =>
                      setEvents(prev => prev.map(e => e.id === event.id ? { ...e, status: 'approved' } : e))
                    }
                  >
                    <Text style={styles.buttonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: 'red' }]}
                    onPress={() =>
                      setEvents(prev => prev.map(e => e.id === event.id ? { ...e, status: 'rejected' } : e))
                    }
                  >
                    <Text style={styles.buttonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <Text style={styles.sectionHeader}>Users</Text>
            {users.map(user => (
              <View key={user.id} style={styles.card}>
                <Text style={styles.cardTitle}>{user.name}</Text>
                <Text>{user.email}</Text>
                <Text>Role: {user.role}</Text>
                <Text>Status: {user.isBanned ? 'Banned' : 'Active'}</Text>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: user.isBanned ? 'green' : 'red' }]}
                  onPress={() =>
                    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isBanned: !u.isBanned } : u))
                  }
                >
                  <Text style={styles.buttonText}>{user.isBanned ? 'Unban' : 'Ban'}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, backgroundColor: '#f2f2f2' },
  tabs: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  tab: { padding: 10, backgroundColor: '#ccc', borderRadius: 8 },
  activeTab: { backgroundColor: '#007BFF' },
  tabText: { color: '#fff', fontWeight: 'bold' },
  content: { paddingHorizontal: 15 },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 1,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
