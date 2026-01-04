import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  getEventBookings,
  getCoachBookings,
  updateBookingStatus,
  type EventBooking,
  type CoachBooking,
} from '../../services/adminService';
import { AdminLayout } from './AdminLayout';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player' | 'payment' | 'paymentSuccess' | 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

type AdminPage = 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

interface AdminBookingsProps {
  onNavigate: (page: AdminPage) => void;
}

export function AdminBookings({ onNavigate }: AdminBookingsProps) {
  const [eventBookings, setEventBookings] = useState<EventBooking[]>([]);
  const [coachBookings, setCoachBookings] = useState<CoachBooking[]>([]);
  const [filteredEventBookings, setFilteredEventBookings] = useState<EventBooking[]>([]);
  const [filteredCoachBookings, setFilteredCoachBookings] = useState<CoachBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const [events, coaches] = await Promise.all([
        getEventBookings(),
        getCoachBookings(),
      ]);
      setEventBookings(events);
      setCoachBookings(coaches);
      setFilteredEventBookings(events);
      setFilteredCoachBookings(coaches);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filteredEvents = eventBookings;
    let filteredCoaches = coachBookings;

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filteredEvents = eventBookings.filter(
        (b) =>
          b.event_name?.toLowerCase().includes(query) ||
          b.user_name?.toLowerCase().includes(query) ||
          b.user_email?.toLowerCase().includes(query)
      );
      filteredCoaches = coachBookings.filter(
        (b) =>
          b.coach_name?.toLowerCase().includes(query) ||
          b.user_name?.toLowerCase().includes(query) ||
          b.user_email?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredEvents = filteredEvents.filter((b) => b.status === statusFilter);
      filteredCoaches = filteredCoaches.filter((b) => b.status === statusFilter);
    }

    setFilteredEventBookings(filteredEvents);
    setFilteredCoachBookings(filteredCoaches);
  }, [searchQuery, statusFilter, eventBookings, coachBookings]);

  const handleStatusChange = async (
    bookingId: number,
    type: 'event' | 'coach',
    newStatus: 'pending' | 'confirmed' | 'cancelled'
  ) => {
    try {
      await updateBookingStatus(bookingId, type, newStatus);
      toast.success('Booking status updated successfully');
      loadBookings();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update booking status');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      confirmed: 'default',
      pending: 'secondary',
      cancelled: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      paid: 'default',
      pending: 'secondary',
      failed: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handlePageNavigate = (page: Page) => {
    window.location.href = '/';
  };

  return (
    <AdminLayout
      title="Manage Bookings"
      description="View and update booking status"
      currentPage="adminBookings"
      onNavigate={handlePageNavigate}
      onAdminNavigate={onNavigate}
    >
      <div>
        <Tabs defaultValue="events" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="events">
                Event Bookings ({eventBookings.length})
              </TabsTrigger>
              <TabsTrigger value="coaches">
                Coach Bookings ({coachBookings.length})
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
          </div>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Event Bookings</CardTitle>
                <CardDescription>Manage all event bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading bookings...</div>
                ) : filteredEventBookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchQuery || statusFilter !== 'all' ? 'No bookings found matching your filters.' : 'No event bookings found.'}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEventBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.id}</TableCell>
                          <TableCell className="font-medium">
                            {booking.event_name || `Event #${booking.event_id}`}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{booking.user_name || `User #${booking.user_id}`}</div>
                              <div className="text-gray-500 text-xs">
                                {booking.user_email || ''}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{booking.event_date ? new Date(booking.event_date).toLocaleDateString() : 'N/A'}</div>
                              <div className="text-gray-500">{booking.event_time || 'N/A'}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            ${booking.event_price?.toFixed(2) || '0.00'}
                          </TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>{getPaymentBadge(booking.payment_status)}</TableCell>
                          <TableCell>
                            <Select
                              value={booking.status}
                              onValueChange={(value: 'pending' | 'confirmed' | 'cancelled') =>
                                handleStatusChange(booking.id, 'event', value)
                              }
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coaches">
            <Card>
              <CardHeader>
                <CardTitle>Coach Bookings</CardTitle>
                <CardDescription>Manage all coach session bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading bookings...</div>
                ) : filteredCoachBookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchQuery || statusFilter !== 'all' ? 'No bookings found matching your filters.' : 'No coach bookings found.'}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Coach</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCoachBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.id}</TableCell>
                          <TableCell className="font-medium">
                            {booking.coach_name || `Coach #${booking.coach_id}`}
                            {booking.specialty && (
                              <div className="text-xs text-gray-500">{booking.specialty}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{booking.user_name || `User #${booking.user_id}`}</div>
                              <div className="text-gray-500 text-xs">
                                {booking.user_email || ''}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{new Date(booking.session_date).toLocaleDateString()}</div>
                              <div className="text-gray-500">{booking.session_time}</div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>{getPaymentBadge(booking.payment_status)}</TableCell>
                          <TableCell>
                            <Select
                              value={booking.status}
                              onValueChange={(value: 'pending' | 'confirmed' | 'cancelled') =>
                                handleStatusChange(booking.id, 'coach', value)
                              }
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

