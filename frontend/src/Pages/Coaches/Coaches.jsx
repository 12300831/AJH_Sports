import React from "react";
import "./Coaches.css";
import { HomeHeader } from "../../components/HomeHeader";

const Coaches = () => {
  return (
    <div className="coaches-page">
      {/* Header */}
      <HomeHeader />

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
          <div className="footer-left">
            <div className="footer-logo" aria-label="AJH Sports">
              <img
                src="/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png"
                alt="AJH Sports"
              />
            </div>
            <h3>Join Our Newsletter</h3>
            <p>
              Subscribe to our newsletter to be the first to know about new
              sessions, competitions and events.
            </p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email" />
              <button type="button">Subscribe</button>
            </div>
          </div>

          <div className="footer-divider" aria-hidden="true" />

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

        <div className="footer-separator" aria-hidden="true" />

        <div className="footer-bottom">
          <span className="footer-copy">©2025 Company Name. All rights reserved</span>
          <div className="footer-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
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
