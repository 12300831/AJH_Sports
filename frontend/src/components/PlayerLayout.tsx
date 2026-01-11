import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player' | 'payment' | 'paymentSuccess';

export type PlayerTab = 'overview' | 'personal-info' | 'stats-activity' | 'preferences';

interface PlayerLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  currentTab: PlayerTab;
  onNavigate: (page: Page) => void;
  onTabChange: (tab: PlayerTab) => void;
  headerAction?: React.ReactNode;
}

export function PlayerLayout({
  children,
  title,
  description,
  currentTab,
  onNavigate,
  onTabChange,
  headerAction,
}: PlayerLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    toast.success('Logged out successfully');
    onNavigate('home');
  };

  const navItems = [
    { id: 'overview' as PlayerTab, label: 'Overview', icon: '📊', path: '/player' },
    { id: 'personal-info' as PlayerTab, label: 'Personal Info', icon: '👤', path: '/player/personal-info' },
    { id: 'stats-activity' as PlayerTab, label: 'Stats & Activity', icon: '📈', path: '/player/stats-activity' },
    { id: 'preferences' as PlayerTab, label: 'Preferences', icon: '⚙️', path: '/player/preferences' },
  ];

  // Get user initials
  const getInitials = () => {
    if (user?.fullName) {
      const names = user.fullName.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return user.fullName.charAt(0).toUpperCase();
    }
    if (user?.name) {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-[#030213] text-white transition-all duration-300 fixed h-screen z-50 flex flex-col`}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen ? (
            <>
              <div>
                <h1 className="text-xl font-bold text-[#e0cb23]">AJH Sports</h1>
                <p className="text-xs text-gray-400 mt-1">Player Portal</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-white hover:bg-gray-800 h-8 w-8 p-0"
              >
                ←
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="text-white hover:bg-gray-800 h-8 w-8 p-0 mx-auto"
            >
              →
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  window.history.pushState({ tab: item.id }, '', item.path);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#e0cb23] text-[#030213] font-semibold shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-700">
          {sidebarOpen ? (
            <>
              {user && (
                <div className="mb-3 p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#e0cb23] flex items-center justify-center text-[#030213] font-bold">
                      {getInitials()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user.fullName || user.name || 'Player'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{user.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => onNavigate('home')}
                  className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20"
                  size="sm"
                >
                  🌐 View Site
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full bg-red-600/20 text-red-300 border-red-500/30 hover:bg-red-600/30"
                  size="sm"
                >
                  🚪 Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Button
                variant="ghost"
                onClick={() => onNavigate('home')}
                className="w-full text-white hover:bg-gray-800 h-10"
                size="sm"
                title="View Site"
              >
                🌐
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full text-red-300 hover:bg-red-600/20 h-10"
                size="sm"
                title="Logout"
              >
                🚪
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Header Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#030213]">{title}</h1>
                {description && (
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {headerAction}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

