import React from "react";
import "./Coaches.css";
import { HomeHeader } from "../../components/HomeHeader";
import michaelImg from "./images/michael.png";

export default function Michael({ onBack, onBookNow }) {
  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
      <HomeHeader />

      <main className="flex-1 flex flex-col items-center px-4 pb-16">
        <div className="w-full max-w-4xl">
          <button
            type="button"
            onClick={() => onBack?.()}
            className="mt-8 mb-6 text-sm font-semibold text-black hover:underline"
          >
            ← Back to Coaches
          </button>

          <section className="relative bg-white rounded-[28px] shadow-[0_24px_80px_rgba(35,43,65,0.16)] px-6 sm:px-12 py-10 text-center overflow-hidden">
            <div className="absolute right-10 top-10 h-28 w-28 rounded-full border-[6px] border-[#ffd93b] opacity-80" />

            <div className="relative mx-auto h-[160px] w-[160px] sm:h-[180px] sm:w-[180px] rounded-[28px] overflow-hidden shadow-[0_14px_38px_rgba(16,24,40,0.18)]">
              <img
                src={michaelImg}
                alt="Michael Rodriguez"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-6 space-y-2">
              <h1 className="text-2xl sm:text-[28px] font-semibold text-[#1d1d1f]">
                Michael Rodriguez
              </h1>
              <p className="text-base sm:text-lg text-[#3c3c8c] font-semibold">
                Advanced Techniques
              </p>
            </div>

            <div className="mt-6 space-y-3 text-sm text-[#1f1f1f] leading-relaxed">
              <p>
                Creds: 15+ yrs, coached state champions & adult-league winners,
                TA Club Professional.
              </p>
              <p>
                Programs: Advanced stroke refinement, tournament prep & match
                strategy, fitness & footwork blocks, high-intensity sparring.
              </p>
              <p className="font-semibold">Best for: Intermediate–Advanced</p>
              <p>
                Availability: Mon–Fri 5:00–9:00 pm, Sat 8:00 am–12:00 pm
              </p>
              <p>Location: Denistone courts | Rate: $80/hr</p>
              <p>Language: English</p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 text-[13px] text-gray-600">
              {["in", "x", "ig", "f"].map((label) => (
                <span
                  key={label}
                  className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                className="w-full sm:w-auto min-w-[160px] rounded-md bg-black px-6 py-3 text-white font-semibold text-[15px] shadow-sm hover:opacity-90 transition"
                onClick={() => onBookNow?.()}
              >
                Book Now!
              </button>
              <button className="w-full sm:w-auto min-w-[140px] rounded-md border border-gray-400 px-6 py-3 text-[15px] font-medium text-[#1f1f1f] hover:bg-gray-50 transition">
                Learn More
              </button>
            </div>
          </section>
        </div>
      </main>

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
