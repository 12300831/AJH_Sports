import { MouseEvent } from 'react';
import ClubAccountOriginal from '../imports/ClubAccount';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact';

interface ClubAccountWrapperProps {
  onNavigate: (page: Page) => void;
}

export function ClubAccountWrapper({ onNavigate }: ClubAccountWrapperProps) {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const text = target.textContent?.trim();
    const normalizedText = text?.replace(/\u2019/g, "'");
    
    // Header navigation items
    if (normalizedText === 'Home') {
      onNavigate('home');
      return;
    }
    if (normalizedText === 'Events') {
      onNavigate('events');
      return;
    }
    if (normalizedText === 'Clubs') {
      onNavigate('clubs');
      return;
    }
    if (normalizedText === 'Coaches') {
      onNavigate('coaches');
      return;
    }
    if (normalizedText === 'Contact Us') {
      onNavigate('contact');
      return;
    }

    // Check if clicking "Return to Home" button
    if (normalizedText === 'Return to Home' || target.closest('button')?.textContent?.includes('Return to Home')) {
      onNavigate('home');
      return;
    }

    // Check if clicking the home icon
    if (target.closest('[data-name="25694 1"]') || target.closest('img[src*="25694"]')) {
      onNavigate('home');
      return;
    }
  };

  return (
    <div onClick={handleClick} className="flex flex-col flex-1 w-full">
      <ClubAccountOriginal />
    </div>
  );
}