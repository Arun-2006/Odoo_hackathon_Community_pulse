import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Phone, UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  phoneNumber: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    },
  });
  
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      await registerUser(data.name, data.email, data.password, data.phoneNumber);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
        <p className="text-gray-600">Join LocalConnect to participate in community events</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Full Name
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
                Email Address
              </span>
            </label>
            <input
              id="email"
              type="email"
              className={`input ${errors.email ? 'border-error-500 focus:ring-error-500' : ''}`}
              placeholder="your@email.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-1">
                <Lock className="h-4 w-4" />
                Password
              </span>
            </label>
            <input
              id="password"
              type="password"
              className={`input ${errors.password ? 'border-error-500 focus:ring-error-500' : ''}`}
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-1">
                <Lock className="h-4 w-4" />
                Confirm Password
              </span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`input ${errors.confirmPassword ? 'border-error-500 focus:ring-error-500' : ''}`}
              placeholder="••••••••"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                Phone Number (optional)
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
          
          <div className="pt-2">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account
                </span>
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;