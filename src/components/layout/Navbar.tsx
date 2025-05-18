import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MapPin, Menu, X, User, LogOut, Calendar, Shield, Home } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <MapPin className="h-6 w-6 text-primary-600" />
            <span className="text-xl font-semibold text-gray-900">LocalConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/events" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Events
            </Link>
            
            {user && (
              <Link to="/events/create" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Create Event
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* User menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  <User className="h-5 w-5" />
                  <span>{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 hover:text-primary-600 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="container-custom flex flex-col space-y-2">
            <Link 
              to="/" 
              className="flex items-center space-x-2 py-2 text-gray-700 hover:text-primary-600 transition-colors"
              onClick={closeMenu}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/events" 
              className="flex items-center space-x-2 py-2 text-gray-700 hover:text-primary-600 transition-colors"
              onClick={closeMenu}
            >
              <Calendar className="h-5 w-5" />
              <span>Events</span>
            </Link>
            
            {user && (
              <Link 
                to="/events/create" 
                className="flex items-center space-x-2 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={closeMenu}
              >
                <Calendar className="h-5 w-5" />
                <span>Create Event</span>
              </Link>
            )}
            
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="flex items-center space-x-2 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={closeMenu}
              >
                <Shield className="h-5 w-5" />
                <span>Admin</span>
              </Link>
            )}
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={closeMenu}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                
                <button 
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="flex items-center space-x-2 py-2 text-gray-700 hover:text-primary-600 transition-colors w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center space-x-2 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={closeMenu}
                >
                  <User className="h-5 w-5" />
                  <span>Login</span>
                </Link>
                
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;