import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./CoachesPage.css";

const CoachesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="coaches-page">
      {/* Header */}
      <header className="coaches-header">
        <div className="logo">ajh</div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          <Link to="/clubs">Clubs</Link>
          <Link to="/coaches" className="active-nav">
            Coaches
          </Link>
          <Link to="#contact">Contact Us</Link>
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
            <button 
              className="primary-cta"
              onClick={() => navigate("/clubs/join")}
            >
              Let's Get Started
            </button>
          </div>

          {/* Image */}
          <div className="coaches-image-wrapper">
            <img
              className="coaches-image"
              src="/images/mytennis.png"
              alt="Tennis coaching"
              onError={(e) => {
                e.target.src = "/images/adult.jpg";
              }}
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
              <Link to="#why">Why Choose Us?</Link>
              <Link to="#featured">Featured</Link>
              <Link to="#partnership">Partnership</Link>
              <Link to="#team">Our Team</Link>
            </div>

            <div className="footer-column">
              <h4>Community</h4>
              <Link to="/events">Events</Link>
              <Link to="#blog">Blog</Link>
              <Link to="#podcast">Podcast</Link>
              <Link to="#invite">Invite a friend</Link>
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
            <Link to="#privacy">Privacy & Policy</Link>
            <Link to="#terms">Terms & Condition</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CoachesPage;

