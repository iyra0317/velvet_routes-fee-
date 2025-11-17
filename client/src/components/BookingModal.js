import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import PaymentForm from './PaymentForm';
import { useAuth } from '../context/AuthContext';
import './BookingModal.css';

const stripePromise = loadStripe('pk_test_51234567890abcdefghijklmnopqrstuvwxyz');

const BookingModal = ({ item, type, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    passengers: 1,
    date: '',
    ...getDefaultDetails(type, item)
  });
  const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem('userPhoneNumber') || '');

  function getDefaultDetails(type, item) {
    switch (type) {
      case 'flight':
        return {
          airline: item.airline,
          flightNumber: item.flightNumber,
          origin: item.origin,
          destination: item.destination,
          departure: item.departure,
          arrival: item.arrival
        };
      case 'car':
        return {
          carName: item.name,
          category: item.category,
          location: '',
          pickUpDate: '',
          dropOffDate: ''
        };
      case 'train':
      case 'bus':
        return {
          operator: item.operator,
          origin: item.origin,
          destination: item.destination,
          departure: item.departure
        };
      default:
        return {};
    }
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const bookingData = {
        type: type,
        details: bookingDetails,
        amount: item.price || item.pricePerDay || item.pricePerNight,
        paymentIntentId: paymentIntent.id,
        customerName: user.name,
        customerEmail: user.email,
        phoneNumber: phoneNumber || undefined
      };

      const response = await axios.post('http://localhost:5000/api/bookings', bookingData);

      // Show success message with email and notification info
      const notificationInfo = response.data.notifications?.notifications || [];
      const smsStatus = notificationInfo.find(n => n.type === 'sms');
      const pushStatus = notificationInfo.find(n => n.type === 'push');
      
      alert(`Booking confirmed! 
      
Booking ID: ${response.data.booking.id}
Invoice sent to: ${user.email}
${phoneNumber ? `SMS notification sent to: ${phoneNumber}` : ''}
${pushStatus?.result?.success ? 'Push notification sent!' : ''}

${response.data.email.previewUrl ? 
  `Preview email: ${response.data.email.previewUrl}` : 
  'Check your email for the invoice PDF!'}`);

      if (onSuccess) onSuccess(response.data.booking);
      onClose();
    } catch (err) {
      alert('Booking failed. Please try again.');
      console.error('Booking error:', err);
    }
  };

  const getPrice = () => {
    return item.price || item.pricePerDay || item.pricePerNight || 0;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Book {type.charAt(0).toUpperCase() + type.slice(1)}</h2>

        {!showPayment ? (
          <form onSubmit={handleBookingSubmit} className="booking-form">
            <div className="booking-summary">
              <h3>{item.name || item.airline || item.operator}</h3>
              {type === 'flight' && (
                <p>{item.origin} → {item.destination}</p>
              )}
              {(type === 'train' || type === 'bus') && (
                <p>{item.origin} → {item.destination}</p>
              )}
              <p className="price">${getPrice()}</p>
            </div>

            {type === 'car' && (
              <>
                <div className="form-group">
                  <label>Pick-up Location</label>
                  <input
                    type="text"
                    value={bookingDetails.location}
                    onChange={(e) => setBookingDetails({...bookingDetails, location: e.target.value})}
                    required
                    placeholder="Enter location"
                  />
                </div>
                <div className="form-group">
                  <label>Pick-up Date</label>
                  <input
                    type="date"
                    value={bookingDetails.pickUpDate}
                    onChange={(e) => setBookingDetails({...bookingDetails, pickUpDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Drop-off Date</label>
                  <input
                    type="date"
                    value={bookingDetails.dropOffDate}
                    onChange={(e) => setBookingDetails({...bookingDetails, dropOffDate: e.target.value})}
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>Number of Passengers</label>
              <select
                value={bookingDetails.passengers}
                onChange={(e) => setBookingDetails({...bookingDetails, passengers: e.target.value})}
              >
                {[1,2,3,4,5,6].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Phone Number (Optional - for SMS notifications)</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (e.target.value) localStorage.setItem('userPhoneNumber', e.target.value);
                }}
                placeholder="+1234567890"
              />
              <small>Format: +[country code][number] (e.g., +12025551234)</small>
            </div>

            <div className="booking-info">
              <p>✉️ Invoice will be sent to: <strong>{user.email}</strong></p>
              <p>📄 PDF invoice will be attached</p>
              {phoneNumber && <p>📱 SMS notification will be sent to: <strong>{phoneNumber}</strong></p>}
              <p>🔔 Browser notification will be sent if enabled</p>
            </div>

            <button type="submit" className="btn btn-primary btn-lg">
              Continue to Payment
            </button>
          </form>
        ) : (
          <div className="payment-section">
            <div className="booking-summary">
              <p><strong>Total Amount:</strong> ${getPrice()}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            
            <Elements stripe={stripePromise}>
              <PaymentForm 
                amount={getPrice()}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowPayment(false)}
              />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
