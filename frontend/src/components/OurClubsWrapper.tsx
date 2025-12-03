import { MouseEvent } from 'react';
import OurClubsOriginal from '../imports/OurClubs';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact';

interface OurClubsWrapperProps {
  onNavigate: (page: Page) => void;
}

export function OurClubsWrapper({ onNavigate }: OurClubsWrapperProps) {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const text = target.textContent?.trim();
    const normalizedText = text?.replace(/\u2019/g, "'"); // normalize smart quotes for menu items
    const cta = target.closest('[data-cta]')?.getAttribute('data-cta');

    if (cta) {
      if (cta.startsWith('join')) {
        onNavigate('account');
        return;
      }
      if (cta.startsWith('contact')) {
        onNavigate('contact');
        return;
      }
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
    } else if (normalizedText === 'Join Us') {
      // Redirect to account page when clicking Join Us buttons
      onNavigate('account');
    }
  };

  return (
    <div onClick={handleClick}>
      <style>{`
        [data-name="Our Clubs"] p {
          cursor: pointer;
          transition: opacity 0.2s;
        }
        [data-name="Our Clubs"] p:hover {
          opacity: 0.8;
        }
        [data-name="Our Clubs"] div[class*="bg-[#e0cb23]"] {
          cursor: pointer;
          transition: opacity 0.2s;
        }
        [data-name="Our Clubs"] div[class*="bg-[#e0cb23]"]:hover {
          opacity: 0.9;
        }
      `}</style>
      <OurClubsOriginal />
    </div>
  );
}