import React, { useEffect, useState } from 'react';
import { HomepageWrapper } from './components/HomepageWrapper';
import { ClubMainWrapper } from './components/ClubMainWrapper';
import { OurClubsWrapper } from './components/OurClubsWrapper';
import { ClubAccountWrapper } from './components/ClubAccountWrapper';
import { ContactWrapper } from './components/ContactWrapper';
import { EventsWrapper } from './events/EventsWrapper';
import { CoachesWrapper } from './components/CoachesWrapper';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Ensure the app always starts on the home view when it first loads
  useEffect(() => {
    setCurrentPage('home');
  }, []);

  const handleNavigate = (page: Page) => {
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomepageWrapper onNavigate={handleNavigate} />;
      case 'clubs':
        // "Clubs" in the header shows the Join Our Club page
        return <ClubMainWrapper onNavigate={handleNavigate} />;
    case 'clubsList':
        // Detailed youth/adult clubs page
        return <OurClubsWrapper onNavigate={handleNavigate} />;
      case 'events':
        return <EventsWrapper onNavigate={handleNavigate} />;
      case 'account':
        return <ClubAccountWrapper onNavigate={handleNavigate} />;
      case 'coaches':
        return <CoachesWrapper onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactWrapper onNavigate={handleNavigate} />;
      default:
        return <ClubMainWrapper onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden">
      <div className="w-full relative">
        {renderPage()}
      </div>
    </div>
  );
}
