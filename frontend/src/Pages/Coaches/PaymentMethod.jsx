import React, { useState } from "react";
import "./Coaches.css";
import { HomeHeader } from "../../components/HomeHeader";
import { createCheckoutSession } from "../../services/paymentService";

export default function PaymentMethod({ onBack, onSummary }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      const params = new URLSearchParams(window.location.search);
      const amount = parseFloat(params.get("amount") || "80.00");
      const bookingName = params.get("bookingName") || "Coaching Session";
      const bookingId = params.get("bookingId") || "coach-booking";

      const response = await createCheckoutSession({
        eventId: bookingId,
        eventName: bookingName,
        amount,
        currency: "aud",
        successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/coaches?canceled=true`,
      });

      if (response.url) {
        window.location.href = response.url;
        return;
      }

      throw new Error("No checkout URL received");
    } catch (err) {
      console.error("Payment error:", err);
      let errorMessage = "Failed to process payment. Please try again.";
      if (err?.message) {
        if (err.message.includes("Failed to fetch") || err.message.includes("Cannot connect")) {
          errorMessage =
            "Cannot connect to payment server. Please check if the backend is running on port 5001.";
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

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
            <div className="flex items-center justify-center gap-2 h-10 rounded-md border border-[#0f243f] bg-white shadow-sm">
              <span className="text-[#0f243f]">💳</span>
              <span className="text-[#0f243f]">Payment Method</span>
            </div>
            <div className="flex items-center justify-center gap-2 h-10 rounded-md border border-[#d8deea] bg-[#f5f7fb] text-[#9aa1ae]">
              <span>✔️</span>
              <span>Payment Success</span>
            </div>
            <div className="flex items-center justify-center gap-2 h-10 rounded-md border border-[#d8deea] bg-[#f5f7fb] text-[#9aa1ae]">
              <span>🕒</span>
              <span>Payment History</span>
            </div>
          </div>

          <section className="bg-white rounded-[20px] shadow-[0_18px_60px_rgba(35,43,65,0.12)] border border-[#e5e7eb] px-5 sm:px-8 py-8">
            <div className="flex items-center gap-2 text-sm font-semibold mb-5">
              <span className="text-[#111]">💳</span>
              <span className="text-[#111]">Payment Method</span>
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <button className="w-full h-11 rounded-md border border-[#0f243f] bg-white text-sm font-semibold text-[#0f243f] shadow-sm cursor-pointer">
                Credit Card
              </button>
              <button className="w-full h-11 rounded-md border border-[#d8deea] bg-[#f5f7fb] text-sm font-semibold text-[#1f1f1f] cursor-pointer">
                PayPal
              </button>
              <button className="w-full h-11 rounded-md border border-[#d8deea] bg-[#f5f7fb] text-sm font-semibold text-[#1f1f1f] cursor-pointer">
                Bank Transfer
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-sm font-semibold text-[#111]">
                Card Number
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="mt-2 w-full h-12 rounded-md border border-[#d5ddeb] bg-[#f7f9fc] px-3 text-sm font-normal outline-none focus:border-[#2f68ff] focus:ring-2 focus:ring-[#2f68ff]/20 transition"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="text-sm font-semibold text-[#111]">
                  Expiry Date
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="mt-2 w-full h-12 rounded-md border border-[#d5ddeb] bg-[#f7f9fc] px-3 text-sm font-normal outline-none focus:border-[#2f68ff] focus:ring-2 focus:ring-[#2f68ff]/20 transition"
                  />
                </label>
                <label className="text-sm font-semibold text-[#111]">
                  CVV
                  <input
                    type="text"
                    placeholder="123"
                    className="mt-2 w-full h-12 rounded-md border border-[#d5ddeb] bg-[#f7f9fc] px-3 text-sm font-normal outline-none focus:border-[#2f68ff] focus:ring-2 focus:ring-[#2f68ff]/20 transition"
                  />
                </label>
              </div>

              <label className="text-sm font-semibold text-[#111]">
                Cardholder Name
                <input
                  type="text"
                  placeholder="John Doe"
                  className="mt-2 w-full h-12 rounded-md border border-[#d5ddeb] bg-[#f7f9fc] px-3 text-sm font-normal outline-none focus:border-[#2f68ff] focus:ring-2 focus:ring-[#2f68ff]/20 transition"
                />
              </label>
            </div>

            <div className="mt-6 pt-4 border-t border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm font-semibold text-[#111]">Total Amount:</div>
              <div className="text-2xl font-bold text-[#111]">$80.00</div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={() => onBack?.()}
                className="w-full sm:w-auto min-w-[140px] rounded-md border border-gray-400 px-6 py-3 text-[15px] font-medium text-[#1f1f1f] hover:bg-gray-50 transition cursor-pointer"
              >
                Back to Summary
              </button>
              <button
                type="button"
                className="w-full sm:w-auto min-w-[180px] rounded-md bg-[#0f243f] px-6 py-3 text-white font-semibold text-[15px] shadow-sm hover:opacity-95 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "$ Pay $80.00"}
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
