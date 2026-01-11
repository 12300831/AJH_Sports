import React, { useState, useEffect } from "react";
import imgAjhSportsLogoNoOutline11 from "/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png";
import img256941 from "../assets/5e80db934d6a91b9278c5c40d1cc305b8b64ad1b.png";

const navsportsUrl = 'https://navsports.com/sport-businesses/ajh-sports/';

function NavSportsWordmark() {
  return (
    <div className="flex items-center gap-3" data-name="NavSportsWordmark">
      <svg
        width="48"
        height="56"
        viewBox="0 0 48 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="navsportsGradient" x1="0" y1="0" x2="48" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e0cb23" />
            <stop offset="1" stopColor="#d4b91f" />
          </linearGradient>
        </defs>
        <path
          d="M24 0C13.506 0 5 8.625 5 19.3C5 34.236 24 56 24 56C24 56 43 34.236 43 19.3C43 8.625 34.494 0 24 0Z"
          fill="url(#navsportsGradient)"
        />
        <circle cx="24" cy="19" r="10" fill="white" opacity="0.9" />
        <path
          d="M24 10L28.5 19L24 28L19.5 19L24 10Z"
          fill="#102A43"
          stroke="#0B1522"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="19" r="2.2" fill="white" stroke="#0B1522" strokeWidth="1.2" />
      </svg>
      <span className="font-['Inter:Bold',sans-serif] text-2xl md:text-3xl font-bold leading-none text-black">NavSports</span>
    </div>
  );
}

