import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  type Event,
  type CreateEventData,
} from '../../services/adminService';
import { AdminLayout } from './AdminLayout';
import { toast } from 'sonner';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player' | 'payment' | 'paymentSuccess' | 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

type AdminPage = 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

interface AdminEventsProps {
  onNavigate: (page: AdminPage) => void;
}

export function AdminEvents({ onNavigate }: AdminEventsProps) {
  // State - backend events only
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    max_players: 20,
    price: 0,
    location: '',
    image_url: '',
    hero_image_url: '',
    status: 'active' as 'active' | 'inactive' | 'cancelled' | 'completed',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load events on mount
  useEffect(() => {
      loadEvents();
  }, []);

  const loadEvents = async () => {
      setLoading(true);
    setError(null);
    
    try {
      const data = await getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load events:', err);
      setError(err.message || 'Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'Event name is required';
    }
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    if (!formData.time) {
      errors.time = 'Time is required';
    }
    if (formData.max_players < 0) {
      errors.max_players = 'Max players cannot be negative';
    }
    if (formData.price < 0) {
      errors.price = 'Price cannot be negative';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenDialog = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        name: event.name || '',
        description: event.description || '',
        date: event.date || '',
        time: event.time || '',
        max_players: event.max_players || 20,
        price: event.price || 0,
        location: event.location || '',
        image_url: event.image_url || '',
        hero_image_url: event.hero_image_url || '',
        status: event.status || 'active',
      });
    } else {
      setEditingEvent(null);
      setFormData({
        name: '',
        description: '',
        date: '',
        time: '',
        max_players: 20,
        price: 0,
        location: '',
        image_url: '',
        hero_image_url: '',
        status: 'active',
      });
    }
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEvent(null);
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      const eventData: CreateEventData = {
        name: formData.name,
          description: formData.description,
          date: formData.date,
          time: formData.time,
        max_players: formData.max_players,
          price: formData.price,
          location: formData.location,
        image_url: formData.image_url || undefined,
        hero_image_url: formData.hero_image_url || undefined,
          status: formData.status,
        };

      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
        toast.success('Event updated successfully!');
      } else {
        await createEvent(eventData);
        toast.success('Event created successfully!');
      }
      
      handleCloseDialog();
      loadEvents();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save event');
    }
  };

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    
    try {
        await deleteEvent(eventToDelete.id);
      toast.success('Event archived successfully! It will no longer appear on the public site.');
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);
      loadEvents();
    } catch (err: any) {
      toast.error(err.message || 'Failed to archive event');
    }
  };

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handlePageNavigate = (page: Page) => {
    window.location.href = '/';
  };

  // RENDER: Loading state
  if (loading) {
    return (
      <AdminLayout
        title="Manage Events"
        description="Create, edit, and delete events"
        currentPage="adminEvents"
        onNavigate={handlePageNavigate}
        onAdminNavigate={onNavigate}
      >
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#030213] mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading events...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // RENDER: Error state
  if (error) {
    return (
      <AdminLayout
        title="Manage Events"
        description="Create, edit, and delete events"
        currentPage="adminEvents"
        onNavigate={handlePageNavigate}
        onAdminNavigate={onNavigate}
      >
        <Card className="border-red-300 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="font-semibold text-lg text-red-800 mb-2">Failed to Load Events</p>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={loadEvents}
                className="bg-[#e0cb23] text-[#030213] hover:bg-[#d4ba1f]"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  // RENDER: Main content
  return (
    <AdminLayout
      title="Manage Events"
      description="Create, edit, and delete events"
      currentPage="adminEvents"
      onNavigate={handlePageNavigate}
      onAdminNavigate={onNavigate}
      headerAction={
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#e0cb23] text-[#030213] hover:bg-[#d4ba1f] font-semibold"
        >
          + Add New Event
        </Button>
      }
    >
      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
            <DialogDescription>
              {editingEvent ? 'Update the event details below' : 'Fill in the details to create a new event'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                Event Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Tennis Tournament 2025"
                        className={formErrors.name ? 'border-red-500' : ''}
                      />
              {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                  </div>

                  <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Event description..."
                rows={3}
                    />
                  </div>

            {/* Image URL Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                <label className="text-sm font-medium mb-1 block">Card Image URL</label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
                <p className="text-xs text-gray-500 mt-1">Image shown on event cards</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Hero Image URL</label>
                <Input
                  value={formData.hero_image_url}
                  onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                  placeholder="https://example.com/hero.jpg"
                  type="url"
                />
                <p className="text-xs text-gray-500 mt-1">Large image for event details</p>
              </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                  type="date"
                        value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className={formErrors.date ? 'border-red-500' : ''}
                      />
                {formErrors.date && <p className="text-xs text-red-500 mt-1">{formErrors.date}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Time <span className="text-red-500">*</span>
                      </label>
                      <Input
                  type="time"
                        value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className={formErrors.time ? 'border-red-500' : ''}
                      />
                {formErrors.time && <p className="text-xs text-red-500 mt-1">{formErrors.time}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Location</label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., AJH Sportscentre"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Status</label>
                      <Select
                        value={formData.status}
                  onValueChange={(value: 'active' | 'inactive' | 'cancelled' | 'completed') => 
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                <label className="text-sm font-medium mb-1 block">Max Players</label>
                      <Input
                  type="number"
                  value={formData.max_players}
                  onChange={(e) => setFormData({ ...formData, max_players: parseInt(e.target.value) || 0 })}
                  min="0"
                  className={formErrors.max_players ? 'border-red-500' : ''}
                />
                {formErrors.max_players && <p className="text-xs text-red-500 mt-1">{formErrors.max_players}</p>}
                    </div>
                    <div>
                <label className="text-sm font-medium mb-1 block">Price (AUD)</label>
                      <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  min="0"
                  className={formErrors.price ? 'border-red-500' : ''}
                />
                {formErrors.price && <p className="text-xs text-red-500 mt-1">{formErrors.price}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
              <Button type="submit" className="bg-[#030213] text-white hover:bg-[#1a1a2e]">
                {editingEvent ? 'Update Event' : 'Create Event'}
                    </Button>
                  </div>
                </form>
          </DialogContent>
        </Dialog>

      {/* Archive (Soft Delete) Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border border-gray-200 shadow-2xl z-[999]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">
              Archive Event?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 mt-2">
              This will archive "<span className="font-semibold text-gray-800">{eventToDelete?.name}</span>" and hide it from the public events page. 
              The event will remain visible in admin with "Inactive" status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel 
              onClick={() => setEventToDelete(null)}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Archive Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Empty state */}
      {events.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="py-16 text-center">
              <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Found</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first event</p>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-[#e0cb23] text-[#030213] hover:bg-[#d4ba1f] font-semibold"
              >
                + Create Your First Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
          {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <div className="text-sm text-gray-600 mb-1">Total Events</div>
                <div className="text-2xl font-bold text-[#030213]">{events.length}</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                <div className="text-sm text-gray-600 mb-1">Active</div>
                  <div className="text-2xl font-bold text-[#030213]">
                  {events.filter(e => e.status === 'active').length}
                  </div>
                </CardContent>
              </Card>
            <Card className="border-l-4 border-l-orange-500">
                <CardContent className="pt-4">
                <div className="text-sm text-gray-600 mb-1">Inactive</div>
                  <div className="text-2xl font-bold text-[#030213]">
                  {events.filter(e => e.status === 'inactive').length}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-4">
                <div className="text-sm text-gray-600 mb-1">Total Capacity</div>
                  <div className="text-2xl font-bold text-[#030213]">
                  {events.reduce((sum, e) => sum + (e.max_players || 0), 0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-br from-[#030213] to-[#1a1a2e] flex items-center justify-center relative overflow-hidden">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.name}
                        className="w-full h-full object-cover"
                      onError={(e) => {
                        // Replace with fallback on error
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <span className={`text-4xl ${event.image_url ? 'hidden' : ''}`}>📅</span>
                  <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadgeColor(event.status)}`}>
                      {event.status || 'active'}
                        </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                  <h4 className="font-semibold text-base mb-2 line-clamp-1">{event.name}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {event.description || 'No description'}
                  </p>
                  <div className="space-y-1 text-xs text-gray-500 mb-3">
                    <div>📅 {event.date || 'TBD'}</div>
                    <div>🕐 {event.time || 'TBD'}</div>
                    <div>📍 {event.location || 'TBD'}</div>
                    <div>👥 {event.max_players || 0} spots</div>
                      </div>
                  <div className="flex items-center justify-between mb-3 pt-2 border-t">
                    <span className="font-bold">${Number(event.price || 0).toFixed(2)}</span>
                      </div>
                  <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(event)}
                      className="flex-1 text-xs"
                          >
                      Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(event)}
                      className="flex-1 text-xs border-orange-300 text-orange-700 hover:bg-orange-50"
                      disabled={event.status === 'inactive'}
                          >
                      {event.status === 'inactive' ? 'Archived' : 'Archive'}
                          </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
    </AdminLayout>
  );
}


















