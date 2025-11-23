import React from "react";
import "./Coaches.css";

const Coaches = () => {
  return (
    <div className="coaches-page">
      {/* Header */}
      <header className="coaches-header">
        <div className="logo">ajh</div>
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#events">Events</a>
          <a href="#clubs">Clubs</a>
          <a href="#coaches" className="active-nav">
            Coaches
          </a>
          <a href="#contact">Contact Us</a>
        </nav>
        <div className="auth-buttons">
          <button className="login-btn">Log In</button>
          <button className="signup-btn">Sign Up</button>
        </div>
      </header>

      {/* Hero section */}
      <main className="coaches-main">
        <section className="coaches-hero">
          <div className="coaches-text">
            <h1>Coaching Packages</h1>
            <p className="coaches-description">
              AJH Sports offers coaching packages for all ages and skill levels.
              Choose a plan that fits your goals, every package includes 10 weeks
              of lessons (1 hour/week), reduced entry to social tennis sessions,
              and catch-up group sessions for wet-weather closures.
            </p>
            <button className="primary-cta">Let's Get Started</button>
          </div>

          {/* ⭐️ Updated: Your own image */}
          <div className="coaches-image-wrapper">
            <img
              className="coaches-image"
              src="/images/mytennis.png"
              alt="Tennis coaching"
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="coaches-footer">
        <div className="footer-top">
          <div className="newsletter">
            <h3>Join Our Newsletter</h3>
            <p>
              Subscribe to our newsletter to be the first to know about new
              sessions, competitions and events.
            </p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email" />
              <button>Subscribe</button>
            </div>
          </div>

          <div className="footer-columns">
            <div className="footer-column">
              <h4>About</h4>
              <a href="#why">Why Choose Us?</a>
              <a href="#featured">Featured</a>
              <a href="#partnership">Partnership</a>
              <a href="#team">Our Team</a>
            </div>

            <div className="footer-column">
              <h4>Community</h4>
              <a href="#events">Events</a>
              <a href="#blog">Blog</a>
              <a href="#podcast">Podcast</a>
              <a href="#invite">Invite a friend</a>
            </div>

            <div className="footer-column">
              <h4>Contact Us</h4>
              <p>ajhsports.com.au</p>
              <p>+61 0412345678</p>
              <p>123 Ave, Sydney, NSW</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>©2025 Company Name. All rights reserved</span>
          <div className="footer-links">
            <a href="#privacy">Privacy & Policy</a>
            <a href="#terms">Terms & Condition</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Coaches;