export default function ClubAccount() {
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isRedirecting) {
      setIsRedirecting(true);
      // Auto-redirect after countdown
      setTimeout(() => {
        window.open(navsportsUrl, '_blank');
      }, 500);
    }
  }, [countdown, isRedirecting]);

  const handleRedirect = () => {
    window.open(navsportsUrl, '_blank');
  };

  return (
    <div 
      className="relative w-full min-h-screen flex flex-col"
      data-name="Club Account"
      style={{
        backgroundImage: "linear-gradient(90deg, rgba(238, 255, 200, 0.2) 0%, rgba(238, 255, 200, 0.2) 100%), linear-gradient(90deg, rgb(247, 250, 252) 0%, rgb(247, 250, 252) 100%)",
      }}
    >
      {/* Header - Same as Homepage */}
      <header className="relative bg-black text-white h-auto min-h-[124.5px] w-full pb-4 md:pb-0 md:h-[124.5px] flex-shrink-0 z-20" data-name="Homepage-Header">
        {/* Logo */}
        <div
          className="absolute h-[53px] left-[20px] md:left-[39px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[20px] md:top-[43px] w-[80px] cursor-pointer z-10"
          data-name="AJHSports-Logo-no-outline-1 1"
          aria-label="AJH Sports"
        >
          <img
            alt="AJH Sports Logo"
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            src={imgAjhSportsLogoNoOutline11}
          />
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:block">
          <button className="absolute block cursor-pointer font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[190px] not-italic text-[16px] text-white top-[56px] w-[62px] hover:text-[#e0cb23] transition-colors">
            <p className="leading-[normal]">Home</p>
          </button>
          <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[309px] not-italic text-[16px] text-white top-[56px] w-[72px] cursor-pointer hover:text-[#e0cb23] transition-colors">
            Events
          </p>
          <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[427px] not-italic text-[16px] text-white top-[54px] w-[71px] cursor-pointer hover:text-[#e0cb23] transition-colors">
            Clubs
          </p>
          <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[544px] not-italic text-[16px] text-white top-[54px] w-[92px] cursor-pointer hover:text-[#e0cb23] transition-colors">
            Coaches
          </p>
          <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[667px] not-italic text-[16px] text-white top-[54px] w-[88px] cursor-pointer hover:text-[#e0cb23] transition-colors">
            Contact Us
          </p>
        </div>

        {/* Tablet navigation */}
        <div className="hidden md:flex lg:hidden absolute left-[120px] top-[56px] gap-4 md:gap-6">
          <button className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors">
            <p>Home</p>
          </button>
          <p className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors">
            Events
          </p>
          <p className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors">
            Clubs
          </p>
          <p className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors">
            Coaches
          </p>
          <p className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors">
            Contact
          </p>
        </div>

        {/* Desktop Auth Buttons - Right */}
        <div className="hidden lg:flex absolute right-[39px] top-[46px] items-center gap-4">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[12px] text-white cursor-pointer hover:text-[#e0cb23] transition-colors">
            Log In
          </p>
          <div className="bg-[#878787] h-[50px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-4 cursor-pointer hover:bg-[#6d6d6d] transition-colors flex items-center justify-center">
            <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[12px] text-white">
              Sign Up
            </span>
          </div>
        </div>

        {/* Tablet/Mobile Auth Buttons */}
        <div className="hidden md:flex lg:hidden absolute right-4 top-[46px] items-center gap-3">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-white cursor-pointer hover:text-[#e0cb23] transition-colors">Log In</p>
          <div className="bg-[#878787] h-[40px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center px-3 cursor-pointer hover:bg-[#6d6d6d] transition-colors">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-white">Sign Up</p>
          </div>
        </div>

        {/* Mobile Menu Button and Auth */}
        <div className="md:hidden absolute right-4 top-[20px] flex items-center gap-3">
          <p className="font-semibold text-xs text-white cursor-pointer">Log In</p>
          <div className="bg-[#878787] h-[40px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center px-3 cursor-pointer hover:bg-[#6d6d6d] transition-colors">
            <p className="font-semibold text-xs text-white">Sign Up</p>
          </div>
        </div>
      </header>

      {/* Main Content - Centered and Modern */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 md:py-20">
        <div className="max-w-2xl w-full text-center space-y-8 md:space-y-12 animate-fade-in">
          {/* Logo Section */}
          <div className="flex justify-center mb-8">
            <div className="h-[120px] md:h-[150px] w-[120px] md:w-[150px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg overflow-hidden bg-white p-4 md:p-6 transform hover:scale-105 transition-transform duration-300">
              <img
                alt="AJH Sports Logo"
                className="w-full h-full object-contain"
                src={imgAjhSportsLogoNoOutline11}
              />
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-4 md:space-y-6">
            <h1 className="font-['Inter:Bold',sans-serif] font-bold text-4xl md:text-5xl lg:text-6xl text-[#2d3648] leading-tight">
              Redirecting to
              <span className="block mt-2 text-[#e0cb23]">
                NavSports
              </span>
            </h1>
            <p className="font-['Inter:Regular',sans-serif] font-normal text-base md:text-lg text-[#2d3648] max-w-md mx-auto">
              You're being redirected to our partner platform to complete your registration.
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center justify-center gap-4">
            <div className="relative w-20 h-20 md:w-24 md:h-24">
              <svg className="transform -rotate-90 w-full h-full">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="rgba(224, 203, 35, 0.2)"
                  strokeWidth="4"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="#e0cb23"
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 45 * (countdown / 5)} ${2 * Math.PI * 45}`}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-['Inter:Bold',sans-serif] font-bold text-2xl md:text-3xl text-[#e0cb23]">
                  {countdown}
                </span>
              </div>
            </div>
            <p className="font-['Inter:Medium',sans-serif] font-medium text-sm md:text-base text-[#2d3648]">
              {countdown > 0 ? 'seconds remaining' : 'Redirecting...'}
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <button
              onClick={handleRedirect}
              className="group relative inline-flex items-center gap-4 px-8 md:px-12 py-4 md:py-5 bg-black rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] hover:bg-[#e0cb23] transform hover:scale-105 transition-all duration-300"
            >
              <NavSportsWordmark />
              <span className="font-['Inter:Medium',sans-serif] font-medium text-sm md:text-base text-white group-hover:text-black transition-colors">
                Continue to NavSports →
              </span>
            </button>
          </div>

          {/* Home Link */}
          <div className="pt-8">
            <button
              className="inline-flex items-center gap-2 text-[#2d3648] hover:text-[#e0cb23] transition-colors group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-white border-2 border-[#2d3648] group-hover:border-[#e0cb23] flex items-center justify-center transition-colors">
                <img
                  alt="Home"
                  src={img256941}
                  className="w-5 h-5 object-contain"
                  data-name="25694 1"
                />
              </div>
              <span className="font-['Inter:Medium',sans-serif] font-medium text-sm">
                Return to Home
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer - Same as Homepage */}
      <footer className="w-full bg-black relative mt-auto" data-name="MAIN">
        {/* Desktop Layout */}
        <div className="hidden md:block relative min-h-[364px]">
        {/* Logo */}
        <div
          className="absolute h-[31px] left-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[30px] w-[47px] cursor-pointer"
        >
          <img
            alt="AJH Sports Logo"
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            src={imgAjhSportsLogoNoOutline11}
          />
        </div>

          {/* Newsletter Title */}
          <p className="absolute font-['Inter:Bold',sans-serif] font-bold h-[25px] leading-[40px] left-[335.5px] lg:left-[335.5px] text-[24px] text-white text-center top-[57px] tracking-[-0.24px] translate-x-[-50%] w-[407px]">
            Join Our Newsletter
          </p>
          
          {/* Newsletter Description */}
          <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[33px] leading-[20px] left-[327px] lg:left-[327px] text-[14px] text-slate-200 text-center top-[113px] translate-x-[-50%] w-[470px]">
            Subscribe to our newsletter to be the first to know about new sessions, competitions and events.
          </p>
          
          {/* Email Input Form - Desktop */}
          <form className="absolute left-[92px] top-[183px]">
            <input
              type="email"
              name="email"
              placeholder="Your email"
              required
              className="w-[316px] h-[47px] px-[15px] rounded-[4px] bg-white border border-white text-black font-['Rubik',sans-serif] text-[16px] outline-none"
            />
            <button
              type="submit"
              className="absolute left-[358px] top-[-2px] h-[49px] w-[151px] bg-[#191919] rounded-[100px] font-['Inter:Bold',sans-serif] font-bold text-[14px] text-white hover:bg-[#333] transition-colors"
            >
              Subscribe
            </button>
          </form>

        {/* Vertical Divider Line - Desktop */}
        <div className="absolute left-[654px] top-[42px] w-[1px] h-[213px] bg-[#807E7E] hidden lg:block" />

        {/* About Section - Desktop */}
        <div className="absolute left-[753px] top-[30px] hidden lg:block">
          <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-[16px]">About</p>
          <div className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[2.2] tracking-[-0.32px]">
            <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Why Choose Us?</p>
            <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Featured</p>
            <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Partnership</p>
            <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Our Team</p>
          </div>
        </div>

        {/* Community Section - Desktop */}
        <div className="absolute left-[957.29px] top-[30px] hidden lg:block">
          <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-[16px]">Community</p>
          <div className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[2.2] tracking-[-0.32px]">
            <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Events</p>
            <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Blog</p>
            <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Podcast</p>
            <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Invite a friend</p>
          </div>
        </div>

        {/* Contact Section - Desktop */}
        <div className="absolute left-[1162px] top-[30px] hidden lg:block">
          <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-[16px]">Contact Us</p>
          <div className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[2.2] tracking-[-0.32px]">
            <p>ajhsports.com.au</p>
            <p>+61 0412345678</p>
            <p>123 Ave, Sydney, NSW</p>
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
            <div className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-colors">
              <span className="text-[10px] text-white">f</span>
            </div>
            <div className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-colors">
              <span className="text-[10px] text-white">𝕏</span>
            </div>
            <div className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-colors">
              <span className="text-[10px] text-white">in</span>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="md:hidden relative py-8 px-4">
          {/* Logo */}
          <div 
            className="flex justify-center mb-6"
            data-name="AJHSports-Logo-no-outline-1 3"
          >
            <div className="h-[31px] w-[47px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer">
              <img 
                alt="AJH Sports Logo" 
                className="w-full h-full object-cover pointer-events-none" 
                src={imgAjhSportsLogoNoOutline11} 
              />
            </div>
          </div>
          
          {/* Newsletter Title */}
          <p className="font-['Inter:Bold',sans-serif] font-bold text-xl text-white text-center mb-2">
            Join Our Newsletter
          </p>
          
          {/* Newsletter Description */}
          <p className="font-['Inter:Regular',sans-serif] font-normal text-xs text-slate-200 text-center mb-6 px-4">
            Subscribe to our newsletter to be the first to know about new sessions, competitions and events.
          </p>
          
          {/* Email Input Form - Mobile */}
          <form className="mb-8 px-4">
            <div className="flex flex-col gap-3">
              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
                className="w-full h-[47px] px-[15px] rounded-[4px] bg-white border border-white text-black font-['Rubik',sans-serif] text-base outline-none"
              />
              <button
                type="submit"
                className="w-full h-[49px] bg-[#191919] rounded-[100px] font-['Inter:Bold',sans-serif] font-bold text-sm text-white hover:bg-[#333] transition-colors"
              >
                Subscribe
              </button>
            </div>
          </form>
          
          {/* Footer Links - Mobile/Tablet */}
          <div className="mb-6 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
              <div>
                <p className="font-semibold text-sm text-white mb-3">About</p>
                <div className="font-medium text-xs text-slate-200 space-y-2">
                  <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Why Choose Us?</p>
                  <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Featured</p>
                  <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Partnership</p>
                  <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Our Team</p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm text-white mb-3">Community</p>
                <div className="font-medium text-xs text-slate-200 space-y-2">
                  <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Events</p>
                  <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Blog</p>
                  <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Podcast</p>
                  <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Invite a friend</p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm text-white mb-3">Contact Us</p>
                <div className="font-medium text-xs text-slate-200 space-y-2">
                  <p>ajhsports.com.au</p>
                  <p>+61 0412345678</p>
                  <p>123 Ave, Sydney, NSW</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Divider - Mobile */}
          <div className="mx-4 mb-4 h-[1px] bg-[#807E7E]" />
          
          {/* Social Icons - Mobile */}
          <div className="flex justify-center gap-4 mb-4">
            <div className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-colors">
              <span className="text-[10px] text-white">f</span>
            </div>
            <div className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-colors">
              <span className="text-[10px] text-white">𝕏</span>
            </div>
            <div className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-colors">
              <span className="text-[10px] text-white">in</span>
            </div>
          </div>
          
          {/* Copyright & Privacy - Mobile */}
          <div className="px-4 pb-4">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[10px] text-slate-200 text-center mb-2 tracking-[-0.22px]">
              ©2025 Company Name. All rights reserved
            </p>
            <div className="flex justify-center gap-4">
              <p className="font-semibold text-[10px] text-slate-200 cursor-pointer hover:text-[#e0cb23] transition-colors">Privacy & Policy</p>
              <p className="font-semibold text-[10px] text-slate-200 cursor-pointer hover:text-[#e0cb23] transition-colors">Terms & Condition</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Fade-in Animation */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
