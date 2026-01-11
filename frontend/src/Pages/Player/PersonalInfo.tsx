import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { PlayerLayout } from '../../components/PlayerLayout';
import { PlayerTab } from '../../components/Playerwrapper';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserProfile } from '../../services/playerService';
import { toast } from 'sonner';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface PersonalInfoProps {
  onNavigate: (page: Page) => void;
  currentTab?: PlayerTab;
  onTabChange?: (tab: PlayerTab) => void;
}

export function PersonalInfo({ onNavigate, currentTab, onTabChange }: PersonalInfoProps) {
  const { user, token, fetchUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || 'Player',
    location: user?.location || 'Sydney, NSW',
    role: user?.role || 'Player',
    email: user?.email || '',
    contactNumber: user?.phone || '',
    bio: 'Passionate tennis player with 5+ years of experience. Always looking to improve my game!',
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.name || 'Player',
        location: user.location || 'Sydney, NSW',
        role: user.role || 'Player',
        email: user.email || '',
        contactNumber: user.phone || '',
        bio: 'Passionate tennis player with 5+ years of experience. Always looking to improve my game!',
      });
    }
  }, [user]);

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    setLoading(true);
    try {
      // Prepare update data (exclude role as it shouldn't be changed by user)
      const updateData: any = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.contactNumber,
        location: formData.location,
      };

      // Only include name if fullName is different
      if (formData.fullName !== user?.fullName && formData.fullName !== user?.name) {
        updateData.name = formData.fullName;
      }

      const response = await updateUserProfile(token, updateData);
      
      if (response.success && response.user) {
        // Refresh user profile in AuthContext
        await fetchUserProfile();
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      console.log('Profile deleted');
    }
  };

  return (
    <PlayerLayout
      title="Personal Information"
      description="Update your personal details and contact information"
      currentTab={currentTab}
      onNavigate={onNavigate}
      onTabChange={onTabChange || (() => {})}
    >
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-[#24292f]">Personal Information</h2>
            <p className="text-sm text-[#656d76] mt-1">Update your personal details and contact information.</p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)} className="bg-[#e0cb23] text-black hover:bg-[#cdb720] text-sm self-start sm:self-auto">
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#24292f] mb-2">Full Name</label>
              <Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} disabled={!isEditing} className="bg-white border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#24292f] mb-2">Email</label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={!isEditing} className="bg-white border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#24292f] mb-2">Location</label>
              <select value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} disabled={!isEditing} className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#e0cb23] focus:ring-2 focus:ring-[#e0cb23]/20 disabled:opacity-50">
                <option value="Sydney, NSW">Sydney, NSW</option>
                <option value="Melbourne, VIC">Melbourne, VIC</option>
                <option value="Brisbane, QLD">Brisbane, QLD</option>
                <option value="Central Coast, NSW">Central Coast, NSW</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#24292f] mb-2">Contact Number</label>
              <Input type="tel" value={formData.contactNumber} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} disabled={!isEditing} className="bg-white border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#24292f] mb-2">Role</label>
              <Input value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} disabled={!isEditing} className="bg-white border-gray-300" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#24292f] mb-2">Bio</label>
              <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} disabled={!isEditing} className="bg-white border-gray-300 min-h-24" />
            </div>
            {isEditing && (
              <div className="col-span-2 flex gap-3 justify-between">
                <Button type="button" variant="outline" onClick={handleDelete} className="border-red-500 text-red-600 hover:bg-red-50" disabled={loading}>
                  Delete Profile
                </Button>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => {
                    setIsEditing(false);
                    // Reset form data to original user data
                    if (user) {
                      setFormData({
                        fullName: user.fullName || user.name || 'Player',
                        location: user.location || 'Sydney, NSW',
                        role: user.role || 'Player',
                        email: user.email || '',
                        contactNumber: user.phone || '',
                        bio: 'Passionate tennis player with 5+ years of experience. Always looking to improve my game!',
                      });
                    }
                  }} className="border-gray-300 text-[#24292f] hover:bg-gray-50" disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#e0cb23] text-black hover:bg-[#cdb720]" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </PlayerLayout>
  );
}
