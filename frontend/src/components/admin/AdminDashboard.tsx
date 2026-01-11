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
    newContactMessages: 0,
    totalBookings: 0,
    loading: true,
  });

  const [recentBookings, setRecentBookings] = useState<(EventBooking | CoachBooking)[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [recentContactMessages, setRecentContactMessages] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
    // Auto-refresh stats every 10 seconds for real-time updates
    const interval = setInterval(() => {
      loadStats();
    }, 10000);
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
          date: m.date,
          time: m.time,
        }))
      ] as Event[];

      const activeEvents = allEvents.filter((e: Event | any) => 
        e.status === 'active' || !e.status
      ).length;
      const activeCoaches = coaches.filter((c: Coach) => c.status === 'active').length;
      
      const allBookings = [...eventBookings, ...coachBookings];
      const pendingBookings = allBookings.filter((b: EventBooking | CoachBooking) => 
        b.status === 'pending'
      ).length;
      const confirmedBookings = allBookings.filter((b: EventBooking | CoachBooking) => 
        b.status === 'confirmed'
      ).length;

      // Get recent bookings (last 5, sorted by created_at)
      const recent = [...allBookings]
        .sort((a, b) => {
          const dateA = new Date((a as any).created_at || 0).getTime();
          const dateB = new Date((b as any).created_at || 0).getTime();
          return dateB - dateA;
        })
        .slice(0, 5);

      // Get upcoming events (next 3 events, sorted by date)
      const upcoming = allEvents
        .filter((e: Event) => {
          if (!e.date) return false;
          const eventDate = new Date(e.date);
          return eventDate >= new Date();
        })
        .sort((a, b) => {
          const dateA = new Date(a.date || '').getTime();
          const dateB = new Date(b.date || '').getTime();
          return dateA - dateB;
        })
        .slice(0, 3);

      // Get contact messages
      let newContactMessages = 0;
      let recentMessages: any[] = [];
      try {
        const getApiUrl = () => {
          const envUrl = import.meta.env.VITE_API_URL;
          if (envUrl) {
            return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
          }
          return 'http://localhost:5001/api';
        };
        const API_URL = getApiUrl();
        const token = localStorage.getItem('token');
        if (token) {
          const allMessagesResponse = await fetch(`${API_URL}/contact?limit=100`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (allMessagesResponse.ok) {
            const allMessagesData = await allMessagesResponse.json();
            const messages = allMessagesData.messages || [];
            newContactMessages = messages.filter((m: any) => 
              m.status === 'new'
            ).length;
            // Get recent 5 messages (most recent first)
            recentMessages = messages.slice(0, 5);
          } else {
            console.error('Failed to fetch contact messages:', allMessagesResponse.status, allMessagesResponse.statusText);
            const errorData = await allMessagesResponse.json().catch(() => ({}));
            console.error('Error details:', errorData);
          }
        } else {
          console.warn('No authentication token found. Contact messages will not be loaded.');
        }
      } catch (error) {
        // Silently fail if contact messages can't be fetched (non-critical)
        console.error('Error fetching contact messages:', error);
      }

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
        newContactMessages,
        totalBookings: allBookings.length,
        loading: false,
      });

      setRecentBookings(recent);
      setUpcomingEvents(upcoming);
      setRecentContactMessages(recentMessages);
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
      {/* Real-time Update Indicator */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="relative">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
          </div>
          <span>Live updates every 10 seconds</span>
        </div>
        {!stats.loading && (
          <div className="text-xs text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
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
            <div className="text-5xl font-bold text-[#030213] mb-2 transition-all duration-500">
              {stats.loading ? (
                <span className="inline-block animate-pulse">...</span>
              ) : (
                <span className="inline-block animate-fade-in">{stats.events}</span>
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
            <div className="text-5xl font-bold text-[#030213] mb-2 transition-all duration-500">
              {stats.loading ? (
                <span className="inline-block animate-pulse">...</span>
              ) : (
                <span className="inline-block animate-fade-in">{stats.coaches}</span>
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
            <div className="text-5xl font-bold text-[#030213] mb-2 transition-all duration-500">
              {stats.loading ? (
                <span className="inline-block animate-pulse">...</span>
              ) : (
                <span className="inline-block animate-fade-in">{stats.users}</span>
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
            <div className="text-5xl font-bold text-[#030213] mb-2 transition-all duration-500">
              {stats.loading ? (
                <span className="inline-block animate-pulse">...</span>
              ) : (
                <span className="inline-block animate-fade-in">{stats.eventBookings + stats.coachBookings}</span>
              )}
            </div>
            <p className="text-sm text-gray-600 font-medium">
              <span className="text-yellow-600 font-semibold">{stats.pendingBookings}</span> pending,{' '}
              <span className="text-green-600 font-semibold">{stats.confirmedBookings}</span> confirmed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Contact Messages */}
      {recentContactMessages.length > 0 && (
        <Card className="border-2 border-pink-200 hover:border-pink-400 transition-all duration-300 shadow-lg hover:shadow-2xl bg-gradient-to-br from-pink-50 via-white to-white mb-8">
          <CardHeader className="bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-t-lg">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-xl">💬</span>
              Recent Contact Messages
              {stats.newContactMessages > 0 && (
                <span className="ml-auto bg-white text-pink-600 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                  {stats.newContactMessages} NEW
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentContactMessages.map((msg, idx) => {
                const isNew = msg.status === 'new';
                const formattedDate = new Date(msg.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                });
                
                return (
                  <div
                    key={msg.id || idx}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isNew
                        ? 'bg-pink-50 border-pink-200 hover:bg-pink-100'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">{msg.name}</p>
                          {isNew && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{msg.email}</p>
                        <p className="text-xs text-gray-500">{formattedDate}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        msg.status === 'new' ? 'bg-red-100 text-red-800' :
                        msg.status === 'read' ? 'bg-blue-100 text-blue-800' :
                        msg.status === 'replied' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {msg.status || 'new'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2 bg-white p-2 rounded border border-gray-200">
                      {msg.message}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Bookings */}
        <Card className="border-2 border-gray-200 hover:border-[#e0cb23]/50 transition-all duration-300 shadow-lg hover:shadow-2xl bg-gradient-to-br from-white via-gray-50 to-white">
          <CardHeader className="bg-gradient-to-r from-[#030213] to-[#1a1a2e] text-white rounded-t-lg">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-xl">📋</span>
              Recent Bookings
              {stats.loading ? (
                <span className="ml-auto text-xs opacity-75 animate-pulse">Loading...</span>
              ) : (
                <span className="ml-auto text-xs opacity-75">
                  {recentBookings.length} recent
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {stats.loading ? (
              <div className="text-center py-8 text-gray-400">
                <div className="animate-pulse">Loading recent bookings...</div>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">No recent bookings</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentBookings.map((booking, idx) => {
                  const isEventBooking = 'event_id' in booking;
                  const bookingType = isEventBooking ? 'Event' : 'Coach';
                  const bookingName = isEventBooking 
                    ? (booking as EventBooking).event_name || 'Unknown Event'
                    : (booking as CoachBooking).coach_name || 'Unknown Coach';
                  const statusColor = booking.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800';
                  
                  return (
                    <div 
                      key={`${isEventBooking ? 'event' : 'coach'}-${(booking as any).id || idx}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{bookingName}</p>
                        <p className="text-xs text-gray-500 mt-1">{bookingType} Booking</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor} ml-2`}>
                        {booking.status || 'unknown'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="border-2 border-gray-200 hover:border-[#e0cb23]/50 transition-all duration-300 shadow-lg hover:shadow-2xl bg-gradient-to-br from-white via-blue-50/30 to-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-xl">🔮</span>
              Upcoming Events
              {stats.loading ? (
                <span className="ml-auto text-xs opacity-75 animate-pulse">Loading...</span>
              ) : (
                <span className="ml-auto text-xs opacity-75">
                  {upcomingEvents.length} upcoming
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {stats.loading ? (
              <div className="text-center py-8 text-gray-400">
                <div className="animate-pulse">Loading upcoming events...</div>
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">No upcoming events scheduled</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {upcomingEvents.map((event, idx) => {
                  const eventDate = event.date ? new Date(event.date) : null;
                  const formattedDate = eventDate 
                    ? eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Date TBD';
                  const formattedTime = event.time 
                    ? new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })
                    : 'Time TBD';
                  
                  return (
                    <div 
                      key={event.id || idx}
                      className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                      onClick={() => onNavigate('adminEvents')}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{event.name || 'Unnamed Event'}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {formattedDate} at {formattedTime}
                        </p>
                      </div>
                      <span className="text-xs text-blue-600 font-medium ml-2">→</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 hover:border-red-400 transition-all duration-300 hover:shadow-xl cursor-pointer"
          onClick={() => {
            // Navigate to contact messages if we have an admin messages page
            // For now, just highlight pending actions
            if (stats.newContactMessages > 0) {
              // Could navigate to contact messages admin page
            }
          }}>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-5xl mb-3">📬</div>
              <p className="text-sm text-gray-700 mb-2 font-semibold">New Messages</p>
              <div className="text-4xl font-bold text-red-600 mb-2">
                {stats.loading ? '...' : stats.newContactMessages}
              </div>
              <p className="text-xs text-gray-600">Contact form inquiries</p>
              {stats.newContactMessages > 0 && (
                <p className="text-xs text-red-600 font-semibold mt-2 animate-pulse">Action required!</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 hover:shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-5xl mb-3">⏱️</div>
              <p className="text-sm text-gray-700 mb-2 font-semibold">Pending Approval</p>
              <div className="text-4xl font-bold text-amber-600 mb-2">
                {stats.loading ? '...' : stats.pendingBookings}
              </div>
              <p className="text-xs text-gray-600">Bookings awaiting confirmation</p>
              {stats.pendingBookings > 0 && (
                <p className="text-xs text-amber-600 font-semibold mt-2">Review needed</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-300 hover:shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-5xl mb-3">✅</div>
              <p className="text-sm text-gray-700 mb-2 font-semibold">Confirmed Today</p>
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                {stats.loading ? '...' : stats.confirmedBookings}
              </div>
              <p className="text-xs text-gray-600">Successfully confirmed</p>
              <p className="text-xs text-emerald-600 font-semibold mt-2">
                {stats.totalBookings > 0 
                  ? `${Math.round((stats.confirmedBookings / stats.totalBookings) * 100)}% success rate`
                  : '0% success rate'}
              </p>
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
