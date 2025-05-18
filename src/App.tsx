import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import EventsApprovalPage from './pages/admin/EventsApprovalPage';
import UsersManagementPage from './pages/admin/UsersManagementPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailPage />} />
        <Route path="events/create" element={user ? <CreateEventPage /> : <Navigate to="/login" />} />
        <Route path="events/:id/edit" element={user ? <EditEventPage /> : <Navigate to="/login" />} />
        <Route path="profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        
        {/* Admin Routes */}
        <Route 
          path="admin" 
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="admin/events" 
          element={user?.role === 'admin' ? <EventsApprovalPage /> : <Navigate to="/" />} 
        />
        <Route 
          path="admin/users" 
          element={user?.role === 'admin' ? <UsersManagementPage /> : <Navigate to="/" />} 
        />
        
        {/* Auth Routes */}
        <Route path="login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
        
        {/* Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;