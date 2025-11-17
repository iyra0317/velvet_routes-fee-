import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✈️</span>
          Velvet Routes
        </Link>

        <ul className="navbar-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/hotels">Hotels</Link></li>
          <li><Link to="/flights">Flights</Link></li>
          <li><Link to="/cars">Cars</Link></li>
          <li><Link to="/transport">Transport</Link></li>
          <li><Link to="/about">About</Link></li>
          {user ? (
            <>
              <li><Link to="/dashboard">My Trips</Link></li>
              <li><Link to="/create-trip">Create Trip</Link></li>
              <li className="profile-dropdown">
                <button 
                  className="profile-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className="profile-icon">{user.name.charAt(0).toUpperCase()}</span>
                  <span>{user.name}</span>
                </button>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/profile" onClick={() => setShowDropdown(false)}>
                      👤 Profile Settings
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="btn btn-secondary">Login</Link></li>
              <li><Link to="/register" className="btn btn-primary">Sign Up</Link></li>
            </>
          )}
          <li><DarkModeToggle /></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
