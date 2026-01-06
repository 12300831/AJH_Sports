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
import { getMockEvents } from '../../services/mockEventsService';

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
    loading: true,
  });

  useEffect(() => {
    loadStats();
    // Auto-refresh stats every 30 seconds
    const interval = setInterval(() => {
      loadStats();
    }, 30000);
    return () => clearInterval(interval);
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

      // Also load mock events to get the complete count (like AdminEvents does)
      const mockEvents = getMockEvents();
      
      // Combine backend events and mock events for total count
      const allEvents = [
        ...events,
        ...mockEvents.map(m => ({
          id: m.id + 10000, // Offset to avoid conflicts
          name: m.title,
          status: 'active' as const, // Mock events are always active
        }))
      ];

      const activeEvents = allEvents.filter((e: Event | any) => 
        e.status === 'active' || !e.status
      ).length;
      const activeCoaches = coaches.filter((c: Coach) => c.status === 'active').length;
      const pendingBookings = [
        ...eventBookings.filter((b: EventBooking) => b.status === 'pending'),
        ...coachBookings.filter((b: CoachBooking) => b.status === 'pending'),
      ].length;
      const confirmedBookings = [
        ...eventBookings.filter((b: EventBooking) => b.status === 'confirmed'),
        ...coachBookings.filter((b: CoachBooking) => b.status === 'confirmed'),
      ].length;

      setStats({
        events: allEvents.length, // Total events (backend + mock)
        activeEvents,
        coaches: coaches.length,
        activeCoaches,
        users: users.length,
        eventBookings: eventBookings.length,
        coachBookings: coachBookings.length,
        pendingBookings,
        confirmedBookings,
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
      {/* Stats Grid - Real-time Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-gray-700 font-semibold">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-xl">📅</span>
              </div>
              Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-[#030213] mb-2">
              {stats.loading ? (
                <span className="inline-block animate-pulse">...</span>
              ) : (
                stats.events
              )}
            </div>
            <p className="text-sm text-gray-600 font-medium">
              <span className="text-blue-600 font-semibold">{stats.activeEvents}</span> active events
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-gray-700 font-semibold">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
              Coaches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-[#030213] mb-2">
              {stats.loading ? (
                <span className="inline-block animate-pulse">...</span>
              ) : (
                stats.coaches
              )}
            </div>
            <p className="text-sm text-gray-600 font-medium">
              <span className="text-green-600 font-semibold">{stats.activeCoaches}</span> active coaches
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-gray-700 font-semibold">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-[#030213] mb-2">
              {stats.loading ? (
                <span className="inline-block animate-pulse">...</span>
              ) : (
                stats.users
              )}
            </div>
            <p className="text-sm text-gray-600 font-medium">
              Total registered users
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-yellow-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-gray-700 font-semibold">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <span className="text-xl">🎫</span>
              </div>
              Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-[#030213] mb-2">
              {stats.loading ? (
                <span className="inline-block animate-pulse">...</span>
              ) : (
                stats.eventBookings + stats.coachBookings
              )}
            </div>
            <p className="text-sm text-gray-600 font-medium">
              <span className="text-yellow-600 font-semibold">{stats.pendingBookings}</span> pending,{' '}
              <span className="text-green-600 font-semibold">{stats.confirmedBookings}</span> confirmed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl mb-2">📅</div>
              <p className="text-sm text-gray-600 mb-2 font-medium">Total Events</p>
              <div className="text-3xl font-bold text-blue-700">
                {stats.loading ? '...' : stats.events}
              </div>
              <p className="text-xs text-gray-500 mt-2">{stats.activeEvents} currently active</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-sm text-gray-600 mb-2 font-medium">Booking Status</p>
              <div className="text-3xl font-bold text-green-700 mb-2">
                {stats.loading ? '...' : `${stats.confirmedBookings}/${stats.eventBookings + stats.coachBookings}`}
              </div>
              <p className="text-xs text-gray-500">Confirmed / Total</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl mb-2">⏳</div>
              <p className="text-sm text-gray-600 mb-2 font-medium">Pending Actions</p>
              <div className="text-3xl font-bold text-purple-700 mb-2">
                {stats.loading ? '...' : stats.pendingBookings}
              </div>
              <p className="text-xs text-gray-500">Bookings awaiting confirmation</p>
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
