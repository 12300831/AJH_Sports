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
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(user?.profileImage || null);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || 'Player',
    location: user?.location || 'Sydney, NSW',
    role: user?.role || 'Player',
    email: user?.email || '',
    contactNumber: user?.phone || '',
    bio: 'Passionate tennis player with 5+ years of experience. Always looking to improve my game!',
    password: '',
    profileImage: user?.profileImage || '',
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
        password: '',
        profileImage: user.profileImage || '',
      });
      setProfileImagePreview(user.profileImage || null);
    }
  }, [user]);

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImagePreview(result);
        setFormData({ ...formData, profileImage: result });
      };
      reader.readAsDataURL(file);
    }
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

      // Include profile image if provided (always send if it exists in formData)
      if (formData.profileImage && formData.profileImage.trim()) {
        console.log('📸 Sending profile image, length:', formData.profileImage.length);
        updateData.profileImage = formData.profileImage;
      }

      // Include password if provided
      if (formData.password && formData.password.trim() !== '') {
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        updateData.password = formData.password;
      }

      const response = await updateUserProfile(token, updateData);
      
      if (response.success && response.user) {
        console.log('✅ Profile updated, image length in response:', response.user.profileImage?.length || 0);
        // Immediately update the preview with the response data
        if (response.user.profileImage) {
          setProfileImagePreview(response.user.profileImage);
        }
        // Update user in AuthContext - this will trigger re-renders in all components using useAuth()
        await fetchUserProfile();
        // Force a small delay to ensure all components have re-rendered
        setTimeout(() => {
          setIsEditing(false);
          setShowPasswordSection(false);
          setFormData({ ...formData, password: '' });
          toast.success('Profile updated successfully!');
        }, 100);
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-gray-200">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {profileImagePreview ? (
                    <img
                      key={`${user?.id || 'preview'}-${profileImagePreview.substring(0, 50)}`}
                      src={`${profileImagePreview}${profileImagePreview.includes('?') ? '&' : '?'}t=${Date.now()}`}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes('?t=')) {
                          target.src = profileImagePreview;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#e0cb23] flex items-center justify-center text-[#030213] text-2xl font-bold border-2 border-gray-300">
                      {getInitials(formData.fullName)}
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-[#e0cb23] text-black rounded-full p-2 cursor-pointer hover:bg-[#cdb720] transition-colors shadow-md">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {isEditing && (
                  <p className="text-xs text-gray-500 text-center">Click to change photo</p>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-[#24292f] mb-1">Profile Picture</h3>
                <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 5MB</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <Input value={formData.role} disabled={true} className="bg-gray-50 border-gray-300 cursor-not-allowed" />
              <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#24292f] mb-2">Bio</label>
              <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} disabled={!isEditing} className="bg-white border-gray-300 min-h-24" />
            </div>

            {/* Password Change Section */}
            {isEditing && (
              <div className="col-span-2 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-[#24292f]">Change Password</h3>
                    <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowPasswordSection(!showPasswordSection);
                      if (showPasswordSection) {
                        setFormData({ ...formData, password: '' });
                      }
                    }}
                    className="border-gray-300"
                  >
                    {showPasswordSection ? 'Hide' : 'Change Password'}
                  </Button>
                </div>
                {showPasswordSection && (
                  <div>
                    <label className="block text-sm font-medium text-[#24292f] mb-2">New Password</label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter new password (min. 6 characters)"
                      className="bg-white border-gray-300"
                    />
                    <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                  </div>
                )}
              </div>
            )}
            </div>

            {isEditing && (
              <div className="flex gap-3 justify-between">
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
                        password: '',
                        profileImage: user.profileImage || '',
                      });
                      setProfileImagePreview(user.profileImage || null);
                      setShowPasswordSection(false);
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
