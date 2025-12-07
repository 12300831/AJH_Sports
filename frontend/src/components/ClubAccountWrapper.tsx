import { MouseEvent } from 'react';
import ClubAccountOriginal from '../imports/ClubAccount';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact';

interface ClubAccountWrapperProps {
  onNavigate: (page: Page) => void;
}

export function ClubAccountWrapper({ onNavigate }: ClubAccountWrapperProps) {

  const navsportsUrl = 'https://navsports.com'; // U
  
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const text = target.textContent?.trim();
    const normalizedText = text?.replace(/\u2019/g, "'"); // 
    
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

    // Check if clicking the home icon at the bottom
    if (target.closest('[data-name="25694 1"]') || target.closest('img[src*="25694"]')) {
      onNavigate('home');
    }
    
    // Check if clicking on the main content area to trigger redirect
    if (target.closest('[data-name="Club Account"]') && 
        !target.closest('[data-name="25694 1"]')) {
      // Optionally trigger immediate redirect on click
      window.open(navsportsUrl, '_blank');
    }
  };

  return (
    <div onClick={handleClick}>
      <style>{`
        [data-name="25694 1"] {
          cursor: pointer;
          transition: transform 0.2s;
        }
        [data-name="25694 1"]:hover {
          transform: scale(1.1);
        }
        [data-name="Club Account"] {
          cursor: pointer;
        }
      `}</style>
      <ClubAccountOriginal />
    </div>
  );
}