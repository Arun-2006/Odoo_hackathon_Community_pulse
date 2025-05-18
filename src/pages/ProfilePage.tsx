import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, LogOut, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to log out. Please try again.');
      setIsLoggingOut(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                <User className="h-12 w-12" />
              </div>
              
              <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
              <p className="text-gray-500 mb-4">
                {user.role === 'admin' ? 'Administrator' : 'Community Member'}
                {user.isVerifiedOrganizer && ' • Verified Organizer'}
              </p>
              
              <button
                onClick={handleLogout}
                className="btn btn-secondary w-full"
                disabled={isLoggingOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoggingOut ? 'Logging out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p>{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p>{user.phoneNumber || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Account Settings</h2>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => toast.success('This feature is coming soon!')}
                className="btn btn-secondary w-full"
              >
                Edit Profile
              </button>
              
              <button
                onClick={() => toast.success('This feature is coming soon!')}
                className="btn btn-secondary w-full"
              >
                Change Password
              </button>
              
              <button
                onClick={() => toast.success('This feature is coming soon!')}
                className="btn btn-secondary w-full"
              >
                Notification Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;