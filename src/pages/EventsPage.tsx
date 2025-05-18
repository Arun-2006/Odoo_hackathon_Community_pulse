import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getEvents } from '../services/eventService';
import { Event, EventCategory } from '../types';
import EventCard from '../components/events/EventCard';
import { Filter, Search, Calendar, MapPin, X } from 'lucide-react';

const EventsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category') as EventCategory | null;
  
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(categoryParam);
  
  const categories = [
    { value: 'garage-sale', label: 'Garage Sales' },
    { value: 'sports', label: 'Sports Matches' },
    { value: 'community-class', label: 'Community Classes' },
    { value: 'volunteer', label: 'Volunteer Opportunities' },
    { value: 'exhibition', label: 'Exhibitions' },
    { value: 'festival', label: 'Festivals' },
  ];
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const fetchedEvents = await getEvents();
        // Only show approved events to regular users
        const approvedEvents = fetchedEvents.filter(event => event.status === 'approved');
        setEvents(approvedEvents);
        applyFilters(approvedEvents, selectedCategory, searchTerm);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [selectedCategory]);
  
  useEffect(() => {
    // Update selected category when URL param changes
    setSelectedCategory(categoryParam);
  }, [categoryParam]);
  
  const applyFilters = (eventList: Event[], category: EventCategory | null, search: string) => {
    let filtered = [...eventList];
    
    // Apply category filter
    if (category) {
      filtered = filtered.filter(event => event.category === category);
    }
    
    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location.city.toLowerCase().includes(searchLower) ||
        event.location.address.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredEvents(filtered);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(events, selectedCategory, value);
  };
  
  const handleCategoryChange = (category: EventCategory | null) => {
    setSelectedCategory(category);
    
    // Update URL
    if (category) {
      navigate(`/events?category=${category}`);
    } else {
      navigate('/events');
    }
    
    applyFilters(events, category, searchTerm);
  };
  
  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchTerm('');
    navigate('/events');
    setFilteredEvents(events);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Community Events</h1>
        <p className="text-gray-600">Discover and join events happening in your area</p>
      </div>
      
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search events by title, description, or location..."
            className="input pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategoryChange(
                selectedCategory === category.value ? null : category.value as EventCategory
              )}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-primary-100 text-primary-800 border-2 border-primary-300'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-2 border-transparent'
              }`}
            >
              {category.label}
            </button>
          ))}
          
          {(selectedCategory || searchTerm) && (
            <button
              onClick={clearFilters}
              className="rounded-full px-4 py-2 text-sm font-medium bg-error-100 text-error-800 hover:bg-error-200 transition-colors flex items-center space-x-1"
            >
              <X className="h-4 w-4" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Events List */}
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
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg p-8">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No events found</h3>
          <p className="text-gray-600 mb-6">
            {selectedCategory || searchTerm 
              ? "There are no events matching your filters. Try changing your search criteria."
              : "There are no events available at the moment."}
          </p>
          {(selectedCategory || searchTerm) && (
            <button
              onClick={clearFilters}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-gray-600">
            Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            {selectedCategory && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EventsPage;