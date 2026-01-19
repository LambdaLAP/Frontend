import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import logo from '../../assets/Logo.png';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Lambda LAP" className="h-8 w-auto" />
            <span className="text-xl font-bold font-display text-gray-900">Lambda LAP</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/courses" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`
              }
            >
              Courses
            </NavLink>
            <NavLink 
              to="/curriculum" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`
              }
            >
              Curriculum
            </NavLink>
            <NavLink 
              to="/mentor" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`
              }
            >
              Mentors
            </NavLink>
            
            {isAuthenticated && (
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`
                }
              >
                Dashboard
              </NavLink>
            )}
          </div>

          {/* Auth Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.profileData?.name || user?.email}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
