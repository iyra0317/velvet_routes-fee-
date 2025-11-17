import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookingModal from '../components/BookingModal';
import './Flights.css';

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy'
  });

  const [filters, setFilters] = useState({
    priceRange: 'all',
    stops: 'all',
    airline: 'all'
  });

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/flights');
      setFlights(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch flights:', err);
      setError('Failed to load flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchParams.origin || !searchParams.destination) {
      setError('Please enter origin and destination');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('http://localhost:5000/api/flights/search', {
        params: searchParams
      });
      setFlights(response.data);
      if (response.data.length === 0) {
        setError('No flights found. Try different cities!');
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const getFilteredFlights = () => {
    let filtered = [...flights];

    if (filters.priceRange !== 'all') {
      const ranges = {
        budget: [0, 200],
        mid: [200, 500],
        premium: [500, Infinity]
      };
      const [min, max] = ranges[filters.priceRange];
      filtered = filtered.filter(f => f.price >= min && f.price < max);
    }

    if (filters.stops !== 'all') {
      filtered = filtered.filter(f => f.stops === parseInt(filters.stops));
    }

    return filtered;
  };

  const filteredFlights = getFilteredFlights();

  const popularRoutes = [
    { from: 'New York', to: 'London', icon: '🗽→🏰' },
    { from: 'Paris', to: 'Tokyo', icon: '🗼→🗾' },
    { from: 'Dubai', to: 'Singapore', icon: '🕌→🦁' },
    { from: 'Los Angeles', to: 'Sydney', icon: '🌴→🦘' }
  ];

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flights-page">
      {/* Search Hero */}
      <div className="search-hero">
        <div className="container">
          <h1 className="page-title">
            Find Your Perfect <span className="text-gradient">Flight</span>
          </h1>
          <p className="page-subtitle">
            Search from thousands of flights worldwide ✈️
          </p>

          <form onSubmit={handleSearch} className="search-form">
            <div className="search-grid">
              <div className="form-group">
                <label>🛫 From</label>
                <input
                  type="text"
                  name="origin"
                  value={searchParams.origin}
                  onChange={handleInputChange}
                  placeholder="Origin City"
                  required
                />
              </div>

              <div className="form-group">
                <label>🛬 To</label>
                <input
                  type="text"
                  name="destination"
                  value={searchParams.destination}
                  onChange={handleInputChange}
                  placeholder="Destination City"
                  required
                />
              </div>

              <div className="form-group">
                <label>📅 Departure</label>
                <input
                  type="date"
                  name="departDate"
                  value={searchParams.departDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>📅 Return</label>
                <input
                  type="date"
                  name="returnDate"
                  value={searchParams.returnDate}
                  onChange={handleInputChange}
                  min={searchParams.departDate || new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>👥 Passengers</label>
                <select
                  name="passengers"
                  value={searchParams.passengers}
                  onChange={handleInputChange}
                >
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>💺 Class</label>
                <select
                  name="class"
                  value={searchParams.class}
                  onChange={handleInputChange}
                >
                  <option value="economy">Economy</option>
                  <option value="premium">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg search-btn" disabled={loading}>
              {loading ? '🔍 Searching...' : '🔍 Search Flights'}
            </button>
          </form>

          {/* Popular Routes */}
          <div className="popular-destinations">
            <span className="popular-label">Popular Routes:</span>
            {popularRoutes.map((route, index) => (
              <button
                key={index}
                className="destination-chip"
                onClick={() => {
                  setSearchParams({ ...searchParams, origin: route.from, destination: route.to });
                  setTimeout(() => handleSearch({ preventDefault: () => {} }), 100);
                }}
              >
                {route.icon} {route.from} → {route.to}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        <div className="container">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {loading && (
            <div className="loading-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flight-card skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                    <div className="skeleton-line"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && flights.length > 0 && (
            <>
              {/* Filters */}
              <div className="filters-bar">
                <div className="filter-group">
                  <label>💰 Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  >
                    <option value="all">All Prices</option>
                    <option value="budget">Budget ($0-$200)</option>
                    <option value="mid">Mid-range ($200-$500)</option>
                    <option value="premium">Premium ($500+)</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>🛑 Stops</label>
                  <select
                    value={filters.stops}
                    onChange={(e) => setFilters({ ...filters, stops: e.target.value })}
                  >
                    <option value="all">All Flights</option>
                    <option value="0">Non-stop</option>
                    <option value="1">1 Stop</option>
                    <option value="2">2+ Stops</option>
                  </select>
                </div>

                <div className="results-count">
                  <span className="count-badge">{filteredFlights.length}</span>
                  {filteredFlights.length === 1 ? 'flight' : 'flights'} found
                </div>
              </div>

              {/* Flights Grid */}
              <div className="flights-grid">
                {filteredFlights.map((flight, index) => (
                  <div
                    key={flight.id || index}
                    className="flight-card animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flight-header">
                      <div className="airline-info">
                        {flight.logo && <img src={flight.logo} alt={flight.airline} className="airline-logo" />}
                        <div>
                          <div className="airline-name">{flight.airline}</div>
                          <div className="flight-number">{flight.flightNumber}</div>
                        </div>
                      </div>
                      <div className="flight-price">
                        <span className="price-value">${flight.price}</span>
                      </div>
                    </div>

                    <div className="flight-route">
                      <div className="route-point">
                        <div className="route-time">{formatTime(flight.departure)}</div>
                        <div className="route-location">{flight.origin}</div>
                        <div className="route-code">{flight.originCode}</div>
                      </div>

                      <div className="route-connector">
                        <div className="route-duration">{formatDuration(flight.duration)}</div>
                        <div className="route-line"></div>
                        <div className="route-stops">
                          {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                        </div>
                      </div>

                      <div className="route-point">
                        <div className="route-time">{formatTime(flight.arrival)}</div>
                        <div className="route-location">{flight.destination}</div>
                        <div className="route-code">{flight.destinationCode}</div>
                      </div>
                    </div>

                    <div className="flight-footer">
                      <div className="flight-class">
                        💺 {flight.class || 'Economy'}
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setSelectedFlight(flight);
                          setShowBooking(true);
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && flights.length === 0 && !error && (
            <div className="empty-state">
              <div className="empty-icon">✈️</div>
              <h2>Start Your Search</h2>
              <p>Enter origin and destination to find available flights</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && selectedFlight && (
        <BookingModal
          item={selectedFlight}
          type="flight"
          onClose={() => {
            setShowBooking(false);
            setSelectedFlight(null);
          }}
          onSuccess={() => {
            setShowBooking(false);
            setSelectedFlight(null);
          }}
        />
      )}
    </div>
  );
};

export default Flights;
