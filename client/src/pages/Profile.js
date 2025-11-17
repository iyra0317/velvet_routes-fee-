import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaSave, FaEdit, FaCamera, FaBell, FaShieldAlt, FaHeart, FaPlane } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    preferences: {
      travelClass: 'economy',
      dietaryRestrictions: [],
      accessibility: false
    }
  });
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    countries: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(response.data.user);
      setProfile({
        name: response.data.user.name || '',
        email: response.data.user.email || '',
        phone: response.data.user.phone || '',
        address: response.data.profile?.address || '',
        dob: response.data.profile?.dob ? response.data.profile.dob.split('T')[0] : '',
        preferences: response.data.profile?.preferences || {
          travelClass: 'economy',
          dietaryRestrictions: [],
          accessibility: false
        }
      });
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/auth/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(response.data.user);
      setMessage('Profile updated successfully!');
      setEditing(false);
      
      // Update user in localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.name = response.data.user.name;
      localStorage.setItem('user', JSON.stringify(userData));
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setProfile({
        ...profile,
        preferences: {
          ...profile.preferences,
          [prefKey]: value
        }
      });
    } else {
      setProfile({
        ...profile,
        [name]: value
      });
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-container">
          
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-info">
              <div className="profile-avatar">
                {getInitials(profile.name)}
                <button className="avatar-upload-btn" title="Change avatar">
                  <FaCamera />
                </button>
              </div>
              <div className="profile-details">
                <h1>{profile.name || 'Traveler'}</h1>
                <p className="profile-email">
                  <FaEnvelope /> {profile.email}
                </p>
                {profile.phone && (
                  <p className="profile-phone">
                    <FaPhone /> {profile.phone}
                  </p>
                )}
                <div className="profile-stats">
                  <div className="stat-item">
                    <span className="stat-value">{stats.totalBookings}</span>
                    <span className="stat-label">Bookings</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">${stats.totalSpent.toFixed(0)}</span>
                    <span className="stat-label">Total Spent</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{stats.countries}</span>
                    <span className="stat-label">Countries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <FaUser /> Personal Info
            </button>
            <button 
              className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <FaHeart /> Travel Preferences
            </button>
            <button 
              className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <FaShieldAlt /> Security
            </button>
          </div>

          {/* Messages */}
          {message && (
            <div className="alert alert-success">
              <FaBell /> {message}
            </div>
          )}
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* Profile Content */}
          <div className="profile-content">
            
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div className="profile-section">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">
                      <FaUser className="section-icon" /> Personal Information
                    </h2>
                    <p className="section-description">Update your personal details and contact information</p>
                  </div>
                  {!editing && (
                    <button className="btn btn-secondary" onClick={() => setEditing(true)}>
                      <FaEdit /> Edit Profile
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label><FaUser /> Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        disabled={!editing}
                        required
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="form-group">
                      <label><FaEnvelope /> Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="disabled-input"
                      />
                      <small>Email cannot be changed</small>
                    </div>

                    <div className="form-group">
                      <label><FaPhone /> Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div className="form-group">
                      <label><FaCalendar /> Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={profile.dob}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>

                    <div className="form-group full-width">
                      <label><FaMapMarkerAlt /> Address</label>
                      <textarea
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        disabled={!editing}
                        rows="3"
                        placeholder="Your full address"
                      />
                    </div>
                  </div>

                  {editing && (
                    <div className="action-buttons">
                      <button type="submit" className="btn btn-primary" disabled={saving}>
                        <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => {
                          setEditing(false);
                          fetchProfile();
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Travel Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="profile-section">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">
                      <FaPlane className="section-icon" /> Travel Preferences
                    </h2>
                    <p className="section-description">Customize your travel experience</p>
                  </div>
                </div>

                <div className="preferences-grid">
                  <div className="preference-card">
                    <label>Preferred Travel Class</label>
                    <select
                      name="preferences.travelClass"
                      value={profile.preferences.travelClass}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="economy">Economy</option>
                      <option value="premium_economy">Premium Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First Class</option>
                    </select>
                  </div>

                  <div className="preference-card">
                    <label>Dietary Restrictions</label>
                    <input
                      type="text"
                      name="preferences.dietaryRestrictions"
                      value={profile.preferences.dietaryRestrictions?.join(', ') || ''}
                      onChange={(e) => {
                        const restrictions = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        setProfile({
                          ...profile,
                          preferences: {
                            ...profile.preferences,
                            dietaryRestrictions: restrictions
                          }
                        });
                      }}
                      placeholder="e.g., Vegetarian, Gluten-free"
                    />
                  </div>

                  <div className="preference-card full-width">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={profile.preferences.accessibility}
                        onChange={(e) => {
                          setProfile({
                            ...profile,
                            preferences: {
                              ...profile.preferences,
                              accessibility: e.target.checked
                            }
                          });
                        }}
                      />
                      <span>I require accessibility accommodations</span>
                    </label>
                  </div>
                </div>

                <div className="action-buttons">
                  <button onClick={handleSubmit} className="btn btn-primary" disabled={saving}>
                    <FaSave /> {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="profile-section">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">
                      <FaShieldAlt className="section-icon" /> Security Settings
                    </h2>
                    <p className="section-description">Manage your account security</p>
                  </div>
                </div>

                <div className="security-info">
                  <div className="info-card">
                    <h3>Password</h3>
                    <p>Last changed: Never</p>
                    <button className="btn btn-secondary">Change Password</button>
                  </div>

                  <div className="info-card">
                    <h3>Two-Factor Authentication</h3>
                    <p>Add an extra layer of security</p>
                    <button className="btn btn-secondary">Enable 2FA</button>
                  </div>

                  <div className="info-card">
                    <h3>Active Sessions</h3>
                    <p>Manage your active sessions</p>
                    <button className="btn btn-secondary">View Sessions</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
