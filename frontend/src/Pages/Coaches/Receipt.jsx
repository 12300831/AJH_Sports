import React from "react";
import "./Coaches.css";
import { HomeHeader } from "../../components/HomeHeader";

export default function Receipt({ onBack }) {
  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
      <HomeHeader />

      <main className="flex-1 flex flex-col items-center px-4 pb-16">
        <div className="w-full max-w-4xl">
          <div className="mt-8 mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#121212]">Payment Receipt</h1>
              <p className="text-sm text-[#51607a]">Confirmation of your booking and payment.</p>
            </div>
            <button
              type="button"
              onClick={() => onBack?.()}
              className="text-sm font-semibold text-[#2f68ff] hover:underline"
            >
              ← Back
            </button>
          </div>

          <section className="bg-white rounded-[20px] shadow-[0_18px_60px_rgba(35,43,65,0.12)] border border-[#e5e7eb] p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase text-[#6b7280] tracking-wide">Receipt No.</p>
                <p className="text-lg font-semibold text-[#111]">AJH-RC-230615-08</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase text-[#6b7280] tracking-wide">Date</p>
                <p className="text-lg font-semibold text-[#111]">June 15, 2025</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <p className="text-xs uppercase text-[#6b7280] tracking-wide">Billed To</p>
                <p className="text-base font-semibold text-[#111]">Michael Rodriguez</p>
                <p className="text-sm text-[#4b5563]">AJH Tennis Center</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase text-[#6b7280] tracking-wide">Payment Method</p>
                <p className="text-base font-semibold text-[#111]">Visa ending in 3456</p>
                <p className="text-sm text-[#4b5563]">Auth Code: AJH-TN-230615-08</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#e5e7eb]">
              <div className="grid grid-cols-4 bg-[#f7f9fc] text-xs font-semibold text-[#6b7280] px-4 py-3">
                <span className="col-span-2">Description</span>
                <span>Qty</span>
                <span className="text-right">Amount</span>
              </div>
              <div className="grid grid-cols-4 px-4 py-3 text-sm text-[#111] border-t border-[#e5e7eb]">
                <div className="col-span-2">
                  <p className="font-semibold">Advanced Tennis Clinic</p>
                  <p className="text-xs text-[#6b7280]">Coach: Michael Rodriguez | 2 hr session</p>
                </div>
                <div>1</div>
                <div className="text-right">$80.00</div>
              </div>
              <div className="px-4 py-3 text-sm text-[#111] border-t border-[#e5e7eb] grid grid-cols-4 bg-[#fbfcff]">
                <div className="col-span-3 text-right font-semibold">Total Paid</div>
                <div className="text-right font-bold">$80.00</div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto min-w-[160px] rounded-md border border-gray-300 px-6 py-3 text-[15px] font-semibold text-[#1f1f1f] bg-white hover:bg-gray-50 transition cursor-pointer"
              >
                ⬇️ Download / Print
              </button>
              <button
                type="button"
                onClick={() => onBack?.()}
                className="w-full sm:w-auto min-w-[140px] rounded-md bg-[#0f243f] px-6 py-3 text-white font-semibold text-[15px] shadow-sm hover:opacity-95 transition cursor-pointer"
              >
                Back to Success
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
