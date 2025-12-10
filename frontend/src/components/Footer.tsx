import React, { useState } from 'react';
import type { FormEvent } from 'react';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface FooterProps {
  onNavigate?: (page: Page) => void;
}

const LOGO_SRC = '/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png';

export function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');

  const handleNavClick = (page: Page) => {
    if (onNavigate) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onNavigate(page);
    }
  };

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Subscribed:', email);
    setEmail('');
  };

  return (
    <footer className="bg-black text-white w-full relative">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-[30px] py-8 md:py-[30px]">
        {/* Top Section: Logo, Newsletter, and Links */}
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 mb-6">
          {/* Left: Logo and Newsletter */}
          <div className="flex-1 max-w-md">
            {/* Logo */}
            <div 
              className="h-[31px] w-[47px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer mb-4"
              onClick={() => handleNavClick('home')}
            >
              <img
                src={LOGO_SRC}
                alt="AJH Sports"
                className="h-full w-full object-cover"
              />
            </div>
            
            {/* Newsletter Title */}
            <h3 className="font-['Inter:Bold',sans-serif] font-bold text-[24px] text-white mb-2 leading-[40px] tracking-[-0.24px]">
              Join Our Newsletter
            </h3>
            
            {/* Newsletter Description */}
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-slate-200 mb-4 leading-[20px]">
              Subscribe to our newsletter to be the first to know about new sessions, competitions and events.
            </p>
            
            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-[47px] px-[15px] rounded-[4px] bg-white border border-white text-black font-['Rubik',sans-serif] text-[16px] outline-none"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-[49px] w-[151px] bg-[#191919] rounded-[100px] font-['Inter:Bold',sans-serif] font-bold text-[14px] text-white hover:bg-[#333] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Vertical Divider - Desktop Only */}
          <div className="hidden lg:block w-[1px] h-[213px] bg-[#807E7E]" />

          {/* Right: Footer Links Columns - Desktop */}
          <div className="hidden lg:flex gap-12 flex-1">
            {/* About Column */}
            <div>
              <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-4">
                About
              </p>
              <div className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[2.2] tracking-[-0.32px]">
                <p 
                  className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                  onClick={() => handleNavClick('home')}
                >
                  Why Choose Us?
                </p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Featured</p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Partnership</p>
                <p 
                  className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                  onClick={() => handleNavClick('coaches')}
                >
                  Our Team
                </p>
              </div>
            </div>

            {/* Community Column */}
            <div>
              <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-4">
                Community
              </p>
              <div className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[2.2] tracking-[-0.32px]">
                <p 
                  className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                  onClick={() => handleNavClick('events')}
                >
                  Events
                </p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Blog</p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Podcast</p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Invite a friend</p>
              </div>
            </div>

            {/* Contact Us Column */}
            <div>
              <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-4">
                Contact Us
              </p>
              <div className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[2.2] tracking-[-0.32px]">
                <p>ajhsports.com.au</p>
                <p>+61 0412345678</p>
                <p>123 Ave, Sydney, NSW</p>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet: Footer Links - Grid Layout */}
          <div className="lg:hidden w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-base text-white mb-4">
                About
              </p>
              <div className="font-['Inter:Medium',sans-serif] font-medium text-sm text-slate-200 space-y-2">
                <p 
                  className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                  onClick={() => handleNavClick('home')}
                >
                  Why Choose Us?
                </p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Featured</p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Partnership</p>
                <p 
                  className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                  onClick={() => handleNavClick('coaches')}
                >
                  Our Team
                </p>
              </div>
            </div>
            <div>
              <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-base text-white mb-4">
                Community
              </p>
              <div className="font-['Inter:Medium',sans-serif] font-medium text-sm text-slate-200 space-y-2">
                <p 
                  className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                  onClick={() => handleNavClick('events')}
                >
                  Events
                </p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Blog</p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Podcast</p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Invite a friend</p>
              </div>
            </div>
            <div>
              <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-base text-white mb-4">
                Contact Us
              </p>
              <div className="font-['Inter:Medium',sans-serif] font-medium text-sm text-slate-200 space-y-2">
                <p>ajhsports.com.au</p>
                <p>+61 0412345678</p>
                <p>123 Ave, Sydney, NSW</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="w-full h-[1px] bg-[#807E7E] mb-4" />

        {/* Bottom Section: Copyright, Social Icons, Privacy & Terms */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[11px] text-slate-200 tracking-[-0.22px]">
            ©2025 Company Name. All rights reserved
          </p>

          {/* Social Media Icons */}
          <div className="flex items-center gap-5">
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

          {/* Privacy & Terms */}
          <div className="flex gap-4">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[11px] text-slate-200 tracking-[-0.22px] cursor-pointer hover:text-[#e0cb23] transition-colors">
              Privacy & Policy
            </p>
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[11px] text-slate-200 tracking-[-0.22px] cursor-pointer hover:text-[#e0cb23] transition-colors">
              Terms & Condition
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
