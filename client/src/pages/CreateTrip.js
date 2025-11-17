import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LocationPicker from '../components/LocationPicker';
import './CreateTrip.css';

const CreateTrip = () => {
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
    activities: '',
    location: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const activities = formData.activities
        .split('\n')
        .filter(a => a.trim())
        .map(a => ({ name: a.trim(), completed: false }));

      await axios.post('http://localhost:5000/api/trips', {
        ...formData,
        activities
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-trip-page">
      <div className="container">
        <div className="create-trip-container">
          <h1>Create New Trip</h1>
          
          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Trip Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Summer Vacation in Paris"
                />
              </div>

              <div className="form-group">
                <label>Destination *</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Paris, France"
                />
                <LocationPicker 
                  onLocationSelect={(loc) => {
                    setFormData({
                      ...formData,
                      destination: `${loc.city}, ${loc.country}`,
                      location: loc
                    });
                  }}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe your trip plans..."
                />
              </div>

              <div className="form-group">
                <label>Activities (one per line)</label>
                <textarea
                  name="activities"
                  value={formData.activities}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Visit Eiffel Tower&#10;Louvre Museum&#10;Seine River Cruise&#10;Montmartre Walking Tour"
                />
              </div>

              {error && <div className="error">{error}</div>}

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
