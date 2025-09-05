import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar bg-base-100 shadow">
      <div className="container mx-auto">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl">DocuChain</Link>
        </div>
        <div className="flex-none gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost">Dashboard</Link>
              <Link to="/documents" className="btn btn-ghost">Documents</Link>
              <Link to="/profile" className="btn btn-ghost">Profile</Link>
              <button onClick={handleLogout} className="btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
