import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AdminLayout } from './AdminLayout';
import { 
  getEvents, 
  getCoaches, 
  getAllUsers, 
  getEventBookings, 
  getCoachBookings 
} from '../../services/adminService';
import type { Event, Coach, User, EventBooking, CoachBooking } from '../../services/adminService';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player' | 'payment' | 'paymentSuccess' | 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

type AdminPage = 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

interface AdminDashboardProps {
  onNavigate: (page: AdminPage) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [stats, setStats] = useState({
    events: 0,
    activeEvents: 0,
    coaches: 0,
    activeCoaches: 0,
    users: 0,
    eventBookings: 0,
    coachBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    loading: true,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [events, coaches, users, eventBookings, coachBookings] = await Promise.all([
        getEvents(),
        getCoaches(),
        getAllUsers(),
        getEventBookings(),
        getCoachBookings(),
      ]);

      const activeEvents = events.filter((e: Event) => e.status === 'active').length;
      const activeCoaches = coaches.filter((c: Coach) => c.status === 'active').length;
      const pendingBookings = [
        ...eventBookings.filter((b: EventBooking) => b.status === 'pending'),
        ...coachBookings.filter((b: CoachBooking) => b.status === 'pending'),
      ].length;
      const confirmedBookings = [
        ...eventBookings.filter((b: EventBooking) => b.status === 'confirmed'),
        ...coachBookings.filter((b: CoachBooking) => b.status === 'confirmed'),
      ].length;

      // Calculate approximate revenue from paid bookings
      const eventRevenue = eventBookings
        .filter((b: EventBooking) => b.payment_status === 'paid')
        .reduce((sum: number, b: EventBooking) => sum + (b.event_price || 0), 0);
      
      const coachRevenue = coachBookings
        .filter((b: CoachBooking) => b.payment_status === 'paid')
        .reduce((sum: number, b: CoachBooking) => {
          const coach = coaches.find((c: Coach) => c.id === b.coach_id);
          return sum + (coach?.hourly_rate || 0);
        }, 0);

      setStats({
        events: events.length,
        activeEvents,
        coaches: coaches.length,
        activeCoaches,
        users: users.length,
        eventBookings: eventBookings.length,
        coachBookings: coachBookings.length,
        pendingBookings,
        confirmedBookings,
        totalRevenue: eventRevenue + coachRevenue,
        loading: false,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const handleNavigate = (page: Page) => {
    // This is for navigation to non-admin pages
    window.location.href = '/';
  };

  return (
    <AdminLayout
      title="Dashboard"
      description="Overview of your sports booking system"
      currentPage="admin"
      onNavigate={handleNavigate}
      onAdminNavigate={onNavigate}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-gray-600">
              <span className="text-2xl">📅</span>
              Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#030213] mb-1">
              {stats.loading ? '...' : stats.events}
            </div>
            <p className="text-xs text-gray-500">
              {stats.activeEvents} active
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-gray-600">
              <span className="text-2xl">👥</span>
              Coaches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#030213] mb-1">
              {stats.loading ? '...' : stats.coaches}
            </div>
            <p className="text-xs text-gray-500">
              {stats.activeCoaches} active
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-gray-600">
              <span className="text-2xl">👤</span>
              Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#030213] mb-1">
              {stats.loading ? '...' : stats.users}
            </div>
            <p className="text-xs text-gray-500">Total registered</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-gray-600">
              <span className="text-2xl">🎫</span>
              Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#030213] mb-1">
              {stats.loading ? '...' : stats.eventBookings + stats.coachBookings}
            </div>
            <p className="text-xs text-gray-500">
              {stats.pendingBookings} pending, {stats.confirmedBookings} confirmed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 bg-gradient-to-r from-[#030213] to-[#1a1a2e] text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300 mb-1">Total Revenue (Estimated)</p>
                <p className="text-4xl font-bold">
                  ${stats.loading ? '...' : stats.totalRevenue.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400 mt-2">From paid bookings</p>
              </div>
              <div className="text-6xl opacity-20">💰</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Booking Status</p>
              <div className="text-3xl font-bold text-green-700 mb-2">
                {stats.confirmedBookings}/{stats.eventBookings + stats.coachBookings}
              </div>
              <p className="text-xs text-gray-600">Confirmed / Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-[#e0cb23]/30 bg-gradient-to-br from-white to-gray-50" 
          onClick={() => onNavigate('adminEvents')}
        >
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="w-14 h-14 rounded-xl bg-[#e0cb23]/20 flex items-center justify-center">
                <span className="text-3xl">📅</span>
              </div>
            </div>
            <CardTitle className="text-xl mb-1">Manage Events</CardTitle>
            <CardDescription className="text-sm">
              Create, edit, and delete events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mt-2 mb-3">
              {stats.loading ? '...' : `${stats.events} events`}
            </div>
            <Button 
              variant="ghost" 
              className="w-full text-[#030213] hover:bg-[#030213] hover:text-white"
            >
              Go to Events →
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-[#e0cb23]/30 bg-gradient-to-br from-white to-gray-50" 
          onClick={() => onNavigate('adminCoaches')}
        >
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="w-14 h-14 rounded-xl bg-[#e0cb23]/20 flex items-center justify-center">
                <span className="text-3xl">👥</span>
              </div>
            </div>
            <CardTitle className="text-xl mb-1">Manage Coaches</CardTitle>
            <CardDescription className="text-sm">
              Manage coach profiles and availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mt-2 mb-3">
              {stats.loading ? '...' : `${stats.coaches} coaches`}
            </div>
            <Button 
              variant="ghost" 
              className="w-full text-[#030213] hover:bg-[#030213] hover:text-white"
            >
              Go to Coaches →
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-[#e0cb23]/30 bg-gradient-to-br from-white to-gray-50" 
          onClick={() => onNavigate('adminBookings')}
        >
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="w-14 h-14 rounded-xl bg-[#e0cb23]/20 flex items-center justify-center">
                <span className="text-3xl">🎫</span>
              </div>
            </div>
            <CardTitle className="text-xl mb-1">Manage Bookings</CardTitle>
            <CardDescription className="text-sm">
              View and update booking status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mt-2 mb-3">
              {stats.loading ? '...' : `${stats.pendingBookings} pending`}
            </div>
            <Button 
              variant="ghost" 
              className="w-full text-[#030213] hover:bg-[#030213] hover:text-white"
            >
              Go to Bookings →
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-[#e0cb23]/30 bg-gradient-to-br from-white to-gray-50" 
          onClick={() => onNavigate('adminUsers')}
        >
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="w-14 h-14 rounded-xl bg-[#e0cb23]/20 flex items-center justify-center">
                <span className="text-3xl">👤</span>
              </div>
            </div>
            <CardTitle className="text-xl mb-1">Manage Users</CardTitle>
            <CardDescription className="text-sm">
              View and manage user accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mt-2 mb-3">
              {stats.loading ? '...' : `${stats.users} users`}
            </div>
            <Button 
              variant="ghost" 
              className="w-full text-[#030213] hover:bg-[#030213] hover:text-white"
            >
              Go to Users →
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity / Helpful Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span>💡</span>
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Use <strong>Manage Events</strong> to create and update events</li>
              <li>• Add coaches with their availability schedules in <strong>Manage Coaches</strong></li>
              <li>• Monitor all bookings and update their status in <strong>Manage Bookings</strong></li>
              <li>• View and manage user accounts in <strong>Manage Users</strong></li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span>⚡</span>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                onClick={() => onNavigate('adminEvents')}
                className="w-full bg-[#030213] text-white hover:bg-[#050525]"
              >
                + Create New Event
              </Button>
              <Button
                onClick={() => onNavigate('adminCoaches')}
                variant="outline"
                className="w-full border-[#030213] text-[#030213] hover:bg-[#030213] hover:text-white"
              >
                + Add New Coach
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
