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
    // Always scroll to top first
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    if (onNavigate) {
      onNavigate(page);
    } else {
      // Fallback: use browser navigation
      const pathMap: Record<Page, string> = {
        home: '/',
        clubs: '/clubs',
        clubsList: '/clubsList',
        account: '/account',
        events: '/events',
        coaches: '/coaches',
        contact: '/contact',
        signin: '/signin',
        signup: '/signup',
        dashboard: '/dashboard',
        player: '/player',
        payment: '/payment',
        paymentSuccess: '/paymentSuccess',
      };
      const path = pathMap[page] || '/';
      window.history.pushState({ page }, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Subscribed:', email);
    setEmail('');
  };

  return (
    <div className="w-full bg-black relative" data-name="MAIN">
      {/* Desktop Layout */}
      <div className="hidden md:block relative min-h-[364px]">
        {/* Newsletter Section - Left Side (matching coaches page) */}
        <div className="absolute left-[30px] top-[30px] flex flex-col gap-[14px] max-w-[520px] text-white">
          {/* Logo */}
          <div 
            className="w-[48px] h-[32px] cursor-pointer"
            data-name="AJHSports-Logo-no-outline-1 3"
            onClick={() => handleNavClick('home')}
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
          <form onSubmit={handleFormSubmit} className="flex gap-[10px]">
            <input
              type="email"
              name="email"
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
                handleNavClick('home');
                setTimeout(() => {
                  const element = document.querySelector('[data-name="Copy - Why Choose Us"]');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
            >
              Why Choose Us?
            </p>
            <p 
              className="cursor-pointer hover:text-[#e0cb23] transition-colors"
              onClick={() => handleNavClick('events')}
            >
              Events
            </p>
            <p 
              className="cursor-pointer hover:text-[#e0cb23] transition-colors"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                handleNavClick('coaches');
              }}
            >
              1-ON-1 Coaching
            </p>
            <p 
              className="cursor-pointer hover:text-[#e0cb23] transition-colors"
              onClick={() => {
                handleNavClick('home');
                setTimeout(() => {
                  const element = document.querySelector('[data-name="Our Lovely Team"]');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
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
              onClick={() => handleNavClick('home')}
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
            <form onSubmit={handleFormSubmit} className="flex gap-[10px]">
              <input
                type="email"
                name="email"
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
                    handleNavClick('home');
                    setTimeout(() => {
                      const element = document.querySelector('[data-name="Copy - Why Choose Us"]');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }}
                >
                  Why Choose Us?
                </p>
                <p 
                  className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                  onClick={() => handleNavClick('events')}
                >
                  Events
                </p>
                <p 
                  className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'instant' });
                    handleNavClick('coaches');
                  }}
                >
                  1-ON-1 Coaching
                </p>
                <p 
                  className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                  onClick={() => {
                    handleNavClick('home');
                    setTimeout(() => {
                      const element = document.querySelector('[data-name="Our Lovely Team"]');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
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
    </div>
  );
}
