import React, { useState } from 'react';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player' | 'payment' | 'paymentSuccess' | 'admin';

interface HomeHeaderProps {
  onNavigate?: (page: Page) => void;
  activePage?: 'home' | 'events' | 'clubs' | 'coaches' | 'contact';
}

const LOGO_SRC = '/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png';

export function HomeHeader({ onNavigate, activePage = 'coaches' }: HomeHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: Page) => {
    if (onNavigate) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onNavigate(page);
      setMobileMenuOpen(false);
    } else {
      // Fallback: use URL navigation if onNavigate not provided
      window.scrollTo({ top: 0, behavior: 'instant' });
      const paths: Record<Page, string> = {
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
        admin: '/admin',
      };
      window.history.pushState({ page }, '', paths[page]);
      window.dispatchEvent(new PopStateEvent('popstate'));
      setMobileMenuOpen(false);
    }
  };

  const getNavColor = (page: string) => {
    return activePage === page ? 'text-[#e0cb23]' : 'text-white';
  };

  const getNavHover = (page: string) => {
    return activePage === page ? 'hover:text-white' : 'hover:text-[#e0cb23]';
  };

  return (
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
          className={`absolute block cursor-pointer font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[190px] not-italic text-[16px] ${getNavColor('home')} top-[56px] w-[62px] ${getNavHover('home')} transition-colors`}
        >
          <p className="leading-[normal]">Home</p>
        </button>
        <button 
          onClick={() => handleNavClick('events')} 
          className={`absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[309px] not-italic text-[16px] ${getNavColor('events')} top-[56px] w-[72px] cursor-pointer ${getNavHover('events')} transition-colors`}
        >
          Events
        </button>
        <button 
          onClick={() => handleNavClick('clubs')} 
          className={`absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[427px] not-italic text-[16px] ${getNavColor('clubs')} top-[54px] w-[71px] cursor-pointer ${getNavHover('clubs')} transition-colors`}
        >
          Clubs
        </button>
        <button 
          onClick={() => handleNavClick('coaches')} 
          className={`absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[544px] not-italic text-[16px] ${getNavColor('coaches')} top-[54px] w-[92px] cursor-pointer ${getNavHover('coaches')} transition-colors`}
        >
          Coaches
        </button>
        <button 
          onClick={() => handleNavClick('contact')} 
          className={`absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[667px] not-italic text-[16px] ${getNavColor('contact')} top-[54px] w-[88px] cursor-pointer ${getNavHover('contact')} transition-colors`}
        >
          Contact Us
        </button>
      </div>

      {/* Tablet Navigation - Show on md to lg */}
      <div className="hidden md:flex lg:hidden absolute left-[120px] top-[56px] gap-4 md:gap-6">
        <button 
          onClick={() => handleNavClick('home')} 
          className={`font-['Inter:Medium',sans-serif] font-medium text-sm ${getNavColor('home')} cursor-pointer ${getNavHover('home')} transition-colors`}
        >
          <p>Home</p>
        </button>
        <button 
          onClick={() => handleNavClick('events')} 
          className={`font-['Inter:Medium',sans-serif] font-medium text-sm ${getNavColor('events')} cursor-pointer ${getNavHover('events')} transition-colors`}
        >
          Events
        </button>
        <button 
          onClick={() => handleNavClick('clubs')} 
          className={`font-['Inter:Medium',sans-serif] font-medium text-sm ${getNavColor('clubs')} cursor-pointer ${getNavHover('clubs')} transition-colors`}
        >
          Clubs
        </button>
        <button 
          onClick={() => handleNavClick('coaches')} 
          className={`font-['Inter:Medium',sans-serif] font-medium text-sm ${getNavColor('coaches')} cursor-pointer ${getNavHover('coaches')} transition-colors`}
        >
          Coaches
        </button>
        <button 
          onClick={() => handleNavClick('contact')} 
          className={`font-['Inter:Medium',sans-serif] font-medium text-sm ${getNavColor('contact')} cursor-pointer ${getNavHover('contact')} transition-colors`}
        >
          Contact
        </button>
      </div>

      {/* Desktop Auth Buttons - Right */}
      <div className="hidden lg:flex absolute right-[39px] top-[46px] items-center gap-4">
        <button 
          onClick={() => handleNavClick('signin')} 
          className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[12px] text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
        >
          Log In
        </button>
        <div 
          className="bg-[#878787] h-[50px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-4 cursor-pointer hover:bg-[#6d6d6d] transition-colors flex items-center justify-center"
          onClick={() => handleNavClick('signup')}
        >
          <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[12px] text-white">
            Sign Up
          </span>
        </div>
      </div>

      {/* Tablet/Mobile Auth Buttons */}
      <div className="hidden md:flex lg:hidden absolute right-4 top-[46px] items-center gap-3">
        <button 
          onClick={() => handleNavClick('signin')} 
          className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
        >
          Log In
        </button>
        <div 
          className="bg-[#878787] h-[40px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center px-3 cursor-pointer hover:bg-[#6d6d6d] transition-colors"
          onClick={() => handleNavClick('signup')}
        >
          <button 
            onClick={() => handleNavClick('signup')} 
            className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-white"
          >
            Sign Up
          </button>
        </div>
      </div>

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
        <button 
          onClick={() => handleNavClick('signin')} 
          className="font-semibold text-xs text-white cursor-pointer"
        >
          Log In
        </button>
        <div 
          className="bg-[#878787] h-[40px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center px-3 cursor-pointer hover:bg-[#6d6d6d] transition-colors"
          onClick={() => handleNavClick('signup')}
        >
          <button 
            onClick={() => handleNavClick('signup')} 
            className="font-semibold text-xs text-white"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-gray-800 z-50">
          <div className="flex flex-col py-4">
            <button 
              onClick={() => handleNavClick('home')} 
              className={`font-['Inter:Medium',sans-serif] font-medium text-base ${getNavColor('home')} px-6 py-3 text-left hover:bg-gray-900 transition-colors`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('events')} 
              className={`font-['Inter:Medium',sans-serif] font-medium text-base ${getNavColor('events')} px-6 py-3 text-left cursor-pointer hover:bg-gray-900 ${getNavHover('events')} transition-colors`}
            >
              Events
            </button>
            <button 
              onClick={() => handleNavClick('clubs')} 
              className={`font-['Inter:Medium',sans-serif] font-medium text-base ${getNavColor('clubs')} px-6 py-3 text-left cursor-pointer hover:bg-gray-900 ${getNavHover('clubs')} transition-colors`}
            >
              Clubs
            </button>
            <button 
              onClick={() => handleNavClick('coaches')} 
              className={`font-['Inter:Medium',sans-serif] font-medium text-base ${getNavColor('coaches')} px-6 py-3 text-left cursor-pointer hover:bg-gray-900 ${getNavHover('coaches')} transition-colors`}
            >
              Coaches
            </button>
            <button 
              onClick={() => handleNavClick('contact')} 
              className={`font-['Inter:Medium',sans-serif] font-medium text-base ${getNavColor('contact')} px-6 py-3 text-left cursor-pointer hover:bg-gray-900 ${getNavHover('contact')} transition-colors`}
            >
              Contact Us
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
