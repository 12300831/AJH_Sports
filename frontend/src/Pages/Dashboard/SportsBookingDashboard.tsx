import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface SportsBookingDashboardProps {
  onNavigate: (page: Page) => void;
}

export function SportsBookingDashboard({ onNavigate }: SportsBookingDashboardProps) {
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
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
      <Header onNavigate={onNavigate} showUserInfo={true} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Top Navigation Tabs */}
        <div className="mb-4 sm:mb-6 flex gap-2 overflow-x-auto">
          <button
            onClick={() => {}}
            className="px-4 sm:px-6 py-2 bg-[#e0cb23] text-black font-semibold rounded-t-lg whitespace-nowrap text-sm sm:text-base"
          >
            SportsBooking
          </button>
          <button
            onClick={() => onNavigate('player')}
            className="px-4 sm:px-6 py-2 bg-white text-black font-semibold rounded-t-lg hover:bg-gray-100 whitespace-nowrap text-sm sm:text-base"
          >
            Player
          </button>
        </div>

        {/* Secondary Tabs */}
        <div className="mb-4 sm:mb-6 flex gap-2 overflow-x-auto">
          <button className="px-3 sm:px-4 py-2 bg-white text-black font-medium rounded-lg whitespace-nowrap text-sm sm:text-base">Player</button>
          <button className="px-3 sm:px-4 py-2 bg-[#e0cb23] text-black font-medium rounded-lg whitespace-nowrap text-sm sm:text-base">Overview</button>
          <button className="px-3 sm:px-4 py-2 bg-white text-black font-medium rounded-lg whitespace-nowrap text-sm sm:text-base">Booking</button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Bookings</p>
                  <p className="text-2xl sm:text-3xl font-bold text-black">12</p>
                  <p className="text-xs text-green-600 mt-1">+2 from last month</p>
                </div>
                <div className="text-2xl sm:text-3xl">📅</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Hours Played</p>
                  <p className="text-2xl sm:text-3xl font-bold text-black">34</p>
                  <p className="text-xs text-green-600 mt-1">+8 from last month</p>
                </div>
                <div className="text-2xl sm:text-3xl">⏰</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Next Booking</p>
                <p className="text-base sm:text-lg font-bold text-black">Today 2:00 PM</p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Tennis Court A</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Upcoming Bookings */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-bold">Upcoming Bookings</CardTitle>
              <p className="text-xs sm:text-sm text-gray-600">Your next scheduled activities</p>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {upcomingBookings.map((booking, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-sm sm:text-base text-black">{booking.venue}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{booking.date} • {booking.time}</p>
                  </div>
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-3 sm:mt-4 text-sm sm:text-base"
                onClick={() => {}}
              >
                View all bookings
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-bold">Recent Activity</CardTitle>
              <p className="text-xs sm:text-sm text-gray-600">Your latest updates</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 sm:space-y-3">
                {recentActivity.map((activity, idx) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-3">
                    <span className="text-[#e0cb23] mt-0.5 sm:mt-1">•</span>
                    <span className="text-xs sm:text-sm text-gray-700">{activity}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
