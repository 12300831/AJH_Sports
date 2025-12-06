import React from "react";
import "./Coaches.css";
import { HomeHeader } from "../../components/HomeHeader";

export default function BookNow({ onBack, onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
      <HomeHeader />

      <main className="flex-1 flex flex-col items-center px-4 pb-16">
        <div className="w-full max-w-4xl">
          <button
            type="button"
            onClick={() => onBack?.()}
            className="mt-8 mb-6 text-sm font-semibold text-[#2f68ff] hover:underline"
          >
            ← Back to Michael
          </button>

          <section className="bg-white rounded-[28px] shadow-[0_24px_80px_rgba(35,43,65,0.16)] px-6 sm:px-12 py-10">
            <header className="text-center space-y-2 mb-8">
              <p className="text-sm font-semibold text-[#2f68ff] uppercase tracking-wide">
                Book with Michael
              </p>
              <h1 className="text-2xl sm:text-[28px] font-semibold text-[#1d1d1f]">
                Reserve your coaching session
              </h1>
              <p className="text-sm sm:text-base text-gray-700">
                Share a few details so we can confirm your spot and tailor the session to your goals.
              </p>
            </header>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 text-sm font-semibold text-[#1f1f1f]">
                Full name
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-md border border-gray-300 px-3 py-3 text-sm font-normal outline-none focus:border-[#2f68ff] focus:ring-2 focus:ring-[#2f68ff]/20 transition"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-[#1f1f1f]">
                Email
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-gray-300 px-3 py-3 text-sm font-normal outline-none focus:border-[#2f68ff] focus:ring-2 focus:ring-[#2f68ff]/20 transition"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-[#1f1f1f]">
                Phone
                <input
                  type="tel"
                  placeholder="+61 ..."
                  className="w-full rounded-md border border-gray-300 px-3 py-3 text-sm font-normal outline-none focus:border-[#2f68ff] focus:ring-2 focus:ring-[#2f68ff]/20 transition"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-[#1f1f1f]">
                Preferred day
                <input
                  type="text"
                  placeholder="e.g., Monday or Saturday"
                  className="w-full rounded-md border border-gray-300 px-3 py-3 text-sm font-normal outline-none focus:border-[#2f68ff] focus:ring-2 focus:ring-[#2f68ff]/20 transition"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-[#1f1f1f] md:col-span-2">
                Goals / focus areas
                <textarea
                  rows={4}
                  placeholder="Tell us what you want to work on"
                  className="w-full rounded-md border border-gray-300 px-3 py-3 text-sm font-normal outline-none focus:border-[#2f68ff] focus:ring-2 focus:ring-[#2f68ff]/20 transition resize-y"
                />
              </label>

              <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => onBack?.()}
                  className="w-full sm:w-auto min-w-[140px] rounded-md border border-gray-400 px-6 py-3 text-[15px] font-medium text-[#1f1f1f] hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto min-w-[160px] rounded-md bg-black px-6 py-3 text-white font-semibold text-[15px] shadow-sm hover:opacity-90 transition"
                >
                  Submit Booking
                </button>
              </div>
            </form>
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
