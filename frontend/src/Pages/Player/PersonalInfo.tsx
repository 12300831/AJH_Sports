import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { PlayerTab } from '../../components/Playerwrapper';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface PersonalInfoProps {
  onNavigate: (page: Page) => void;
  currentTab?: PlayerTab;
  onTabChange?: (tab: PlayerTab) => void;
}

export function PersonalInfo({ onNavigate, currentTab, onTabChange }: PersonalInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'John Smith',
    location: 'Central Coast',
    role: 'Player',
    email: 'john.smith@email.com',
    contactNumber: '123456789',
    bio: 'Passionate tennis player with 5+ years of experience. Always looking to improve my game!',
  });

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      console.log('Profile deleted');
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <Header onNavigate={onNavigate} showUserInfo={true} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-lg border border-[#d0d7de] p-4 sm:p-6 mb-4">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-[#0969da] rounded-full flex items-center justify-center text-white text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 relative">
                    {getInitials(formData.fullName)}
                    <button className="absolute bottom-0 right-0 bg-[#e0cb23] rounded-full p-1.5 sm:p-2 text-black hover:bg-[#cdb720] transition-colors">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-[#24292f] mb-1">{formData.fullName}</h1>
                  <p className="text-[#656d76] text-xs sm:text-sm mb-4">{formData.email}</p>
                  <span className="px-3 py-1 bg-[#ddf4ff] text-[#0969da] text-xs font-medium rounded-full border border-[#b6e3ff]">
                    {formData.role}
                  </span>
                </div>
                <p className="text-[#24292f] text-xs sm:text-sm mb-4 text-center">{formData.bio}</p>
                <div className="text-[#656d76] text-xs sm:text-sm mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{formData.location}, NSW</span>
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
              <div className="bg-white rounded-lg border border-[#d0d7de]">
                <div className="p-3 sm:p-4 border-b border-[#d0d7de] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-[#24292f]">Personal Information</h2>
                    <p className="text-xs text-[#656d76] mt-1">Update your personal details and contact information.</p>
                  </div>
                  <Button onClick={() => setIsEditing(!isEditing)} className="bg-[#e0cb23] text-black hover:bg-[#cdb720] text-xs sm:text-sm self-start sm:self-auto">
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
                <div className="p-3 sm:p-4">
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div><label className="block text-sm font-medium text-[#24292f] mb-2">Full Name</label><Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} disabled={!isEditing} className="bg-white border-[#d0d7de]" /></div>
                    <div><label className="block text-sm font-medium text-[#24292f] mb-2">Email</label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={!isEditing} className="bg-white border-[#d0d7de]" /></div>
                    <div><label className="block text-sm font-medium text-[#24292f] mb-2">Location</label><select value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} disabled={!isEditing} className="w-full h-9 rounded-md border border-[#d0d7de] bg-white px-3 py-1 text-sm outline-none focus:border-[#e0cb23] focus:ring-2 focus:ring-[#e0cb23]/20 disabled:opacity-50"><option value="Central Coast">Central Coast</option><option value="Sydney">Sydney</option><option value="Melbourne">Melbourne</option><option value="Brisbane">Brisbane</option></select></div>
                    <div><label className="block text-sm font-medium text-[#24292f] mb-2">Contact Number</label><Input type="tel" value={formData.contactNumber} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} disabled={!isEditing} className="bg-white border-[#d0d7de]" /></div>
                    <div><label className="block text-sm font-medium text-[#24292f] mb-2">Role</label><Input value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} disabled={!isEditing} className="bg-white border-[#d0d7de]" /></div>
                    <div className="col-span-2"><label className="block text-sm font-medium text-[#24292f] mb-2">Bio</label><Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} disabled={!isEditing} className="bg-white border-[#d0d7de] min-h-24" /></div>
                    {isEditing && (
                      <div className="col-span-2 flex gap-3 justify-between">
                        <Button type="button" variant="outline" onClick={handleDelete} className="border-red-500 text-red-600 hover:bg-red-50">Delete Profile</Button>
                        <div className="flex gap-3">
                          <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="border-[#d0d7de] text-[#24292f] hover:bg-[#f6f8fa]">Cancel</Button>
                          <Button type="submit" className="bg-[#e0cb23] text-black hover:bg-[#cdb720]">Save</Button>
                        </div>
                      </div>
                    )}
                  </form>
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
