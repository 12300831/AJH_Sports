import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface SportsBookingDashboardProps {
  onNavigate: (page: Page) => void;
}

const LOGO_SRC = '/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png';

export function SportsBookingDashboard({ onNavigate }: SportsBookingDashboardProps) {
  const handleNavClick = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(page);
  };

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
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* Header */}
      <header className="bg-[#1a1a2e] text-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-10">
              <img src={LOGO_SRC} alt="AJH Sports" className="h-12" />
              <nav className="flex gap-8 text-base font-medium">
                <button onClick={() => handleNavClick('home')} className="hover:opacity-70">Home</button>
                <button onClick={() => handleNavClick('events')} className="hover:opacity-70">Events</button>
                <button onClick={() => handleNavClick('clubs')} className="hover:opacity-70">Clubs</button>
                <button onClick={() => handleNavClick('coaches')} className="hover:opacity-70">Coaches</button>
                <button onClick={() => handleNavClick('contact')} className="hover:opacity-70">Contact Us</button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => handleNavClick('signin')} className="hover:opacity-70">Log In</button>
              <Button
                onClick={() => handleNavClick('signup')}
                className="bg-[#e0cb23] text-black hover:bg-[#cdb720]"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-[#1a1a2e] border-t border-[#2a2a3e]">
          <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm">👤</span>
              <span className="text-sm">John Smith</span>
              <span className="text-sm text-gray-400">john.smith@email.com</span>
            </div>
            <button onClick={() => handleNavClick('signin')} className="text-sm hover:opacity-70 flex items-center gap-2">
              <span>🚪</span>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Top Navigation Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => {}}
            className="px-6 py-2 bg-[#e0cb23] text-black font-semibold rounded-t-lg"
          >
            SportsBooking
          </button>
          <button
            onClick={() => handleNavClick('player')}
            className="px-6 py-2 bg-white text-black font-semibold rounded-t-lg hover:bg-gray-100"
          >
            Player
          </button>
        </div>

        {/* Secondary Tabs */}
        <div className="mb-6 flex gap-2">
          <button className="px-4 py-2 bg-white text-black font-medium rounded-lg">Player</button>
          <button className="px-4 py-2 bg-[#e0cb23] text-black font-medium rounded-lg">Overview</button>
          <button className="px-4 py-2 bg-white text-black font-medium rounded-lg">Booking</button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-black">12</p>
                  <p className="text-xs text-green-600 mt-1">+2 from last month</p>
                </div>
                <div className="text-3xl">📅</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hours Played</p>
                  <p className="text-3xl font-bold text-black">34</p>
                  <p className="text-xs text-green-600 mt-1">+8 from last month</p>
                </div>
                <div className="text-3xl">⏰</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Next Booking</p>
                <p className="text-lg font-bold text-black">Today 2:00 PM</p>
                <p className="text-sm text-gray-600 mt-1">Tennis Court A</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Upcoming Bookings */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Upcoming Bookings</CardTitle>
              <p className="text-sm text-gray-600">Your next scheduled activities</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingBookings.map((booking, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-black">{booking.venue}</p>
                    <p className="text-sm text-gray-600">{booking.date} • {booking.time}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                className="w-full mt-4"
                onClick={() => {}}
              >
                View all bookings
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
              <p className="text-sm text-gray-600">Your latest updates</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-[#e0cb23] mt-1">•</span>
                    <span className="text-sm text-gray-700">{activity}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
        </div>
      </main>
    </div>
  );
}