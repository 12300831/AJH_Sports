import React from "react";
import "./Coaches.css";
import { HomeHeader } from "../../components/HomeHeader";

export default function PaymentSuccess({
  onSummary,
  onMethod,
  onHistory,
  onReceipt,
  onBookAnother,
}) {
  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
      <HomeHeader />

      <main className="flex-1 flex flex-col items-center px-4 pb-16">
        <div className="w-full max-w-5xl">
          <div className="mt-8 mb-6 text-center space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#121212]">
              Payment Center
            </h1>
            <p className="text-base sm:text-lg text-[#4366a0]">
              Manage your bookings, payments, and view transaction history
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm font-semibold mb-6">
            <button
              type="button"
              onClick={() => onSummary?.()}
              className="flex items-center justify-center gap-2 h-10 rounded-md border border-[#d8deea] bg-[#f5f7fb] cursor-pointer"
            >
              <span className="text-[#6b7280]">📅</span>
              <span>Booking Summary</span>
            </button>
            <button
              type="button"
              onClick={() => onMethod?.()}
              className="flex items-center justify-center gap-2 h-10 rounded-md border border-[#d8deea] bg-[#f5f7fb] cursor-pointer"
            >
              <span className="text-[#6b7280]">💳</span>
              <span>Payment Method</span>
            </button>
            <div className="flex items-center justify-center gap-2 h-10 rounded-md border border-[#0f243f] bg-white shadow-sm">
              <span className="text-[#0f243f]">✔️</span>
              <span className="text-[#0f243f]">Payment Success</span>
            </div>
            <button
              type="button"
              onClick={() => onHistory?.()}
              className="flex items-center justify-center gap-2 h-10 rounded-md border border-[#d8deea] bg-[#f5f7fb] cursor-pointer"
            >
              <span className="text-[#6b7280]">🕒</span>
              <span>Payment History</span>
            </button>
          </div>

          <section className="bg-white rounded-[20px] shadow-[0_18px_60px_rgba(35,43,65,0.12)] border border-[#e5e7eb] px-5 sm:px-10 py-10 flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-[#e8f8ec] border border-[#b8e2c3] flex items-center justify-center mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <h2 className="text-2xl font-semibold text-[#111] mb-2">
              Payment Successful!
            </h2>
            <p className="text-sm sm:text-base text-[#4b5563] text-center mb-8">
              Your booking has been confirmed and payment processed successfully.
            </p>

            <div className="w-full max-w-3xl rounded-2xl bg-[#f8fafc] border border-[#e1e7f0] p-6 text-sm text-[#111]">
              <p className="font-semibold mb-4">Booking Confirmation</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-[#6b7280]">Coach:</p>
                    <p className="font-semibold">Michael Rodriguez</p>
                  </div>
                  <div>
                    <p className="text-[#6b7280]">Time:</p>
                    <p className="font-semibold">9:00 AM – 11:00 AM</p>
                  </div>
                  <div>
                    <p className="text-[#6b7280]">Payment Method:</p>
                    <p className="font-semibold">Visa ending in 3456</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[#6b7280]">Date:</p>
                    <p className="font-semibold">June 15, 2025</p>
                  </div>
                  <div>
                    <p className="text-[#6b7280]">Amount Paid:</p>
                    <p className="font-semibold">$80.00</p>
                  </div>
                  <div>
                    <p className="text-[#6b7280]">Confirmation Code:</p>
                    <p className="font-semibold">AJH-TN-230615-08</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="w-full sm:w-auto min-w-[180px] rounded-md border border-gray-300 px-6 py-3 text-[15px] font-medium text-[#1f1f1f] bg-white hover:bg-gray-50 transition cursor-pointer"
                onClick={() => onReceipt?.()}
              >
                ⬇️ Download Receipt
              </button>
              <button
                type="button"
                className="w-full sm:w-auto min-w-[200px] rounded-md bg-[#0f243f] px-6 py-3 text-white font-semibold text-[15px] shadow-sm hover:opacity-95 transition cursor-pointer"
                onClick={() => (onBookAnother ? onBookAnother() : onSummary?.())}
              >
                Book Another Session
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
