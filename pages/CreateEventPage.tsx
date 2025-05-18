import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createEvent } from '../services/eventService';
import { NewEvent } from '../types';
import EventForm from '../components/events/EventForm';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: NewEvent) => {
    try {
      setIsSubmitting(true);
      const event = await createEvent(data);
      toast.success('Event created successfully! It will be visible after approval.');
      navigate(`/events/${event.id}`);
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error('Failed to create event. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Create a New Event</h1>
      <p className="text-gray-600 mb-8">Share your event with the community</p>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <EventForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default CreateEventPage;