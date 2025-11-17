import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './NotificationSetup.css';

const NotificationSetup = () => {
  const { user } = useAuth();
  const [notificationStatus, setNotificationStatus] = useState({
    permission: 'default',
    subscribed: false,
    supported: false
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  useEffect(() => {
    checkNotificationSupport();
    const savedPhone = localStorage.getItem('userPhoneNumber');
    if (savedPhone) setPhoneNumber(savedPhone);
  }, []);

  const checkNotificationSupport = () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setNotificationStatus(prev => ({
        ...prev,
        supported: true,
        permission: Notification.permission
      }));
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(prev => ({ ...prev, permission }));

      if (permission === 'granted') {
        await setupPushNotifications();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const setupPushNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);

      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa-40HI80NM9f4EmgS7DTOSQ7JmKXox8_dQXBPBqZpZAY38jqFOvzD9Jbw';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      await axios.post('http://localhost:5000/api/notifications/subscribe', {
        subscription
      });

      setNotificationStatus(prev => ({ ...prev, subscribed: true }));
      
      new Notification('🎉 Notifications Enabled!', {
        body: 'You\'ll now receive booking confirmations on your device',
        icon: '/icon-192x192.png'
      });
    } catch (error) {
      console.error('Error setting up push notifications:', error);
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const testNotification = async () => {
    try {
      await axios.post('http://localhost:5000/api/notifications/test', {
        phoneNumber: phoneNumber || undefined
      });
      alert('Test notification sent! Check your devices.');
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert('Failed to send test notification');
    }
  };

  const savePhoneNumber = () => {
    localStorage.setItem('userPhoneNumber', phoneNumber);
    setShowPhoneInput(false);
    alert('Phone number saved! You\'ll receive SMS notifications for bookings.');
  };

  if (!user) return null;

  return (
    <div className="notification-setup">
      <h3>📱 Notification Settings</h3>
      
      <div className="notification-options">
        <div className="notification-option">
          <div className="option-header">
            <span className="option-icon">🔔</span>
            <div>
              <h4>Browser Notifications</h4>
              <p>Get instant notifications in your browser</p>
            </div>
          </div>
          
          {notificationStatus.supported ? (
            <div className="option-actions">
              {notificationStatus.permission === 'granted' ? (
                <div className="status-granted">
                  <span className="status-icon">✅</span>
                  <span>Enabled</span>
                  <button onClick={testNotification} className="btn btn-sm btn-secondary">
                    Test
                  </button>
                </div>
              ) : (
                <button 
                  onClick={requestNotificationPermission}
                  className="btn btn-primary"
                >
                  Enable Notifications
                </button>
              )}
            </div>
          ) : (
            <span className="not-supported">Not supported in this browser</span>
          )}
        </div>

        <div className="notification-option">
          <div className="option-header">
            <span className="option-icon">📱</span>
            <div>
              <h4>SMS Notifications</h4>
              <p>Get booking confirmations via text message</p>
            </div>
          </div>
          
          <div className="option-actions">
            {!showPhoneInput ? (
              <button 
                onClick={() => setShowPhoneInput(true)}
                className="btn btn-secondary"
              >
                {phoneNumber ? 'Update Phone' : 'Add Phone Number'}
              </button>
            ) : (
              <div className="phone-input-group">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  className="phone-input"
                />
                <button onClick={savePhoneNumber} className="btn btn-primary btn-sm">
                  Save
                </button>
                <button onClick={() => setShowPhoneInput(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="notification-option">
          <div className="option-header">
            <span className="option-icon">💬</span>
            <div>
              <h4>WhatsApp Notifications</h4>
              <p>Get booking confirmations on WhatsApp</p>
            </div>
          </div>
          
          <div className="option-actions">
            <span className="info-text">
              {phoneNumber ? 'Enabled with your phone number' : 'Add phone number to enable'}
            </span>
          </div>
        </div>
      </div>

      <div className="notification-info">
        <p>💡 <strong>Tip:</strong> Enable all notification methods to never miss a booking confirmation!</p>
      </div>
    </div>
  );
};

export default NotificationSetup;
