import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookingModal from '../components/BookingModal';
import './Cars.css';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  
  const [searchParams, setSearchParams] = useState({
    location: '',
    pickUpDate: '',
    dropOffDate: '',
    pickUpTime: '10:00',
    dropOffTime: '10:00'
  });

  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    transmission: 'all'
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/cars');
      setCars(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch cars:', err);
      setError('Failed to load cars. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchParams.location) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('http://localhost:5000/api/cars/search', {
        params: searchParams
      });
      setCars(response.data);
      if (response.data.length === 0) {
        setError('No cars found. Try a different location!');
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

  const getFilteredCars = () => {
    let filtered = [...cars];

    if (filters.category !== 'all') {
      filtered = filtered.filter(car => 
        car.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.priceRange !== 'all') {
      const ranges = {
        budget: [0, 50],
        mid: [50, 100],
        luxury: [100, Infinity]
      };
      const [min, max] = ranges[filters.priceRange];
      filtered = filtered.filter(car => 
        car.pricePerDay >= min && car.pricePerDay < max
      );
    }

    if (filters.transmission !== 'all') {
      filtered = filtered.filter(car => 
        car.transmission.toLowerCase() === filters.transmission.toLowerCase()
      );
    }

    return filtered;
  };

  const filteredCars = getFilteredCars();

  const popularLocations = [
    { name: 'Paris', icon: '🗼' },
    { name: 'New York', icon: '🗽' },
    { name: 'London', icon: '🏰' },
    { name: 'Dubai', icon: '🕌' },
    { name: 'Los Angeles', icon: '🌴' },
    { name: 'Tokyo', icon: '🗾' }
  ];

  return (
    <div className="cars-page">
      {/* Search Hero */}
      <div className="search-hero">
        <div className="container">
          <h1 className="page-title">
            Rent Your Perfect <span className="text-gradient">Car</span>
          </h1>
          <p className="page-subtitle">
            Choose from thousands of vehicles worldwide 🚗
          </p>

          <form onSubmit={handleSearch} className="search-form">
            <div className="search-grid">
              <div className="form-group">
                <label>📍 Pick-up Location</label>
                <input
                  type="text"
                  name="location"
                  value={searchParams.location}
                  onChange={handleInputChange}
                  placeholder="City or Airport"
                  required
                />
              </div>

              <div className="form-group">
                <label>📅 Pick-up Date</label>
                <input
                  type="date"
                  name="pickUpDate"
                  value={searchParams.pickUpDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>🕐 Pick-up Time</label>
                <input
                  type="time"
                  name="pickUpTime"
                  value={searchParams.pickUpTime}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>📅 Drop-off Date</label>
                <input
                  type="date"
                  name="dropOffDate"
                  value={searchParams.dropOffDate}
                  onChange={handleInputChange}
                  min={searchParams.pickUpDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>🕐 Drop-off Time</label>
                <input
                  type="time"
                  name="dropOffTime"
                  value={searchParams.dropOffTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg search-btn" disabled={loading}>
              {loading ? '🔍 Searching...' : '🔍 Search Cars'}
            </button>
          </form>

          {/* Popular Locations */}
          <div className="popular-destinations">
            <span className="popular-label">Popular:</span>
            {popularLocations.map((loc, index) => (
              <button
                key={index}
                className="destination-chip"
                onClick={() => {
                  setSearchParams({ ...searchParams, location: loc.name });
                  setTimeout(() => handleSearch({ preventDefault: () => {} }), 100);
                }}
              >
                {loc.icon} {loc.name}
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
                <div key={i} className="car-card skeleton">
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

          {!loading && cars.length > 0 && (
            <>
              {/* Filters */}
              <div className="filters-bar">
                <div className="filter-group">
                  <label>🚗 Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  >
                    <option value="all">All Categories</option>
                    <option value="economy">Economy</option>
                    <option value="compact">Compact</option>
                    <option value="suv">SUV</option>
                    <option value="luxury">Luxury</option>
                    <option value="van">Van</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>💰 Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  >
                    <option value="all">All Prices</option>
                    <option value="budget">Budget ($0-$50)</option>
                    <option value="mid">Mid-range ($50-$100)</option>
                    <option value="luxury">Luxury ($100+)</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>⚙️ Transmission</label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                  >
                    <option value="all">All Types</option>
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>

                <div className="results-count">
                  <span className="count-badge">{filteredCars.length}</span>
                  {filteredCars.length === 1 ? 'car' : 'cars'} found
                </div>
              </div>

              {/* Cars Grid */}
              <div className="cars-grid">
                {filteredCars.map((car, index) => (
                  <div
                    key={car.id || index}
                    className="car-card animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="car-image">
                      {car.image ? (
                        <img src={car.image} alt={car.name} />
                      ) : (
                        <div className="placeholder-image">🚗</div>
                      )}
                      <div className="car-category">{car.category}</div>
                    </div>

                    <div className="car-content">
                      <h3 className="car-name">{car.name}</h3>
                      <p className="car-supplier">🏢 {car.supplier || 'Premium Rentals'}</p>

                      <div className="car-specs">
                        <div className="spec">
                          <span className="spec-icon">👥</span>
                          <span>{car.seats} Seats</span>
                        </div>
                        <div className="spec">
                          <span className="spec-icon">🚪</span>
                          <span>{car.doors} Doors</span>
                        </div>
                        <div className="spec">
                          <span className="spec-icon">⚙️</span>
                          <span>{car.transmission}</span>
                        </div>
                      </div>

                      {car.features && car.features.length > 0 && (
                        <div className="car-features">
                          {car.features.slice(0, 3).map((feature, idx) => (
                            <span key={idx} className="feature-tag">✓ {feature}</span>
                          ))}
                          {car.features.length > 3 && (
                            <span className="feature-tag">+{car.features.length - 3} more</span>
                          )}
                        </div>
                      )}

                      <div className="car-footer">
                        <div className="car-price">
                          <span className="price-label">From</span>
                          <span className="price-value">${car.pricePerDay}</span>
                          <span className="price-period">/day</span>
                        </div>
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            setSelectedCar(car);
                            setShowBooking(true);
                          }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && cars.length === 0 && !error && (
            <div className="empty-state">
              <div className="empty-icon">🚗</div>
              <h2>Start Your Search</h2>
              <p>Enter a location above to find available cars</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && selectedCar && (
        <BookingModal
          item={selectedCar}
          type="car"
          onClose={() => {
            setShowBooking(false);
            setSelectedCar(null);
          }}
          onSuccess={() => {
            setShowBooking(false);
            setSelectedCar(null);
          }}
        />
      )}
    </div>
  );
};

export default Cars;
