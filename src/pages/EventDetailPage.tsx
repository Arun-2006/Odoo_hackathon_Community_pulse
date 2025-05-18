import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  Edit, 
  Trash, 
  ArrowLeft, 
  Badge, 
  Share, 
  AlertTriangle 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getEvent, deleteEvent, registerForEvent, formatEventDate } from '../services/eventService';
import { Event, EventAttendee, NewEventAttendee } from '../types';
import AttendForm from '../components/events/AttendForm';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAttendForm, setShowAttendForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendees, setAttendees] = useState<EventAttendee[]>([]);
  
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const fetchedEvent = await getEvent(id);
        setEvent(fetchedEvent);
      } catch (err) {
        console.error('Failed to fetch event:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error || !event) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="h-16 w-16 text-error-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
        <p className="text-gray-600 mb-6">{error || 'The event you are looking for does not exist or has been removed.'}</p>
        <Link to="/events" className="btn btn-primary">
          Browse Events
        </Link>
      </div>
    );
  }
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      await deleteEvent(event.id);
      toast.success('Event deleted successfully');
      navigate('/events');
    } catch (err) {
      console.error('Failed to delete event:', err);
      toast.error('Failed to delete event. Please try again later.');
      setIsDeleting(false);
    }
  };
  
  const handleAttend = async (data: NewEventAttendee) => {
    try {
      setIsSubmitting(true);
      await registerForEvent(event.id, data);
      toast.success('Registration successful! You will receive a confirmation email shortly.');
      setShowAttendForm(false);
    } catch (err) {
      console.error('Failed to register for event:', err);
      toast.error('Failed to register for the event. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'garage-sale':
        return 'Garage Sale';
      case 'sports':
        return 'Sports Match';
      case 'community-class':
        return 'Community Class';
      case 'volunteer':
        return 'Volunteer Opportunity';
      case 'exhibition':
        return 'Exhibition';
      case 'festival':
        return 'Festival';
      default:
        return category;
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'garage-sale':
        return 'bg-accent-100 text-accent-800';
      case 'sports':
        return 'bg-primary-100 text-primary-800';
      case 'community-class':
        return 'bg-secondary-100 text-secondary-800';
      case 'volunteer':
        return 'bg-success-100 text-success-800';
      case 'exhibition':
        return 'bg-warning-100 text-warning-800';
      case 'festival':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const isOwner = user && user.id === event.organizer.id;
  const isAdmin = user && user.role === 'admin';
  const canEdit = isOwner || isAdmin;
  const isPending = event.status === 'pending';
  const isRejected = event.status === 'rejected';
  
  return (
    <div>
      {/* Navigation */}
      <div className="mb-6">
        <Link 
          to="/events" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Events
        </Link>
      </div>
      
      {/* Status Alert - Show if pending or rejected */}
      {(isPending || isRejected) && (
        <div className={`mb-6 p-4 rounded-md ${
          isPending ? 'bg-warning-50 border border-warning-200' : 'bg-error-50 border border-error-200'
        }`}>
          <div className="flex items-start">
            <AlertTriangle className={`h-5 w-5 mt-0.5 ${
              isPending ? 'text-warning-500' : 'text-error-500'
            }`} />
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                isPending ? 'text-warning-800' : 'text-error-800'
              }`}>
                {isPending ? 'Event Pending Approval' : 'Event Rejected'}
              </h3>
              <p className="mt-1 text-sm">
                {isPending 
                  ? 'This event is awaiting approval by an administrator and is not yet visible to the public.'
                  : 'This event has been rejected by an administrator and is not visible to the public.'
                }
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Event Details */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
        {/* Event Image */}
        <div className="h-64 md:h-80 bg-gray-200 relative">
          {event.imageUrl ? (
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Calendar className="h-20 w-20 text-gray-400" />
            </div>
          )}
          
          {/* Category Badge */}
          <span className={`absolute top-4 left-4 text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(event.category)}`}>
            {getCategoryLabel(event.category)}
          </span>
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <h1 className="text-3xl font-bold">{event.title}</h1>
            
            {canEdit && (
              <div className="flex gap-2">
                <Link 
                  to={`/events/${event.id}/edit`}
                  className="btn btn-secondary"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
                
                <button 
                  onClick={handleDelete}
                  className="btn btn-danger"
                  disabled={isDeleting}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">About This Event</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {event.description}
                </p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Organizer</h2>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{event.organizer.name}</span>
                  {event.organizer.isVerified && (
                    <Badge className="h-4 w-4 text-primary-600" title="Verified Organizer" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3">When</h2>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-700">
                        {format(new Date(event.startDate), 'EEEE, MMMM d, yyyy')}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3">Where</h2>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-700">{event.location.address}</p>
                    <p className="text-gray-700">
                      {event.location.city}, {event.location.state} {event.location.zipCode}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Call to Action */}
              {event.status === 'approved' && (
                <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
                  <h2 className="text-lg font-semibold mb-2">Interested in attending?</h2>
                  <p className="text-gray-700 mb-4">Register now to join this event!</p>
                  
                  {showAttendForm ? (
                    <AttendForm 
                      onSubmit={handleAttend}
                      isSubmitting={isSubmitting}
                    />
                  ) : (
                    <button
                      onClick={() => setShowAttendForm(true)}
                      className="btn btn-primary w-full"
                    >
                      Register to Attend
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;