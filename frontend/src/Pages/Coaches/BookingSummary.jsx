import React from "react";
import "./Coaches.css";
import { HomeHeader } from "../../components/HomeHeader";

export default function BookingSummary({ onBack, onProceed }) {
  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
      <HomeHeader />

      <main className="flex-1 flex flex-col items-center px-4 pb-16">
        <div className="w-full max-w-5xl">
          <div className="mt-8 mb-6 flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#121212]">
              Complete your Booking
            </h1>
            <p className="text-base sm:text-lg text-[#222]">
              Secure your payment with a quick payment
            </p>
          </div>

          <section className="bg-white rounded-[28px] shadow-[0_24px_80px_rgba(35,43,65,0.16)] px-6 sm:px-10 py-10">
            <div className="text-center space-y-1 mb-6">
              <h2 className="text-2xl font-semibold text-[#111]">Payment Center</h2>
              <p className="text-sm text-[#4366a0]">
                Manage your bookings, payments, and view transaction history
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm font-semibold mb-8">
              <div className="flex items-center justify-center gap-2 h-10 rounded-md border border-[#d8deea] bg-[#f5f7fb]">
                <span className="text-[#6b7280]">📅</span>
                <span>Booking Summary</span>
              </div>
              <div className="flex items-center justify-center gap-2 h-10 rounded-md border border-[#d8deea]">
                <span className="text-[#6b7280]">💳</span>
                <span>Payment Method</span>
              </div>
              <div className="flex items-center justify-center gap-2 h-10 rounded-md border border-[#d8deea]">
                <span className="text-[#6b7280]">✔️</span>
                <span>Payment Success</span>
              </div>
              <div className="flex items-center justify-center gap-2 h-10 rounded-md border border-[#d8deea]">
                <span className="text-[#6b7280]">🕒</span>
                <span>Payment History</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-[#dfe3ec] rounded-2xl p-5 sm:p-6 bg-[#fafcff]">
                <div className="flex items-center gap-2 mb-4 text-sm font-semibold">
                  <span className="text-[#111]">🗓️</span>
                  <span className="text-[#111]">Booking Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <p className="text-[#111] font-semibold">Coach:</p>
                    <p className="text-[#234889] hover:underline cursor-default">Michael Rodriguez</p>
                  </div>
                  <div>
                    <p className="text-[#111] font-semibold">Package:</p>
                    <p className="text-[#234889]">Advanced Tennis Clinic</p>
                  </div>
                  <div>
                    <p className="text-[#111] font-semibold">Date &amp; Time:</p>
                    <p className="text-[#234889]">June 15, 2025</p>
                    <p className="text-[#234889]">9:00 AM – 11:00 AM</p>
                  </div>
                  <div>
                    <p className="text-[#111] font-semibold">Location:</p>
                    <p className="text-[#234889]">AJH Tennis Center</p>
                    <p className="text-[#234889]">Court 3</p>
                  </div>
                  <div>
                    <p className="text-[#111] font-semibold">Duration:</p>
                    <p className="text-[#234889]">2 hours</p>
                  </div>
                  <div>
                    <p className="text-[#111] font-semibold">Booking Ref:</p>
                    <p className="text-[#234889]">AJH-TN-230615-08</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#e5e7eb] flex items-center justify-between text-base font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-[#111] text-xl">$75.00</span>
                </div>
              </div>

              <div className="border border-[#dfe3ec] rounded-2xl p-5 sm:p-6 bg-white flex flex-col gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#111] mb-2">Additional Notes</p>
                  <p className="text-sm font-semibold text-[#111] mb-2">Notes for Coach (Optional)</p>
                  <textarea
                    rows={4}
                    placeholder="Add any special requests or notes for your coach..."
                    className="w-full rounded-lg border border-[#d5ddeb] bg-[#f5f7fb] px-3 py-3 text-sm text-[#111] outline-none focus:border-[#2f68ff] focus:ring-2 focus:ring-[#2f68ff]/20 transition"
                  />
                </div>

                <div className="rounded-xl bg-[#e9f1ff] border border-[#cfe0ff] p-4 text-sm text-[#1e3b7c]">
                  <p className="font-semibold mb-2">What's Included:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Professional coaching session</li>
                    <li>Court access and equipment</li>
                    <li>Performance feedback</li>
                    <li>Practice recommendations</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-end mt-auto">
                  <button
                    type="button"
                    onClick={() => onBack?.()}
                  className="w-full sm:w-auto min-w-[140px] rounded-md border border-gray-400 px-6 py-3 text-[15px] font-medium text-[#1f1f1f] hover:bg-gray-50 transition cursor-pointer"
                >
                  Back to Booking
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto min-w-[180px] rounded-md bg-[#0f243f] px-6 py-3 text-white font-semibold text-[15px] shadow-sm hover:opacity-95 transition cursor-pointer"
                  onClick={() => onProceed?.()}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
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
