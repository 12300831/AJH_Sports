import { FormEvent, useState } from 'react';
import { createCheckoutSession } from '../services/paymentService';

// Images are served from the public folder at the root path (/images/...)
const Image_tennis = '/images/TT.png';
const Image_tt = '/images/Tennis.png';
const Image_tennis_court = '/images/TennisOpen.png';
const Image_tt_table = '/images/TTCup.png';
const Image_kids_in_sports = '/images/KidsSports.png';
const Image_coaching = '/images/OneonOneCoaching.png';
const imgAjhSportsLogo = '/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png';

// Hero images for event detail pages - High quality images
const Image_tennis_hero = '/images/tennis-ball-hero.jpg';
const Image_tt_hero = '/images/table-tennis-players-hero.jpg';
const Image_kids_hero = '/images/kids-tug-of-war-hero.jpg';
const Image_coaching_hero = '/images/tennis-court-hero.jpg';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'payment';

interface EventsWrapperProps {
  onNavigate: (page: Page) => void;
}

type EventCategory = 'all' | 'tournament' | 'coaching' | 'party';

interface Event {
  id: number;
  image: string;
  heroImage: string;
  title: string;
  alt: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  spots: number;
  price: string;
  featured: boolean;
  description: string;
  fullDescription?: string;
  whoCanJoin?: string;
  entryFee?: string;
  whatsIncluded?: string;
  registrationDeadline?: string;
  venue?: string;
}

const events: Event[] = [
  {
    id: 1,
    image: Image_tennis_court,
    heroImage: Image_tennis_hero,
    title: 'Tennis Open 2025',
    alt: 'Tennis Open 2025',
    category: 'tournament',
    date: 'August 10-18, 2025',
    time: '9:00 AM - 6:00 PM',
    location: 'AJH Sportscentre',
    spots: 24,
    price: '$30',
    featured: true,
    description: 'Annual tennis championship for all skill levels.',
    fullDescription: 'Experience the thrill of competition at the Tennis Open! Designed for players of all abilities, this event includes round-robin matches followed by knockout rounds. Winners will receive trophies and vouchers for AJH coaching sessions.',
    whoCanJoin: 'Juniors & Adults, Singles & Doubles formats available',
    entryFee: '$30 per player/team',
    whatsIncluded: 'Access to practice courts, refreshments, and event photography',
    registrationDeadline: 'August 1, 2025',
    venue: 'Outdoor Tennis Courts',
  },
  {
    id: 2,
    image: Image_tt_table,
    heroImage: Image_tt_hero,
    title: 'Table Tennis Tournament',
    alt: 'Table Tennis Tournament 2025',
    category: 'tournament',
    date: 'Jan 22, 2025',
    time: '10:00 AM - 4:00 PM',
    location: 'AJH Sportscentre',
    spots: 32,
    price: '$35',
    featured: true,
    description: 'Fast-paced table tennis action for all ages!',
    fullDescription: 'Join us for an exciting table tennis tournament! Compete against players of similar skill levels in this fast-paced event. Categories include singles and doubles for both juniors and adults.',
    whoCanJoin: 'All ages welcome, Beginner to Advanced levels',
    entryFee: '$35 per player',
    whatsIncluded: 'Equipment provided, refreshments, medals for winners',
    registrationDeadline: 'January 15, 2025',
    venue: 'Indoor Sports Hall',
  },
  {
    id: 3,
    image: Image_kids_in_sports,
    heroImage: Image_kids_hero,
    title: 'Kids Sports Party',
    alt: 'Kids Sports Parties',
    category: 'party',
    date: 'Every Weekend',
    time: '2:00 PM - 5:00 PM',
    location: 'AJH Sportscentre',
    spots: 20,
    price: '$25/child',
    featured: false,
    description: 'Fun sports activities for kids aged 5-12.',
    fullDescription: 'Make your child\'s birthday unforgettable with our sports party package! Kids will enjoy a variety of fun sports activities including tennis, table tennis, and team games. Our experienced coaches ensure a safe and exciting experience.',
    whoCanJoin: 'Kids aged 5-12 years',
    entryFee: '$25 per child (minimum 10 children)',
    whatsIncluded: 'All equipment, party coordinator, certificates for all participants',
    registrationDeadline: 'Book at least 2 weeks in advance',
    venue: 'Party Area',
  },
  {
    id: 4,
    image: Image_coaching,
    heroImage: Image_coaching_hero,
    title: '1-ON-1 Coaching',
    alt: '1-on-1 Coaching',
    category: 'coaching',
    date: 'Book Anytime',
    time: 'Flexible Hours',
    location: 'AJH Sportscentre',
    spots: 0,
    price: 'From $60/hr',
    featured: false,
    description: 'Personalized coaching with expert instructors.',
    fullDescription: 'Take your game to the next level with personalized one-on-one coaching. Our Level 3 certified coaches will work with you to improve your technique, strategy, and mental game. Suitable for all ages and skill levels.',
    whoCanJoin: 'All ages and skill levels',
    entryFee: 'From $60 per hour',
    whatsIncluded: 'Video analysis, personalized training plan, progress tracking',
    registrationDeadline: 'Book 48 hours in advance',
    venue: 'Training Courts',
  },
];

