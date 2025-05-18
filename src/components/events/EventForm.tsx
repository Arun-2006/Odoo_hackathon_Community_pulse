import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NewEvent, EventCategory } from '../../types';
import { Calendar, Clock, MapPin, Info, Image, Tag } from 'lucide-react';

const eventSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000, 'Description cannot exceed 1000 characters'),
  category: z.enum(['garage-sale', 'sports', 'community-class', 'volunteer', 'exhibition', 'festival'] as [EventCategory, ...EventCategory[]]),
  imageUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  location: z.object({
    address: z.string().min(5, 'Address must be at least 5 characters'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().min(5, 'ZIP code is required'),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialValues?: Partial<NewEvent>;
  onSubmit: (data: NewEvent) => void;
  isSubmitting: boolean;
}

const EventForm = ({ initialValues, onSubmit, isSubmitting }: EventFormProps) => {
  const [showImagePreview, setShowImagePreview] = useState(!!initialValues?.imageUrl);
  
  const defaultValues: Partial<EventFormValues> = {
    title: '',
    description: '',
    category: 'garage-sale',
    imageUrl: '',
    startDate: '',
    endDate: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      latitude: 0,
      longitude: 0,
    },
    ...initialValues,
  };

  const { 
    register, 
    handleSubmit, 
    control,
    formState: { errors }, 
    watch,
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues,
  });

  const imageUrl = watch('imageUrl');

  const categoryOptions = [
    { value: 'garage-sale', label: 'Garage Sale' },
    { value: 'sports', label: 'Sports Match' },
    { value: 'community-class', label: 'Community Class' },
    { value: 'volunteer', label: 'Volunteer Opportunity' },
    { value: 'exhibition', label: 'Exhibition' },
    { value: 'festival', label: 'Festival' },
  ];

  const onFormSubmit = (data: EventFormValues) => {
    // Add default coordinates if not provided
    if (!data.location.latitude) data.location.latitude = 0;
    if (!data.location.longitude) data.location.longitude = 0;
    
    onSubmit(data as NewEvent);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Event Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Info size={20} /> 
          Basic Information
        </h3>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Event Title *
          </label>
          <input
            id="title"
            type="text"
            className={`input ${errors.title ? 'border-error-500 focus:ring-error-500' : ''}`}
            placeholder="e.g., Community Garage Sale"
            {...register('title')}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-error-600">{errors.title.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            rows={4}
            className={`input ${errors.description ? 'border-error-500 focus:ring-error-500' : ''}`}
            placeholder="Describe your event in detail..."
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            className={`input ${errors.category ? 'border-error-500 focus:ring-error-500' : ''}`}
            {...register('category')}
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-error-600">{errors.category.message}</p>
          )}
        </div>
      </div>
      
      {/* Image */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Image size={20} /> 
          Event Image
        </h3>
        
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL (optional)
          </label>
          <div className="flex">
            <input
              id="imageUrl"
              type="text"
              className={`input flex-grow ${errors.imageUrl ? 'border-error-500 focus:ring-error-500' : ''}`}
              placeholder="https://example.com/image.jpg"
              {...register('imageUrl')}
              onChange={(e) => {
                register('imageUrl').onChange(e);
                setShowImagePreview(!!e.target.value);
              }}
            />
            <button
              type="button"
              className="ml-2 btn btn-secondary"
              onClick={() => setShowImagePreview(!showImagePreview)}
            >
              {showImagePreview ? 'Hide' : 'Preview'}
            </button>
          </div>
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-error-600">{errors.imageUrl.message}</p>
          )}
          
          {showImagePreview && imageUrl && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
              <img 
                src={imageUrl} 
                alt="Event preview" 
                className="h-40 w-full object-cover rounded-md border border-gray-200"
                onError={() => {
                  // Handle image load error
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Date and Time */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Calendar size={20} /> 
          Date & Time
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date and Time *
            </label>
            <input
              id="startDate"
              type="datetime-local"
              className={`input ${errors.startDate ? 'border-error-500 focus:ring-error-500' : ''}`}
              {...register('startDate')}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-error-600">{errors.startDate.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date and Time *
            </label>
            <input
              id="endDate"
              type="datetime-local"
              className={`input ${errors.endDate ? 'border-error-500 focus:ring-error-500' : ''}`}
              {...register('endDate')}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-error-600">{errors.endDate.message}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <MapPin size={20} /> 
          Location
        </h3>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address *
          </label>
          <input
            id="address"
            type="text"
            className={`input ${errors.location?.address ? 'border-error-500 focus:ring-error-500' : ''}`}
            placeholder="123 Main St"
            {...register('location.address')}
          />
          {errors.location?.address && (
            <p className="mt-1 text-sm text-error-600">{errors.location.address.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              id="city"
              type="text"
              className={`input ${errors.location?.city ? 'border-error-500 focus:ring-error-500' : ''}`}
              placeholder="Cityville"
              {...register('location.city')}
            />
            {errors.location?.city && (
              <p className="mt-1 text-sm text-error-600">{errors.location.city.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <input
              id="state"
              type="text"
              className={`input ${errors.location?.state ? 'border-error-500 focus:ring-error-500' : ''}`}
              placeholder="CA"
              {...register('location.state')}
            />
            {errors.location?.state && (
              <p className="mt-1 text-sm text-error-600">{errors.location.state.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code *
            </label>
            <input
              id="zipCode"
              type="text"
              className={`input ${errors.location?.zipCode ? 'border-error-500 focus:ring-error-500' : ''}`}
              placeholder="12345"
              {...register('location.zipCode')}
            />
            {errors.location?.zipCode && (
              <p className="mt-1 text-sm text-error-600">{errors.location.zipCode.message}</p>
            )}
          </div>
        </div>
        
        {/* Hidden fields for coordinates */}
        <input type="hidden" {...register('location.latitude', { valueAsNumber: true })} />
        <input type="hidden" {...register('location.longitude', { valueAsNumber: true })} />
      </div>
      
      {/* Submit */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;