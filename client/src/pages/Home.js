import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: '🏨',
      title: 'Luxury Hotels',
      description: 'Book from millions of hotels worldwide',
      gradient: 'var(--gradient-primary)',
      link: '/hotels'
    },
    {
      icon: '✈️',
      title: 'Cheap Flights',
      description: 'Find the best flight deals instantly',
      gradient: 'var(--gradient-ocean)',
      link: '/transport'
    },
    {
      icon: '🚗',
      title: 'Car Rentals',
      description: 'Rent cars at the best prices',
      gradient: 'var(--gradient-sunset)',
      link: '/cars'
    },
    {
      icon: '🚂',
      title: 'Trains & Buses',
      description: 'Travel comfortably by rail or road',
      gradient: 'var(--gradient-forest)',
      link: '/transport'
    }
  ];

  const destinations = [
    { name: 'Paris', image: '🗼', color: '#667eea' },
    { name: 'Tokyo', image: '🗾', color: '#f093fb' },
    { name: 'New York', image: '🗽', color: '#4facfe' },
    { name: 'London', image: '🏰', color: '#43e97b' },
    { name: 'Dubai', image: '🕌', color: '#fa709a' },
    { name: 'Bali', image: '🏝️', color: '#a8edea' }
  ];

  const stats = [
    { value: '10M+', label: 'Hotels Worldwide', icon: '🏨' },
    { value: '500K+', label: 'Flight Routes', icon: '✈️' },
    { value: '50K+', label: 'Car Rentals', icon: '🚗' },
    { value: '1M+', label: 'Happy Travelers', icon: '😊' }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        
        <div className="container hero-content">
          <div className="hero-text animate-fadeIn">
            <h1 className="hero-title">
              Your Journey Begins
              <span className="text-gradient"> Here</span>
            </h1>
            <p className="hero-subtitle">
              Discover amazing destinations, book hotels, flights, and cars all in one place.
              Your perfect trip is just a click away! ✨
            </p>
            <div className="hero-buttons">
              <Link to="/hotels" className="btn btn-primary btn-lg">
                <span>🏨</span> Explore Hotels
              </Link>
              <Link to="/transport" className="btn btn-accent btn-lg">
                <span>✈️</span> Find Flights
              </Link>
            </div>
          </div>

          <div className="hero-image animate-fadeIn">
            <div className="floating-card card-1">
              <span className="card-icon">🏨</span>
              <div>
                <div className="card-title">Luxury Hotels</div>
                <div className="card-subtitle">From $99/night</div>
              </div>
            </div>
            <div className="floating-card card-2">
              <span className="card-icon">✈️</span>
              <div>
                <div className="card-title">Best Flights</div>
                <div className="card-subtitle">Save up to 40%</div>
              </div>
            </div>
            <div className="floating-card card-3">
              <span className="card-icon">🚗</span>
              <div>
                <div className="card-title">Car Rentals</div>
                <div className="card-subtitle">From $29/day</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle">
              All your travel needs in one beautiful platform
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className={`feature-card ${activeFeature === index ? 'active' : ''}`}
                style={{ '--gradient': feature.gradient }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="destinations">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle">
              Explore the world's most amazing places
            </p>
          </div>

          <div className="destinations-grid">
            {destinations.map((dest, index) => (
              <Link
                key={index}
                to={`/hotels?location=${dest.name}`}
                className="destination-card"
                style={{ '--dest-color': dest.color }}
              >
                <div className="destination-image">{dest.image}</div>
                <div className="destination-overlay">
                  <h3 className="destination-name">{dest.name}</h3>
                  <div className="destination-cta">Explore →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Book your perfect trip in 3 simple steps
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">🔍</div>
              <h3 className="step-title">Search</h3>
              <p className="step-description">
                Find hotels, flights, or cars for your destination
              </p>
            </div>

            <div className="step-connector"></div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">✅</div>
              <h3 className="step-title">Compare</h3>
              <p className="step-description">
                Compare prices and choose the best option
              </p>
            </div>

            <div className="step-connector"></div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">🎉</div>
              <h3 className="step-title">Book</h3>
              <p className="step-description">
                Secure booking with instant confirmation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Adventure?</h2>
            <p className="cta-subtitle">
              Join millions of travelers who trust Velvet Routes for their journeys
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <Link to="/hotels" className="btn btn-secondary btn-lg">
                Browse Hotels
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
