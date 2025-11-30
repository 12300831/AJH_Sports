import { useState } from 'react';
import { ClubMainWrapper } from './components/ClubMainWrapper';
import { OurClubsWrapper } from './components/OurClubsWrapper';
import { ClubAccountWrapper } from './components/ClubAccountWrapper';
import { ContactWrapper } from './components/ContactWrapper';
import { EventsWrapper } from './events/EventsWrapper';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: Page) => {
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <ClubMainWrapper onNavigate={handleNavigate} />;
      case 'clubs':
        return <OurClubsWrapper onNavigate={handleNavigate} />;
      case 'events':
        return <EventsWrapper onNavigate={handleNavigate} />;
      case 'account':
        return <ClubAccountWrapper onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactWrapper onNavigate={handleNavigate} />;
      default:
        return <ClubMainWrapper onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden">
      {/* Responsive container that scales content for mobile/tablet */}
      <div className="w-full relative">
        <style>{`
          @media (max-width: 1439px) {
            .responsive-wrapper {
              transform-origin: top center;
              transform: scale(calc(100vw / 1440));
            }
          }
          
          @media (min-width: 1440px) {
            .responsive-wrapper {
              margin: 0 auto;
            }
          }
        `}</style>
        <div className="responsive-wrapper" style={{ width: '1440px', margin: '0 auto' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}