// src/pages/CoachesPage.jsx
import React from "react";
import "./Coaches.css";
import { HomeHeader } from "../../components/HomeHeader";
import michaelImg from "./images/michael.png";
import jamesImg from "./images/James.png";
import markImg from "./images/mark.png";
import kristinImg from "./images/kristin.png";

// Coach images – replace with your actual file names
const coaches = [
  {
    id: "michael-rodriguez",
    name: "Michael Rodriguez",
    role: "Advanced Technique",
    image: michaelImg,
  },
  {
    id: "james-wilson",
    name: "James Wilson",
    role: "Serve Specialist",
    image: jamesImg,
  },
  {
    id: "mark-leo",
    name: "Mark Leo",
    role: "Junior Development",
    image: markImg,
  },
  {
    id: "kristin-russell",
    name: "Kristin Russell",
    role: "Junior Development",
    image: kristinImg,
  },
];

function CoachCard({ coach, onViewProfile }) {
  return (
    <div className="flex flex-col items-center">
      {/* Photo */}
      <div className="w-[280px] h-[240px] rounded-[24px] overflow-hidden mb-4 shadow-sm">
        <img
          src={coach.image}
          alt={coach.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name + role */}
      <div className="text-center mb-3">
        <p className="text-[14px] underline font-medium">{coach.name}</p>
        <p className="text-[12px] text-gray-600 mt-1">{coach.role}</p>
      </div>

      {/* Social icons (simple placeholders – you can replace with real icons) */}
      <div className="flex gap-3 text-[12px] text-gray-600 mb-4">
        {["in", "x", "ig", "f"].map((label) => (
          <span
            key={label}
            className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center"
          >
            {label}
          </span>
        ))}
      </div>

      {/* View profile button */}
      <button
        onClick={() => onViewProfile?.(coach.id)}
        className="border border-[#2f68ff] text-[#2f68ff] text-[12px] px-6 py-2 rounded-[4px] hover:bg-[#2f68ff] hover:text-white transition"
      >
        View Profile
      </button>
    </div>
  );
}

export default function CoachesPage({ onViewProfile }) {
  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
      <HomeHeader />

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto pt-16 pb-12 px-4 md:px-0">
        <h1 className="text-[28px] md:text-[32px] font-semibold text-center mb-12">
          Our tennis Coaches
        </h1>

        {/* 2x2 coach grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-16 gap-y-16 md:gap-y-24">
          {coaches.map((coach) => (
            <CoachCard
              key={coach.id}
              coach={coach}
              onViewProfile={onViewProfile}
            />
          ))}
        </div>
      </main>

      {/* Newsletter + footer */}
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
}
