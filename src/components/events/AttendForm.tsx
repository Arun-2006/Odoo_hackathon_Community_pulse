import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NewEventAttendee } from '../../types';
import { User, Mail, Phone, Users } from 'lucide-react';

const attendeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters'),
  additionalAttendees: z.number().min(0, 'Value cannot be negative').max(10, 'Maximum 10 additional attendees allowed'),
});

type AttendeeFormValues = z.infer<typeof attendeeSchema>;

interface AttendFormProps {
  onSubmit: (data: NewEventAttendee) => void;
  isSubmitting: boolean;
}

const AttendForm = ({ onSubmit, isSubmitting }: AttendFormProps) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
  } = useForm<AttendeeFormValues>({
    resolver: zodResolver(attendeeSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      additionalAttendees: 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Your Name *
          </span>
        </label>
        <input
          id="name"
          type="text"
          className={`input ${errors.name ? 'border-error-500 focus:ring-error-500' : ''}`}
          placeholder="John Doe"
          {...register('name')}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            Email Address *
          </span>
        </label>
        <input
          id="email"
          type="email"
          className={`input ${errors.email ? 'border-error-500 focus:ring-error-500' : ''}`}
          placeholder="john@example.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            Phone Number *
          </span>
        </label>
        <input
          id="phoneNumber"
          type="tel"
          className={`input ${errors.phoneNumber ? 'border-error-500 focus:ring-error-500' : ''}`}
          placeholder="(555) 123-4567"
          {...register('phoneNumber')}
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-error-600">{errors.phoneNumber.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="additionalAttendees" className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Additional Attendees
          </span>
        </label>
        <input
          id="additionalAttendees"
          type="number"
          min="0"
          max="10"
          className={`input ${errors.additionalAttendees ? 'border-error-500 focus:ring-error-500' : ''}`}
          {...register('additionalAttendees', { valueAsNumber: true })}
        />
        {errors.additionalAttendees && (
          <p className="mt-1 text-sm text-error-600">{errors.additionalAttendees.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">How many people are coming with you? (max 10)</p>
      </div>
      
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register for Event'}
        </button>
      </div>
    </form>
  );
};

export default AttendForm;