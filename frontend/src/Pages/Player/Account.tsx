import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { PlayerTab } from '../../components/Playerwrapper';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface AccountProps {
  onNavigate: (page: Page) => void;
  currentTab?: PlayerTab;
  onTabChange?: (tab: PlayerTab) => void;
}

const LOGO_SRC = '/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png';

export function Account({ onNavigate, currentTab = 'account', onTabChange }: AccountProps) {
  const handleNavClick = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(page);
  };

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

        {/* Account Content */}
        <div className="grid grid-cols-2 gap-6">
          {/* Membership & Billing */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Membership & Billing</CardTitle>
              <p className="text-sm text-gray-600">Manage your subscription and payment methods</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-[#e0cb23] to-[#cdb720] rounded-lg text-black">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Premium Member</h3>
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                    Active
                  </span>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Unlimited bookings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Advanced features</span>
                  </li>
                </ul>
                <p className="text-sm">Next billing: Jan 28, 2025</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">Manage Billing</Button>
                <Button variant="outline" className="flex-1">View Payment History</Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Account Actions</CardTitle>
              <p className="text-sm text-gray-600">Advanced account management options</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">Download My Data</Button>
              <Button variant="outline" className="w-full justify-start">Export Booking History</Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                Deactivate Account
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}