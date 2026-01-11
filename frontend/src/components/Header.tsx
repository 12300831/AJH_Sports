import React, { useState } from 'react';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  showUserInfo?: boolean;
  currentPage?: Page;
}

const LOGO_SRC = '/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png';

export function Header({ onNavigate, showUserInfo = false, currentPage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-black h-auto min-h-[124.5px] w-full relative pb-4 md:pb-0 md:h-[124.5px]">
        {/* Logo - Left */}
        <div
          className="absolute h-[53px] left-[20px] md:left-[39px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[20px] md:top-[43px] w-[80px] cursor-pointer z-10"
          onClick={() => handleNavClick('home')}
          aria-label="AJH Sports"
        >
          <img
            src={LOGO_SRC}
            alt="AJH Sports"
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          />
        </div>

        {/* Desktop Navigation - Center (matching homepage exact positioning) */}
        <div className="hidden lg:block">
          <button 
            onClick={() => handleNavClick('home')} 
            className="absolute block cursor-pointer font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[190px] not-italic text-[16px] text-[#e0cb23] top-[56px] w-[62px] hover:text-white transition-colors"
          >
            <p className="leading-[normal]">Home</p>
          </button>
          <button 
            onClick={() => handleNavClick('events')} 
            className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[309px] not-italic text-[16px] text-white top-[56px] w-[72px] cursor-pointer hover:text-[#e0cb23] transition-colors"
          >
            Events
          </button>
          <button 
            onClick={() => handleNavClick('clubs')} 
            className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[427px] not-italic text-[16px] text-white top-[54px] w-[71px] cursor-pointer hover:text-[#e0cb23] transition-colors"
          >
            Clubs
          </button>
          <button 
            onClick={() => handleNavClick('coaches')} 
            className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[544px] not-italic text-[16px] text-white top-[54px] w-[92px] cursor-pointer hover:text-[#e0cb23] transition-colors"
          >
            Coaches
          </button>
          <button 
            onClick={() => handleNavClick('contact')} 
            className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[667px] not-italic text-[16px] text-white top-[54px] w-[88px] cursor-pointer hover:text-[#e0cb23] transition-colors"
          >
            Contact Us
          </button>
        </div>

        {/* Tablet Navigation - Show on md to lg */}
        <div className="hidden md:flex lg:hidden absolute left-[120px] top-[56px] gap-4 md:gap-6">
          <button 
            onClick={() => handleNavClick('home')} 
            className="font-['Inter:Medium',sans-serif] font-medium text-sm text-[#e0cb23] cursor-pointer hover:text-white transition-colors"
          >
            <p>Home</p>
          </button>
          <button 
            onClick={() => handleNavClick('events')} 
            className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
          >
            Events
          </button>
          <button 
            onClick={() => handleNavClick('clubs')} 
            className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
          >
            Clubs
          </button>
          <button 
            onClick={() => handleNavClick('coaches')} 
            className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
          >
            Coaches
          </button>
          <button 
            onClick={() => handleNavClick('contact')} 
            className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
          >
            Contact
          </button>
        </div>

        {/* Desktop Auth Buttons - Right */}
        {!showUserInfo && (
          <>
            <div 
              className={`absolute h-[50px] left-[1327.25px] lg:left-[1327.25px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[46px] w-[64px] cursor-pointer transition-colors hidden lg:block ${currentPage === 'signup' ? 'bg-[#e0cb23]' : 'bg-[#878787] hover:bg-[#6d6d6d]'}`}
              onClick={() => handleNavClick('signup')}
            />
            <button 
              onClick={() => handleNavClick('signup')} 
              className={`absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] leading-[normal] left-[1336px] lg:left-[1336px] not-italic text-[12px] top-[65px] w-[46px] cursor-pointer hidden lg:block ${currentPage === 'signup' ? 'text-black' : 'text-white'}`}
            >
              Sign Up
            </button>
            <button 
              onClick={() => handleNavClick('signin')} 
              className={`absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] leading-[normal] left-[1267px] lg:left-[1267px] not-italic text-[12px] top-[63px] w-[36px] cursor-pointer transition-colors hidden lg:block ${currentPage === 'signin' ? 'text-[#e0cb23]' : 'text-white hover:text-[#e0cb23]'}`}
            >
              Log In
            </button>
          </>
        )}

        {/* Tablet/Mobile Auth Buttons */}
        {!showUserInfo && (
          <div className="hidden md:flex lg:hidden absolute right-4 top-[46px] items-center gap-3">
            <button 
              onClick={() => handleNavClick('signin')} 
              className={`font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs cursor-pointer transition-colors ${currentPage === 'signin' ? 'text-[#e0cb23]' : 'text-white hover:text-[#e0cb23]'}`}
            >
              Log In
            </button>
            <div 
              className={`h-[40px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center px-3 cursor-pointer transition-colors ${currentPage === 'signup' ? 'bg-[#e0cb23]' : 'bg-[#878787] hover:bg-[#6d6d6d]'}`}
              onClick={() => handleNavClick('signup')}
            >
              <button 
                onClick={() => handleNavClick('signup')} 
                className={`font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs ${currentPage === 'signup' ? 'text-black' : 'text-white'}`}
              >
                Sign Up
              </button>
            </div>
          </div>
        )}

        {/* Mobile Menu Button and Auth */}
        <div className="md:hidden absolute right-4 top-[20px] flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col gap-1.5 w-6 h-6 justify-center items-center"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
          {!showUserInfo && (
            <>
              <button 
                onClick={() => handleNavClick('signin')} 
                className={`font-semibold text-xs cursor-pointer ${currentPage === 'signin' ? 'text-[#e0cb23]' : 'text-white'}`}
              >
                Log In
              </button>
              <div 
                className={`h-[40px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center px-3 cursor-pointer transition-colors ${currentPage === 'signup' ? 'bg-[#e0cb23]' : 'bg-[#878787] hover:bg-[#6d6d6d]'}`}
                onClick={() => handleNavClick('signup')}
              >
                <button 
                  onClick={() => handleNavClick('signup')} 
                  className="font-semibold text-xs text-white"
                >
                  Sign Up
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-gray-800 z-50">
            <div className="flex flex-col py-4">
              <button 
                onClick={() => handleNavClick('home')} 
                className="font-['Inter:Medium',sans-serif] font-medium text-base text-[#e0cb23] px-6 py-3 text-left hover:bg-gray-900 transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('events')} 
                className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 text-left cursor-pointer hover:bg-gray-900 hover:text-[#e0cb23] transition-colors"
              >
                Events
              </button>
              <button 
                onClick={() => handleNavClick('clubs')} 
                className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 text-left cursor-pointer hover:bg-gray-900 hover:text-[#e0cb23] transition-colors"
              >
                Clubs
              </button>
              <button 
                onClick={() => handleNavClick('coaches')} 
                className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 text-left cursor-pointer hover:bg-gray-900 hover:text-[#e0cb23] transition-colors"
              >
                Coaches
              </button>
              <button 
                onClick={() => handleNavClick('contact')} 
                className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 text-left cursor-pointer hover:bg-gray-900 hover:text-[#e0cb23] transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
        )}
      </header>
      {showUserInfo && (
        <div className="bg-gray-200 border-t border-gray-300">
          <div className="mx-auto max-w-7xl px-4 md:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 bg-[#0969da] rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                JS
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="text-sm text-gray-900 font-medium">John Smith</span>
                <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">john.smith@email.com</span>
              </div>
            </div>
            <button
              onClick={() => handleNavClick('signin')}
              className="text-sm text-gray-900 hover:text-gray-700 flex items-center gap-2 transition-colors self-start sm:self-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
