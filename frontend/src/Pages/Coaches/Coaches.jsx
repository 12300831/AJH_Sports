import React from "react";
import "./Coaches.css";
import { HomeHeader } from "../../components/HomeHeader";
import oneOnOneImage from "./images/1on1.png";
import groupCoachingImage from "./images/group coaching.png";

const Coaches = ({ onShowCoachesList, onShowLessons }) => {
  const packages = [
    {
      id: "one-on-one",
      title: "1-ON-1 Coaching",
      price: "From $80/hr",
      description:
        "Personalized coaching with expert instructors tailored to your skill level and goals.",
      image: oneOnOneImage,
      ctaColor: "#f2d123",
      badgeTextColor: "#f35d05",
    },
    {
      id: "group",
      title: "Group Coaching",
      price: "From $15/hr",
      description:
        "Join dynamic group sessions and learn alongside other passionate players.",
      image: groupCoachingImage,
      ctaColor: "#f2d123",
      badgeTextColor: "#f35d05",
    },
  ];

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

        {/* Packages section */}
        <section className="coaches-packages">
          <div className="packages-heading">
            <p className="packages-kicker">Coaching Packages</p>
          </div>
          <div className="package-grid">
            {packages.map((pkg) => (
              <article key={pkg.id} className="package-card">
                <div className="package-image-wrapper">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="package-image"
                    style={pkg.id === "one-on-one" ? { objectPosition: "50% 28%" } : undefined}
                  />
                  <span className="package-badge" style={{ color: pkg.badgeTextColor }}>
                    {pkg.price}
                  </span>
                </div>
                <div className="package-info">
              <h3 className="package-title">{pkg.title}</h3>
              <p className="package-description">{pkg.description}</p>
              <button
                className="package-button"
                type="button"
                style={{ backgroundColor: pkg.ctaColor }}
                onClick={
                  pkg.id === "one-on-one"
                    ? () => onShowCoachesList?.()
                    : pkg.id === "group"
                    ? () => onShowLessons?.()
                    : undefined
                }
              >
                {pkg.id === "one-on-one" ? "View Our Coaches" : "View Tennis Lessons"}
              </button>
            </div>
          </article>
            ))}
          </div>
        </section>

        {/* Why Choose Us - pulled from Events page */}
        <section className="why-choose">
          <div className="why-choose-header">
            <h2>Why Choose Us?</h2>
          </div>
          <div className="why-choose-grid">
            {[
              { icon: "🎯", title: "Expert Coaching", desc: "40+ years experience" },
              { icon: "👥", title: "All Levels", desc: "Beginner to advanced" },
              { icon: "🤝", title: "Community", desc: "Friendly environment" },
              { icon: "🏆", title: "Quality", desc: "Modern facilities" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="why-choose-card">
                <div className="why-choose-icon">
                  <span>{icon}</span>
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
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
