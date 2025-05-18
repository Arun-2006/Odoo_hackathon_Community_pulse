import { Link } from 'react-router-dom';
import { formatEventDate } from '../../services/eventService';
import { Event } from '../../types';
import { Calendar, MapPin, User, Badge, Clock, ArrowRight } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Approval';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'approved':
        return 'bg-success-100 text-success-800';
      case 'rejected':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card overflow-hidden group hover:translate-y-[-4px] transition-all duration-300">
      {/* Image */}
      <div className="h-48 overflow-hidden relative">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Category badge */}
        <span className={`absolute top-4 left-4 text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(event.category)}`}>
          {getCategoryLabel(event.category)}
        </span>
        
        {/* Status badge (if not approved) */}
        {event.status !== 'approved' && (
          <span className={`absolute top-4 right-4 text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(event.status)}`}>
            {getStatusLabel(event.status)}
          </span>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{event.title}</h3>
        
        <div className="mb-3 space-y-2">
          <div className="flex items-start space-x-2">
            <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
            <span className="text-sm text-gray-600">
              {formatEventDate(event.startDate)}
            </span>
          </div>
          
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
            <span className="text-sm text-gray-600 line-clamp-1">
              {event.location.address}, {event.location.city}
            </span>
          </div>
          
          <div className="flex items-start space-x-2">
            <User className="h-4 w-4 text-gray-500 mt-0.5" />
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-600">
                {event.organizer.name}
              </span>
              {event.organizer.isVerified && (
                <Badge className="h-3 w-3 text-primary-600" />
              )}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <Link 
          to={`/events/${event.id}`} 
          className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
        >
          <span>View details</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default EventCard;