import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlane, FaTrain, FaBus, FaCar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import BookingModal from '../components/BookingModal';
import './Transport.css';

const Transport = () => {
  const [activeTab, setActiveTab] = useState('flights');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departDate: '',
    returnDate: '',
    passengers: 1
  });

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (type) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/${type}`);
      setData(response.data);
    } catch (err) {
      console.error(`Failed to fetch ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.get(`http://localhost:5000/api/${activeTab}/search`, {
        params: searchParams
      });
      setData(response.data);
    } catch (err) {
      console.error('Search failed:', err);
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

  const renderTransportCard = (item) => {
    switch (activeTab) {
      case 'flights':
        return (
          <div key={item.id} className="transport-card animate-fade-in">
            <div className="transport-header">
              <div className="airline-info">
                <img src={item.logo} alt={item.airline} className="airline-logo" />
                <div>
                  <h3>{item.airline}</h3>
                  <p className="flight-number">{item.flightNumber}</p>
                </div>
              </div>
              <div className="price-tag">
                <span className="price">${item.price}</span>
                <span className="per-person">/person</span>
              </div>
            </div>
            
            <div className="transport-route">
              <div className="route-point">
                <div className="time">{formatTime(item.departure)}</div>
                <div className="location">{item.origin}</div>
              </div>
              
              <div className="route-middle">
                <div className="duration">
                  <FaClock /> {formatDuration(item.duration)}
                </div>
                <div className="route-line"></div>
                <div className="stops">{item.stops === 0 ? 'Direct' : `${item.stops} stop(s)`}</div>
              </div>
              
              <div className="route-point">
                <div className="time">{formatTime(item.arrival)}</div>
                <div className="location">{item.destination}</div>
              </div>
            </div>
            
            <div className="transport-footer">
              <div className="details">
                <span className="badge">{item.cabinClass}</span>
                <span className="aircraft">{item.aircraft}</span>
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSelectedItem(item);
                  setShowBooking(true);
                }}
              >
                Book Flight
              </button>
            </div>
          </div>
        );

      case 'trains':
        return (
          <div key={item.id} className="transport-card animate-fade-in">
            <div className="transport-header">
              <div className="operator-info">
                <FaTrain className="transport-icon" />
                <div>
                  <h3>{item.operator}</h3>
                  <p className="train-number">{item.trainNumber}</p>
                </div>
              </div>
              <div className="price-tag">
                <span className="price">${item.price}</span>
              </div>
            </div>
            
            <div className="transport-route">
              <div className="route-point">
                <div className="time">{formatTime(item.departure)}</div>
                <div className="location">{item.origin}</div>
              </div>
              
              <div className="route-middle">
                <div className="duration">
                  <FaClock /> {formatDuration(item.duration)}
                </div>
                <div className="route-line"></div>
                <div className="stops">{item.stops === 0 ? 'Direct' : `${item.stops} stop(s)`}</div>
              </div>
              
              <div className="route-point">
                <div className="time">{formatTime(item.arrival)}</div>
                <div className="location">{item.destination}</div>
              </div>
            </div>
            
            <div className="transport-footer">
              <div className="amenities">
                {item.amenities.slice(0, 3).map((amenity, idx) => (
                  <span key={idx} className="amenity-badge">✓ {amenity}</span>
                ))}
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSelectedItem(item);
                  setShowBooking(true);
                }}
              >
                Book Train
              </button>
            </div>
          </div>
        );

      case 'buses':
        return (
          <div key={item.id} className="transport-card animate-fade-in">
            <div className="transport-header">
              <div className="operator-info">
                <FaBus className="transport-icon" />
                <div>
                  <h3>{item.operator}</h3>
                  <p className="bus-number">{item.busNumber}</p>
                </div>
              </div>
              <div className="price-tag">
                <span className="price">${item.price}</span>
              </div>
            </div>
            
            <div className="transport-route">
              <div className="route-point">
                <div className="time">{formatTime(item.departure)}</div>
                <div className="location">{item.origin}</div>
              </div>
              
              <div className="route-middle">
                <div className="duration">
                  <FaClock /> {formatDuration(item.duration)}
                </div>
                <div className="route-line"></div>
                <div className="stops">{item.stops} stop(s)</div>
              </div>
              
              <div className="route-point">
                <div className="time">{formatTime(item.arrival)}</div>
                <div className="location">{item.destination}</div>
              </div>
            </div>
            
            <div className="transport-footer">
              <div className="amenities">
                {item.amenities.slice(0, 3).map((amenity, idx) => (
                  <span key={idx} className="amenity-badge">✓ {amenity}</span>
                ))}
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSelectedItem(item);
                  setShowBooking(true);
                }}
              >
                Book Bus
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading && data.length === 0) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading transport options...</p>
      </div>
    );
  }

  return (
    <div className="transport-page animate-fade-in">
      <div className="transport-hero">
        <div className="hero-background">
          <img 
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600" 
            alt="Transport" 
            className="hero-bg-image"
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <h1 className="animate-slide-left">Book Your Transport</h1>
          <p className="animate-slide-right">Flights, Trains, Buses - All in One Place</p>
        </div>
      </div>

      <div className="container">
        <div className="transport-tabs">
          <button 
            className={`tab-btn ${activeTab === 'flights' ? 'active' : ''}`}
            onClick={() => setActiveTab('flights')}
          >
            <FaPlane /> Flights
          </button>
          <button 
            className={`tab-btn ${activeTab === 'trains' ? 'active' : ''}`}
            onClick={() => setActiveTab('trains')}
          >
            <FaTrain /> Trains
          </button>
          <button 
            className={`tab-btn ${activeTab === 'buses' ? 'active' : ''}`}
            onClick={() => setActiveTab('buses')}
          >
            <FaBus /> Buses
          </button>
          <button 
            className={`tab-btn ${activeTab === 'cars' ? 'active' : ''}`}
            onClick={() => window.location.href = '/cars'}
          >
            <FaCar /> Cars
          </button>
        </div>

        <form className="transport-search-form card" onSubmit={handleSearch}>
          <div className="search-grid">
            <div className="form-group">
              <label><FaMapMarkerAlt /> From</label>
              <input
                type="text"
                name="origin"
                value={searchParams.origin}
                onChange={handleInputChange}
                placeholder="Origin city"
                required
              />
            </div>
            
            <div className="form-group">
              <label><FaMapMarkerAlt /> To</label>
              <input
                type="text"
                name="destination"
                value={searchParams.destination}
                onChange={handleInputChange}
                placeholder="Destination city"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Departure Date</label>
              <input
                type="date"
                name="departDate"
                value={searchParams.departDate}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Passengers</label>
              <select
                name="passengers"
                value={searchParams.passengers}
                onChange={handleInputChange}
              >
                {[1,2,3,4,5,6].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary btn-lg">
            Search {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </button>
        </form>

        <div className="transport-results">
          <h2>Available {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ({data.length})</h2>
          
          <div className="transport-list">
            {data.map(item => renderTransportCard(item))}
          </div>
        </div>
      </div>

      {showBooking && selectedItem && (
        <BookingModal
          item={selectedItem}
          type={activeTab.slice(0, -1)} // Remove 's' from 'flights', 'trains', 'buses'
          onClose={() => {
            setShowBooking(false);
            setSelectedItem(null);
          }}
          onSuccess={(booking) => {
            console.log('Booking successful:', booking);
          }}
        />
      )}
    </div>
  );
};

export default Transport;
