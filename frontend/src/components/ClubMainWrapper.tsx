import { MouseEvent } from 'react';
import ClubMain from '../imports/ClubMain';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup';

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
      // From Join Our Club -> go to clubs list (youth/adult)
      onNavigate('clubsList');
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
      // Header "Clubs" from anywhere should show Join Our Club
      onNavigate('clubs');
    } else if (normalizedText === 'Coaches') {
      onNavigate('coaches');
    } else if (normalizedText === 'Contact Us' || normalizedText === 'Contact') {
      onNavigate('contact');
    } else if (normalizedText === 'Log In' || normalizedText === 'Login') {
      onNavigate('signin');
    } else if (normalizedText === 'Sign Up' || normalizedText === 'Signup') {
      onNavigate('signup');
    } else if (normalizedText === "Let's Play!" || text === "Let's Play!") {
      // Any Let's Play on this page goes to the clubs list
      onNavigate('clubsList');
    }
  };

  return (
    <div onClick={handleClick} className="flex flex-col flex-1 w-full min-h-screen h-full">
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
      <ClubMain />
    </div>
  );
}