import { Link } from 'react-router-dom';
import { Calendar, Users, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Mock stats for demo
  const stats = {
    pendingEvents: 2,
    approvedEvents: 3,
    totalUsers: 10,
    verifiedOrganizers: 1,
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
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Manage events, users, and platform settings</p>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Pending Events</h3>
            <Clock className="h-8 w-8 text-warning-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.pendingEvents}</p>
          <Link 
            to="/admin/events" 
            className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800"
          >
            Review Events
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Approved Events</h3>
            <CheckCircle className="h-8 w-8 text-success-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.approvedEvents}</p>
          <Link 
            to="/events" 
            className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800"
          >
            View All Events
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
            <Users className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          <Link 
            to="/admin/users" 
            className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800"
          >
            Manage Users
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Verified Organizers</h3>
            <Shield className="h-8 w-8 text-secondary-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.verifiedOrganizers}</p>
          <Link 
            to="/admin/users" 
            className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800"
          >
            Manage Organizers
          </Link>
        </div>
      </div>
      
      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Event Management</h2>
          <div className="space-y-3">
            <Link 
              to="/admin/events" 
              className="flex items-center text-gray-700 hover:text-primary-600 transition-colors py-2"
            >
              <Calendar className="h-5 w-5 mr-3 text-gray-500" />
              <span>Review Pending Events</span>
            </Link>
            <Link 
              to="/events" 
              className="flex items-center text-gray-700 hover:text-primary-600 transition-colors py-2"
            >
              <Calendar className="h-5 w-5 mr-3 text-gray-500" />
              <span>Browse All Events</span>
            </Link>
            <button 
              className="flex items-center text-gray-700 hover:text-primary-600 transition-colors py-2 w-full text-left"
              onClick={() => alert('Feature coming soon!')}
            >
              <Calendar className="h-5 w-5 mr-3 text-gray-500" />
              <span>Featured Events</span>
            </button>
            <button 
              className="flex items-center text-gray-700 hover:text-primary-600 transition-colors py-2 w-full text-left"
              onClick={() => alert('Feature coming soon!')}
            >
              <Calendar className="h-5 w-5 mr-3 text-gray-500" />
              <span>Send Event Notifications</span>
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <div className="space-y-3">
            <Link 
              to="/admin/users" 
              className="flex items-center text-gray-700 hover:text-primary-600 transition-colors py-2"
            >
              <Users className="h-5 w-5 mr-3 text-gray-500" />
              <span>Manage Users</span>
            </Link>
            <button 
              className="flex items-center text-gray-700 hover:text-primary-600 transition-colors py-2 w-full text-left"
              onClick={() => alert('Feature coming soon!')}
            >
              <Shield className="h-5 w-5 mr-3 text-gray-500" />
              <span>Verify Organizers</span>
            </button>
            <button 
              className="flex items-center text-gray-700 hover:text-primary-600 transition-colors py-2 w-full text-left"
              onClick={() => alert('Feature coming soon!')}
            >
              <AlertTriangle className="h-5 w-5 mr-3 text-gray-500" />
              <span>Reports & Flagged Content</span>
            </button>
            <button 
              className="flex items-center text-gray-700 hover:text-primary-600 transition-colors py-2 w-full text-left"
              onClick={() => alert('Feature coming soon!')}
            >
              <Users className="h-5 w-5 mr-3 text-gray-500" />
              <span>User Activity Logs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;