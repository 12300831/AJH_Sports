import { MouseEvent } from 'react';
import ClubMainOriginal from '../imports/ClubMain';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact';

interface ClubMainWrapperProps {
  onNavigate: (page: Page) => void;
}

export function ClubMainWrapper({ onNavigate }: ClubMainWrapperProps) {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const text = target.textContent?.trim();
    const normalizedText = text?.replace(/\u2019/g, "'"); // normalize smart quotes
    const cta = target.closest('[data-cta]')?.getAttribute('data-cta');

    if (cta === 'lets-play') {
      onNavigate('clubs');
      return;
    }
    if (cta === 'join-club') {
      onNavigate('account');
      return;
    }

    // Navigation items in header
    if (normalizedText === 'Home') {
      onNavigate('home');
    } else if (normalizedText === 'Events') {
      onNavigate('events');
    } else if (normalizedText === 'Clubs') {
      onNavigate('clubs');
    } else if (normalizedText === 'Coaches') {
      onNavigate('coaches');
    } else if (normalizedText === 'Contact Us') {
      onNavigate('contact');
    } else if (normalizedText === "Let's Play!" || text === "Let's Play!") {
      // Redirect to clubs page to see youth and adult clubs
      onNavigate('clubs');
    }
  };

  return (
    <div onClick={handleClick}>
      <style>{`
        [data-name="Club Main"] p {
          cursor: pointer;
          transition: opacity 0.2s;
        }
        [data-name="Club Main"] p:hover {
          opacity: 0.8;
        }
        [data-name="Club Main"] div[class*="bg-[#e0cb23]"] {
          cursor: pointer;
          transition: opacity 0.2s;
        }
        [data-name="Club Main"] div[class*="bg-[#e0cb23]"]:hover {
          opacity: 0.9;
        }
        [data-name="Club Main"] div[class*="bg-[rgba(196,196,196,0.2)]"] {
          background-color: rgba(196, 196, 196, 0.6) !important;
        }
      `}</style>
      <ClubMainOriginal />
    </div>
  );
}