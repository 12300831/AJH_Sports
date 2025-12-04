import { MouseEvent, useState } from 'react';
import Coaches from '../Pages/Coaches/Coaches';
import CoachesPage from '../Pages/Coaches/CoachesPage';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact';

interface CoachesWrapperProps {
  onNavigate: (page: Page) => void;
}

export function CoachesWrapper({ onNavigate }: CoachesWrapperProps) {
  const [showCoachesPage, setShowCoachesPage] = useState(false);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const text = target.textContent?.trim();
    const normalizedText = text?.replace(/\u2019/g, "'"); // normalize smart quotes in menu items

    if (target.tagName === 'A') {
      e.preventDefault();
    }

    if (target.classList.contains('primary-cta') || normalizedText === "Let's Get Started") {
      setShowCoachesPage(true);
      return;
    }

    if (normalizedText === 'Home') {
      onNavigate('home');
      setShowCoachesPage(false);
    } else if (normalizedText === 'Events') {
      onNavigate('events');
      setShowCoachesPage(false);
    } else if (normalizedText === 'Clubs') {
      onNavigate('clubs');
      setShowCoachesPage(false);
    } else if (normalizedText === 'Coaches') {
      onNavigate('coaches');
    } else if (normalizedText === 'Contact Us') {
      onNavigate('contact');
      setShowCoachesPage(false);
    } else if (normalizedText === 'Log In' || normalizedText === 'Sign Up') {
      onNavigate('account');
      setShowCoachesPage(false);
    } else if (normalizedText === "Let's Get Started") {
      setShowCoachesPage(true);
    }
  };

  return (
    <div onClick={handleClick}>
      {showCoachesPage ? <CoachesPage /> : <Coaches />}
    </div>
  );
}
