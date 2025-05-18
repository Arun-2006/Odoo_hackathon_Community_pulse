import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Search, ArrowRight } from 'lucide-react';
import { getEvents } from '../services/eventService';
import { Event, EventCategory } from '../types';
import EventCard from '../components/events/EventCard';

const HomePage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const events = await getEvents();
        // Sort by start date and limit to 6
        const sorted = events
          .filter(event => event.status === 'approved')
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
          .slice(0, 6);
        setUpcomingEvents(sorted);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load upcoming events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  const categoryCards = [
    {
      category: 'garage-sale',
      label: 'Garage Sales',
      icon: <MapPin className="h-6 w-6" />,
      color: 'bg-accent-500 text-white',
    },
    {
      category: 'sports',
      label: 'Sports Matches',
      icon: <MapPin className="h-6 w-6" />,
      color: 'bg-primary-500 text-white',
    },
    {
      category: 'community-class',
      label: 'Community Classes',
      icon: <MapPin className="h-6 w-6" />,
      color: 'bg-secondary-500 text-white',
    },
    {
      category: 'volunteer',
      label: 'Volunteer',
      icon: <MapPin className="h-6 w-6" />,
      color: 'bg-success-500 text-white',
    },
    {
      category: 'exhibition',
      label: 'Exhibitions',
      icon: <MapPin className="h-6 w-6" />,
      color: 'bg-warning-500 text-white',
    },
    {
      category: 'festival',
      label: 'Festivals',
      icon: <MapPin className="h-6 w-6" />,
      color: 'bg-error-500 text-white',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-primary-900 text-white py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight animate-[fadeIn_0.8s_ease-out]">
              Connect with Your Community
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-100 animate-[fadeIn_1s_ease-out]">
              Discover local events, activities, and opportunities happening right in your neighborhood.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-[fadeIn_1.2s_ease-out]">
              <Link to="/events" className="btn bg-white text-primary-900 hover:bg-gray-100">
                Browse Events
              </Link>
              <Link to="/events/create" className="btn bg-primary-700 text-white hover:bg-primary-800">
                Create Event
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute transform -translate-y-1/2 left-3/4 top-1/4">
            <MapPin className="h-64 w-64" />
          </div>
          <div className="absolute transform translate-y-1/3 -left-24 top-1/2">
            <Calendar className="h-48 w-48" />
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Explore Event Categories</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find exactly what interests you within your community
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryCards.map((card) => (
            <Link 
              key={card.category}
              to={`/events?category=${card.category}`}
              className="card p-6 hover:scale-[1.02] transition-all duration-300"
            >
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{card.label}</h3>
              <p className="text-gray-600 mb-4">
                Discover local {card.label.toLowerCase()} happening in your area.
              </p>
              <div className="flex items-center text-primary-600 font-medium">
                <span>Browse {card.label}</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Upcoming Events Section */}
      <section>
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
            <p className="text-lg text-gray-600">
              Don't miss these upcoming events in your community
            </p>
          </div>
          <Link 
            to="/events" 
            className="hidden sm:flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium"
          >
            <span>View all events</span>
            <ArrowRight className="h-4 w-4" />
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
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">No upcoming events found.</p>
            <Link to="/events/create" className="btn btn-primary">
              Create an Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center sm:hidden">
          <Link 
            to="/events" 
            className="btn btn-primary"
          >
            View All Events
          </Link>
        </div>
      </section>
      
      {/* Feature Call-To-Action */}
      <section className="bg-gray-100 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Create Your Own Event</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have something to share with your community? Create your own event and connect with neighbors who share your interests.
            </p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex flex-col items-center justify-center space-y-6">
                <Calendar className="h-16 w-16 text-primary-600" />
                <h3 className="text-2xl font-semibold text-center">Host a Community Event</h3>
                <p className="text-center text-gray-600">
                  Whether it's a garage sale, sports match, class, or volunteer opportunity, you can organize it and invite your community.
                </p>
                <Link to="/events/create" className="btn btn-primary w-full">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;