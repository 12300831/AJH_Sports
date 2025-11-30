import { FormEvent } from 'react';
import './eventspage.css'; // CSS import

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact';

interface EventsWrapperProps {
  onNavigate: (page: Page) => void;
}

const navItems: Array<{ label: string; page: Page }> = [
  { label: 'Home', page: 'home' },
  { label: 'Events', page: 'events' },
  { label: 'Clubs', page: 'clubs' },
  { label: 'Coaches', page: 'coaches' },
  { label: 'Contact Us', page: 'contact' },
];

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
      <header className="bg-[#d9d9d9] shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-10 text-[16px] font-medium text-black">
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
          <div className="flex items-center gap-6 text-sm font-semibold text-black">
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
                <div className="feature-item">PLAY</div>
                <div className="feature-item">LEARN</div>
                <div className="feature-item">CONNECT</div>
                <div className="feature-item">COMPETE</div>
              </div>
              <p className="intro-description">
                Join exciting tournaments, coaching sessions, and social matches.
                Perfect for all skill levels and age groups.
              </p>
              <div className="intro-stats">
                <div className="stat">
                  <div className="stat-icon">👥</div>
                  <div className="stat-number">100+</div>
                  <div className="stat-text">Active players</div>
                </div>
                <div className="stat">
                  <div className="stat-icon">📅</div>
                  <div className="stat-number">10+</div>
                  <div className="stat-text">Events Monthly</div>
                </div>
                <div className="stat">
                  <div className="stat-icon">🏟️</div>
                  <div className="stat-number">10</div>
                  <div className="stat-text">Courts Available</div>
                </div>
              </div>
              <div className="intro-additional-info">
                <span>🎾 200+ Tennis Players</span>
                <span>🏓 150+ Table Tennis Enthusiasts</span>
                <span>🎉 50+ Kids Parties Hosted</span>
              </div>
            </div>
            <div className="intro-images">
              <img
                src="/mnt/data/00380abb-b864-468b-a559-b083d99184f4.png"
                alt="Tennis and Table Tennis"
                className="intro-image"
              />
              <img
                src="/mnt/data/00380abb-b864-468b-a559-b083d99184f4.png"
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
          <div className="event-item">
            <img src="tennis.jpg" alt="Tennis Open 2025" className="event-image" />
            <div className="event-title">Tennis Open 2025 🎾</div>
          </div>

          <div className="event-item">
            <img src="table-tennis.jpg" alt="Table Tennis Tournament 2025" className="event-image" />
            <div className="event-title">Table Tennis Tournament 2025 🏓</div>
          </div>

          <div className="event-item">
            <img src="kids-party.jpg" alt="Kids Sports Parties" className="event-image" />
            <div className="event-title">Kids Sports Parties 🎉</div>
          </div>

          <div className="event-item">
            <img src="coaching.jpg" alt="1-on-1 Coaching" className="event-image" />
            <div className="event-title">1-ON-1 Coaching 🧑‍🏫</div>
          </div>
        </div>
      </section>
    </div>
  );
}
