import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getEvent, updateEvent } from '../services/eventService';
import { Event, NewEvent } from '../types';
import EventForm from '../components/events/EventForm';
import { useAuth } from '../hooks/useAuth';
import { AlertTriangle } from 'lucide-react';

const EditEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const fetchedEvent = await getEvent(id);
        setEvent(fetchedEvent);
        
        // Check if user is authorized to edit
        if (user && (user.id === fetchedEvent.organizer.id || user.role === 'admin')) {
          // User is authorized
        } else {
          setError('You are not authorized to edit this event.');
          setTimeout(() => navigate(`/events/${id}`), 3000);
        }
      } catch (err) {
        console.error('Failed to fetch event:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [id, user, navigate]);
  
  const handleSubmit = async (data: NewEvent) => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      await updateEvent(id, data);
      toast.success('Event updated successfully! Changes will be visible after approval.');
      navigate(`/events/${id}`);
    } catch (error) {
      console.error('Failed to update event:', error);
      toast.error('Failed to update event. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error || !event) {
    return (
      <div className="text-center py-16 bg-error-50 rounded-lg p-8">
        <AlertTriangle className="h-16 w-16 text-error-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p className="text-gray-700 mb-6">{error || 'The event you are trying to edit does not exist or has been removed.'}</p>
        <button
          onClick={() => navigate('/events')}
          className="btn btn-primary"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Edit Event</h1>
      <p className="text-gray-600 mb-8">Make changes to your event</p>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <EventForm 
          initialValues={{
            title: event.title,
            description: event.description,
            category: event.category,
            imageUrl: event.imageUrl,
            startDate: event.startDate,
            endDate: event.endDate,
            location: event.location,
          }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditEventPage;