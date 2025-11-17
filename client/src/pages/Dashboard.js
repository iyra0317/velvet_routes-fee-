import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NotificationSetup from '../components/NotificationSetup';
import './Dashboard.css';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/trips');
      setTrips(response.data);
    } catch (err) {
      setError('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/trips/${id}`);
      setTrips(trips.filter(trip => trip.id !== id));
    } catch (err) {
      alert('Failed to delete trip');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>My Trips</h1>
          <Link to="/create-trip" className="btn btn-primary">
            + Create New Trip
          </Link>
        </div>

        <NotificationSetup />

        {error && <div className="error">{error}</div>}

        {trips.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✈️</div>
            <h2>No trips yet</h2>
            <p>Start planning your next adventure!</p>
            <Link to="/create-trip" className="btn btn-primary">
              Create Your First Trip
            </Link>
          </div>
        ) : (
          <div className="trips-grid">
            {trips.map(trip => (
              <div key={trip.id} className="trip-card">
                <div className="trip-header">
                  <h3>{trip.title}</h3>
                  <span className="trip-destination">📍 {trip.destination}</span>
                </div>
                <div className="trip-dates">
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </div>
                {trip.description && (
                  <p className="trip-description">{trip.description}</p>
                )}
                <div className="trip-footer">
                  <Link to={`/trip/${trip.id}`} className="btn btn-secondary">
                    View Details
                  </Link>
                  <button 
                    onClick={() => deleteTrip(trip.id)} 
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
