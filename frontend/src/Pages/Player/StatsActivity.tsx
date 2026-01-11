import React from 'react';
import { PlayerLayout } from '../../components/PlayerLayout';
import { PlayerTab } from '../../components/Playerwrapper';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface StatsActivityProps {
  onNavigate: (page: Page) => void;
  currentTab?: PlayerTab;
  onTabChange?: (tab: PlayerTab) => void;
}

export function StatsActivity({ onNavigate, currentTab, onTabChange }: StatsActivityProps) {
  // Template - no real data yet
  const recentMatches: any[] = [];

  return (
    <PlayerLayout
      title="Stats & Activity"
      description="View your detailed statistics and recent activity"
      currentTab={currentTab}
      onNavigate={onNavigate}
      onTabChange={onTabChange || (() => {})}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[#24292f]">Performance Metrics</h3>
            <p className="text-sm text-[#656d76] mt-1">Your detailed statistics and progress</p>
          </div>
          <div className="p-4 sm:p-6 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-3xl font-bold text-[#24292f] mb-2">--</p>
              <p className="text-sm text-[#656d76]">Current Streak</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-3xl font-bold text-[#24292f] mb-2">--</p>
              <p className="text-sm text-[#656d76]">Favorite Activity</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[#24292f]">Recent Activity</h3>
            <p className="text-sm text-[#656d76] mt-1">Your latest matches</p>
          </div>
          <div className="p-4 sm:p-6">
            {recentMatches.length > 0 ? (
              <div className="space-y-3">
                {recentMatches.map((match, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-[#24292f]">{match.opponent}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${match.result === 'Won' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                        {match.result}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#656d76]">
                      <span>{match.score}</span>
                      <span>{match.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-[#656d76]">No recent activity available</p>
                <p className="text-xs text-[#656d76] mt-1">Your match history will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PlayerLayout>
  );
}
