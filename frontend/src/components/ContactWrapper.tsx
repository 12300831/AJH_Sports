import { FormEvent, useState } from 'react';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup';

interface ContactWrapperProps {
  onNavigate: (page: Page) => void;
}

const LOGO_SRC = "/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png";

export function ContactWrapper({ onNavigate }: ContactWrapperProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (page: Page) => {
    // Always scroll to top first
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    if (onNavigate) {
      onNavigate(page);
    } else {
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
      };
      const path = pathMap[page] || '/';
      window.history.pushState({ page }, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    setIsMobileMenuOpen(false);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    // eslint-disable-next-line no-alert
    alert(`Thanks for reaching out${name ? `, ${name}` : ''}! We'll be in touch soon.`);
    event.currentTarget.reset();
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col" data-name="Contact Page">
      {/* Header - Same as Homepage */}
      <header className="relative bg-black text-white h-auto min-h-[124.5px] w-full pb-4 md:pb-0 md:h-[124.5px]" data-name="Homepage-Header">
        {/* Logo */}
        <div
          className="absolute h-[53px] left-[20px] md:left-[39px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[20px] md:top-[43px] w-[80px] cursor-pointer z-10"
          aria-label="AJH Sports"
          onClick={() => handleNavClick('home')}
        >
          <img
            src={LOGO_SRC}
            alt="AJH Sports"
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          />
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:block">
          <button 
            onClick={() => handleNavClick('home')}
            className="absolute block cursor-pointer font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[190px] not-italic text-[16px] text-white top-[56px] w-[62px] hover:text-[#e0cb23] transition-colors"
          >
            <p className="leading-[normal]">Home</p>
          </button>
          <p 
            onClick={() => handleNavClick('events')}
            className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[309px] not-italic text-[16px] text-white top-[56px] w-[72px] cursor-pointer hover:text-[#e0cb23] transition-colors"
          >
            Events
          </p>
          <p 
            onClick={() => handleNavClick('clubs')}
            className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[427px] not-italic text-[16px] text-white top-[54px] w-[71px] cursor-pointer hover:text-[#e0cb23] transition-colors"
          >
            Clubs
          </p>
          <p 
            onClick={() => handleNavClick('coaches')}
            className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[544px] not-italic text-[16px] text-white top-[54px] w-[92px] cursor-pointer hover:text-[#e0cb23] transition-colors"
          >
            Coaches
          </p>
          <p 
            onClick={() => handleNavClick('contact')}
            className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[667px] not-italic text-[16px] text-[#e0cb23] top-[54px] w-[88px] cursor-pointer hover:text-white transition-colors"
          >
            Contact Us
          </p>
        </div>

        {/* Tablet navigation */}
        <div className="hidden md:flex lg:hidden absolute left-[120px] top-[56px] gap-4 md:gap-6">
          <button 
            onClick={() => handleNavClick('home')}
            className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
          >
            <p>Home</p>
          </button>
          <p 
            onClick={() => handleNavClick('events')}
            className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
          >
            Events
          </p>
          <p 
            onClick={() => handleNavClick('clubs')}
            className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
          >
            Clubs
          </p>
          <p 
            onClick={() => handleNavClick('coaches')}
            className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
          >
            Coaches
          </p>
          <p 
            onClick={() => handleNavClick('contact')}
            className="font-['Inter:Medium',sans-serif] font-medium text-sm text-[#e0cb23] cursor-pointer hover:text-white transition-colors"
          >
            Contact
          </p>
        </div>

        {/* Sign Up Button - Desktop */}
        <div 
          onClick={() => handleNavClick('signup')}
          className="absolute bg-[#878787] h-[50px] left-[1327.25px] lg:left-[1327.25px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[46px] w-[64px] cursor-pointer hover:bg-[#6d6d6d] transition-colors hidden lg:block" 
        />
        <p 
          onClick={() => handleNavClick('signup')}
          className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] leading-[normal] left-[1336px] lg:left-[1336px] not-italic text-[12px] text-white top-[65px] w-[46px] cursor-pointer hidden lg:block"
        >
          Sign Up
        </p>

        {/* Log In - Desktop */}
        <p 
          onClick={() => handleNavClick('signin')}
          className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] leading-[normal] left-[1267px] lg:left-[1267px] not-italic text-[12px] text-white top-[63px] w-[36px] cursor-pointer hover:text-[#e0cb23] transition-colors hidden lg:block"
        >
          Log In
        </p>

        {/* Tablet/Mobile Auth Buttons */}
        <div className="hidden md:flex lg:hidden absolute right-4 top-[46px] items-center gap-3">
          <p 
            onClick={() => handleNavClick('signin')}
            className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
          >
            Log In
          </p>
          <div 
            onClick={() => handleNavClick('signup')}
            className="bg-[#878787] h-[40px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center px-3 cursor-pointer hover:bg-[#6d6d6d] transition-colors"
          >
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-white">Sign Up</p>
          </div>
        </div>

        {/* Mobile Menu Button and Auth */}
        <div className="md:hidden absolute right-4 top-[20px] flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex flex-col gap-1.5 w-6 h-6 justify-center items-center"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
          <p 
            onClick={() => handleNavClick('signin')}
            className="font-semibold text-xs text-white cursor-pointer"
          >
            Log In
          </p>
          <div 
            onClick={() => handleNavClick('signup')}
            className="bg-[#878787] h-[40px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center px-3 cursor-pointer hover:bg-[#6d6d6d] transition-colors"
          >
            <p className="font-semibold text-xs text-white">Sign Up</p>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-gray-800 z-50">
            <div className="flex flex-col py-4">
              <button 
                onClick={() => handleNavClick('home')}
                className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 text-left hover:bg-gray-900 hover:text-[#e0cb23] transition-colors"
              >
                Home
              </button>
              <p 
                onClick={() => handleNavClick('events')}
                className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 cursor-pointer hover:bg-gray-900 hover:text-[#e0cb23] transition-colors"
              >
                Events
              </p>
              <p 
                onClick={() => handleNavClick('clubs')}
                className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 cursor-pointer hover:bg-gray-900 hover:text-[#e0cb23] transition-colors"
              >
                Clubs
              </p>
              <p 
                onClick={() => handleNavClick('coaches')}
                className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 cursor-pointer hover:bg-gray-900 hover:text-[#e0cb23] transition-colors"
              >
                Coaches
              </p>
              <p 
                onClick={() => handleNavClick('contact')}
                className="font-['Inter:Medium',sans-serif] font-medium text-base text-[#e0cb23] px-6 py-3 cursor-pointer hover:bg-gray-900 hover:text-white transition-colors"
              >
                Contact Us
              </p>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <section className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#e0cb23]">Get in touch</p>
            <h1 className="mt-4 text-4xl font-bold text-black">We're here to help your club grow</h1>
            <p className="mt-6 text-lg text-[#555]">
              Whether you&apos;re building your first roster or scaling multiple teams, our support staff is on
              standby. Reach out for scheduling, training, and membership questions anytime.
            </p>
            <dl className="mt-8 grid gap-6 text-[#222] md:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold text-[#7a7a7a]">Phone</dt>
                <dd className="text-xl font-bold">0447827788</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-[#7a7a7a]">Email</dt>
                <dd className="text-xl font-bold">info@starstv.com.au</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-black">Quick message</h2>
            <p className="mt-2 text-sm text-[#5c5c5c]">Send us a note and we&apos;ll reply in under 24 hours.</p>
            <form className="mt-6 flex flex-col gap-4" onSubmit={handleFormSubmit}>
              <input
                name="name"
                className="rounded-xl border border-black/10 px-4 py-3 text-base outline-none transition focus:border-[#e0cb23]"
                placeholder="Full name"
                required
              />
              <input
                name="email"
                type="email"
                className="rounded-xl border border-black/10 px-4 py-3 text-base outline-none transition focus:border-[#e0cb23]"
                placeholder="Email address"
                required
              />
              <textarea
                name="message"
                className="min-h-32 rounded-xl border border-black/10 px-4 py-3 text-base outline-none transition focus:border-[#e0cb23]"
                placeholder="How can we help?"
                required
              />
              <button
                type="submit"
                className="rounded-xl bg-[#e0cb23] px-4 py-3 text-base font-semibold text-black transition hover:bg-[#cdb720]"
              >
                Send message
              </button>
            </form>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: 'Join our Youth Club',
              copy: 'Train with elite coaches, access performance analytics, and grow with a supportive community.',
            },
            {
              title: 'Join our Adult Club',
              copy: 'Stay competitive, find new teammates, and keep your passion for sport thriving all year.',
            },
            ].map(({ title, copy }) => (
            <div key={title} className="rounded-3xl bg-white p-8 shadow-lg">
          
              <h3 className="mt-3 text-2xl font-semibold text-black">{title}</h3>
              <p className="mt-4 text-base text-[#555]">{copy}</p>
              <div className="mt-6 flex items-center gap-4">
      
                <button
                  type="button"
                 className="rounded-xl bg-[#e0cb23] px-6 py-3 text-base font-semibold text-black transition hover:bg-[#cdb720]"
                  onClick={() => handleNavClick('account')}
                >
                  Join Us
                </button>
                <button
                  type="button"
                  className="text-base font-semibold text-[#e0cb23] transition hover:text-[#cdb720]"
                  onClick={() => handleNavClick('clubs')}
                >
                  Explore clubs
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Footer - Same as Homepage */}
      <footer className="w-full bg-black relative mt-auto" data-name="MAIN">
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
          <div className="absolute left-[654px] top-[42px] w-[1px] h-[213px] bg-[#807E7E] hidden lg:block" />
          
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
                onClick={() => onNavigate && onNavigate('coaches')}
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
                      if (onNavigate) {
                        window.scrollTo({ top: 0, behavior: 'instant' });
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

