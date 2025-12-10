import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { PlayerTab } from '../../components/Playerwrapper';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface StatsActivityProps {
  onNavigate: (page: Page) => void;
  currentTab?: PlayerTab;
  onTabChange?: (tab: PlayerTab) => void;
}

export function StatsActivity({ onNavigate, currentTab, onTabChange }: StatsActivityProps) {
  const recentMatches = [
    { opponent: 'vs Sarah M.', result: 'Won', score: '6-4, 6-2', date: 'Dec 26' },
    { opponent: 'vs Mike R.', result: 'Lost', score: '4-6, 6-3, 6-7', date: 'Dec 24' },
    { opponent: 'vs Emma K.', result: 'Won', score: '6-1, 6-4', date: 'Dec 22' },
  ];

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <Header onNavigate={onNavigate} showUserInfo={true} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-lg border border-[#d0d7de] p-4 sm:p-6 mb-4">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-[#0969da] rounded-full flex items-center justify-center text-white text-3xl sm:text-5xl lg:text-6xl font-bold mb-4">JS</div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-[#24292f] mb-1">John Smith</h1>
                  <p className="text-[#656d76] text-xs sm:text-sm mb-4">john.smith@email.com</p>
                  <span className="px-3 py-1 bg-[#ddf4ff] text-[#0969da] text-xs font-medium rounded-full border border-[#b6e3ff]">Player</span>
                </div>
                <p className="text-[#24292f] text-xs sm:text-sm mb-4 text-center">Passionate tennis player with 5+ years of experience. Always looking to improve my game!</p>
                <div className="text-[#656d76] text-xs sm:text-sm mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>Central Coast, NSW</span>
                  </div>
                </div>
                <div className="border-t border-[#d0d7de] pt-4 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#656d76] text-xs sm:text-sm">Total Bookings</span>
                    <span className="text-[#24292f] font-semibold text-sm sm:text-base">47</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#656d76] text-xs sm:text-sm">Hours Played</span>
                    <span className="text-[#24292f] font-semibold text-sm sm:text-base">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#656d76] text-xs sm:text-sm">Win Rate</span>
                    <span className="text-[#24292f] font-semibold text-sm sm:text-base">68%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-lg border border-[#d0d7de] mb-4 overflow-x-auto">
                <nav className="flex border-b border-[#d0d7de] min-w-max sm:min-w-0">
                  <button onClick={() => onTabChange?.('overview')} className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${currentTab === 'overview' ? 'border-[#e0cb23] text-[#24292f]' : 'border-transparent text-[#656d76] hover:text-[#24292f] hover:border-[#d0d7de]'}`}>Overview</button>
                  <button onClick={() => onTabChange?.('personal-info')} className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${currentTab === 'personal-info' ? 'border-[#e0cb23] text-[#24292f]' : 'border-transparent text-[#656d76] hover:text-[#24292f] hover:border-[#d0d7de]'}`}>Personal Info</button>
                  <button onClick={() => onTabChange?.('stats-activity')} className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${currentTab === 'stats-activity' ? 'border-[#e0cb23] text-[#24292f]' : 'border-transparent text-[#656d76] hover:text-[#24292f] hover:border-[#d0d7de]'}`}>Stats & Activity</button>
                  <button onClick={() => onTabChange?.('preferences')} className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${currentTab === 'preferences' ? 'border-[#e0cb23] text-[#24292f]' : 'border-transparent text-[#656d76] hover:text-[#24292f] hover:border-[#d0d7de]'}`}>Preferences</button>
                </nav>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-[#d0d7de]">
                  <div className="p-4 border-b border-[#d0d7de]">
                    <h3 className="text-base font-semibold text-[#24292f]">Performance Metrics</h3>
                    <p className="text-xs text-[#656d76] mt-1">Your detailed statistics and progress</p>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-[#f6f8fa] rounded border border-[#d0d7de]">
                      <p className="text-2xl font-bold text-[#24292f] mb-1">5</p>
                      <p className="text-xs text-[#656d76]">Current Streak</p>
                    </div>
                    <div className="text-center p-3 bg-[#f6f8fa] rounded border border-[#d0d7de]">
                      <p className="text-2xl font-bold text-[#24292f] mb-1">Tennis</p>
                      <p className="text-xs text-[#656d76]">Favorite Activity</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-[#d0d7de]">
                  <div className="p-4 border-b border-[#d0d7de]">
                    <h3 className="text-base font-semibold text-[#24292f]">Recent Activity</h3>
                    <p className="text-xs text-[#656d76] mt-1">Your latest matches</p>
                  </div>
                  <div className="p-4 space-y-3">
                    {recentMatches.map((match, idx) => (
                      <div key={idx} className="p-3 bg-[#f6f8fa] rounded border border-[#d0d7de]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm text-[#24292f]">{match.opponent}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${match.result === 'Won' ? 'bg-[#dafbe1] text-[#1a7f37] border border-[#a5f3b8]' : 'bg-[#ffebe9] text-[#cf222e] border border-[#ffc1cc]'}`}>{match.result}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#656d76]">{match.score}</span>
                          <span className="text-[#656d76]">{match.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
