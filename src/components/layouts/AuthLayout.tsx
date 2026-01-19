import React from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/Logo.png';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center mb-6">
          <img src={logo} alt="Lambda LAP" className="h-12 w-auto" />
        </Link>
        <h2 className="text-center text-3xl font-display font-bold text-gray-900 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-panel py-8 px-4 shadow sm:rounded-2xl sm:px-10">
          {children}
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Lambda LAP</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
