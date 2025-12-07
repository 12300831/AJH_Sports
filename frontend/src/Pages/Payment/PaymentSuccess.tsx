import React, { useState } from "react";
import "./PaymentSuccess.css";
import svgPaths from "../../utils/svgPaths";

const LOGO_SRC = "/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png";

interface PaymentSuccessProps {
  onNavigate?: (page: string) => void;
  onBookAnother?: () => void;
}

export default function PaymentSuccess({ onNavigate, onBookAnother }: PaymentSuccessProps) {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed:", email);
    setEmail("");
  };

  const handleDownloadReceipt = () => {
    // Generate and download receipt
    console.log("Downloading receipt...");
    // In a real app, this would generate a PDF or redirect to a receipt page
    alert("Receipt download functionality will be implemented here");
  };

  const handleBookAnotherSession = () => {
    if (onBookAnother) {
      onBookAnother();
    } else if (onNavigate) {
      onNavigate("events");
    }
  };

  const handleNavClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="payment-success-page bg-[#f7fafc] min-h-screen flex flex-col w-full">
      {/* Header - Same as Homepage */}
      <header className="bg-black h-auto min-h-[80px] md:h-[124.5px] w-full relative pb-4 md:pb-0">
        {/* Logo */}
        <div 
          className="absolute h-[53px] left-[20px] md:left-[39px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[20px] md:top-[43px] w-[80px] cursor-pointer z-10"
          onClick={() => handleNavClick("home")}
        >
          <img 
            alt="AJH Sports Logo" 
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
            src={LOGO_SRC} 
          />
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <button 
            className="absolute block cursor-pointer font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[0] left-[190px] not-italic text-[16px] text-white top-[56px] w-[62px] hover:text-[#e0cb23] transition-colors"
            onClick={() => handleNavClick("home")}
          >
            <p className="leading-[normal]">Home</p>
          </button>
          <p 
            className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[309px] not-italic text-[16px] text-white top-[56px] w-[72px] cursor-pointer hover:text-[#e0cb23] transition-colors"
            onClick={() => handleNavClick("events")}
          >
            Events
          </p>
          <p 
            className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[427px] not-italic text-[16px] text-white top-[54px] w-[71px] cursor-pointer hover:text-[#e0cb23] transition-colors"
            onClick={() => handleNavClick("clubs")}
          >
            Clubs
          </p>
          <p 
            className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[544px] not-italic text-[16px] text-white top-[54px] w-[92px] cursor-pointer hover:text-[#e0cb23] transition-colors"
            onClick={() => handleNavClick("coaches")}
          >
            Coaches
          </p>
          <p 
            className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[667px] not-italic text-[16px] text-white top-[54px] w-[88px] cursor-pointer hover:text-[#e0cb23] transition-colors"
            onClick={() => handleNavClick("contact")}
          >
            Contact Us
          </p>
        </div>
        
        {/* Sign Up Button */}
        <div 
          className="absolute bg-[#878787] h-[50px] left-[1327.25px] md:left-[1327.25px] lg:left-[1327.25px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[46px] w-[64px] cursor-pointer hover:bg-[#6d6d6d] transition-colors hidden md:block"
          onClick={() => handleNavClick("account")}
        />
        <p 
          className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] leading-[normal] left-[1336px] md:left-[1336px] lg:left-[1336px] not-italic text-[12px] text-white top-[65px] w-[46px] cursor-pointer hidden md:block"
          onClick={() => handleNavClick("account")}
        >
          Sign Up
        </p>
        
        {/* Log In */}
        <p 
          className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] leading-[normal] left-[1267px] md:left-[1267px] lg:left-[1267px] not-italic text-[12px] text-white top-[63px] w-[36px] cursor-pointer hover:text-[#e0cb23] transition-colors hidden md:block"
          onClick={() => handleNavClick("account")}
        >
          Log In
        </p>
        
        {/* Mobile Navigation */}
        <div className="md:hidden absolute right-4 top-[20px] flex items-center gap-3">
          <p 
            className="font-semibold text-xs text-white cursor-pointer"
            onClick={() => handleNavClick("account")}
          >
            Log In
          </p>
          <div 
            className="bg-[#878787] h-[40px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center px-3 cursor-pointer hover:bg-[#6d6d6d] transition-colors"
            onClick={() => handleNavClick("account")}
          >
            <p className="font-semibold text-xs text-white">Sign Up</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="w-full max-w-4xl mx-auto">
          {/* Title Section */}
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
              onClick={() => handleNavClick("events")}
              className="flex items-center justify-center gap-2 h-10 rounded-md border border-gray-300 bg-[#f5f7fb] text-sm font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              <span>📅</span>
              <span className="hidden sm:inline">Booking Summary</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("payment")}
              className="flex items-center justify-center gap-2 h-10 rounded-md border border-gray-300 bg-[#f5f7fb] text-sm font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              <span>💳</span>
              <span className="hidden sm:inline">Payment Method</span>
            </button>
            <div className="flex items-center justify-center gap-2 h-10 rounded-md border-2 border-black bg-white text-sm font-semibold text-black">
              <span>✔️</span>
              <span className="hidden sm:inline">Payment Success</span>
            </div>
            <div className="flex items-center justify-center gap-2 h-10 rounded-md border border-gray-300 bg-[#f5f7fb] text-sm font-semibold text-gray-400">
              <span>🕒</span>
              <span className="hidden sm:inline">Payment History</span>
            </div>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-[20px] shadow-lg border border-gray-200 p-6 md:p-8">
            {/* Success Icon and Message */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
                Payment Successful!
              </h2>
              <p className="text-base text-gray-600">
                Your booking has been confirmed and payment processed successfully.
              </p>
            </div>

            {/* Booking Confirmation Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg text-black mb-4">Booking Confirmation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Coach</p>
                    <p className="font-semibold text-black">Michael Rodriguez</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Time</p>
                    <p className="font-semibold text-black">9:00 AM – 11:00 AM</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                    <p className="font-semibold text-black">Visa ending in 3456</p>
                  </div>
                </div>
                {/* Right Column */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date</p>
                    <p className="font-semibold text-black">June 15, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                    <p className="font-semibold text-black">$75.00</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Confirmation Code</p>
                    <p className="font-semibold text-black">AJH-TN-230615-08</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="w-full sm:w-auto min-w-[180px] rounded-md border-2 border-black bg-white px-6 py-3 text-black font-semibold text-[15px] hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Receipt
              </button>
              <button
                type="button"
                onClick={handleBookAnotherSession}
                className="w-full sm:w-auto min-w-[180px] rounded-md bg-black px-6 py-3 text-white font-semibold text-[15px] shadow-sm hover:opacity-95 transition"
              >
                Book Another Session
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Same as Homepage */}
      <footer className="payment-success-footer bg-black text-white mt-12">
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
                    className="h-[31px] w-[47px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer"
                    onClick={() => handleNavClick("home")}
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
                    <p 
                      className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                      onClick={() => handleNavClick("events")}
                    >
                      Events
                    </p>
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
                    <p 
                      className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                      onClick={() => handleNavClick("events")}
                    >
                      Events
                    </p>
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