const categories: Array<{ id: EventCategory; label: string; icon: string }> = [
  { id: 'all', label: 'All Events', icon: '✨' },
  { id: 'tournament', label: 'Tournaments', icon: '🏆' },
  { id: 'coaching', label: 'Coaching', icon: '🎓' },
  { id: 'party', label: 'Parties', icon: '🎉' },
];

const stats = [
  { icon: '👥', number: '100+', text: 'Active Players' },
  { icon: '📅', number: '10+', text: 'Monthly Events' },
  { icon: '🏟️', number: '10', text: 'Courts' },
];

// --- COMPONENT ---
export function EventsWrapper({ onNavigate }: EventsWrapperProps) {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('all');
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleNavClick = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    alert(`Thanks for subscribing${email ? ` with ${email}` : ''}!`);
    event.currentTarget.reset();
  };

  const handleViewDetails = (event: Event) => {
    // If it's "1-ON-1 Coaching", navigate to coaches page instead
    if (event.title === '1-ON-1 Coaching') {
      handleNavClick('coaches');
      return;
    }
    setSelectedEvent(event);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
  };

  const handleRegisterNow = async () => {
    if (!selectedEvent) return;

    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // Parse the price from the event
      // Handle formats like "$30", "$35", "$25/child", "From $60/hr"
      const priceMatch = selectedEvent.price.match(/\$(\d+(?:\.\d+)?)/);
      if (!priceMatch) {
        throw new Error('Invalid price format');
      }
      const amount = parseFloat(priceMatch[1]);

      // Create checkout session and redirect to Stripe
      const response = await createCheckoutSession({
        eventId: selectedEvent.id.toString(),
        eventName: selectedEvent.title,
        amount: amount,
        currency: 'aud',
        successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/events?canceled=true`,
      });

      if (response.url) {
        // Redirect directly to Stripe Checkout
        window.location.href = response.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      let errorMessage = 'Failed to process payment. Please try again.';
      if (err.message) {
        if (err.message.includes('Failed to fetch') || err.message.includes('Cannot connect')) {
          errorMessage = 'Cannot connect to payment server. Please check if the backend is running on port 5001.';
        } else {
          errorMessage = err.message;
        }
      }
      setPaymentError(errorMessage);
      setIsProcessingPayment(false);
    }
  };

  const filteredEvents =
    selectedCategory === 'all'
      ? events
      : events.filter((e) => e.category === selectedCategory);

  // Header Component (reusable)
  const Header = () => (
    <div className="bg-black h-auto min-h-[124.5px] w-full relative pb-4 md:pb-0 md:h-[124.5px]">
      {/* Logo */}
      <div 
        className="absolute h-[53px] left-[20px] md:left-[39px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[20px] md:top-[43px] w-[80px] cursor-pointer z-10"
        onClick={() => handleNavClick('home')}
      >
        <img 
          alt="AJH Sports Logo" 
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
          src={imgAjhSportsLogo}
        />
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <button 
          className="absolute block cursor-pointer font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[0] left-[190px] not-italic text-[16px] text-white top-[56px] w-[62px] hover:text-[#e0cb23] transition-colors"
          onClick={() => handleNavClick('home')}
        >
          <p className="leading-[normal]">Home</p>
        </button>
        <p 
          className={`absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[309px] not-italic text-[16px] top-[56px] w-[72px] cursor-pointer transition-colors ${
            selectedEvent ? 'text-white hover:text-[#e0cb23]' : 'text-[#e0cb23]'
          }`}
          onClick={selectedEvent ? handleBackToEvents : undefined}
        >
          Events
        </p>
        <p 
          className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[427px] not-italic text-[16px] text-white top-[54px] w-[71px] cursor-pointer hover:text-[#e0cb23] transition-colors"
          onClick={() => handleNavClick('clubs')}
        >
          Clubs
        </p>
        <p 
          className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[544px] not-italic text-[16px] text-white top-[54px] w-[92px] cursor-pointer hover:text-[#e0cb23] transition-colors"
          onClick={() => handleNavClick('coaches')}
        >
          Coaches
        </p>
        <p 
          className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[667px] not-italic text-[16px] text-white top-[54px] w-[88px] cursor-pointer hover:text-[#e0cb23] transition-colors"
          onClick={() => handleNavClick('contact')}
        >
          Contact Us
        </p>
      </div>
      
      {/* Tablet Navigation */}
      <div className="hidden md:flex lg:hidden absolute left-[120px] top-[56px] gap-4 md:gap-6">
        <button 
          className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
          onClick={() => handleNavClick('home')}
        >
          <p>Home</p>
        </button>
        <p 
          className={`font-['Inter:Medium',sans-serif] font-medium text-sm cursor-pointer transition-colors ${
            selectedEvent ? 'text-white hover:text-[#e0cb23]' : 'text-[#e0cb23]'
          }`}
          onClick={selectedEvent ? handleBackToEvents : undefined}
        >
          Events
        </p>
        <p 
          className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
          onClick={() => handleNavClick('clubs')}
        >
          Clubs
        </p>
        <p 
          className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
          onClick={() => handleNavClick('coaches')}
        >
          Coaches
        </p>
        <p 
          className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
          onClick={() => handleNavClick('contact')}
        >
          Contact
        </p>
      </div>
      
      {/* Desktop Auth Buttons */}
      <div 
        className="absolute bg-[#878787] h-[50px] right-[60px] xl:right-[132px] 2xl:left-[1327.25px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[46px] w-[64px] cursor-pointer hover:bg-[#6d6d6d] transition-colors hidden lg:block"
        onClick={() => handleNavClick('signup')}
      />
      <p 
        className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] leading-[normal] right-[69px] xl:right-[141px] 2xl:left-[1336px] not-italic text-[12px] text-white top-[65px] w-[46px] cursor-pointer hidden lg:block"
        onClick={() => handleNavClick('signup')}
      >
        Sign Up
      </p>
      <p 
        className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] leading-[normal] right-[140px] xl:right-[212px] 2xl:left-[1267px] not-italic text-[12px] text-white top-[63px] w-[36px] cursor-pointer hover:text-[#e0cb23] transition-colors hidden lg:block"
        onClick={() => handleNavClick('signin')}
      >
        Log In
      </p>
      
      {/* Tablet/Mobile Auth Buttons */}
      <div className="hidden md:flex lg:hidden absolute right-4 top-[46px] items-center gap-3">
        <p 
          className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
          onClick={() => handleNavClick('signin')}
        >
          Log In
        </p>
        <div 
          className="bg-[#878787] h-[40px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center px-3 cursor-pointer hover:bg-[#6d6d6d] transition-colors"
          onClick={() => handleNavClick('signup')}
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
          <span className={`block w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
        <p 
          className="font-semibold text-xs text-white cursor-pointer"
          onClick={() => handleNavClick('signin')}
        >
          Log In
        </p>
        <div 
          className="bg-[#878787] h-[40px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center px-3 cursor-pointer hover:bg-[#6d6d6d] transition-colors"
          onClick={() => handleNavClick('signup')}
        >
          <p className="font-semibold text-xs text-white">Sign Up</p>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-gray-800 z-50">
          <div className="flex flex-col py-4">
            <button 
              className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 text-left hover:bg-gray-900 hover:text-[#e0cb23] transition-colors"
              onClick={() => handleNavClick('home')}
            >
              Home
            </button>
            <p 
              className={`font-['Inter:Medium',sans-serif] font-medium text-base px-6 py-3 cursor-pointer hover:bg-gray-900 transition-colors ${
                selectedEvent ? 'text-white hover:text-[#e0cb23]' : 'text-[#e0cb23]'
              }`}
              onClick={selectedEvent ? handleBackToEvents : undefined}
            >
              Events
            </p>
            <p 
              className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 cursor-pointer hover:bg-gray-900 hover:text-[#e0cb23] transition-colors"
              onClick={() => handleNavClick('clubs')}
            >
              Clubs
            </p>
            <p 
              className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 cursor-pointer hover:bg-gray-900 hover:text-[#e0cb23] transition-colors"
              onClick={() => handleNavClick('coaches')}
            >
              Coaches
            </p>
            <p 
              className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 cursor-pointer hover:bg-gray-900 hover:text-[#e0cb23] transition-colors"
              onClick={() => handleNavClick('contact')}
            >
              Contact Us
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Footer Component (reusable)
  const Footer = () => (
    <div className="w-full bg-black relative min-h-[364px] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
        {/* Logo */}
        <div 
          className="h-[31px] w-[47px] mb-6 md:mb-0 md:absolute md:left-[30px] md:top-[30px] cursor-pointer"
          onClick={() => handleNavClick('home')}
        >
          <img 
            alt="AJH Sports Logo" 
            className="w-full h-full object-cover pointer-events-none" 
            src={imgAjhSportsLogo}
          />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Newsletter Section */}
          <div className="flex-1 lg:max-w-md">
            <p className="font-['Inter:Bold',sans-serif] font-bold text-xl md:text-2xl text-white mb-3 md:mb-4 text-center lg:text-left">
              Join Our Newsletter
            </p>
            <p className="font-['Inter:Regular',sans-serif] font-normal text-sm md:text-base text-slate-200 mb-4 md:mb-6 text-center lg:text-left">
              Subscribe to our newsletter to be the first to know about new sessions, competitions and events.
            </p>
            <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
                className="flex-1 h-[47px] px-4 rounded-[4px] bg-white border border-white text-black font-['Rubik',sans-serif] text-base outline-none"
              />
              <button
                type="submit"
                className="h-[47px] px-6 bg-[#191919] rounded-[100px] font-['Inter:Bold',sans-serif] font-bold text-sm text-white hover:bg-[#333] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
          
          {/* Footer Links - Desktop */}
          <div className="hidden lg:flex gap-12 xl:gap-16">
            <div className="w-px h-[213px] bg-[#807E7E]"></div>
            <div>
              <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-xl text-white mb-4">About</p>
              <div className="font-['Inter:Medium',sans-serif] font-medium text-base text-slate-200 space-y-2">
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors" onClick={() => handleNavClick('home')}>Why Choose Us?</p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Featured</p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Partnership</p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors" onClick={() => handleNavClick('coaches')}>Our Team</p>
              </div>
            </div>
            <div>
              <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-xl text-white mb-4">Community</p>
              <div className="font-['Inter:Medium',sans-serif] font-medium text-base text-slate-200 space-y-2">
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors" onClick={selectedEvent ? handleBackToEvents : undefined}>Events</p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Blog</p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Podcast</p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Invite a friend</p>
              </div>
            </div>
            <div>
              <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-xl text-white mb-4">Contact Us</p>
              <div className="font-['Inter:Medium',sans-serif] font-medium text-base text-slate-200 space-y-2">
                <p>ajhsports.com.au</p>
                <p>+61 0412345678</p>
                <p>123 Ave, Sydney, NSW</p>
              </div>
            </div>
          </div>
          
          {/* Footer Links - Mobile/Tablet */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#807E7E]">
            <div>
              <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-lg text-white mb-3">About</p>
              <div className="font-['Inter:Medium',sans-serif] font-medium text-sm text-slate-200 space-y-2">
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors" onClick={() => handleNavClick('home')}>Why Choose Us?</p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Featured</p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Partnership</p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors" onClick={() => handleNavClick('coaches')}>Our Team</p>
              </div>
            </div>
            <div>
              <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-lg text-white mb-3">Community</p>
              <div className="font-['Inter:Medium',sans-serif] font-medium text-sm text-slate-200 space-y-2">
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors" onClick={selectedEvent ? handleBackToEvents : undefined}>Events</p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Blog</p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Podcast</p>
                <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Invite a friend</p>
              </div>
            </div>
            <div>
              <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-lg text-white mb-3">Contact Us</p>
              <div className="font-['Inter:Medium',sans-serif] font-medium text-sm text-slate-200 space-y-2">
                <p>ajhsports.com.au</p>
                <p>+61 0412345678</p>
                <p>123 Ave, Sydney, NSW</p>
              </div>
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
      </div>
    </div>
  );

  // If an event is selected, show the detail view
  if (selectedEvent) {
    return (
      <div className="bg-white relative w-full min-h-screen flex flex-col" data-name="Event Detail Page">
        <Header />
        
        {/* Hero Image Section */}
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative overflow-hidden">
          <img 
            src={selectedEvent.heroImage} 
            alt={selectedEvent.alt}
            className="w-full h-full object-cover object-center"
            loading="eager"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLImageElement).src = selectedEvent.image;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/30" />
          
          <button
            onClick={handleBackToEvents}
            className="absolute top-4 left-4 md:top-6 md:left-10 flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-white/95 backdrop-blur-sm text-black font-['Inter:Medium',sans-serif] font-medium text-[16px] hover:bg-white transition-all shadow-lg"
          >
            <span>←</span>
            <span className="hidden sm:inline">Back to Events</span>
            <span className="sm:hidden">Back</span>
          </button>
          
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-10">
            <h1 className="font-['Inter:Bold',sans-serif] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[36px] text-white drop-shadow-lg">
              {selectedEvent.title}
            </h1>
          </div>
        </div>

        {/* Event Info Section */}
        <div className="w-full bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[110px] py-6 md:py-8 lg:py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12">
              {/* Date */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 md:w-11 md:h-11 bg-black/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg md:text-xl">📅</span>
                </div>
                <div>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-[#888] uppercase tracking-wide mb-1">Date</p>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-sm md:text-base text-black">{selectedEvent.date}</p>
                </div>
              </div>
              
              {/* Who Can Join */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 md:w-11 md:h-11 bg-black/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg md:text-xl">👥</span>
                </div>
                <div>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-[#888] uppercase tracking-wide mb-1">Who Can Join?</p>
                  <p className="font-['Inter:Regular',sans-serif] text-sm md:text-base text-black max-w-xs">{selectedEvent.whoCanJoin}</p>
                </div>
              </div>
              
              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 md:w-11 md:h-11 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg md:text-xl">📍</span>
                </div>
                <div>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-[#888] uppercase tracking-wide mb-1">Location</p>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-sm md:text-base text-black">{selectedEvent.location}</p>
                  <p className="font-['Inter:Regular',sans-serif] text-xs md:text-sm text-[#666]">{selectedEvent.venue}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="w-full bg-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[110px] py-8 md:py-10 lg:py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-['Inter:Bold',sans-serif] font-bold text-lg md:text-xl lg:text-2xl text-black mb-4 md:mb-6">Description:</h2>
            <p className="font-['Inter:Regular',sans-serif] text-sm md:text-base text-[#444] leading-relaxed mb-6 md:mb-8">
              {selectedEvent.fullDescription}
            </p>
            
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 bg-gray-50 p-4 md:p-6 rounded-xl">
              <p className="font-['Inter:Regular',sans-serif] text-sm md:text-base text-black">
                <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold">Entry Fee:</span> {selectedEvent.entryFee}
              </p>
              <p className="font-['Inter:Regular',sans-serif] text-sm md:text-base text-black">
                <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold">What's Included:</span> {selectedEvent.whatsIncluded}
              </p>
              <p className="font-['Inter:Regular',sans-serif] text-sm md:text-base text-black">
                <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold">Registration Deadline:</span> {selectedEvent.registrationDeadline}
              </p>
            </div>
            
            {/* Error Message */}
            {paymentError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{paymentError}</p>
              </div>
            )}
            
            <button
              onClick={handleRegisterNow}
              disabled={isProcessingPayment}
              className="bg-black text-white font-['Inter:Semi_Bold',sans-serif] font-semibold text-sm md:text-base px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-[#333] transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingPayment ? 'Processing...' : 'Register Now'}
            </button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Main Events List View
  return (
    <div className="bg-white relative w-full min-h-screen flex flex-col" data-name="Events Page">
      <Header />

      {/* Hero Section */}
      <div className="w-full bg-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[110px] py-8 md:py-12 lg:py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="w-full lg:w-[520px]">
              <h1 className="font-['Inter:Bold',sans-serif] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[48px] text-black leading-tight tracking-wide mb-4 md:mb-6">
                Discover<br />AJH Sports Events
              </h1>
              
              <p className="font-['Inter:Regular',sans-serif] text-sm md:text-base lg:text-[16px] text-[#444] leading-relaxed mb-6 md:mb-8">
                Explore our coaching programs, kids' sports parties, and social matches 
                designed for all ages and skill levels.
              </p>
              
              {/* Stats Row */}
              <div className="flex gap-6 md:gap-8 lg:gap-10 mb-6 md:mb-8">
                {stats.map(({ icon, number, text }) => (
                  <div key={text} className="text-center">
                    <div className="text-base md:text-lg mb-1">{icon}</div>
                    <div className="font-['Inter:Bold',sans-serif] font-bold text-lg md:text-xl lg:text-[22px] text-black">{number}</div>
                    <div className="font-['Inter:Regular',sans-serif] text-xs md:text-sm text-[#666]">{text}</div>
                  </div>
                ))}
              </div>
              
              {/* CTA Button */}
              <button
                type="button"
                className="bg-black text-white font-['Inter:Semi_Bold',sans-serif] font-semibold text-sm md:text-base px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg hover:bg-[#333] transition-colors"
              >
                Browse All Events
              </button>
            </div>
            
            {/* Right Images */}
            <div className="flex gap-3 md:gap-4 lg:gap-4 justify-center lg:justify-end w-full lg:w-auto">
              <img
                src={Image_tennis}
                alt="Tennis"
                className="w-[140px] h-[240px] sm:w-[160px] sm:h-[280px] md:w-[180px] md:h-[300px] lg:w-[200px] lg:h-[340px] object-cover rounded-[60px] md:rounded-[80px] border border-gray-200"
              />
              <img
                src={Image_tt}
                alt="Table Tennis"
                className="w-[140px] h-[240px] sm:w-[160px] sm:h-[280px] md:w-[180px] md:h-[300px] lg:w-[200px] lg:h-[340px] object-cover rounded-[60px] md:rounded-[80px] border border-gray-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="w-full bg-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[110px] py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6 md:mb-8">
            <h2 className="font-['Inter:Bold',sans-serif] font-bold text-2xl md:text-3xl lg:text-[28px] text-black mb-2">
              Upcoming Events
            </h2>
            <p className="font-['Inter:Regular',sans-serif] text-sm md:text-base text-[#666]">
              Find the perfect event for you
            </p>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8">
            {categories.map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedCategory(id)}
                className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-['Inter:Medium',sans-serif] font-medium text-xs md:text-sm transition-all border ${
                  selectedCategory === id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black hover:bg-black hover:text-white'
                }`}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
          
          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg overflow-hidden cursor-pointer border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onMouseEnter={() => setHoveredEvent(event.id)}
                onMouseLeave={() => setHoveredEvent(null)}
                onClick={() => handleViewDetails(event)}
              >
                {/* Image */}
                <div className="relative h-[150px] md:h-[180px] overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.alt}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      hoveredEvent === event.id ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  {event.featured && (
                    <span className="absolute top-2 left-2 bg-black text-white font-['Inter:Bold',sans-serif] text-xs font-bold px-2 py-1 rounded uppercase">
                      Featured
                    </span>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-3 md:p-4">
                  <h4 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-sm md:text-base text-black mb-2">
                    {event.title}
                  </h4>
                  
                  <p className="font-['Inter:Regular',sans-serif] text-xs md:text-sm text-[#666] mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-[#888] mb-3">
                    <span>📅 {event.date}</span>
                    <span>•</span>
                    <span>📍 {event.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="font-['Inter:Bold',sans-serif] font-bold text-sm md:text-base text-black">{event.price}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(event);
                      }}
                      className={`font-['Inter:Medium',sans-serif] font-medium text-xs px-3 py-1.5 rounded transition-all border ${
                        hoveredEvent === event.id
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-black hover:bg-black hover:text-white'
                      }`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[110px]">
        <div className="max-w-7xl mx-auto border-t border-gray-200"></div>
      </div>

      {/* Why Choose Us Section */}
      <div className="w-full bg-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[110px] py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="font-['Inter:Bold',sans-serif] font-bold text-xl md:text-2xl lg:text-[24px] text-black">Why Choose Us?</h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
            {[
              { icon: '🎯', title: 'Expert Coaching', desc: '40+ years experience' },
              { icon: '👥', title: 'All Levels', desc: 'Beginner to advanced' },
              { icon: '🤝', title: 'Community', desc: 'Friendly environment' },
              { icon: '🏆', title: 'Quality', desc: 'Modern facilities' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center w-full sm:w-auto">
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 rounded-full bg-white border-2 border-black flex items-center justify-center">
                  <span className="text-xl md:text-2xl">{icon}</span>
                </div>
                <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-sm md:text-base text-black mb-1">{title}</h3>
                <p className="font-['Inter:Regular',sans-serif] text-xs md:text-sm text-[#666]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[110px] py-8 md:py-10 lg:py-12 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-['Inter:Bold',sans-serif] font-bold text-xl md:text-2xl text-black mb-3 md:mb-4">Ready to get started?</h2>
          <p className="font-['Inter:Regular',sans-serif] text-sm md:text-base text-[#666] mb-4 md:mb-6">
            Join our community and start playing today!
          </p>
          <button
            type="button"
            className="bg-black text-white font-['Inter:Semi_Bold',sans-serif] font-semibold text-sm md:text-base px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-[#333] transition-colors"
            onClick={() => handleNavClick('clubs')}
          >
            Join Now
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
