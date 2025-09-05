import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <nav className="navbar bg-base-100 shadow">
      <div className="container mx-auto">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl">DocuChain</Link>
        </div>
        <div className="flex-none gap-2 items-center">
          <label className="swap swap-rotate mr-2">
            <input type="checkbox" checked={theme === 'dark'} onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')} />
            <svg className="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64 17.657A9 9 0 1018 6a7 7 0 11-12.36 11.657z"/></svg>
            <svg className="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 12a7 7 0 1114 0 7 7 0 01-14 0zm7-9a1 1 0 010 2 1 1 0 010-2zm0 16a1 1 0 010 2 1 1 0 010-2zM4.22 4.22a1 1 0 011.42 0 1 1 0 01-1.42 1.42 1 1 0 010-1.42zm12.02 12.02a1 1 0 011.42 0 1 1 0 01-1.42 1.42 1 1 0 010-1.42zM1 13a1 1 0 012 0 1 1 0 01-2 0zm18 0a1 1 0 012 0 1 1 0 01-2 0zM4.22 19.78a1 1 0 011.42 0 1 1 0 01-1.42 1.42 1 1 0 010-1.42zm12.02-12.02a1 1 0 011.42 0 1 1 0 01-1.42 1.42 1 1 0 010-1.42z"/></svg>
          </label>
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
