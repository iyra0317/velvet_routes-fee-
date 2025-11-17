import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import PaymentForm from '../components/PaymentForm';
import './HotelDetails.css';

const stripePromise = loadStripe('pk_test_51234567890abcdefghijklmnopqrstuvwxyz');

const HotelDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    checkIn: location.state?.checkIn || '',
    checkOut: location.state?.checkOut || '',
    guests: 2,
    rooms: 1
  });

  useEffect(() => {
    fetchHotelDetails();
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/hotels/${id}`);
      setHotel(response.data);
    } catch (err) {
      console.error('Failed to fetch hotel details');
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    if (!bookingDetails.checkIn || !bookingDetails.checkOut) return 0;
    const start = new Date(bookingDetails.checkIn);
    const end = new Date(bookingDetails.checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const calculateTotal = () => {
    if (!hotel) return 0;
    const nights = calculateNights();
    return nights * hotel.pricePerNight * bookingDetails.rooms;
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setShowBooking(true);
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        hotelId: hotel.id,
        ...bookingDetails,
        totalAmount: calculateTotal(),
        paymentIntentId: paymentIntent.id
      });
      
      alert('Booking confirmed! Check your email for details.');
      navigate('/dashboard');
    } catch (err) {
      alert('Booking failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading hotel details...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Hotel not found</h2>
        <button onClick={() => navigate('/hotels')} className="btn btn-primary">
          Back to Hotels
        </button>
      </div>
    );
  }

  const nights = calculateNights();
  const total = calculateTotal();

  return (
    <div className="hotel-details-page">
      <div className="hotel-header">
        <div className="container">
          <button onClick={() => navigate('/hotels')} className="back-btn">
            ← Back to Hotels
          </button>
          <h1>{hotel.name}</h1>
          <p className="hotel-location">📍 {hotel.location}</p>
          <div className="hotel-rating">
            <span className="rating-score">{hotel.rating}</span>
            <span className="rating-stars">⭐⭐⭐⭐⭐</span>
            <span className="rating-reviews">({hotel.reviews} reviews)</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="hotel-details-grid">
          <div className="hotel-main">
            <div className="hotel-gallery">
              <img src={hotel.image} alt={hotel.name} className="main-image" />
            </div>

            <div className="hotel-section">
              <h2>About This Property</h2>
              <p>{hotel.description}</p>
            </div>

            <div className="hotel-section">
              <h2>Amenities</h2>
              <div className="amenities-grid">
                {hotel.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <span className="amenity-icon">✓</span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            <div className="hotel-section">
              <h2>Location</h2>
              <div className="location-map">
                <p>📍 {hotel.address || hotel.location}</p>
                <p className="text-secondary">Interactive map coming soon</p>
              </div>
            </div>
          </div>

          <div className="hotel-sidebar">
            <div className="booking-card">
              <div className="price-display">
                <span className="price-amount">${hotel.pricePerNight}</span>
                <span className="price-period">/night</span>
              </div>

              {!showBooking ? (
                <form onSubmit={handleBookingSubmit}>
                  <div className="form-group">
                    <label>Check-in</label>
                    <input
                      type="date"
                      value={bookingDetails.checkIn}
                      onChange={(e) => setBookingDetails({...bookingDetails, checkIn: e.target.value})}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="form-group">
                    <label>Check-out</label>
                    <input
                      type="date"
                      value={bookingDetails.checkOut}
                      onChange={(e) => setBookingDetails({...bookingDetails, checkOut: e.target.value})}
                      required
                      min={bookingDetails.checkIn}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Guests</label>
                      <select
                        value={bookingDetails.guests}
                        onChange={(e) => setBookingDetails({...bookingDetails, guests: e.target.value})}
                      >
                        {[1,2,3,4,5,6].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Rooms</label>
                      <select
                        value={bookingDetails.rooms}
                        onChange={(e) => setBookingDetails({...bookingDetails, rooms: e.target.value})}
                      >
                        {[1,2,3,4].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {nights > 0 && (
                    <div className="price-breakdown">
                      <div className="price-row">
                        <span>${hotel.pricePerNight} × {nights} nights × {bookingDetails.rooms} room(s)</span>
                        <span>${total}</span>
                      </div>
                      <div className="price-row total">
                        <span>Total</span>
                        <span>${total}</span>
                      </div>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary btn-lg" disabled={nights <= 0}>
                    Continue to Payment
                  </button>
                </form>
              ) : (
                <div className="payment-section">
                  <h3>Payment Details</h3>
                  <div className="booking-summary">
                    <p><strong>Check-in:</strong> {bookingDetails.checkIn}</p>
                    <p><strong>Check-out:</strong> {bookingDetails.checkOut}</p>
                    <p><strong>Guests:</strong> {bookingDetails.guests}</p>
                    <p><strong>Rooms:</strong> {bookingDetails.rooms}</p>
                    <p className="total-amount"><strong>Total:</strong> ${total}</p>
                  </div>
                  
                  <Elements stripe={stripePromise}>
                    <PaymentForm 
                      amount={total}
                      onSuccess={handlePaymentSuccess}
                      onCancel={() => setShowBooking(false)}
                    />
                  </Elements>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
