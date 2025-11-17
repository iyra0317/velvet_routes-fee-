import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import BookingModal from '../components/BookingModal';
import './Hotels.css';

const Hotels = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  
  const [search, setSearch] = useState({
    destination: searchParams.get('location') || '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1
  });

  const [filters, setFilters] = useState({
    priceRange: 'all',
    rating: 'all',
    amenities: []
  });

  useEffect(() => {
    // Load hotels on page load
    fetchInitialHotels();
  }, []);

  const fetchInitialHotels = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/hotels');
      setHotels(response.data);
    } catch (err) {
      console.error('Failed to load hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.destination) {
      setError('Please enter a destination');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get('http://localhost:5000/api/hotels/search', {
        params: {
          destination: search.destination,
          checkIn: search.checkIn,
          checkOut: search.checkOut,
          guests: search.guests,
          rooms: search.rooms
        }
      });
      
      setHotels(response.data);
      if (response.data.length === 0) {
        setError('No hotels found. Try a different destination!');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search hotels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (hotel) => {
    setSelectedHotel(hotel);
    setShowBooking(true);
  };

  const getFilteredHotels = () => {
    let filtered = [...hotels];

    // Price filter
    if (filters.priceRange !== 'all') {
      const ranges = {
        budget: [0, 100],
        mid: [100, 200],
        luxury: [200, Infinity]
      };
      const [min, max] = ranges[filters.priceRange];
      filtered = filtered.filter(h => h.pricePerNight >= min && h.pricePerNight < max);
    }

    // Rating filter
    if (filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(h => h.rating >= minRating);
    }

    return filtered;
  };

  const filteredHotels = getFilteredHotels();

  const popularDestinations = [
    { name: 'Paris', icon: '🗼' },
    { name: 'Tokyo', icon: '🗾' },
    { name: 'New York', icon: '🗽' },
    { name: 'London', icon: '🏰' },
    { name: 'Dubai', icon: '🕌' },
    { name: 'Bali', icon: '🏝️' }
  ];

  return (
    <div className="hotels-page">
      {/* Search Hero */}
      <div className="search-hero">
        <div className="container">
          <h1 className="page-title">
            Find Your Perfect <span className="text-gradient">Hotel</span>
          </h1>
          <p className="page-subtitle">
            Search from millions of hotels worldwide 🏨
          </p>

          <form onSubmit={handleSearch} className="search-form">
            <div className="search-grid">
              <div className="form-group">
                <label>📍 Destination</label>
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={search.destination}
                  onChange={(e) => setSearch({ ...search, destination: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>📅 Check-in</label>
                <input
                  type="date"
                  value={search.checkIn}
                  onChange={(e) => setSearch({ ...search, checkIn: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>📅 Check-out</label>
                <input
                  type="date"
                  value={search.checkOut}
                  onChange={(e) => setSearch({ ...search, checkOut: e.target.value })}
                  min={search.checkIn || new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>👥 Guests</label>
                <select
                  value={search.guests}
                  onChange={(e) => setSearch({ ...search, guests: e.target.value })}
                >
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>🛏️ Rooms</label>
                <select
                  value={search.rooms}
                  onChange={(e) => setSearch({ ...search, rooms: e.target.value })}
                >
                  {[1, 2, 3, 4].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Room' : 'Rooms'}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg search-btn" disabled={loading}>
              {loading ? '🔍 Searching...' : '🔍 Search Hotels'}
            </button>
          </form>

          {/* Popular Destinations */}
          <div className="popular-destinations">
            <span className="popular-label">Popular:</span>
            {popularDestinations.map((dest, index) => (
              <button
                key={index}
                className="destination-chip"
                onClick={() => {
                  setSearch({ ...search, destination: dest.name });
                  setTimeout(() => handleSearch({ preventDefault: () => {} }), 100);
                }}
              >
                {dest.icon} {dest.name}
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
                <div key={i} className="hotel-card skeleton">
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

          {!loading && hotels.length > 0 && (
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
                    <option value="budget">Budget ($0-$100)</option>
                    <option value="mid">Mid-range ($100-$200)</option>
                    <option value="luxury">Luxury ($200+)</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>⭐ Rating</label>
                  <select
                    value={filters.rating}
                    onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                  >
                    <option value="all">All Ratings</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                  </select>
                </div>

                <div className="results-count">
                  <span className="count-badge">{filteredHotels.length}</span>
                  {filteredHotels.length === 1 ? 'hotel' : 'hotels'} found
                </div>
              </div>

              {/* Hotels Grid */}
              <div className="hotels-grid">
                {filteredHotels.map((hotel, index) => (
                  <div
                    key={hotel.id || index}
                    className="hotel-card animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="hotel-image">
                      {hotel.image ? (
                        <img src={hotel.image} alt={hotel.name} />
                      ) : (
                        <div className="placeholder-image">🏨</div>
                      )}
                      {hotel.featured && <div className="featured-badge">⭐ Featured</div>}
                    </div>

                    <div className="hotel-content">
                      <div className="hotel-header">
                        <h3 className="hotel-name">{hotel.name}</h3>
                        <div className="hotel-rating">
                          <span className="rating-stars">⭐</span>
                          <span className="rating-value">{hotel.rating || '4.5'}</span>
                        </div>
                      </div>

                      <div className="hotel-location">
                        📍 {hotel.location}
                      </div>

                      {hotel.amenities && hotel.amenities.length > 0 && (
                        <div className="hotel-amenities">
                          {hotel.amenities.slice(0, 3).map((amenity, i) => (
                            <span key={i} className="amenity-tag">{amenity}</span>
                          ))}
                          {hotel.amenities.length > 3 && (
                            <span className="amenity-tag">+{hotel.amenities.length - 3} more</span>
                          )}
                        </div>
                      )}

                      <div className="hotel-footer">
                        <div className="hotel-price">
                          <span className="price-label">From</span>
                          <span className="price-value">${hotel.pricePerNight || hotel.price || 99}</span>
                          <span className="price-period">/night</span>
                        </div>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleBooking(hotel)}
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

          {!loading && hotels.length === 0 && !error && (
            <div className="empty-state">
              <div className="empty-icon">🏨</div>
              <h2>Start Your Search</h2>
              <p>Enter a destination above to find amazing hotels</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && selectedHotel && (
        <BookingModal
          item={selectedHotel}
          type="hotel"
          onClose={() => {
            setShowBooking(false);
            setSelectedHotel(null);
          }}
          onSuccess={() => {
            setShowBooking(false);
            setSelectedHotel(null);
          }}
        />
      )}
    </div>
  );
};

export default Hotels;
