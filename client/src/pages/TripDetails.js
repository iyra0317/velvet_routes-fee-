import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './TripDetails.css';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/trips/${id}`);
      setTrip(response.data);
      setEditData(response.data);
    } catch (err) {
      setError('Failed to load trip');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/trips/${id}`);
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to delete trip');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/trips/${id}`, editData);
      setTrip(response.data);
      setEditing(false);
    } catch (err) {
      alert('Failed to update trip');
    }
  };

  const toggleActivity = async (activityIndex) => {
    const updatedActivities = [...trip.activities];
    updatedActivities[activityIndex].completed = !updatedActivities[activityIndex].completed;

    try {
      const response = await axios.put(`http://localhost:5000/api/trips/${id}`, {
        ...trip,
        activities: updatedActivities
      });
      setTrip(response.data);
    } catch (err) {
      alert('Failed to update activity');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  if (error || !trip) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <p>{error || 'Trip not found'}</p>
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="trip-details-page">
      <div className="container">
        <div className="trip-details-header">
          <Link to="/dashboard" className="back-link">← Back to Trips</Link>
          <div className="header-actions">
            {!editing && (
              <>
                <button onClick={() => setEditing(true)} className="btn btn-secondary">
                  Edit Trip
                </button>
                <button onClick={handleDelete} className="btn btn-danger">
                  Delete Trip
                </button>
              </>
            )}
          </div>
        </div>

        {editing ? (
          <div className="card">
            <h2>Edit Trip</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Destination</label>
                <input
                  type="text"
                  value={editData.destination}
                  onChange={(e) => setEditData({ ...editData, destination: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={editData.startDate?.split('T')[0]}
                    onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={editData.endDate?.split('T')[0]}
                    onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="trip-hero">
              <h1>{trip.title}</h1>
              <div className="trip-meta">
                <span className="destination">📍 {trip.destination}</span>
                <span className="dates">
                  📅 {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </span>
              </div>
            </div>

            {trip.description && (
              <div className="card">
                <h2>About This Trip</h2>
                <p>{trip.description}</p>
              </div>
            )}

            {trip.activities && trip.activities.length > 0 && (
              <div className="card">
                <h2>Activities & Itinerary</h2>
                <div className="activities-list">
                  {trip.activities.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <input
                        type="checkbox"
                        checked={activity.completed}
                        onChange={() => toggleActivity(index)}
                        id={`activity-${index}`}
                      />
                      <label 
                        htmlFor={`activity-${index}`}
                        className={activity.completed ? 'completed' : ''}
                      >
                        {activity.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TripDetails;
