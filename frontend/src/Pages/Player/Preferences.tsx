import React, { useState } from 'react';
import { Switch } from '../../components/ui/switch';
import { PlayerLayout } from '../../components/PlayerLayout';
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
    sms: false,
    marketing: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    activityStatus: true,
    matchHistory: false,
  });

  const handleNotificationChange = (key: keyof typeof notifications, checked: boolean) => {
    setNotifications({ ...notifications, [key]: checked });
    // TODO: Save to backend API
    console.log(`Notification ${key} set to:`, checked);
  };

  const handlePrivacyChange = (key: keyof typeof privacy, checked: boolean) => {
    setPrivacy({ ...privacy, [key]: checked });
    // TODO: Save to backend API
    console.log(`Privacy ${key} set to:`, checked);
  };

  return (
    <PlayerLayout
      title="Preferences"
      description="Manage your notification and privacy settings"
      currentTab={currentTab}
      onNavigate={onNavigate}
      onTabChange={onTabChange || (() => {})}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[#24292f]">Notification</h3>
            <p className="text-sm text-[#656d76] mt-1">Choose how you want to be notified.</p>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="text-lg">🔔</span>
                <div>
                  <p className="font-medium text-sm text-[#24292f]">Email Notification</p>
                  <p className="text-xs text-[#656d76]">Booking confirmations and updates.</p>
                </div>
              </div>
              <Switch 
                checked={notifications.email} 
                onCheckedChange={(checked) => handleNotificationChange('email', checked)} 
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="text-lg">📱</span>
                <div>
                  <p className="font-medium text-sm text-[#24292f]">Push Notification</p>
                  <p className="text-xs text-[#656d76]">Real-time alerts and reminders.</p>
                </div>
              </div>
              <Switch 
                checked={notifications.push} 
                onCheckedChange={(checked) => handleNotificationChange('push', checked)} 
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="text-lg">💬</span>
                <div>
                  <p className="font-medium text-sm text-[#24292f]">SMS Notification</p>
                  <p className="text-xs text-[#656d76]">Text message alerts.</p>
                </div>
              </div>
              <Switch 
                checked={notifications.sms} 
                onCheckedChange={(checked) => handleNotificationChange('sms', checked)} 
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="text-lg">📧</span>
                <div>
                  <p className="font-medium text-sm text-[#24292f]">Marketing Communication</p>
                  <p className="text-xs text-[#656d76]">Promotions and special offers.</p>
                </div>
              </div>
              <Switch 
                checked={notifications.marketing} 
                onCheckedChange={(checked) => handleNotificationChange('marketing', checked)} 
              />
            </div>
          </div>
                </div>
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[#24292f]">Privacy & Security</h3>
            <p className="text-sm text-[#656d76] mt-1">Manage your privacy settings.</p>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="text-lg">🛡️</span>
                <div>
                  <p className="font-medium text-sm text-[#24292f]">Profile Visibility</p>
                  <p className="text-xs text-[#656d76]">Allow others to see your profile.</p>
                </div>
              </div>
              <Switch 
                checked={privacy.profileVisibility} 
                onCheckedChange={(checked) => handlePrivacyChange('profileVisibility', checked)} 
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="text-lg">🟢</span>
                <div>
                  <p className="font-medium text-sm text-[#24292f]">Activity Status</p>
                  <p className="text-xs text-[#656d76]">Show when you're online.</p>
                </div>
              </div>
              <Switch 
                checked={privacy.activityStatus} 
                onCheckedChange={(checked) => handlePrivacyChange('activityStatus', checked)} 
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="text-lg">📊</span>
                <div>
                  <p className="font-medium text-sm text-[#24292f]">Match History</p>
                  <p className="text-xs text-[#656d76]">Make your match history public.</p>
                </div>
              </div>
              <Switch 
                checked={privacy.matchHistory} 
                onCheckedChange={(checked) => handlePrivacyChange('matchHistory', checked)} 
              />
            </div>
          </div>
                </div>
      </div>
    </PlayerLayout>
  );
}
