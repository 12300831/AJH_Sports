import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { PlayerTab } from '../../components/Playerwrapper';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface PlayerOverviewProps {
  onNavigate: (page: Page) => void;
  currentTab?: PlayerTab;
  onTabChange?: (tab: PlayerTab) => void;
}

export function PlayerOverview({ onNavigate, currentTab = 'overview', onTabChange }: PlayerOverviewProps) {
  const upcomingBookings = [
    { venue: 'Tennis Court A', date: 'Today', time: '2:00 PM - 3:00 PM', status: 'confirmed' },
    { venue: 'Basketball Court', date: 'Tomorrow', time: '10:00 AM - 11:00 AM', status: 'pending' },
    { venue: 'Swimming Pool', date: 'Dec 30', time: '6:00 PM - 7:00 PM', status: 'confirmed' },
  ];

  const recentActivity = [
    'Booking confirmed for Tennis Court A',
    'Payment processed for Basketball Court',
    'Booking modified for Swimming Pool',
    'New booking request submitted',
  ];

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <Header onNavigate={onNavigate} showUserInfo={true} />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar - Profile Info */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-lg border border-[#d0d7de] p-4 sm:p-6 mb-4">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-[#0969da] rounded-full flex items-center justify-center text-white text-3xl sm:text-5xl lg:text-6xl font-bold mb-4">
                    JS
                  </div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-[#24292f] mb-1">John Smith</h1>
                  <p className="text-[#656d76] text-xs sm:text-sm mb-4">john.smith@email.com</p>
                  <span className="px-3 py-1 bg-[#ddf4ff] text-[#0969da] text-xs font-medium rounded-full border border-[#b6e3ff]">
                    Player
                  </span>
                </div>
                <p className="text-[#24292f] text-xs sm:text-sm mb-4 text-center">
                  Passionate tennis player with 5+ years of experience. Always looking to improve my game!
                </p>
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

            {/* Right Main Content */}
            <div className="flex-1 min-w-0">
              {/* Tab Navigation */}
              <div className="bg-white rounded-lg border border-[#d0d7de] mb-4 overflow-x-auto">
                <nav className="flex border-b border-[#d0d7de] min-w-max sm:min-w-0">
                  <button
                    onClick={() => onTabChange?.('overview')}
                    className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      currentTab === 'overview'
                        ? 'border-[#e0cb23] text-[#24292f]'
                        : 'border-transparent text-[#656d76] hover:text-[#24292f] hover:border-[#d0d7de]'
                    }`}
                  >
                    <span className="flex items-center gap-1 sm:gap-2">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Overview
                    </span>
                  </button>
                  <button
                    onClick={() => onTabChange?.('personal-info')}
                    className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      currentTab === 'personal-info'
                        ? 'border-[#e0cb23] text-[#24292f]'
                        : 'border-transparent text-[#656d76] hover:text-[#24292f] hover:border-[#d0d7de]'
                    }`}
                  >
                    Personal Info
                  </button>
                  <button
                    onClick={() => onTabChange?.('stats-activity')}
                    className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      currentTab === 'stats-activity'
                        ? 'border-[#e0cb23] text-[#24292f]'
                        : 'border-transparent text-[#656d76] hover:text-[#24292f] hover:border-[#d0d7de]'
                    }`}
                  >
                    Stats & Activity
                  </button>
                  <button
                    onClick={() => onTabChange?.('preferences')}
                    className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      currentTab === 'preferences'
                        ? 'border-[#e0cb23] text-[#24292f]'
                        : 'border-transparent text-[#656d76] hover:text-[#24292f] hover:border-[#d0d7de]'
                    }`}
                  >
                    Preferences
                  </button>
                </nav>
              </div>

              {/* Content Area */}
              <div className="space-y-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white rounded-lg border border-[#d0d7de] p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl mb-2">📅</div>
                    <p className="text-xs text-[#656d76] mb-1">Total Bookings</p>
                    <p className="text-xl sm:text-2xl font-bold text-[#24292f]">47</p>
                  </div>
                  <div className="bg-white rounded-lg border border-[#d0d7de] p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl mb-2">⏰</div>
                    <p className="text-xs text-[#656d76] mb-1">Hours Played</p>
                    <p className="text-xl sm:text-2xl font-bold text-[#24292f]">156</p>
                  </div>
                  <div className="bg-white rounded-lg border border-[#d0d7de] p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl mb-2">📈</div>
                    <p className="text-xs text-[#656d76] mb-1">Win Rate</p>
                    <p className="text-xl sm:text-2xl font-bold text-[#24292f]">68%</p>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white rounded-lg border border-[#d0d7de] p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3">
                      <div className="text-lg sm:text-xl">🎯</div>
                      <div>
                        <p className="font-semibold text-[#24292f] text-xs sm:text-sm">Monthly Goal Progress</p>
                        <p className="text-xs text-[#656d76]">14 of 20 hours this month</p>
                      </div>
                    </div>
                    <div className="w-full bg-[#d0d7de] rounded-full h-2">
                      <div className="bg-[#e0cb23] h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-[#d0d7de] p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3">
                      <div className="text-lg sm:text-xl">🏆</div>
                      <div>
                        <p className="font-semibold text-[#24292f] text-xs sm:text-sm">Achievements</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">🏆</span>
                        <span className="text-xs text-[#24292f]">First Win</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">🏆</span>
                        <span className="text-xs text-[#24292f]">10 Hours Played</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">🏆</span>
                        <span className="text-xs text-[#24292f]">Perfect Week</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {/* Upcoming Bookings */}
                  <div className="bg-white rounded-lg border border-[#d0d7de]">
                    <div className="p-3 sm:p-4 border-b border-[#d0d7de]">
                      <h3 className="text-sm sm:text-base font-semibold text-[#24292f]">Upcoming Bookings</h3>
                      <p className="text-xs text-[#656d76] mt-1">Your next scheduled activities</p>
                    </div>
                    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                      {upcomingBookings.map((booking, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 sm:p-3 bg-[#f6f8fa] rounded border border-[#d0d7de]">
                          <div className="flex-1">
                            <p className="font-medium text-xs sm:text-sm text-[#24292f]">{booking.venue}</p>
                            <p className="text-xs text-[#656d76]">{booking.date} • {booking.time}</p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${
                              booking.status === 'confirmed'
                                ? 'bg-[#dafbe1] text-[#1a7f37] border border-[#a5f3b8]'
                                : 'bg-[#fff8c5] text-[#9a6700] border border-[#fae17d]'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        className="w-full mt-2 text-xs sm:text-sm border-[#d0d7de] text-[#24292f] hover:bg-[#f6f8fa]"
                        onClick={() => {}}
                      >
                        View all bookings
                      </Button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-lg border border-[#d0d7de]">
                    <div className="p-3 sm:p-4 border-b border-[#d0d7de]">
                      <h3 className="text-sm sm:text-base font-semibold text-[#24292f]">Recent Activity</h3>
                      <p className="text-xs text-[#656d76] mt-1">Your latest updates</p>
                    </div>
                    <div className="p-3 sm:p-4">
                      <ul className="space-y-2">
                        {recentActivity.map((activity, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#24292f]">
                            <span className="text-[#e0cb23] mt-0.5">•</span>
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
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
