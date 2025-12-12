import React, { useState } from "react";
import "./Payment.css";
import svgPaths from "../../utils/svgPaths";
import { createCheckoutSession } from "../../services/paymentService";

const LOGO_SRC = "/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png";

interface PaymentProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
  onPaymentSuccess?: () => void;
}

export default function Payment({ onBack, onNavigate, onPaymentSuccess }: PaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBackToEvents = () => {
    if (onBack) {
      onBack();
    } else if (onNavigate) {
      onNavigate("events");
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribed:", email);
    setEmail("");
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // Get event details from URL params or state
      // For now, using placeholder values - you should get these from your event context
      const eventId = new URLSearchParams(window.location.search).get('eventId') || '1';
      const eventName = new URLSearchParams(window.location.search).get('eventName') || 'Tennis Event';
      const amount = parseFloat(new URLSearchParams(window.location.search).get('amount') || '75.00');

      // Create checkout session
      const response = await createCheckoutSession({
        eventId,
        eventName,
        amount,
        currency: 'usd',
        customerEmail: email || undefined,
        successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/payment?canceled=true`,
      });

      // Redirect to Stripe Checkout
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to process payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-page bg-[#f7fafc] min-h-screen flex flex-col">
      {/* Header with Back to Events */}
      <header className="payment-header bg-black w-full h-auto min-h-[80px] md:h-[124.5px] relative">
        <button
          onClick={handleBackToEvents}
          className="absolute left-[20px] md:left-[45px] top-[20px] md:top-[52px] flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity z-10"
        >
          <div className="w-[30px] h-[30px] md:w-[35px] md:h-[35px] flex items-center justify-center">
            <svg
              className="w-full h-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 30 30"
            >
              <path
                d={svgPaths.p143f6f80}
                fill="#ffffff"
              />
            </svg>
          </div>
          <p className="font-['Roboto:Medium',sans-serif] font-medium text-base md:text-[24px] text-white leading-[1.5]">
            Back to Events
          </p>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Payment Form Section */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
              Payment Center
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Manage your bookings, payments, and view transaction history
            </p>
          </div>

          {/* Payment Steps Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <button
              type="button"
              onClick={() => onNavigate?.("events")}
              className="flex items-center justify-center gap-2 h-10 rounded-md border border-gray-300 bg-[#f5f7fb] text-sm font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              <span>📅</span>
              <span className="hidden sm:inline">Booking Summary</span>
            </button>
            <div className="flex items-center justify-center gap-2 h-10 rounded-md border-2 border-black bg-white text-sm font-semibold text-black">
              <span>💳</span>
              <span className="hidden sm:inline">Payment Method</span>
            </div>
            <div className="flex items-center justify-center gap-2 h-10 rounded-md border border-gray-300 bg-[#f5f7fb] text-sm font-semibold text-gray-400">
              <span>✔️</span>
              <span className="hidden sm:inline">Payment Success</span>
            </div>
            <div className="flex items-center justify-center gap-2 h-10 rounded-md border border-gray-300 bg-[#f5f7fb] text-sm font-semibold text-gray-400">
              <span>🕒</span>
              <span className="hidden sm:inline">Payment History</span>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-[20px] shadow-lg border border-gray-200 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl">💳</span>
              <h2 className="text-lg font-semibold text-black">Payment Method</h2>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod("credit-card")}
                className={`h-11 rounded-md border text-sm font-semibold transition ${
                  paymentMethod === "credit-card"
                    ? "border-black bg-white text-black shadow-sm"
                    : "border-gray-300 bg-[#f5f7fb] text-gray-700 hover:bg-gray-100"
                }`}
              >
                Credit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("apple-pay")}
                className={`h-11 rounded-md border text-sm font-semibold transition ${
                  paymentMethod === "apple-pay"
                    ? "border-black bg-white text-black shadow-sm"
                    : "border-gray-300 bg-[#f5f7fb] text-gray-700 hover:bg-gray-100"
                }`}
              >
                Apple Pay
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("google-pay")}
                className={`h-11 rounded-md border text-sm font-semibold transition ${
                  paymentMethod === "google-pay"
                    ? "border-black bg-white text-black shadow-sm"
                    : "border-gray-300 bg-[#f5f7fb] text-gray-700 hover:bg-gray-100"
                }`}
              >
                Google Pay
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Payment Form */}
            {paymentMethod === "credit-card" && (
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full h-12 rounded-md border border-gray-300 bg-[#f7f9fc] px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full h-12 rounded-md border border-gray-300 bg-[#f7f9fc] px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full h-12 rounded-md border border-gray-300 bg-[#f7f9fc] px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    className="w-full h-12 rounded-md border border-gray-300 bg-[#f7f9fc] px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-black">Total Amount:</div>
                  <div className="text-2xl font-bold text-black">$75.00</div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleBackToEvents}
                    className="w-full sm:w-auto min-w-[140px] rounded-md border border-gray-400 px-6 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full sm:w-auto min-w-[180px] rounded-md bg-[#191919] px-6 py-3 text-white font-semibold text-[15px] shadow-sm hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : '$ Pay $75.00'}
                  </button>
                </div>
              </form>
            )}

            {paymentMethod === "apple-pay" && (
              <div className="space-y-4">
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">Pay securely with Apple Pay</p>
                </div>
                <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-black">Total Amount:</div>
                  <div className="text-2xl font-bold text-black">$75.00</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleBackToEvents}
                    className="w-full sm:w-auto min-w-[140px] rounded-md border border-gray-400 px-6 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full sm:w-auto min-w-[180px] rounded-md bg-black px-6 py-3 text-white font-semibold text-[15px] shadow-sm hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Pay with Apple Pay'}
                  </button>
                </div>
              </div>
            )}

            {paymentMethod === "google-pay" && (
              <div className="space-y-4">
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-gray-300 rounded-full mb-4">
                    <span className="text-gray-700 text-2xl">G</span>
                  </div>
                  <p className="text-gray-600 mb-4">Pay securely with Google Pay</p>
                </div>
                <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-black">Total Amount:</div>
                  <div className="text-2xl font-bold text-black">$75.00</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleBackToEvents}
                    className="w-full sm:w-auto min-w-[140px] rounded-md border border-gray-400 px-6 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full sm:w-auto min-w-[180px] rounded-md bg-white border-2 border-gray-300 px-6 py-3 text-gray-700 font-semibold text-[15px] shadow-sm hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-gray-700 font-bold">G</span>
                    {isProcessing ? 'Processing...' : 'Pay with Google Pay'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer - Same as Homepage */}
      <footer className="payment-footer bg-black text-white mt-12">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
          {/* Newsletter Section */}
          <div className="mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
              {/* Logo and Newsletter */}
              <div className="flex-1 max-w-md">
                <div className="mb-4">
                  <img
                    src={LOGO_SRC}
                    alt="AJH Sports"
                    className="h-[31px] w-[47px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                  />
                </div>
                <h3 className="font-['Inter:Bold',sans-serif] font-bold text-2xl md:text-[32px] text-white mb-2">
                  Join Our Newsletter
                </h3>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-xs md:text-sm text-gray-300 mb-4">
                  Subscribe to our newsletter to be the first to know about new sessions, competitions and events.
                </p>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-[46px] px-4 rounded-[4px] border border-black bg-white text-black text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <button
                    type="submit"
                    className="h-[46px] px-6 bg-[#191919] rounded-[100px] font-['Inter:Bold',sans-serif] font-bold text-sm text-white hover:bg-[#333] transition whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              {/* Vertical Divider - Desktop */}
              <div className="hidden lg:block w-[1px] h-[213px] bg-gray-600" />

              {/* Footer Links - Desktop */}
              <div className="hidden lg:grid grid-cols-3 gap-8 flex-1">
                <div>
                  <h4 className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-xl text-white mb-4">
                    About
                  </h4>
                  <div className="font-['Inter:Medium',sans-serif] font-medium text-base text-gray-300 space-y-2">
                    <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Why Choose Us?</p>
                    <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Featured</p>
                    <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Partnership</p>
                    <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Our Team</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-xl text-white mb-4">
                    Community
                  </h4>
                  <div className="font-['Inter:Medium',sans-serif] font-medium text-base text-gray-300 space-y-2">
                    <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Events</p>
                    <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Blog</p>
                    <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Podcast</p>
                    <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Invite a friend</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-xl text-white mb-4">
                    Contact Us
                  </h4>
                  <div className="font-['Inter:Medium',sans-serif] font-medium text-base text-gray-300 space-y-2">
                    <p>ajhsports.com.au</p>
                    <p>+61 0412345678</p>
                    <p>123 Ave, Sydney, NSW</p>
                  </div>
                </div>
              </div>

              {/* Footer Links - Mobile/Tablet */}
              <div className="lg:hidden w-full grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                <div>
                  <h4 className="font-semibold text-base text-white mb-3">About</h4>
                  <div className="font-medium text-sm text-gray-300 space-y-2">
                    <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Why Choose Us?</p>
                    <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Featured</p>
                    <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Partnership</p>
                    <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Our Team</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-base text-white mb-3">Community</h4>
                  <div className="font-medium text-sm text-gray-300 space-y-2">
                    <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Events</p>
                    <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Blog</p>
                    <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Podcast</p>
                    <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Invite a friend</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-base text-white mb-3">Contact Us</h4>
                  <div className="font-medium text-sm text-gray-300 space-y-2">
                    <p>ajhsports.com.au</p>
                    <p>+61 0412345678</p>
                    <p>123 Ave, Sydney, NSW</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Divider */}
          <div className="w-full h-[1px] bg-gray-600 mb-6" />

          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="font-['Inter:Regular',sans-serif] font-normal text-base text-white">
                AJH Sports
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-sm text-gray-400">
                ©2025 AJH Sports. All rights reserved
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm">f</span>
              </div>
              <div className="w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm">𝕏</span>
              </div>
              <div className="w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm">in</span>
              </div>
            </div>

            {/* Privacy & Terms */}
            <div className="flex gap-4">
              <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-sm md:text-base text-gray-400 cursor-pointer hover:text-[#e0cb23] transition-colors">
                Privacy & Policy
              </p>
              <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-sm md:text-base text-gray-400 cursor-pointer hover:text-[#e0cb23] transition-colors">
                Terms & Condition
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

