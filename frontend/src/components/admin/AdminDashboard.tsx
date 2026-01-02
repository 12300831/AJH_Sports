import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  getEvents, 
  getCoaches, 
  getAllUsers, 
  getEventBookings, 
  getCoachBookings 
} from '../../services/adminService';
import type { Event, Coach, User, EventBooking, CoachBooking } from '../../services/adminService';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player' | 'payment' | 'paymentSuccess' | 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

interface AdminDashboardProps {
  onNavigate: (page: Page) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [stats, setStats] = useState({
    events: 0,
    coaches: 0,
    users: 0,
    eventBookings: 0,
    coachBookings: 0,
    loading: true,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [events, coaches, users, eventBookings, coachBookings] = await Promise.all([
          getEvents(),
          getCoaches(),
          getAllUsers(),
          getEventBookings(),
          getCoachBookings(),
        ]);

        setStats({
          events: events.length,
          coaches: coaches.length,
          users: users.length,
          eventBookings: eventBookings.length,
          coachBookings: coachBookings.length,
          loading: false,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <div className="bg-[#030213] text-white py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            <p className="text-gray-300 mt-1">Manage your sports booking system</p>
          </div>
          <Button
            variant="outline"
            onClick={() => onNavigate('home')}
            className="bg-white text-[#030213] hover:bg-gray-100"
          >
            Back to Site
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid - Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
          <Card className="border-2 border-[#e0cb23]/20 hover:border-[#e0cb23]/40 transition-all hover:shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="text-2xl">📅</span>
                Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#030213] mb-1">
                {stats.loading ? '...' : stats.events}
              </div>
              <p className="text-xs text-gray-500">Total events</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#e0cb23]/20 hover:border-[#e0cb23]/40 transition-all hover:shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="text-2xl">👥</span>
                Coaches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#030213] mb-1">
                {stats.loading ? '...' : stats.coaches}
              </div>
              <p className="text-xs text-gray-500">Total coaches</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#e0cb23]/20 hover:border-[#e0cb23]/40 transition-all hover:shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="text-2xl">👤</span>
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#030213] mb-1">
                {stats.loading ? '...' : stats.users}
              </div>
              <p className="text-xs text-gray-500">Total users</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#e0cb23]/20 hover:border-[#e0cb23]/40 transition-all hover:shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="text-2xl">🎫</span>
                Event Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#030213] mb-1">
                {stats.loading ? '...' : stats.eventBookings}
              </div>
              <p className="text-xs text-gray-500">Total bookings</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#e0cb23]/20 hover:border-[#e0cb23]/40 transition-all hover:shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="text-2xl">🏋️</span>
                Coach Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#030213] mb-1">
                {stats.loading ? '...' : stats.coachBookings}
              </div>
              <p className="text-xs text-gray-500">Total bookings</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-[#e0cb23]/30 bg-gradient-to-br from-white to-gray-50" 
            onClick={() => onNavigate('adminEvents')}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-lg bg-[#e0cb23]/20 flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
              </div>
              <CardTitle className="text-xl mb-1">Manage Events</CardTitle>
              <CardDescription className="text-sm">Create, edit, and delete events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mt-2">
                {stats.loading ? '...' : `${stats.events} events`}
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-[#e0cb23]/30 bg-gradient-to-br from-white to-gray-50" 
            onClick={() => onNavigate('adminCoaches')}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-lg bg-[#e0cb23]/20 flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
              <CardTitle className="text-xl mb-1">Manage Coaches</CardTitle>
              <CardDescription className="text-sm">Manage coach profiles and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mt-2">
                {stats.loading ? '...' : `${stats.coaches} coaches`}
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-[#e0cb23]/30 bg-gradient-to-br from-white to-gray-50" 
            onClick={() => onNavigate('adminUsers')}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-lg bg-[#e0cb23]/20 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
              </div>
              <CardTitle className="text-xl mb-1">Manage Users</CardTitle>
              <CardDescription className="text-sm">View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mt-2">
                {stats.loading ? '...' : `${stats.users} users`}
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-[#e0cb23]/30 bg-gradient-to-br from-white to-gray-50" 
            onClick={() => onNavigate('adminBookings')}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-lg bg-[#e0cb23]/20 flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
              </div>
              <CardTitle className="text-xl mb-1">Manage Bookings</CardTitle>
              <CardDescription className="text-sm">View and update booking status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mt-2">
                {stats.loading ? '...' : `${stats.eventBookings + stats.coachBookings} total bookings`}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

