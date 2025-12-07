import { useState } from 'react';
import { PlayerOverview } from '../Pages/Player/Overview';
import { PersonalInfo } from '../Pages/Player/PersonalInfo';
import { StatsActivity } from '../Pages/Player/StatsActivity';
import { Preferences } from '../Pages/Player/Preferences';
import { Account } from '../Pages/Player/Account';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface PlayerWrapperProps {
  onNavigate: (page: Page) => void;
}

export type PlayerTab = 'overview' | 'personal-info' | 'stats-activity' | 'preferences' | 'account';

export function PlayerWrapper({ onNavigate }: PlayerWrapperProps) {
  const [currentTab, setCurrentTab] = useState<PlayerTab>('overview');

  const renderTab = () => {
    switch (currentTab) {
      case 'overview':
        return <PlayerOverview onNavigate={onNavigate} currentTab={currentTab} onTabChange={setCurrentTab} />;
      case 'personal-info':
        return <PersonalInfo onNavigate={onNavigate} currentTab={currentTab} onTabChange={setCurrentTab} />;
      case 'stats-activity':
        return <StatsActivity onNavigate={onNavigate} currentTab={currentTab} onTabChange={setCurrentTab} />;
      case 'preferences':
        return <Preferences onNavigate={onNavigate} currentTab={currentTab} onTabChange={setCurrentTab} />;
      case 'account':
        return <Account onNavigate={onNavigate} currentTab={currentTab} onTabChange={setCurrentTab} />;
      default:
        return <PlayerOverview onNavigate={onNavigate} currentTab={currentTab} onTabChange={setCurrentTab} />;
    }
  };

  return renderTab();
}