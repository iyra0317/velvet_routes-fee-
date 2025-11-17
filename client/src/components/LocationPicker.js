import React, { useState, useEffect } from 'react';
import './LocationPicker.css';

const LocationPicker = ({ onLocationSelect }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getCurrentLocation = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          const locationData = {
            latitude,
            longitude,
            address: data.display_name,
            city: data.address.city || data.address.town || data.address.village,
            country: data.address.country
          };

          setLocation(locationData);
          if (onLocationSelect) {
            onLocationSelect(locationData);
          }
        } catch (err) {
          setError('Failed to get location details');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  return (
    <div className="location-picker">
      <button
        type="button"
        onClick={getCurrentLocation}
        className="btn btn-secondary"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-sm"></span>
            Getting location...
          </>
        ) : (
          <>
            📍 Use Current Location
          </>
        )}
      </button>

      {error && <div className="error">{error}</div>}

      {location && (
        <div className="location-display">
          <p className="location-icon">✓ Location detected</p>
          <p className="location-text">{location.city}, {location.country}</p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
