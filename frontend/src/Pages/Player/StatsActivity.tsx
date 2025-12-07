import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { PlayerTab } from '../../components/Playerwrapper';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface StatsActivityProps {
  onNavigate: (page: Page) => void;
  currentTab?: PlayerTab;
  onTabChange?: (tab: PlayerTab) => void;
}

const LOGO_SRC = '/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png';

export function StatsActivity({ onNavigate, currentTab = 'stats-activity', onTabChange }: StatsActivityProps) {
  const handleNavClick = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(page);
  };

  const recentMatches = [
    { opponent: 'vs Sarah M.', result: 'Won', score: '6-4, 6-2', date: 'Dec 26' },
    { opponent: 'vs Mike R.', result: 'Lost', score: '4-6, 6-3, 6-7', date: 'Dec 24' },
    { opponent: 'vs Emma K.', result: 'Won', score: '6-1, 6-4', date: 'Dec 22' },
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
        {/* Top Navigation */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="px-6 py-2 bg-white text-black font-semibold rounded-t-lg hover:bg-gray-100"
          >
            SportsBooking
          </button>
          <button
            onClick={() => handleNavClick('player')}
            className="px-6 py-2 bg-[#e0cb23] text-black font-semibold rounded-t-lg"
          >
            Player
          </button>
        </div>

        {/* Secondary Tabs */}
        <div className="mb-6 flex gap-2">
          <button className="px-4 py-2 bg-[#e0cb23] text-black font-medium rounded-lg">Player</button>
          <button className="px-4 py-2 bg-white text-black font-medium rounded-lg">Overview</button>
          <button className="px-4 py-2 bg-white text-black font-medium rounded-lg">Booking</button>
        </div>

        {/* Profile Card */}
        <Card className="bg-white mb-6">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-3xl font-bold">
              JS
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-black">John Smith</h2>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded">Player</span>
              </div>
              <p className="text-gray-600">john.smith@email.com</p>
              <p className="text-gray-600">Central Coast, NSW</p>
              <p className="text-gray-600 mt-2">
                Passionate tennis player with 5+ years of experience. Always looking to improve my game!
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-black text-white hover:bg-gray-800">Settings</Button>
              <Button variant="outline" className="border-black">Connect</Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Navigation */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <button 
            onClick={() => onTabChange?.('overview')}
            className={`px-4 py-2 font-medium ${currentTab === 'overview' ? 'border-b-2 border-[#e0cb23] text-black' : 'text-gray-600 hover:text-black'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => onTabChange?.('personal-info')}
            className={`px-4 py-2 font-medium ${currentTab === 'personal-info' ? 'border-b-2 border-[#e0cb23] text-black' : 'text-gray-600 hover:text-black'}`}
          >
            Personal Info
          </button>
          <button 
            onClick={() => onTabChange?.('stats-activity')}
            className={`px-4 py-2 font-medium ${currentTab === 'stats-activity' ? 'border-b-2 border-[#e0cb23] text-black' : 'text-gray-600 hover:text-black'}`}
          >
            Stats & Activity
          </button>
          <button 
            onClick={() => onTabChange?.('preferences')}
            className={`px-4 py-2 font-medium ${currentTab === 'preferences' ? 'border-b-2 border-[#e0cb23] text-black' : 'text-gray-600 hover:text-black'}`}
          >
            Preferences
          </button>
          <button 
            onClick={() => onTabChange?.('account')}
            className={`px-4 py-2 font-medium ${currentTab === 'account' ? 'border-b-2 border-[#e0cb23] text-black' : 'text-gray-600 hover:text-black'}`}
          >
            Account
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Performance Metrics */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Performance Metrics</CardTitle>
              <p className="text-sm text-gray-600">Your detailed statistics and progress</p>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-black mb-1">5</p>
                <p className="text-sm text-gray-600">Current Streak</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-black mb-1">Tennis</p>
                <p className="text-sm text-gray-600">Favorite Activity</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
              <p className="text-sm text-gray-600">Your latest matches</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentMatches.map((match, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-black">{match.opponent}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        match.result === 'Won' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {match.result}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{match.score}</span>
                    <span className="text-gray-600">{match.date}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}