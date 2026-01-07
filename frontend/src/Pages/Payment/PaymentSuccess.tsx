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
      <footer className="payment-success-footer bg-black text-white mt-12" data-name="MAIN">
        {/* Desktop Layout */}
        <div className="hidden md:block relative min-h-[364px]">
          {/* Newsletter Section - Left Side (matching coaches page) */}
          <div className="absolute left-[30px] top-[30px] flex flex-col gap-[14px] max-w-[520px] text-white">
            {/* Logo */}
            <div 
              className="w-[48px] h-[32px] cursor-pointer"
              data-name="AJHSports-Logo-no-outline-1 3"
              onClick={() => handleNavClick("home")}
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
                onClick={() => handleNavClick("home")}
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

