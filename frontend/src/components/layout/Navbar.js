import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">DocuChain</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Dashboard
                </Link>
                <Link to="/documents" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Documents
                </Link>
                <div className="relative ml-3">
                  <div className="flex items-center">
                    <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Login
                </Link>
                <Link to="/register" className="ml-2 px-3 py-2 rounded-md text-sm font-medium bg-white text-blue-600 hover:bg-gray-100">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
