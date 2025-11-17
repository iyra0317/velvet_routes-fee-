import React from 'react';
import './About.css';

const About = () => {
  const teamMembers = [
    {
      name: 'Manleen',
      role: 'Team Lead',
      icon: '👑',
      description: 'Leading the team with vision and coordination',
      color: 'var(--gradient-royal)'
    },
    {
      name: 'Iyra',
      role: 'Backend Developer',
      icon: '⚙️',
      description: 'Building robust server-side architecture',
      color: 'var(--gradient-ocean)'
    },
    {
      name: 'Neeti',
      role: 'UI/UX Designer',
      icon: '🎨',
      description: 'Crafting beautiful user experiences',
      color: 'var(--gradient-sunset)'
    },
    {
      name: 'Eknoor',
      role: 'Website Management',
      icon: '📊',
      description: 'Managing and optimizing the platform',
      color: 'var(--gradient-emerald)'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1 className="hero-title">
            Meet Our <span className="text-gradient">Team</span>
          </h1>
          <p className="hero-subtitle">
            The talented individuals behind Velvet Routes
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="team-card animate-fadeIn"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  '--member-color': member.color
                }}
              >
                <div className="member-icon">{member.icon}</div>
                <h3 className="member-name">{member.name}</h3>
                <div className="member-role">{member.role}</div>
                <p className="member-description">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Project */}
      <section className="project-section">
        <div className="container">
          <div className="project-content">
            <h2 className="section-title">About Velvet Routes</h2>
            <p className="section-text">
              Velvet Routes is a comprehensive travel booking platform designed to make your journey planning seamless and enjoyable. 
              Our platform offers a wide range of services including hotel bookings, flight reservations, car rentals, and ground transportation options.
            </p>
            <p className="section-text">
              Built with modern web technologies and a focus on user experience, Velvet Routes brings together the best travel options 
              from around the world in one beautiful, easy-to-use interface.
            </p>

            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🏨</div>
                <h4>Hotels Worldwide</h4>
                <p>Access to millions of hotels globally</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✈️</div>
                <h4>Flight Booking</h4>
                <p>Compare and book flights easily</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🚗</div>
                <h4>Car Rentals</h4>
                <p>Rent vehicles at best prices</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🚂</div>
                <h4>Ground Transport</h4>
                <p>Trains and buses for every route</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="tech-section">
        <div className="container">
          <h2 className="section-title">Built With</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <div className="tech-icon">⚛️</div>
              <div className="tech-name">React</div>
            </div>
            <div className="tech-item">
              <div className="tech-icon">🟢</div>
              <div className="tech-name">Node.js</div>
            </div>
            <div className="tech-item">
              <div className="tech-icon">🚀</div>
              <div className="tech-name">Express</div>
            </div>
            <div className="tech-item">
              <div className="tech-icon">🎨</div>
              <div className="tech-name">CSS3</div>
            </div>
            <div className="tech-item">
              <div className="tech-icon">🔌</div>
              <div className="tech-name">REST API</div>
            </div>
            <div className="tech-item">
              <div className="tech-icon">💳</div>
              <div className="tech-name">Stripe</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="about-footer">
        <div className="container">
          <p className="footer-text">
            Made with ❤️ by the Velvet Routes Team
          </p>
          <p className="footer-subtext">
            © 2024 Velvet Routes. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
