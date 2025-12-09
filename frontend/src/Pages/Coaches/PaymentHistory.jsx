import React from "react";
import "./Coaches.css";
import { HomeHeader } from "../../components/HomeHeader";

export default function PaymentHistory({ onSummary, onMethod, onSuccess, onReceipt }) {
  const rows = [
    {
      date: "Jun 15, 2025",
      description: "Advanced Tennis Clinic - Michael Rodriguez",
      ref: "AJH-TN-230615-08",
      amount: "$75.00",
      method: "Visa ••••3456",
      status: { label: "Paid", color: "bg-[#dcfce7] text-[#166534]" },
    },
    {
      date: "May 28, 2025",
      description: "Junior Tournament Entry - Sarah Johnson",
      ref: "AJH-TN-230528-05",
      amount: "$45.00",
      method: "PayPal",
      status: { label: "Paid", color: "bg-[#dcfce7] text-[#166534]" },
    },
    {
      date: "Apr 12, 2025",
      description: "Tennis Lesson Package - James Wilson",
      ref: "AJH-TN-230412-12",
      amount: "$200.00",
      method: "Mastercard ••••2298",
      status: { label: "Refunded", color: "bg-[#fee2e2] text-[#b91c1c]" },
    },
    {
      date: "Mar 30, 2025",
      description: "Court Reservation - Court 2",
      ref: "AJH-CR-230330-03",
      amount: "$30.00",
      method: "Bank Transfer",
      status: { label: "Pending", color: "bg-[#fef9c3] text-[#854d0e]" },
    },
  ];

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
            <button
              type="button"
              onClick={() => onSuccess?.()}
              className="flex items-center justify-center gap-2 h-10 rounded-md border border-[#d8deea] bg-[#f5f7fb] cursor-pointer"
            >
              <span className="text-[#6b7280]">✔️</span>
              <span>Payment Success</span>
            </button>
            <div className="flex items-center justify-center gap-2 h-10 rounded-md border border-[#0f243f] bg-white shadow-sm">
              <span className="text-[#0f243f]">🕒</span>
              <span className="text-[#0f243f]">Payment History</span>
            </div>
          </div>

          <section className="bg-white rounded-[20px] shadow-[0_18px_60px_rgba(35,43,65,0.12)] border border-[#e5e7eb] px-4 sm:px-8 py-8">
            <div className="flex items-start gap-2 mb-4">
              <span className="text-lg">🕒</span>
              <div>
                <p className="text-base font-semibold text-[#111]">Payment History</p>
                <p className="text-sm text-[#6b7280]">
                  View your past transactions and bookings
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-[#111]">
                <thead>
                  <tr className="bg-[#f7f9fc] text-[#6b7280] font-semibold">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Payment Method</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr
                      key={row.ref}
                      className={`border-b border-[#e5e7eb] ${idx % 2 === 0 ? "bg-white" : "bg-[#fbfcff]"}`}
                    >
                      <td className="px-4 py-3 align-top">{row.date}</td>
                      <td className="px-4 py-3 align-top">
                        <p className="font-semibold">{row.description}</p>
                        <p className="text-[#6b7280] text-xs">Ref: {row.ref}</p>
                      </td>
                      <td className="px-4 py-3 align-top">{row.amount}</td>
                    <td className="px-4 py-3 align-top">{row.method}</td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${row.status.color}`}
                      >
                        {row.status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-[#1f1f1f] bg-white hover:bg-gray-50 transition cursor-pointer"
                        onClick={() => onReceipt?.()}
                      >
                        ⬇️ Receipt
                      </button>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
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
