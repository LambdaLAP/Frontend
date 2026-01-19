// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import CourseList from './pages/Course/CourseList';
import CourseDetails from './pages/Course/CourseDetails';
import LessonView from './pages/Lesson/LessonView';
import Home from './pages/Home/Home';
import Mentor from './pages/Mentor/Mentor';
import Curriculum from './pages/Curriculum/Curriculum';

// Protected Route Wrapper
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen justify-center items-center">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Public Route Wrapper (redirects to dashboard if already logged in)
const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen justify-center items-center">Loading...</div>;
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:courseId" element={<CourseDetails />} />
          <Route path="/lessons/:lessonId" element={<LessonView />} />
          <Route path="/mentor" element={<Mentor />} />
          <Route path="/curriculum" element={<Curriculum />} />
          {/* Add more protected routes here */}
        </Route>

        {/* Root Redirect - now redundant if public route handles /, so removing replace logic or keeping as fallback */}
        {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
        
        {/* 404 - Redirect to Home if not logged in, Dashboard if logged in (logic handled by public/protected wrappers) */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
