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
        currency: 'aud', // Changed to AUD as per backend controller
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
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to process payment. Please try again.';
      
      if (err.message) {
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = 'Cannot connect to payment server. Please ensure the backend is running on port 5001.';
        } else if (err.message.includes('Cannot connect')) {
          errorMessage = err.message;
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
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
      <footer className="payment-footer bg-black text-white mt-12" data-name="MAIN">
        {/* Desktop Layout */}
        <div className="hidden md:block relative min-h-[364px]">
          {/* Newsletter Section - Left Side (matching coaches page) */}
          <div className="absolute left-[30px] top-[30px] flex flex-col gap-[14px] max-w-[520px] text-white">
            {/* Logo */}
            <div 
              className="w-[48px] h-[32px] cursor-pointer"
              data-name="AJHSports-Logo-no-outline-1 3"
              onClick={() => onNavigate && onNavigate('home')}
            >
              <img 
                alt="AJH Sports Logo" 
                className="w-full h-full object-contain" 
                src={LOGO_SRC} 
              />
            </div>
            
            {/* Newsletter Title */}
            <h3 className="text-[24px] font-bold m-0 text-white">
              Join Our Newsletter
            </h3>
            
            {/* Newsletter Description */}
            <p className="text-[14px] text-[#e8e8e8] m-0 mb-2">
              Subscribe to our newsletter to be the first to know about new sessions, competitions and events.
            </p>
            
            {/* Email Input Form */}
            <form onSubmit={handleSubscribe} className="flex gap-[10px]">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-[14px] rounded-[6px] border-none bg-white text-black text-[14px] outline-none placeholder:text-[#6b6b6b]"
              />
              <button
                type="submit"
                className="bg-[#4a4a4a] text-white rounded-[24px] border-none px-[22px] py-3 text-[14px] font-bold cursor-pointer min-w-[120px] hover:opacity-90 transition-opacity duration-150"
              >
                Subscribe
              </button>
            </form>
          </div>
          
          {/* Vertical Divider Line - Desktop */}
          <div className="absolute left-[654px] top-[42px] w-[1px] h-[180px] bg-[#807E7E] hidden lg:block" />
          
          {/* About Section - Desktop */}
          <div className="absolute left-[753px] top-[30px] hidden lg:block w-[180px]">
            <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-[16px]">About</p>
            <div className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[2.2] tracking-[-0.32px]">
              <p 
                className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('home');
                    setTimeout(() => {
                      const element = document.querySelector('[data-name="Copy - Why Choose Us"]');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }
                }}
              >
                Why Choose Us?
              </p>
              <p 
                className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                onClick={() => onNavigate && onNavigate('events')}
              >
                Events
              </p>
              <p 
                className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  if (onNavigate) {
                    onNavigate('coaches');
                  }
                }}
              >
                1-ON-1 Coaching
              </p>
              <p 
                className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('home');
                    setTimeout(() => {
                      const element = document.querySelector('[data-name="Our Lovely Team"]');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }
                }}
              >
                Our Team
              </p>
            </div>
          </div>
          
          {/* Wet Weather Section - Desktop */}
          <div className="absolute left-[960px] top-[30px] hidden lg:block w-[200px]">
            <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-[16px]">
              Wet Weather
            </p>
            <div className="flex flex-col gap-3">
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[1.6] tracking-[-0.32px]">
                Follow us on Twitter for weather updates
              </p>
              <a 
                href="https://x.com/starstv" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A202C] hover:bg-[#e0cb23] text-white hover:text-black rounded-lg transition-all duration-300 w-fit group"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="font-['Inter:Medium',sans-serif] font-medium text-xs">Follow @starstv</span>
              </a>
            </div>
          </div>
          
          {/* Contact Section - Desktop */}
          <div className="absolute left-[1167px] top-[30px] hidden lg:block w-[180px]">
            <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-[16px]">Contact Us</p>
            <div className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[2.2] tracking-[-0.32px]">
              <p>ajh@ajhsports.com.au</p>
              <p>0447827788</p>
              <p>22 Salter Cres, Denistone East NSW 2112</p>
            </div>
          </div>
          
          {/* Bottom Divider - Desktop */}
          <div className="absolute left-[77px] top-[297px] w-[calc(100%-154px)] max-w-[1318.17px] h-[1px] bg-[#807E7E]" />
          
          {/* Copyright - Desktop */}
          <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[30px] text-[11px] text-slate-200 top-[332px] tracking-[-0.22px]">
            ©2025 Company Name. All rights reserved
          </p>
          
          {/* Privacy & Terms - Desktop */}
          <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold text-[11px] text-slate-200 text-right top-[335px] tracking-[-0.22px] cursor-pointer hover:text-[#e0cb23] transition-colors" style={{ left: '1061px' }}>
            Privacy & Policy
          </p>
          <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold text-[11px] text-slate-200 text-right top-[336px] tracking-[-0.22px] cursor-pointer hover:text-[#e0cb23] transition-colors" style={{ left: '1263px' }}>
            Terms & Condition
          </p>
          
          {/* Social Icons - Desktop */}
          <div className="absolute left-[646px] top-[320px] flex gap-[20px]">
            <a 
              href="https://www.facebook.com/aussiestarstv/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-all hover:scale-110"
              aria-label="Facebook"
            >
              <span className="text-[10px] text-white">f</span>
            </a>
            <a 
              href="https://x.com/starstv" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-all hover:scale-110"
              aria-label="Twitter"
            >
              <span className="text-[10px] text-white">𝕏</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/starstv/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-all hover:scale-110"
              aria-label="LinkedIn"
            >
              <span className="text-[10px] text-white">in</span>
            </a>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="md:hidden relative py-8 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Newsletter Section - Mobile (matching coaches page) */}
            <div className="flex flex-col gap-[14px] max-w-[520px] mx-auto text-white mb-8" data-name="AJHSports-Logo-no-outline-1 3">
              {/* Logo */}
              <div 
                className="w-[48px] h-[32px] cursor-pointer"
                onClick={() => onNavigate && onNavigate('home')}
              >
                <img 
                  alt="AJH Sports Logo" 
                  className="w-full h-full object-contain" 
                  src={LOGO_SRC} 
                />
              </div>
              
              {/* Newsletter Title */}
              <h3 className="text-[24px] font-bold m-0 text-white">
                Join Our Newsletter
              </h3>
              
              {/* Newsletter Description */}
              <p className="text-[14px] text-[#e8e8e8] m-0 mb-2">
                Subscribe to our newsletter to be the first to know about new sessions, competitions and events.
              </p>
              
              {/* Email Input Form */}
              <form onSubmit={handleSubscribe} className="flex gap-[10px]">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-[14px] rounded-[6px] border-none bg-white text-black text-[14px] outline-none placeholder:text-[#6b6b6b]"
                />
                <button
                  type="submit"
                  className="bg-[#4a4a4a] text-white rounded-[24px] border-none px-[22px] py-3 text-[14px] font-bold cursor-pointer min-w-[120px] hover:opacity-90 transition-opacity duration-150"
                >
                  Subscribe
                </button>
              </form>
            </div>
            
            {/* Footer Links - Mobile/Tablet */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#807E7E]">
              <div>
                <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-lg text-white mb-3 text-center sm:text-left">About</p>
                <div className="font-['Inter:Medium',sans-serif] font-medium text-sm text-slate-200 space-y-2 text-center sm:text-left">
                  <p 
                    className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate('home');
                        setTimeout(() => {
                          const element = document.querySelector('[data-name="Copy - Why Choose Us"]');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }, 100);
                      }
                    }}
                  >
                    Why Choose Us?
                  </p>
                  <p 
                    className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                    onClick={() => onNavigate && onNavigate('events')}
                  >
                    Events
                  </p>
                  <p 
                    className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'instant' });
                      if (onNavigate) {
                        onNavigate('coaches');
                      }
                    }}
                  >
                    1-ON-1 Coaching
                  </p>
                  <p 
                    className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate('home');
                        setTimeout(() => {
                          const element = document.querySelector('[data-name="Our Lovely Team"]');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }, 100);
                      }
                    }}
                  >
                    Our Team
                  </p>
                </div>
              </div>
              <div>
                <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-lg text-white mb-3 text-center sm:text-left">
                  Wet Weather
                </p>
                <div className="flex flex-col gap-3 items-center sm:items-start">
                  <p className="font-['Inter:Medium',sans-serif] font-medium text-sm text-slate-200 text-center sm:text-left">
                    Follow us on Twitter for weather updates
                  </p>
                  <a 
                    href="https://x.com/starstv" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1A202C] hover:bg-[#e0cb23] text-white hover:text-black rounded-lg transition-all duration-300 w-fit group"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span className="font-['Inter:Medium',sans-serif] font-medium text-[11px]">Follow @starstv</span>
                  </a>
                </div>
              </div>
              <div>
                <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-lg text-white mb-3 text-center sm:text-left">Contact Us</p>
                <div className="font-['Inter:Medium',sans-serif] font-medium text-sm text-slate-200 space-y-2 text-center sm:text-left">
                  <p>ajh@ajhsports.com.au</p>
                  <p>0447827788</p>
                  <p>22 Salter Cres, Denistone East NSW 2112</p>
                </div>
              </div>
            </div>
            
            {/* Bottom Section */}
            <div className="mt-8 pt-6 border-t border-[#807E7E] flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-slate-200 text-center sm:text-left">
                ©2025 Company Name. All rights reserved
              </p>
              <div className="flex items-center gap-4">
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-slate-200 cursor-pointer hover:text-[#e0cb23] transition-colors">
                  Privacy & Policy
                </p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-slate-200 cursor-pointer hover:text-[#e0cb23] transition-colors">
                  Terms & Condition
                </p>
              </div>
              <div className="flex gap-5">
                <a 
                  href="https://www.facebook.com/aussiestarstv/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-all hover:scale-110"
                  aria-label="Facebook"
                >
                  <span className="text-[10px] text-white">f</span>
                </a>
                <a 
                  href="https://x.com/starstv" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-all hover:scale-110"
                  aria-label="Twitter"
                >
                  <span className="text-[10px] text-white">𝕏</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/starstv/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-all hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <span className="text-[10px] text-white">in</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

