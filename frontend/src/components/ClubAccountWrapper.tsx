import { MouseEvent } from 'react';
import ClubAccountOriginal from '../imports/ClubAccount';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact';

interface ClubAccountWrapperProps {
  onNavigate: (page: Page) => void;
}

export function ClubAccountWrapper({ onNavigate }: ClubAccountWrapperProps) {
  // Auto-redirect to NavSports after 3 seconds
  // Replace with your actual NavSports URL or contact method
  const navsportsUrl = 'https://navsports.com/contact'; // Update this URL as needed
  
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
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