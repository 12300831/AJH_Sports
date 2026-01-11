import { FormEvent, useState, useRef } from 'react';
import { toast } from 'sonner';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup';

interface ContactWrapperProps {
  onNavigate: (page: Page) => void;
}

const LOGO_SRC = "/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png";

// Get API URL from environment or use default
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  return 'http://localhost:5001/api';
};

const API_URL = getApiUrl();

export function ContactWrapper({ onNavigate }: ContactWrapperProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleNavClick = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (isSubmitting) return;
    
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      // Show success toast
      toast.success('Thank you for your message! We\'ll get back to you within 24 hours.');
      
      // Reset form
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to send message. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
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
            <form ref={formRef} className="mt-6 flex flex-col gap-4" onSubmit={handleFormSubmit}>
              <input
                name="name"
                className="rounded-xl border border-black/10 px-4 py-3 text-base outline-none transition focus:border-[#e0cb23]"
                placeholder="Full name"
                required
                disabled={isSubmitting}
              />
              <input
                name="email"
                type="email"
                className="rounded-xl border border-black/10 px-4 py-3 text-base outline-none transition focus:border-[#e0cb23]"
                placeholder="Email address"
                required
                disabled={isSubmitting}
              />
              <textarea
                name="message"
                className="min-h-32 rounded-xl border border-black/10 px-4 py-3 text-base outline-none transition focus:border-[#e0cb23]"
                placeholder="How can we help?"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[#e0cb23] px-4 py-3 text-base font-semibold text-black transition hover:bg-[#cdb720] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send message'}
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
          {/* Logo */}
          <div 
            className="absolute h-[31px] left-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[30px] w-[47px] cursor-pointer z-10"
            data-name="AJHSports-Logo-no-outline-1 3"
            onClick={() => handleNavClick('home')}
          >
            <img 
              alt="AJH Sports Logo" 
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
              src={LOGO_SRC} 
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
            <div 
              className="h-[31px] w-[47px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer"
              onClick={() => handleNavClick('home')}
            >
              <img 
                alt="AJH Sports Logo" 
                className="w-full h-full object-cover pointer-events-none" 
                src={LOGO_SRC} 
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
    </div>
  );
}

