import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Calendar, CheckCircle, X, Eye, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getPendingEvents, updateEventStatus } from '../../services/adminService';
import { Event } from '../../types';
import { formatEventDate } from '../../services/eventService';

const EventsApprovalPage = () => {
  const { user } = useAuth();
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPendingEvents = async () => {
      try {
        setIsLoading(true);
        const events = await getPendingEvents();
        setPendingEvents(events);
      } catch (err) {
        console.error('Failed to fetch pending events:', err);
        setError('Failed to load pending events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.role === 'admin') {
      fetchPendingEvents();
    }
  }, [user]);
  
  const handleApprove = async (eventId: string) => {
    try {
      await updateEventStatus(eventId, 'approved');
      setPendingEvents(pendingEvents.filter(event => event.id !== eventId));
      toast.success('Event approved successfully');
    } catch (err) {
      console.error('Failed to approve event:', err);
      toast.error('Failed to approve event. Please try again.');
    }
  };
  
  const handleReject = async (eventId: string) => {
    try {
      await updateEventStatus(eventId, 'rejected');
      setPendingEvents(pendingEvents.filter(event => event.id !== eventId));
      toast.success('Event rejected');
    } catch (err) {
      console.error('Failed to reject event:', err);
      toast.error('Failed to reject event. Please try again.');
    }
  };
  
  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="h-16 w-16 text-error-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Events Approval</h1>
          <p className="text-gray-600">Review and manage pending events</p>
        </div>
        
        <Link to="/admin" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-error-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : pendingEvents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg p-8">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Pending Events</h3>
          <p className="text-gray-600 mb-6">
            There are no events waiting for approval at the moment.
          </p>
          <Link to="/admin" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organizer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                        {event.imageUrl ? (
                          <img 
                            src={event.imageUrl} 
                            alt={event.title} 
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <Calendar className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {event.location.city}, {event.location.state}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.organizer.name}</div>
                    <div className="text-sm text-gray-500">
                      {event.organizer.isVerified ? 'Verified Organizer' : 'Unverified'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatEventDate(event.startDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                      {event.category.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/events/${event.id}`}
                        className="text-primary-600 hover:text-primary-900 bg-primary-50 hover:bg-primary-100 p-2 rounded-full transition-colors"
                        title="View Event"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleApprove(event.id)}
                        className="text-success-600 hover:text-success-900 bg-success-50 hover:bg-success-100 p-2 rounded-full transition-colors"
                        title="Approve Event"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleReject(event.id)}
                        className="text-error-600 hover:text-error-900 bg-error-50 hover:bg-error-100 p-2 rounded-full transition-colors"
                        title="Reject Event"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventsApprovalPage;