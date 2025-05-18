import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AlertTriangle, Badge, User, Lock, Calendar, Eye, Check, Ban } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getUsers, setUserVerifiedStatus, toggleUserBan, getUserEventHistory } from '../../services/adminService';
import { User as UserType, Event } from '../../types';

const UsersManagementPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);
  
  const handleViewUser = async (selectedUser: UserType) => {
    setSelectedUser(selectedUser);
    setShowUserDetails(true);
    
    try {
      setIsLoadingEvents(true);
      const events = await getUserEventHistory(selectedUser.id);
      setUserEvents(events);
    } catch (err) {
      console.error('Failed to fetch user events:', err);
      toast.error('Failed to load user event history.');
    } finally {
      setIsLoadingEvents(false);
    }
  };
  
  const handleToggleVerified = async (userId: string, isVerified: boolean) => {
    try {
      const updatedUser = await setUserVerifiedStatus(userId, !isVerified);
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(updatedUser);
      }
      
      toast.success(`User ${!isVerified ? 'verified' : 'unverified'} successfully`);
    } catch (err) {
      console.error('Failed to update user verified status:', err);
      toast.error('Failed to update user status. Please try again.');
    }
  };
  
  const handleToggleBan = async (userId: string, isBanned: boolean) => {
    try {
      const updatedUser = await toggleUserBan(userId);
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(updatedUser);
      }
      
      toast.success(`User ${isBanned ? 'unbanned' : 'banned'} successfully`);
    } catch (err) {
      console.error('Failed to update user ban status:', err);
      toast.error('Failed to update user status. Please try again.');
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
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-gray-600">Manage users and organizers</p>
        </div>
        
        <Link to="/admin" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <div className={`lg:col-span-${showUserDetails ? '1' : '3'}`}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Users Found</h3>
                <p className="text-gray-600">
                  There are no users registered in the system.
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className={`hover:bg-gray-50 ${user.isBanned ? 'bg-error-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{user.role}</div>
                        <div className="text-sm text-gray-500">
                          {user.isVerifiedOrganizer && (
                            <span className="flex items-center text-primary-600">
                              <Badge className="h-3 w-3 mr-1" />
                              Verified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isBanned ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-error-100 text-error-800">
                            Banned
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-success-100 text-success-800">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="text-primary-600 hover:text-primary-900 bg-primary-50 hover:bg-primary-100 p-2 rounded-full transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleToggleVerified(user.id, user.isVerifiedOrganizer)}
                            className={`${
                              user.isVerifiedOrganizer 
                                ? 'text-warning-600 hover:text-warning-900 bg-warning-50 hover:bg-warning-100' 
                                : 'text-success-600 hover:text-success-900 bg-success-50 hover:bg-success-100'
                            } p-2 rounded-full transition-colors`}
                            title={user.isVerifiedOrganizer ? 'Remove Verification' : 'Verify User'}
                          >
                            <Badge className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleToggleBan(user.id, user.isBanned)}
                            className={`${
                              user.isBanned
                                ? 'text-success-600 hover:text-success-900 bg-success-50 hover:bg-success-100'
                                : 'text-error-600 hover:text-error-900 bg-error-50 hover:bg-error-100'
                            } p-2 rounded-full transition-colors`}
                            title={user.isBanned ? 'Unban User' : 'Ban User'}
                          >
                            {user.isBanned ? <Check className="h-5 w-5" /> : <Ban className="h-5 w-5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        {/* User Details Sidebar */}
        {showUserDetails && selectedUser && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold">User Details</h2>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    {selectedUser.phoneNumber && (
                      <p className="text-gray-600">{selectedUser.phoneNumber}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium capitalize">{selectedUser.role}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">{selectedUser.isBanned ? 'Banned' : 'Active'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Verified Organizer</p>
                    <p className="font-medium">{selectedUser.isVerifiedOrganizer ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Joined</p>
                    <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleVerified(selectedUser.id, selectedUser.isVerifiedOrganizer)}
                    className="btn btn-secondary flex-1"
                  >
                    <Badge className="h-4 w-4 mr-2" />
                    {selectedUser.isVerifiedOrganizer ? 'Remove Verification' : 'Verify Organizer'}
                  </button>
                  <button
                    onClick={() => handleToggleBan(selectedUser.id, selectedUser.isBanned)}
                    className={`btn flex-1 ${selectedUser.isBanned ? 'btn-primary' : 'btn-danger'}`}
                  >
                    {selectedUser.isBanned ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Unban User
                      </>
                    ) : (
                      <>
                        <Ban className="h-4 w-4 mr-2" />
                        Ban User
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">User Events</h3>
                
                {isLoadingEvents ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                  </div>
                ) : userEvents.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-md">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">This user hasn't created any events yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userEvents.map(event => (
                      <Link 
                        key={event.id}
                        to={`/events/${event.id}`}
                        className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start">
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
                          <div className="ml-3">
                            <h4 className="text-sm font-medium">{event.title}</h4>
                            <div className="flex items-center text-xs text-gray-500 space-x-2">
                              <span className="capitalize">{event.category.replace('-', ' ')}</span>
                              <span>•</span>
                              <span className="capitalize">{event.status}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagementPage;