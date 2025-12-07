import { useState, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { PlayerTab } from '../../components/Playerwrapper';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface PersonalInfoProps {
  onNavigate: (page: Page) => void;
  currentTab?: PlayerTab;
  onTabChange?: (tab: PlayerTab) => void;
}

const LOGO_SRC = '/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png';

export function PersonalInfo({ onNavigate, currentTab = 'personal-info', onTabChange }: PersonalInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'John Smith',
    location: 'Central Coast',
    role: 'Player',
    email: 'john.smith@email.com',
    contactNumber: '123456789',
    bio: 'Passionate tennis player with 5+ years of experience. Always looking to improve my game!',
  });

  const handleNavClick = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(page);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Save to backend
    setIsEditing(false);
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
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-3xl font-bold relative">
              JS
              <button className="absolute bottom-0 right-0 bg-[#e0cb23] rounded-full p-2 text-black">
                📷
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-black">{formData.fullName}</h2>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded">{formData.role}</span>
              </div>
              <p className="text-gray-600">{formData.email}</p>
              <p className="text-gray-600">{formData.location}, NSW</p>
              <p className="text-gray-600 mt-2">{formData.bio}</p>
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

        {/* Personal Information Form */}
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Update your personal details and contact information.</p>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-[#e0cb23] text-black hover:bg-[#cdb720]"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Full Name</label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={!isEditing}
                  className="bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Location</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={!isEditing}
                  className="w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-base outline-none focus:border-[#e0cb23] focus:ring-2 focus:ring-[#e0cb23]/20 disabled:opacity-50"
                >
                  <option value="Central Coast">Central Coast</option>
                  <option value="Sydney">Sydney</option>
                  <option value="Melbourne">Melbourne</option>
                  <option value="Brisbane">Brisbane</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Contact Number</label>
                <Input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  disabled={!isEditing}
                  className="bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Role</label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  disabled={!isEditing}
                  className="bg-white"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-black mb-2">Bio</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  className="bg-white min-h-24"
                />
              </div>

              {isEditing && (
                <div className="col-span-2 flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#e0cb23] text-black hover:bg-[#cdb720]"
                  >
                    Save
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}