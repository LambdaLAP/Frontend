import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../ui/Button";
import logo from "../../assets/Logo.png";

interface NavbarProps {
    darkMode?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode = false }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navClasses = darkMode 
    ? "fixed top-0 left-0 right-0 z-50 bg-[#0d1117] border-b border-gray-800"
    : "fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100";

  const textClasses = (isActive: boolean) => darkMode
    ? `text-sm font-medium transition-colors duration-200 ${isActive ? "text-indigo-400" : "text-gray-300 hover:text-white"}`
    : `text-sm font-medium transition-colors duration-200 ${isActive ? "text-indigo-600" : "text-gray-600 hover:text-gray-900"}`;

  const logoTextClass = darkMode ? "text-white" : "text-gray-900";
  const userTextClass = darkMode ? "text-gray-300" : "text-gray-700";

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Lambda LAP" className="h-8 w-auto" />
            <span className={`text-xl font-bold font-display ${logoTextClass}`}>
              Lambda LAP
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/courses"
              className={({ isActive }) => textClasses(isActive)}
            >
              Courses
            </NavLink>
            <NavLink
              to="/curriculum"
              className={({ isActive }) => textClasses(isActive)}
            >
              Curriculum
            </NavLink>
            <NavLink
              to="/mentor"
              className={({ isActive }) => textClasses(isActive)}
            >
              Mentors
            </NavLink>

            {isAuthenticated && (user?.role === "ADMIN" || user?.role === "INSTRUCTOR") && (
              <NavLink
                to="/admin/courses"
                className={({ isActive }) => textClasses(isActive)}
              >
                Admin Panel
              </NavLink>
            )}

            {isAuthenticated && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) => textClasses(isActive)}
              >
                Dashboard
              </NavLink>
            )}
          </div>

          {/* Auth Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className={`text-sm font-medium hidden sm:block ${userTextClass}`}>
                  {user?.profileData?.name || user?.email}
                </span>
                <Button variant={darkMode ? "ghost" : "ghost"} size="sm" onClick={handleLogout} className={darkMode ? "text-gray-300 hover:text-white hover:bg-white/10" : ""}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className={darkMode ? "text-gray-300 hover:text-white" : ""}>
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
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
