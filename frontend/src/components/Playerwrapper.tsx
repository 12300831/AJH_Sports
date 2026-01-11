import { useState, useEffect } from 'react';
import { PlayerOverview } from '../Pages/Player/Overview';
import { PersonalInfo } from '../Pages/Player/PersonalInfo';
import { StatsActivity } from '../Pages/Player/StatsActivity';
import { Preferences } from '../Pages/Player/Preferences';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player' | 'payment' | 'paymentSuccess';

interface PlayerWrapperProps {
  onNavigate: (page: Page) => void;
}

export type PlayerTab = 'overview' | 'personal-info' | 'stats-activity' | 'preferences';

// Map URL paths to player tabs
const pathToPlayerTab: Record<string, PlayerTab> = {
  '/player': 'overview',
  '/player/personal-info': 'personal-info',
  '/player/stats-activity': 'stats-activity',
  '/player/preferences': 'preferences',
};

export function PlayerWrapper({ onNavigate }: PlayerWrapperProps) {
  const [currentTab, setCurrentTab] = useState<PlayerTab>('overview');

  useEffect(() => {
    // Sync with URL on mount
    const path = window.location.pathname;
    const tab = pathToPlayerTab[path] || 'overview';
    setCurrentTab(tab);
  }, []);

  // Listen for URL changes
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const tab = pathToPlayerTab[path] || 'overview';
      setCurrentTab(tab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (tab: PlayerTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update URL
    const pathMap: Record<PlayerTab, string> = {
      'overview': '/player',
      'personal-info': '/player/personal-info',
      'stats-activity': '/player/stats-activity',
      'preferences': '/player/preferences',
    };
    window.history.pushState({ tab }, '', pathMap[tab]);
  };

  const renderTab = () => {
    switch (currentTab) {
      case 'overview':
        return <PlayerOverview onNavigate={onNavigate} currentTab={currentTab} onTabChange={handleTabChange} />;
      case 'personal-info':
        return <PersonalInfo onNavigate={onNavigate} currentTab={currentTab} onTabChange={handleTabChange} />;
      case 'stats-activity':
        return <StatsActivity onNavigate={onNavigate} currentTab={currentTab} onTabChange={handleTabChange} />;
      case 'preferences':
        return <Preferences onNavigate={onNavigate} currentTab={currentTab} onTabChange={handleTabChange} />;
      default:
        return <PlayerOverview onNavigate={onNavigate} currentTab={currentTab} onTabChange={handleTabChange} />;
    }
  };

  return renderTab();
}
