import { FormEvent, useState } from 'react';

// Images are served from the public folder at the root path (/images/...)
const Image_tennis = '/images/TT.png';
const Image_tt = '/images/Tennis.png';
const Image_tennis_court = '/images/TennisOpen.png';
const Image_tt_table = '/images/TTCup.png';
const Image_kids_in_sports = '/images/KidsSports.png';
const Image_coaching = '/images/OneonOneCoaching.png';
const imgAjhSportsLogo = '/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png';

// Hero images for event detail pages - Save the uploaded images with these names
const Image_tennis_hero = '/images/tennis-open-hero.jpg';
const Image_tt_hero = '/images/table-tennis-hero.jpg';
const Image_kids_hero = '/images/kids-party-hero.jpg';
const Image_coaching_hero = '/images/coaching-hero.jpg';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'payment';

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

  const handleNavClick = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(page);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    alert(`Thanks for subscribing${email ? ` with ${email}` : ''}!`);
    event.currentTarget.reset();
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
  };

  const handleRegisterNow = () => {
    onNavigate('payment');
  };

  const filteredEvents =
    selectedCategory === 'all'
      ? events
      : events.filter((e) => e.category === selectedCategory);

  // If an event is selected, show the detail view
  if (selectedEvent) {
    return (
      <div className="bg-white relative w-[1440px]" data-name="Event Detail Page">
        {/* Responsive Styles */}
        <style>{`
          @media (max-width: 1440px) {
            .detail-container { width: 100% !important; }
            .detail-hero { height: 50vw !important; max-height: 500px !important; }
            .detail-content { padding-left: 6% !important; padding-right: 6% !important; }
            .detail-info-grid { gap: 40px !important; flex-wrap: wrap !important; }
          }
          @media (max-width: 1024px) {
            .detail-hero { height: 45vw !important; min-height: 300px !important; }
            .detail-info-grid { gap: 30px !important; }
            .detail-info-item { min-width: 200px !important; }
          }
          @media (max-width: 768px) {
            .detail-hero { height: 60vw !important; min-height: 250px !important; }
            .detail-info-grid { flex-direction: column !important; gap: 20px !important; }
            .detail-description { max-width: 100% !important; }
            .nav-items { display: none !important; }
            .footer-columns { flex-wrap: wrap !important; gap: 30px !important; }
          }
          @media (max-width: 480px) {
            .detail-hero { height: 70vw !important; }
            .back-button { font-size: 12px !important; padding: 8px 12px !important; }
          }
        `}</style>

        {/* Header */}
        <div className="bg-black h-[124.5px] w-full relative">
          <div 
            className="absolute h-[53px] left-[39px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[43px] w-[80px] cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <img 
              alt="AJH Sports Logo" 
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
              src={imgAjhSportsLogo}
            />
          </div>
          <div className="nav-items">
            <button 
              className="absolute block cursor-pointer font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[0] left-[190px] not-italic text-[16px] text-white top-[56px] w-[62px] hover:text-[#e0cb23] transition-colors"
              onClick={() => handleNavClick('home')}
            >
              <p className="leading-[normal]">Home</p>
            </button>
            <p 
              className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[309px] not-italic text-[16px] text-[#e0cb23] top-[56px] w-[72px] cursor-pointer"
              onClick={handleBackToEvents}
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
          <div 
            className="absolute bg-[#878787] h-[50px] left-[1327.25px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[46px] w-[64px] cursor-pointer hover:bg-[#6d6d6d] transition-colors"
            onClick={() => handleNavClick('account')}
          />
          <p 
            className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] leading-[normal] left-[1336px] not-italic text-[12px] text-white top-[65px] w-[46px] cursor-pointer"
            onClick={() => handleNavClick('account')}
          >
            Sign Up
          </p>
          <p 
            className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] leading-[normal] left-[1267px] not-italic text-[12px] text-white top-[63px] w-[36px] cursor-pointer hover:text-[#e0cb23] transition-colors"
            onClick={() => handleNavClick('account')}
          >
            Log In
          </p>
        </div>

        {/* Hero Image Section */}
        <div className="detail-hero w-full h-[500px] relative overflow-hidden">
          <img 
            src={selectedEvent.heroImage} 
            alt={selectedEvent.alt}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              // Fallback to regular image if hero image fails to load
              (e.target as HTMLImageElement).src = selectedEvent.image;
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/30" />
          
          {/* Back Button */}
          <button
            onClick={handleBackToEvents}
            className="back-button absolute top-[24px] left-[40px] flex items-center gap-[10px] bg-white/95 backdrop-blur-sm text-black font-['Inter:Medium',sans-serif] font-medium text-[14px] px-[20px] py-[12px] rounded-[8px] hover:bg-white transition-all shadow-lg"
          >
            <span className="text-[18px]">←</span>
            Back to Events
          </button>
          
          {/* Event Title Overlay */}
          <div className="absolute bottom-[30px] left-[40px]">
            <h1 className="font-['Inter:Bold',sans-serif] font-bold text-[36px] text-white drop-shadow-lg">
              {selectedEvent.title}
            </h1>
          </div>
        </div>

        {/* Event Info Section */}
        <div className="detail-content w-full bg-white border-b border-gray-200 px-[110px] py-[35px]">
          <div className="detail-info-grid flex gap-[80px]">
            {/* Date */}
            <div className="detail-info-item flex items-start gap-[12px]">
              <div className="w-[44px] h-[44px] bg-black/5 rounded-[10px] flex items-center justify-center">
                <span className="text-[20px]">📅</span>
              </div>
              <div>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[12px] text-[#888] uppercase tracking-[0.5px] mb-[4px]">Date</p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] text-black">{selectedEvent.date}</p>
              </div>
            </div>
            
            {/* Who Can Join */}
            <div className="detail-info-item flex items-start gap-[12px]">
              <div className="w-[44px] h-[44px] bg-black/5 rounded-[10px] flex items-center justify-center">
                <span className="text-[20px]">👥</span>
              </div>
              <div>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[12px] text-[#888] uppercase tracking-[0.5px] mb-[4px]">Who Can Join?</p>
                <p className="font-['Inter:Regular',sans-serif] text-[14px] text-black max-w-[280px]">{selectedEvent.whoCanJoin}</p>
              </div>
            </div>
            
            {/* Location */}
            <div className="detail-info-item flex items-start gap-[12px]">
              <div className="w-[44px] h-[44px] bg-red-50 rounded-[10px] flex items-center justify-center">
                <span className="text-[20px]">📍</span>
              </div>
              <div>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[12px] text-[#888] uppercase tracking-[0.5px] mb-[4px]">Location</p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] text-black">{selectedEvent.location}</p>
                <p className="font-['Inter:Regular',sans-serif] text-[13px] text-[#666]">{selectedEvent.venue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="detail-content w-full bg-white px-[110px] py-[40px]">
          <div className="detail-description max-w-[700px]">
            <h2 className="font-['Inter:Bold',sans-serif] font-bold text-[20px] text-black mb-[16px]">Description:</h2>
            <p className="font-['Inter:Regular',sans-serif] text-[15px] text-[#444] leading-[1.8] mb-[28px]">
              {selectedEvent.fullDescription}
            </p>
            
            <div className="space-y-[12px] mb-[32px] bg-gray-50 p-[20px] rounded-[12px]">
              <p className="font-['Inter:Regular',sans-serif] text-[14px] text-black">
                <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold">Entry Fee:</span> {selectedEvent.entryFee}
              </p>
              <p className="font-['Inter:Regular',sans-serif] text-[14px] text-black">
                <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold">What's Included:</span> {selectedEvent.whatsIncluded}
              </p>
              <p className="font-['Inter:Regular',sans-serif] text-[14px] text-black">
                <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold">Registration Deadline:</span> {selectedEvent.registrationDeadline}
              </p>
            </div>
            
            <button
              onClick={handleRegisterNow}
              className="bg-black text-white font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] px-[32px] py-[14px] rounded-[8px] hover:bg-[#333] transition-colors shadow-lg hover:shadow-xl"
            >
              Register Now
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full h-[364px] bg-black relative mt-[40px]">
          <div 
            className="absolute h-[31px] left-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[30px] w-[47px] cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <img 
              alt="AJH Sports Logo" 
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
              src={imgAjhSportsLogo}
            />
          </div>
          <p className="absolute font-['Inter:Bold',sans-serif] font-bold h-[25px] leading-[40px] left-[335.5px] text-[24px] text-white text-center top-[57px] tracking-[-0.24px] translate-x-[-50%] w-[407px]">
            Join Our Newsletter
          </p>
          <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[33px] leading-[20px] left-[327px] text-[14px] text-slate-200 text-center top-[113px] translate-x-[-50%] w-[470px]">
            Subscribe to our newsletter to be the first to know about new sessions, competitions and events.
          </p>
          <form onSubmit={handleFormSubmit} className="absolute left-[92px] top-[183px]">
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
          <div className="absolute left-[654px] top-[42px] w-[1px] h-[213px] bg-[#807E7E]" />
          <div className="absolute left-[753px] top-[30px]">
            <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-[16px]">About</p>
            <div className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[2.2] tracking-[-0.32px]">
              <p className="cursor-pointer hover:text-[#e0cb23] transition-colors" onClick={() => handleNavClick('home')}>Why Choose Us?</p>
              <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Featured</p>
              <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Partnership</p>
              <p className="cursor-pointer hover:text-[#e0cb23] transition-colors" onClick={() => handleNavClick('coaches')}>Our Team</p>
            </div>
          </div>
          <div className="absolute left-[957.29px] top-[30px]">
            <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-[16px]">Community</p>
            <div className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[2.2] tracking-[-0.32px]">
              <p className="cursor-pointer hover:text-[#e0cb23] transition-colors" onClick={handleBackToEvents}>Events</p>
              <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Blog</p>
              <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Podcast</p>
              <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Invite a friend</p>
            </div>
          </div>
          <div className="absolute left-[1162px] top-[30px]">
            <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-[16px]">Contact Us</p>
            <div className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[2.2] tracking-[-0.32px]">
              <p>ajhsports.com.au</p>
              <p>+61 0412345678</p>
              <p>123 Ave, Sydney, NSW</p>
            </div>
          </div>
          <div className="absolute left-[77px] top-[297px] w-[1318.17px] h-[1px] bg-[#807E7E]" />
          <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[30px] text-[11px] text-slate-200 top-[332px] tracking-[-0.22px]">
            ©2025 Company Name. All rights reserved
          </p>
          <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold text-[11px] text-slate-200 text-right top-[335px] tracking-[-0.22px] cursor-pointer hover:text-[#e0cb23] transition-colors" style={{ left: '1061px' }}>
            Privacy & Policy
          </p>
          <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold text-[11px] text-slate-200 text-right top-[336px] tracking-[-0.22px] cursor-pointer hover:text-[#e0cb23] transition-colors" style={{ left: '1263px' }}>
            Terms & Condition
          </p>
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
      </div>
    );
  }

  // Main Events List View
  return (
    <div className="bg-white relative w-[1440px]" data-name="Events Page">
      {/* Responsive Styles */}
      <style>{`
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Media Queries for Responsiveness */
        @media (max-width: 1440px) {
          .main-container { width: 100% !important; }
          .main-content { padding-left: 6% !important; padding-right: 6% !important; }
          .hero-images { margin-right: 20px !important; }
          .hero-image { width: 180px !important; height: 300px !important; }
          .events-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 16px !important; }
        }
        
        @media (max-width: 1200px) {
          .events-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .hero-title { font-size: 40px !important; }
          .hero-image { width: 160px !important; height: 280px !important; }
        }
        
        @media (max-width: 1024px) {
          .events-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-section { flex-direction: column !important; align-items: flex-start !important; }
          .hero-images { margin-top: 30px !important; margin-right: 0 !important; }
          .hero-content { width: 100% !important; }
          .why-choose-grid { gap: 40px !important; flex-wrap: wrap !important; }
        }
        
        @media (max-width: 768px) {
          .nav-items { display: none !important; }
          .events-grid { grid-template-columns: 1fr !important; max-width: 400px !important; margin: 0 auto !important; }
          .hero-title { font-size: 32px !important; }
          .hero-images { gap: 12px !important; }
          .hero-image { width: 140px !important; height: 240px !important; border-radius: 60px !important; }
          .stats-row { gap: 20px !important; }
          .category-filters { flex-wrap: wrap !important; }
          .why-choose-grid { justify-content: center !important; }
          .footer-content { display: none !important; }
        }
        
        @media (max-width: 480px) {
          .hero-title { font-size: 28px !important; }
          .hero-images { flex-direction: column !important; align-items: center !important; }
          .hero-image { width: 200px !important; height: 200px !important; border-radius: 50% !important; }
          .section-title { font-size: 24px !important; }
        }
      `}</style>

      {/* Header */}
      <div className="bg-black h-[124.5px] w-[1440px] relative main-container">
        <div 
          className="absolute h-[53px] left-[39px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[43px] w-[80px] cursor-pointer"
          onClick={() => handleNavClick('home')}
        >
          <img 
            alt="AJH Sports Logo" 
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
            src={imgAjhSportsLogo}
          />
        </div>
        <div className="nav-items">
          <button 
            className="absolute block cursor-pointer font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[0] left-[190px] not-italic text-[16px] text-white top-[56px] w-[62px] hover:text-[#e0cb23] transition-colors"
            onClick={() => handleNavClick('home')}
          >
            <p className="leading-[normal]">Home</p>
          </button>
          <p 
            className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[309px] not-italic text-[16px] text-[#e0cb23] top-[56px] w-[72px] cursor-pointer"
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
        <div 
          className="absolute bg-[#878787] h-[50px] left-[1327.25px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[46px] w-[64px] cursor-pointer hover:bg-[#6d6d6d] transition-colors"
          onClick={() => handleNavClick('account')}
        />
        <p 
          className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] leading-[normal] left-[1336px] not-italic text-[12px] text-white top-[65px] w-[46px] cursor-pointer"
          onClick={() => handleNavClick('account')}
        >
          Sign Up
        </p>
        <p 
          className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] leading-[normal] left-[1267px] not-italic text-[12px] text-white top-[63px] w-[36px] cursor-pointer hover:text-[#e0cb23] transition-colors"
          onClick={() => handleNavClick('account')}
        >
          Log In
        </p>
      </div>

      {/* Hero Section */}
      <div className="w-[1440px] bg-white px-[110px] py-[50px] border-b border-gray-100 main-container main-content">
        <div className="hero-section flex justify-between items-center">
          {/* Left Content */}
          <div className="hero-content w-[520px]">
            <h1 className="hero-title font-['Inter:Bold',sans-serif] font-bold text-[48px] text-black leading-[1.15] tracking-[0.5px] mb-[16px]">
              Discover<br />AJH Sports Events
            </h1>
            
            <p className="font-['Inter:Regular',sans-serif] text-[16px] text-[#444] leading-[1.6] mb-[24px]">
              Explore our coaching programs, kids' sports parties, and social matches 
              designed for all ages and skill levels.
            </p>
            
            {/* Stats Row */}
            <div className="stats-row flex gap-[40px] mb-[24px]">
              {stats.map(({ icon, number, text }) => (
                <div key={text} className="text-center">
                  <div className="text-[18px] mb-[2px]">{icon}</div>
                  <div className="font-['Inter:Bold',sans-serif] font-bold text-[22px] text-black">{number}</div>
                  <div className="font-['Inter:Regular',sans-serif] text-[12px] text-[#666]">{text}</div>
                </div>
              ))}
            </div>
            
            {/* CTA Button */}
            <button
              type="button"
              className="bg-black text-white font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] px-[24px] py-[12px] rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] hover:bg-[#333] transition-colors"
            >
              Browse All Events
            </button>
          </div>
          
          {/* Right Images */}
          <div className="hero-images flex gap-[16px] mr-[60px]">
            <img
              src={Image_tennis}
              alt="Tennis"
              className="hero-image w-[200px] h-[340px] object-cover rounded-[80px] border border-gray-200"
            />
            <img
              src={Image_tt}
              alt="Table Tennis"
              className="hero-image w-[200px] h-[340px] object-cover rounded-[80px] border border-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="w-[1440px] bg-white px-[110px] py-[50px] main-container main-content">
        {/* Section Header */}
        <div className="text-center mb-[32px]">
          <h2 className="section-title font-['Inter:Bold',sans-serif] font-bold text-[28px] text-black mb-[6px]">
            Upcoming Events
          </h2>
          <p className="font-['Inter:Regular',sans-serif] text-[14px] text-[#666]">
            Find the perfect event for you
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="category-filters flex justify-center gap-[10px] mb-[32px]">
          {categories.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedCategory(id)}
              className={`flex items-center gap-[6px] px-[16px] py-[8px] rounded-[5px] font-['Inter:Medium',sans-serif] font-medium text-[13px] transition-all border ${
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
        <div className="events-grid grid grid-cols-4 gap-[20px]">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-[10px] overflow-hidden card-hover cursor-pointer border border-gray-200"
              onMouseEnter={() => setHoveredEvent(event.id)}
              onMouseLeave={() => setHoveredEvent(null)}
              onClick={() => handleViewDetails(event)}
            >
              {/* Image */}
              <div className="relative h-[150px] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.alt}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    hoveredEvent === event.id ? 'scale-105' : 'scale-100'
                  }`}
                />
                {event.featured && (
                  <span className="absolute top-[8px] left-[8px] bg-black text-white font-['Inter:Bold',sans-serif] text-[9px] font-bold px-[8px] py-[3px] rounded-[3px] uppercase">
                    Featured
                  </span>
                )}
              </div>
              
              {/* Content */}
              <div className="p-[14px]">
                <h4 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-black mb-[4px]">
                  {event.title}
                </h4>
                
                <p className="font-['Inter:Regular',sans-serif] text-[11px] text-[#666] mb-[10px] line-clamp-2">
                  {event.description}
                </p>
                
                <div className="flex items-center gap-[4px] text-[10px] text-[#888] mb-[10px]">
                  <span>📅 {event.date}</span>
                  <span className="mx-[2px]">•</span>
                  <span>📍 {event.location}</span>
                </div>
                
                <div className="flex items-center justify-between pt-[10px] border-t border-gray-100">
                  <span className="font-['Inter:Bold',sans-serif] font-bold text-[15px] text-black">{event.price}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(event);
                    }}
                    className={`font-['Inter:Medium',sans-serif] font-medium text-[10px] px-[10px] py-[5px] rounded-[3px] transition-all border ${
                      hoveredEvent === event.id
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black'
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

      {/* Divider Line */}
      <div className="w-[1440px] px-[110px] main-container main-content">
        <div className="border-t border-gray-200"></div>
      </div>

      {/* Why Choose Us Section */}
      <div className="w-[1440px] bg-white px-[110px] py-[50px] main-container main-content">
        <div className="text-center mb-[32px]">
          <h2 className="section-title font-['Inter:Bold',sans-serif] font-bold text-[24px] text-black">Why Choose Us?</h2>
        </div>
        
        <div className="why-choose-grid flex justify-center gap-[60px]">
          {[
            { icon: '🎯', title: 'Expert Coaching', desc: '40+ years experience' },
            { icon: '👥', title: 'All Levels', desc: 'Beginner to advanced' },
            { icon: '🤝', title: 'Community', desc: 'Friendly environment' },
            { icon: '🏆', title: 'Quality', desc: 'Modern facilities' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="w-[50px] h-[50px] mx-auto mb-[10px] rounded-full bg-white border-2 border-black flex items-center justify-center">
                <span className="text-[22px]">{icon}</span>
              </div>
              <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-black mb-[2px]">{title}</h3>
              <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[#666]">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-[1440px] bg-white px-[110px] py-[40px] border-t border-b border-gray-200 main-container main-content">
        <div className="text-center">
          <h2 className="font-['Inter:Bold',sans-serif] font-bold text-[22px] text-black mb-[10px]">Ready to get started?</h2>
          <p className="font-['Inter:Regular',sans-serif] text-[14px] text-[#666] mb-[16px]">
            Join our community and start playing today!
          </p>
          <button
            type="button"
            className="bg-black text-white font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] px-[24px] py-[10px] rounded-[5px] hover:bg-[#333] transition-colors"
            onClick={() => handleNavClick('clubs')}
          >
            Join Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="w-[1440px] h-[364px] bg-black relative main-container">
        {/* Logo */}
        <div 
          className="absolute h-[31px] left-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[30px] w-[47px] cursor-pointer"
          onClick={() => handleNavClick('home')}
        >
          <img 
            alt="AJH Sports Logo" 
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
            src={imgAjhSportsLogo}
          />
        </div>
        
        {/* Newsletter Title */}
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold h-[25px] leading-[40px] left-[335.5px] text-[24px] text-white text-center top-[57px] tracking-[-0.24px] translate-x-[-50%] w-[407px]">
          Join Our Newsletter
        </p>
        
        {/* Newsletter Description */}
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[33px] leading-[20px] left-[327px] text-[14px] text-slate-200 text-center top-[113px] translate-x-[-50%] w-[470px]">
          Subscribe to our newsletter to be the first to know about new sessions, competitions and events.
        </p>
        
        {/* Email Input */}
        <form onSubmit={handleFormSubmit} className="absolute left-[92px] top-[183px]">
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
        
        {/* Divider Line (vertical) */}
        <div className="absolute left-[654px] top-[42px] w-[1px] h-[213px] bg-[#807E7E] footer-content" />
        
        {/* About Section */}
        <div className="absolute left-[753px] top-[30px] footer-content">
          <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-[16px]">About</p>
          <div className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[2.2] tracking-[-0.32px]">
            <p className="cursor-pointer hover:text-[#e0cb23] transition-colors" onClick={() => handleNavClick('home')}>Why Choose Us?</p>
            <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Featured</p>
            <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Partnership</p>
            <p className="cursor-pointer hover:text-[#e0cb23] transition-colors" onClick={() => handleNavClick('coaches')}>Our Team</p>
          </div>
        </div>
        
        {/* Community Section */}
        <div className="absolute left-[957.29px] top-[30px] footer-content">
          <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-[16px]">Community</p>
          <div className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[2.2] tracking-[-0.32px]">
            <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Events</p>
            <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Blog</p>
            <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Podcast</p>
            <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Invite a friend</p>
          </div>
        </div>
        
        {/* Contact Section */}
        <div className="absolute left-[1162px] top-[30px] footer-content">
          <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-[16px]">Contact Us</p>
          <div className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[2.2] tracking-[-0.32px]">
            <p>ajhsports.com.au</p>
            <p>+61 0412345678</p>
            <p>123 Ave, Sydney, NSW</p>
          </div>
        </div>
        
        {/* Bottom Divider */}
        <div className="absolute left-[77px] top-[297px] w-[1318.17px] h-[1px] bg-[#807E7E]" />
        
        {/* Copyright */}
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[30px] text-[11px] text-slate-200 top-[332px] tracking-[-0.22px]">
          ©2025 Company Name. All rights reserved
        </p>
        
        {/* Privacy & Terms */}
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold text-[11px] text-slate-200 text-right top-[335px] tracking-[-0.22px] cursor-pointer hover:text-[#e0cb23] transition-colors footer-content" style={{ left: '1061px' }}>
          Privacy & Policy
        </p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold text-[11px] text-slate-200 text-right top-[336px] tracking-[-0.22px] cursor-pointer hover:text-[#e0cb23] transition-colors footer-content" style={{ left: '1263px' }}>
          Terms & Condition
        </p>
        
        {/* Social Icons */}
        <div className="absolute left-[646px] top-[320px] flex gap-[20px] footer-content">
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
  );
}
