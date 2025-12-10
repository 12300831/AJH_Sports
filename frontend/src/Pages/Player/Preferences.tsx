import React, { useState } from 'react';
import { Switch } from '../../components/ui/switch';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { PlayerTab } from '../../components/Playerwrapper';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface PreferencesProps {
  onNavigate: (page: Page) => void;
  currentTab?: PlayerTab;
  onTabChange?: (tab: PlayerTab) => void;
}

export function Preferences({ onNavigate, currentTab, onTabChange }: PreferencesProps) {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: true,
    marketing: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    activityStatus: true,
    matchHistory: true,
  });

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
                    <h3 className="text-base font-semibold text-[#24292f]">Notification</h3>
                    <p className="text-xs text-[#656d76] mt-1">Choose how you want to be notified.</p>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🔔</span>
                        <div>
                          <p className="font-medium text-sm text-[#24292f]">Email Notification</p>
                          <p className="text-xs text-[#656d76]">Booking confirmations and updates.</p>
                        </div>
                      </div>
                      <Switch checked={notifications.email} onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📱</span>
                        <div>
                          <p className="font-medium text-sm text-[#24292f]">Push Notification</p>
                          <p className="text-xs text-[#656d76]">Real-time alerts and reminders.</p>
                        </div>
                      </div>
                      <Switch checked={notifications.push} onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">💬</span>
                        <div>
                          <p className="font-medium text-sm text-[#24292f]">SMS Notification</p>
                          <p className="text-xs text-[#656d76]">Text message alerts.</p>
                        </div>
                      </div>
                      <Switch checked={notifications.sms} onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📧</span>
                        <div>
                          <p className="font-medium text-sm text-[#24292f]">Marketing Communication</p>
                          <p className="text-xs text-[#656d76]">Promotions and special offers.</p>
                        </div>
                      </div>
                      <Switch checked={notifications.marketing} onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })} />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-[#d0d7de]">
                  <div className="p-4 border-b border-[#d0d7de]">
                    <h3 className="text-base font-semibold text-[#24292f]">Privacy & Security</h3>
                    <p className="text-xs text-[#656d76] mt-1">Manage your privacy settings.</p>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🛡️</span>
                        <div>
                          <p className="font-medium text-sm text-[#24292f]">Profile Visibility</p>
                          <p className="text-xs text-[#656d76]">Allow others to see your profile.</p>
                        </div>
                      </div>
                      <Switch checked={privacy.profileVisibility} onCheckedChange={(checked) => setPrivacy({ ...privacy, profileVisibility: checked })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🟢</span>
                        <div>
                          <p className="font-medium text-sm text-[#24292f]">Activity Status</p>
                          <p className="text-xs text-[#656d76]">Show when you're online.</p>
                        </div>
                      </div>
                      <Switch checked={privacy.activityStatus} onCheckedChange={(checked) => setPrivacy({ ...privacy, activityStatus: checked })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📊</span>
                        <div>
                          <p className="font-medium text-sm text-[#24292f]">Match History</p>
                          <p className="text-xs text-[#656d76]">Make your match history public.</p>
                        </div>
                      </div>
                      <Switch checked={privacy.matchHistory} onCheckedChange={(checked) => setPrivacy({ ...privacy, matchHistory: checked })} />
                    </div>
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
