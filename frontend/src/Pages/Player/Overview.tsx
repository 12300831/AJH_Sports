import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { PlayerTab } from '../../components/Playerwrapper';
import { PlayerLayout } from '../../components/PlayerLayout';
import { useAuth } from '../../contexts/AuthContext';
import { getUserProfile, getEventBookings, getCoachBookings, calculateStats, formatBookings, generateRecentActivity, Booking, PlayerStats } from '../../services/playerService';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface PlayerOverviewProps {
  onNavigate: (page: Page) => void;
  currentTab?: PlayerTab;
  onTabChange?: (tab: PlayerTab) => void;
}

export function PlayerOverview({ onNavigate, currentTab = 'overview', onTabChange }: PlayerOverviewProps) {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [stats, setStats] = useState<PlayerStats>({
    totalBookings: 0,
    hoursPlayed: 0,
    winRate: 0,
    monthlyHours: 0,
    monthlyGoal: 20,
  });
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile - always fetch fresh data
        const profileResponse = await getUserProfile(token);
        if (profileResponse?.user) {
          setProfileData(profileResponse.user);
        } else if (user) {
          setProfileData(user);
        }

        // Fetch bookings (these handle errors internally and return empty arrays)
        const [eventBookingsResponse, coachBookingsResponse] = await Promise.all([
          getEventBookings(token),
          getCoachBookings(token),
        ]);

        const eventBookings = eventBookingsResponse.bookings || [];
        const coachBookings = coachBookingsResponse.bookings || [];

        // Calculate stats
        const calculatedStats = calculateStats(eventBookings, coachBookings);
        setStats(calculatedStats);

        // Format upcoming bookings
        const formattedBookings = formatBookings(eventBookings, coachBookings);
        setUpcomingBookings(formattedBookings);

        // Generate recent activity
        const activities = generateRecentActivity(eventBookings, coachBookings);
        setRecentActivity(activities);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        // If profile fetch fails, user might not be authenticated
        if (error.message?.includes('Failed to fetch user profile')) {
          console.warn('User profile fetch failed - user may need to login again');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, user]); // Refetch when user or token changes

  // Get user initials
  const getInitials = () => {
    if (profileData?.fullName) {
      const names = profileData.fullName.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return profileData.fullName.substring(0, 2).toUpperCase();
    }
    if (profileData?.name) {
      const names = profileData.name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return profileData.name.substring(0, 2).toUpperCase();
    }
    if (user?.name) {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    return '--';
  };

  // Get display name
  const getDisplayName = () => {
    return profileData?.fullName || profileData?.name || user?.name || '--';
  };

  // Get display email
  const getDisplayEmail = () => {
    return profileData?.email || user?.email || '--';
  };

  // Get display location
  const getDisplayLocation = () => {
    return profileData?.location || user?.location || '--';
  };

  // Calculate monthly goal percentage
  const monthlyGoalPercentage = stats.monthlyGoal > 0 
    ? Math.min((stats.monthlyHours / stats.monthlyGoal) * 100, 100) 
    : 0;

  return (
    <PlayerLayout
      title="Player Dashboard"
      description="View your stats, bookings, and activity"
      currentTab={currentTab}
      onNavigate={onNavigate}
      onTabChange={onTabChange || (() => {})}
    >
      <div className="space-y-6">
        {/* Profile Summary Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 bg-[#0969da] rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {loading ? '--' : getInitials()}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-semibold text-[#24292f] mb-1">{loading ? '--' : getDisplayName()}</h2>
              <p className="text-[#656d76] text-sm mb-2">{loading ? '--' : getDisplayEmail()}</p>
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <span className="px-3 py-1 bg-[#ddf4ff] text-[#0969da] text-xs font-medium rounded-full border border-[#b6e3ff]">
                  {profileData?.role || user?.role || 'Player'}
                </span>
                <div className="flex items-center gap-2 text-sm text-[#656d76]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{loading ? '--' : getDisplayLocation()}</span>
                </div>
              </div>
              <p className="text-[#24292f] text-sm">{profileData?.bio || 'Welcome to your player dashboard!'}</p>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <div className="flex items-center justify-between md:justify-start gap-4 px-4 py-2 bg-gray-50 rounded-lg">
                <span className="text-[#656d76] text-sm">Total Bookings</span>
                <span className="text-[#24292f] font-semibold">{loading ? '--' : stats.totalBookings}</span>
              </div>
              <div className="flex items-center justify-between md:justify-start gap-4 px-4 py-2 bg-gray-50 rounded-lg">
                <span className="text-[#656d76] text-sm">Hours Played</span>
                <span className="text-[#24292f] font-semibold">{loading ? '--' : stats.hoursPlayed}</span>
              </div>
              <div className="flex items-center justify-between md:justify-start gap-4 px-4 py-2 bg-gray-50 rounded-lg">
                <span className="text-[#656d76] text-sm">Win Rate</span>
                <span className="text-[#24292f] font-semibold">{loading ? '--' : `${stats.winRate}%`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white rounded-lg border border-[#d0d7de] p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl mb-2">📅</div>
                    <p className="text-xs text-[#656d76] mb-1">Total Bookings</p>
                    <p className="text-xl sm:text-2xl font-bold text-[#24292f]">{loading ? '--' : stats.totalBookings}</p>
                  </div>
                  <div className="bg-white rounded-lg border border-[#d0d7de] p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl mb-2">⏰</div>
                    <p className="text-xs text-[#656d76] mb-1">Hours Played</p>
                    <p className="text-xl sm:text-2xl font-bold text-[#24292f]">{loading ? '--' : stats.hoursPlayed}</p>
                  </div>
                  <div className="bg-white rounded-lg border border-[#d0d7de] p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl mb-2">📈</div>
                    <p className="text-xs text-[#656d76] mb-1">Win Rate</p>
                    <p className="text-xl sm:text-2xl font-bold text-[#24292f]">{loading ? '--' : `${stats.winRate}%`}</p>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white rounded-lg border border-[#d0d7de] p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3">
                      <div className="text-lg sm:text-xl">🎯</div>
                      <div>
                        <p className="font-semibold text-[#24292f] text-xs sm:text-sm">Monthly Goal Progress</p>
                        <p className="text-xs text-[#656d76]">{loading ? '--' : `${stats.monthlyHours} of ${stats.monthlyGoal} hours this month`}</p>
                      </div>
                    </div>
                    <div className="w-full bg-[#d0d7de] rounded-full h-2">
                      <div className="bg-[#e0cb23] h-2 rounded-full" style={{ width: loading ? '0%' : `${monthlyGoalPercentage}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-[#d0d7de] p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3">
                      <div className="text-lg sm:text-xl">🏆</div>
                      <div>
                        <p className="font-semibold text-[#24292f] text-xs sm:text-sm">Achievements</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">🏆</span>
                        <span className="text-xs text-[#24292f]">First Win</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">🏆</span>
                        <span className="text-xs text-[#24292f]">10 Hours Played</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">🏆</span>
                        <span className="text-xs text-[#24292f]">Perfect Week</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {/* Upcoming Bookings */}
                  <div className="bg-white rounded-lg border border-[#d0d7de]">
                    <div className="p-3 sm:p-4 border-b border-[#d0d7de]">
                      <h3 className="text-sm sm:text-base font-semibold text-[#24292f]">Upcoming Bookings</h3>
                      <p className="text-xs text-[#656d76] mt-1">Your next scheduled activities</p>
                    </div>
                    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                      {loading ? (
                        <p className="text-xs text-[#656d76] text-center py-4">Loading bookings...</p>
                      ) : upcomingBookings.length === 0 ? (
                        <p className="text-xs text-[#656d76] text-center py-4">No upcoming bookings</p>
                      ) : (
                        <>
                          {upcomingBookings.map((booking) => (
                            <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 sm:p-3 bg-[#f6f8fa] rounded border border-[#d0d7de]">
                              <div className="flex-1">
                                <p className="font-medium text-xs sm:text-sm text-[#24292f]">{booking.venue || '--'}</p>
                                <p className="text-xs text-[#656d76]">{booking.date || '--'} • {booking.time || '--'}</p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${
                                  booking.status === 'confirmed'
                                    ? 'bg-[#dafbe1] text-[#1a7f37] border border-[#a5f3b8]'
                                    : 'bg-[#fff8c5] text-[#9a6700] border border-[#fae17d]'
                                }`}
                              >
                                {booking.status || 'pending'}
                              </span>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            className="w-full mt-2 text-xs sm:text-sm border-[#d0d7de] text-[#24292f] hover:bg-[#f6f8fa]"
                            onClick={() => {}}
                          >
                            View all bookings
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-lg border border-[#d0d7de]">
                    <div className="p-3 sm:p-4 border-b border-[#d0d7de]">
                      <h3 className="text-sm sm:text-base font-semibold text-[#24292f]">Recent Activity</h3>
                      <p className="text-xs text-[#656d76] mt-1">Your latest updates</p>
                    </div>
                    <div className="p-3 sm:p-4">
                      {loading ? (
                        <p className="text-xs text-[#656d76] text-center py-4">Loading activity...</p>
                      ) : recentActivity.length === 0 ? (
                        <p className="text-xs text-[#656d76] text-center py-4">No recent activity</p>
                      ) : (
                        <ul className="space-y-2">
                          {recentActivity.map((activity, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#24292f]">
                              <span className="text-[#e0cb23] mt-0.5">•</span>
                              <span>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
        </div>
    </PlayerLayout>
  );
}
