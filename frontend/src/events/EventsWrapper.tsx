import { FormEvent } from 'react';
// Images are served from the public folder at the root path (/images/...)
// so we use URL strings instead of importing from /public.
const Image_tennis = '/images/TT.png';
const Image_tt = '/images/Tennis.png';
const Image_tennis_court = '/images/TennisOpen.png';
const Image_tt_table = '/images/TTCup.png';
const Image_kids_in_sports = '/images/KidsSports.png';
const Image_coaching = '/images/OneonOneCoaching.png';

import './eventspage.css'; // CSS import

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact';

interface EventsWrapperProps {
  onNavigate: (page: Page) => void;
}

// --- DATA ARRAYS ---
const navItems: Array<{ label: string; page: Page }> = [
  { label: 'Home', page: 'home' },
  { label: 'Events', page: 'events' },
  { label: 'Clubs', page: 'clubs' },
  { label: 'Coaches', page: 'coaches' },
  { label: 'Contact Us', page: 'contact' },
];

const features = ['PLAY', 'LEARN', 'CONNECT', 'COMPETE'];

const stats = [
  { icon: '👥', number: '100+', text: 'Active players' },
  { icon: '📅', number: '10+', text: 'Events Monthly' },
  { icon: '🏟️', number: '10', text: 'Courts Available' },
];

const additionalInfo = [
  '🎾 200+ Tennis Players',
  '🏓 150+ Table Tennis Enthusiasts',
  '🎉 50+ Kids Parties Hosted',
];

const events = [
  { image: Image_tennis_court, title: 'Tennis Open 2025 🎾', alt: 'Tennis Open 2025' },
  { image: Image_tt_table, title: 'Table Tennis Tournament 2025 🏓', alt: 'Table Tennis Tournament 2025' },
  { image: Image_kids_in_sports, title: 'Kids Sports Parties 🎉', alt: 'Kids Sports Parties' },
  { image: Image_coaching, title: '1-ON-1 Coaching 🧑‍🏫', alt: '1-on-1 Coaching' },
];

// --- COMPONENT ---
export function EventsWrapper({ onNavigate }: EventsWrapperProps) {
  const handleNavClick = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(page);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    alert(`Thanks for signing up${name ? `, ${name}` : ''}!`);
    event.currentTarget.reset();
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]" data-name="Events Page">
      {/* Shared-style header (aligned with main site navigation) */}
      <header className="bg-black shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-10 text-[16px] font-medium text-white">
            <div className="flex items-center gap-3">
              <div className="h-[40px] w-[60px]">
                <img
                  src="/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png"
                  alt="AJH Sports logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            {navItems.map(({ label, page }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleNavClick(page)}
                className="transition-opacity hover:opacity-70"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-6 text-sm font-semibold text-white">
            <button
              type="button"
              className="transition-opacity hover:opacity-70"
              onClick={() => handleNavClick('account')}
            >
              Log In
            </button>
            <button
              type="button"
              className="rounded-md bg-[#878787] px-4 py-2 text-white transition hover:bg-[#6d6d6d]"
              onClick={() => handleNavClick('account')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <section className="events-intro-section">
        <div className="intro-container">
          <div className="intro-header">
            <div className="intro-text">
              <h1 className="intro-title">
                Discover <br /> AJH Sports Events
              </h1>
              <div className="intro-tagline">
                “Explore our range of coaching programs, kids’ sports parties, and
                social matches designed for all ages and skill levels. Book your
                spot today and be part of the AJH Sports community."
              </div>

              <div className="intro-features">
                {features.map((feature) => (
                  <div key={feature} className="feature-item">{feature}</div>
                ))}
              </div>

              <p className="intro-description">
                Join exciting tournaments, coaching sessions, and social matches.
                Perfect for all skill levels and age groups.
              </p>

              <div className="intro-stats">
                {stats.map(({ icon, number, text }) => (
                  <div key={text} className="stat">
                    <div className="stat-icon">{icon}</div>
                    <div className="stat-number">{number}</div>
                    <div className="stat-text">{text}</div>
                  </div>
                ))}
              </div>

              <div className="intro-additional-info">
                {additionalInfo.map((info) => (
                  <span key={info}>{info}</span>
                ))}
              </div>
            </div>

            <div className="intro-images">
              <img
                src={Image_tennis}
                alt="Tennis and Table Tennis"
                className="intro-image"
              />
              <img
                src={Image_tt}
                alt="Tennis and Table Tennis"
                className="intro-image"
              />
            </div>
          </div>
          <div className="upcoming-events-title">UPCOMING EVENTS 🎾🏓!</div>
        </div>
      </section>

      <section className="events-list-section">
        <div className="events-list-container">
          {events.map(({ image, title, alt }) => (
            <div key={title} className="event-item">
              <img src={image} alt={alt} className="event-image" />
              <div className="event-title">{title}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
