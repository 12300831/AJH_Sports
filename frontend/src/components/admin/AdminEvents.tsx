import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
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
  DialogTrigger,
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
import { getMockEvents, convertMockEventToBackendFormat, updateMockEvent, deleteMockEvent, createMockEvent, type MockEvent } from '../../services/mockEventsService';
import { AdminLayout } from './AdminLayout';
import { toast } from 'sonner';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player' | 'payment' | 'paymentSuccess' | 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

type AdminPage = 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

interface AdminEventsProps {
  onNavigate: (page: AdminPage) => void;
}

// Extended event interface that includes both backend and mock event fields
interface ExtendedEvent extends Partial<Event> {
  id: number;
  name?: string;
  title?: string; // From mock events
  description?: string;
  fullDescription?: string;
  date?: string;
  time?: string;
  max_players?: number;
  spots?: number; // From mock events
  price?: number;
  priceString?: string; // From mock events (e.g., "$30")
  location?: string;
  status?: 'active' | 'cancelled' | 'completed';
  category?: 'tournament' | 'coaching' | 'party';
  featured?: boolean;
  whoCanJoin?: string;
  entryFee?: string;
  whatsIncluded?: string;
  registrationDeadline?: string;
  venue?: string;
  image?: string;
  heroImage?: string;
  alt?: string;
  isMockEvent?: boolean; // Flag to identify mock events
}

export function AdminEvents({ onNavigate }: AdminEventsProps) {
  const [backendEvents, setBackendEvents] = useState<Event[]>([]);
  const [mockEvents, setMockEvents] = useState<MockEvent[]>([]);
  const [allEvents, setAllEvents] = useState<ExtendedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<ExtendedEvent | null>(null);
  const [eventToSync, setEventToSync] = useState<MockEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<ExtendedEvent | null>(null);
  const [formData, setFormData] = useState<any>({
    name: '',
    title: '',
    description: '',
    fullDescription: '',
    date: '',
    time: '',
    max_players: 0,
    spots: 0,
    price: 0,
    priceString: '',
    location: '',
    status: 'active',
    category: 'tournament',
    featured: false,
    whoCanJoin: '',
    entryFee: '',
    whatsIncluded: '',
    registrationDeadline: '',
    venue: '',
    image: '',
    heroImage: '',
    alt: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<'all' | 'backend' | 'mock'>('all');

  useEffect(() => {
    try {
      // Load mock events immediately (synchronous)
      const mockData = getMockEvents();
      console.log('🚀 Initial mock events load:', mockData.length, mockData);
      setMockEvents(mockData || []);
      
      // Then load all events (including backend)
      loadEvents();
    } catch (err: any) {
      console.error('Error in AdminEvents useEffect:', err);
      setError(err.message || 'Failed to load events');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      // Ensure both are arrays before processing
      const safeBackendEvents = Array.isArray(backendEvents) ? backendEvents : [];
      const safeMockEvents = Array.isArray(mockEvents) ? mockEvents : [];
      
      console.log('🔄 Combining events - backendEvents:', safeBackendEvents.length, 'mockEvents:', safeMockEvents.length);
      
      const backendEventsList = safeBackendEvents.map(e => ({ ...e, isMockEvent: false }));
      const mockEventsList = safeMockEvents.map(m => ({
      id: m.id + 10000, // Offset mock event IDs to avoid conflicts
      title: m.title,
      name: m.title,
      description: m.description,
      fullDescription: m.fullDescription,
      date: m.date,
      time: m.time,
      spots: m.spots,
      max_players: m.spots,
      priceString: m.price,
      price: parseFloat(m.price.replace(/[^0-9.]/g, '')) || 0,
      location: m.location,
      category: m.category,
      featured: m.featured,
      whoCanJoin: m.whoCanJoin,
      entryFee: m.entryFee,
      whatsIncluded: m.whatsIncluded,
      registrationDeadline: m.registrationDeadline,
      venue: m.venue,
      image: m.image,
      heroImage: m.heroImage,
      alt: m.alt,
      status: 'active' as const,
      isMockEvent: true,
    }));
    
    const combined: ExtendedEvent[] = [
      ...backendEventsList,
      ...mockEventsList,
    ];
    
      console.log('✅ Combined events total:', combined.length, 'Backend:', backendEventsList.length, 'Mock:', mockEventsList.length);
      if (mockEventsList.length > 0) {
        console.log('📋 Mock events:', mockEventsList.map(e => e.title));
      }
      setAllEvents(combined);
    } catch (err: any) {
      console.error('Error combining events:', err);
      setError(err.message || 'Failed to combine events');
    }
  }, [backendEvents, mockEvents]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Load backend events
      try {
        const backendData = await getEvents();
        // Ensure backendData is always an array
        const eventsArray = Array.isArray(backendData) ? backendData : [];
        console.log('📥 Backend events loaded:', eventsArray.length, eventsArray);
        setBackendEvents(eventsArray);
      } catch (error) {
        console.error('Error loading backend events:', error);
        setBackendEvents([]);
      }
      
      // Load mock events - this should always work
      const mockData = getMockEvents();
      console.log('Loaded mock events:', mockData.length, mockData);
      if (mockData && mockData.length > 0) {
        setMockEvents(mockData);
      } else {
        console.error('No mock events found!');
        // Force reload from service
        const freshMockData = getMockEvents();
        console.log('Fresh mock data:', freshMockData);
        setMockEvents(freshMockData || []);
      }
    } catch (error: any) {
      console.error('Error loading events:', error);
      toast.error(error.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    const eventName = formData.name || formData.title;
    if (!eventName?.trim()) {
      errors.name = 'Event name is required';
    }
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    if (!formData.time) {
      errors.time = 'Time is required';
    }
    const maxPlayers = formData.max_players || formData.spots;
    if (maxPlayers < 0) {
      errors.max_players = 'Max players cannot be negative';
    }
    const price = formData.price || 0;
    if (price < 0) {
      errors.price = 'Price cannot be negative';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenDialog = (event?: ExtendedEvent) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        name: event.name || event.title || '',
        title: event.title || event.name || '',
        description: event.description || '',
        fullDescription: event.fullDescription || '',
        date: event.date || '',
        time: event.time || '',
        max_players: event.max_players || event.spots || 0,
        spots: event.spots || event.max_players || 0,
        price: event.price || 0,
        priceString: event.priceString || (event.price ? `$${event.price}` : ''),
        location: event.location || '',
        status: event.status || 'active',
        category: event.category || 'tournament',
        featured: event.featured || false,
        whoCanJoin: event.whoCanJoin || '',
        entryFee: event.entryFee || '',
        whatsIncluded: event.whatsIncluded || '',
        registrationDeadline: event.registrationDeadline || '',
        venue: event.venue || '',
        image: event.image || '',
        heroImage: event.heroImage || '',
        alt: event.alt || '',
      });
    } else {
      setEditingEvent(null);
      setFormData({
        name: '',
        title: '',
        description: '',
        fullDescription: '',
        date: '',
        time: '',
        max_players: 20,
        spots: 20,
        price: 0,
        priceString: '',
        location: '',
        status: 'active',
        category: 'tournament',
        featured: false,
        whoCanJoin: '',
        entryFee: '',
        whatsIncluded: '',
        registrationDeadline: '',
        venue: '',
        image: '',
        heroImage: '',
        alt: '',
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
      if (editingEvent?.isMockEvent) {
        // Update mock event directly
        const mockEventId = editingEvent.id - 10000; // Remove the offset
        const updated = updateMockEvent(mockEventId, {
          title: formData.name || formData.title || '',
          description: formData.description,
          fullDescription: formData.fullDescription,
          date: formData.date,
          time: formData.time,
          spots: formData.max_players || formData.spots || 0,
          price: formData.priceString || (formData.price ? `$${formData.price}` : ''),
          location: formData.location,
          category: formData.category,
          featured: formData.featured,
          whoCanJoin: formData.whoCanJoin,
          entryFee: formData.entryFee,
          whatsIncluded: formData.whatsIncluded,
          registrationDeadline: formData.registrationDeadline,
          venue: formData.venue,
          image: formData.image,
          heroImage: formData.heroImage,
          alt: formData.alt,
        });
        if (updated) {
          toast.success('Mock event updated successfully!');
        } else {
          toast.error('Failed to update mock event');
        }
      } else if (editingEvent && !editingEvent.isMockEvent) {
        // Update existing backend event
        const updateData: CreateEventData = {
          name: formData.name || formData.title,
          description: formData.fullDescription || formData.description,
          date: formData.date,
          time: formData.time,
          max_players: formData.max_players || formData.spots,
          price: formData.price,
          location: formData.location,
          status: formData.status,
        };
        await updateEvent(editingEvent.id, updateData);
        toast.success('Event updated successfully!');
      } else {
        // Create new event - create as mock event first
        const newMockEvent = createMockEvent({
          title: formData.name || formData.title || '',
          description: formData.description,
          fullDescription: formData.fullDescription,
          date: formData.date,
          time: formData.time,
          spots: formData.max_players || formData.spots,
          price: formData.priceString || (formData.price ? `$${formData.price}` : ''),
          location: formData.location,
          category: formData.category,
          featured: formData.featured,
          whoCanJoin: formData.whoCanJoin,
          entryFee: formData.entryFee,
          whatsIncluded: formData.whatsIncluded,
          registrationDeadline: formData.registrationDeadline,
          venue: formData.venue,
          image: formData.image || '',
          heroImage: formData.heroImage || '',
          alt: formData.alt || formData.name || formData.title || '',
        });
        toast.success('Event created successfully!');
      }
      handleCloseDialog();
      loadEvents();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save event');
    }
  };

  const handleSyncToBackend = async (mockEvent: MockEvent) => {
    try {
      const backendData = convertMockEventToBackendFormat(mockEvent);
      await createEvent(backendData);
      toast.success(`"${mockEvent.title}" synced to backend successfully!`);
      setIsSyncDialogOpen(false);
      setEventToSync(null);
      loadEvents();
    } catch (error: any) {
      toast.error(error.message || 'Failed to sync event to backend');
    }
  };

  const handleDeleteClick = (event: ExtendedEvent) => {
    setEventToDelete(event);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    
    try {
      if (eventToDelete.isMockEvent) {
        // Delete mock event
        const mockEventId = eventToDelete.id - 10000; // Remove the offset
        const deleted = deleteMockEvent(mockEventId);
        if (deleted) {
          toast.success('Event deleted successfully!');
        } else {
          toast.error('Failed to delete event');
        }
      } else {
        // Delete backend event
        await deleteEvent(eventToDelete.id);
        toast.success('Event deleted successfully!');
      }
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);
      loadEvents();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete event');
    }
  };

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getCategoryBadgeColor = (category?: string) => {
    switch (category) {
      case 'tournament':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'coaching':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'party':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredEvents = viewMode === 'all' 
    ? allEvents 
    : viewMode === 'backend' 
      ? allEvents.filter(e => !e.isMockEvent)
      : allEvents.filter(e => e.isMockEvent);
  
  console.log('🎯 Filtered events:', filteredEvents.length, 'viewMode:', viewMode, 'allEvents:', allEvents.length);
  console.log('📊 Event breakdown:', {
    all: allEvents.length,
    backend: allEvents.filter(e => !e.isMockEvent).length,
    mock: allEvents.filter(e => e.isMockEvent).length,
    filtered: filteredEvents.length
  });

  const handlePageNavigate = (page: Page) => {
    window.location.href = '/';
  };

  // Debug: Log component render
  console.log('🎨 AdminEvents rendering - loading:', loading, 'allEvents:', allEvents.length, 'error:', error);

  // Ensure we always render something
  if (error && !loading) {
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
            <div className="text-red-700 text-center">
              <p className="font-semibold text-lg mb-2">⚠️ Error Loading Events</p>
              <p className="mb-4">{error}</p>
              <Button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  loadEvents();
                }}
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
      {error && (
        <Card className="mb-6 border-red-300 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-700">
              <p className="font-semibold">Error: {error}</p>
              <Button
                onClick={() => {
                  setError(null);
                  loadEvents();
                }}
                className="mt-2"
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
            <DialogDescription>
              {editingEvent ? 'Update the event details below' : 'Fill in all the details to create a new event'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Event Name / Title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.name || formData.title}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value, title: e.target.value });
                          if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                        }}
                        required
                        placeholder="e.g., Tennis Tournament 2025"
                        className={formErrors.name ? 'border-red-500' : ''}
                      />
                      {formErrors.name && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Category</label>
                      <Select
                        value={formData.category}
                        onValueChange={(value: 'tournament' | 'coaching' | 'party') => 
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tournament">Tournament</SelectItem>
                          <SelectItem value="coaching">Coaching</SelectItem>
                          <SelectItem value="party">Party</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Short Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description shown in event cards..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Full Description</label>
                    <Textarea
                      value={formData.fullDescription}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                      placeholder="Detailed description shown on event detail page..."
                      rows={4}
                    />
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.date}
                        onChange={(e) => {
                          setFormData({ ...formData, date: e.target.value });
                          if (formErrors.date) setFormErrors({ ...formErrors, date: '' });
                        }}
                        required
                        placeholder="e.g., August 10-18, 2025 or Every Weekend or Book Anytime"
                        className={formErrors.date ? 'border-red-500' : ''}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter date range, single date, or flexible text (e.g., "Every Weekend")
                      </p>
                      {formErrors.date && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.date}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Time <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.time}
                        onChange={(e) => {
                          setFormData({ ...formData, time: e.target.value });
                          if (formErrors.time) setFormErrors({ ...formErrors, time: '' });
                        }}
                        required
                        placeholder="e.g., 9:00 AM - 6:00 PM or Flexible Hours"
                        className={formErrors.time ? 'border-red-500' : ''}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter time range or flexible text (e.g., "9:00 AM - 6:00 PM")
                      </p>
                      {formErrors.time && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.time}</p>
                      )}
                    </div>
                  </div>

                  {/* Location & Venue */}
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
                      <label className="text-sm font-medium mb-1 block">Venue</label>
                      <Input
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        placeholder="e.g., Outdoor Tennis Courts"
                      />
                    </div>
                  </div>

                  {/* Capacity & Price */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Max Players / Spots <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        value={formData.max_players || formData.spots}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          setFormData({ ...formData, max_players: value, spots: value });
                          if (formErrors.max_players) setFormErrors({ ...formErrors, max_players: '' });
                        }}
                        required
                        min="0"
                        className={formErrors.max_players ? 'border-red-500' : ''}
                      />
                      {formErrors.max_players && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.max_players}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Price (AUD) <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setFormData({ ...formData, price: value, priceString: value > 0 ? `$${value}` : '' });
                          if (formErrors.price) setFormErrors({ ...formErrors, price: '' });
                        }}
                        required
                        min="0"
                        placeholder="0.00"
                        className={formErrors.price ? 'border-red-500' : ''}
                      />
                      {formErrors.price && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.price}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Price Display</label>
                      <Input
                        value={formData.priceString}
                        onChange={(e) => setFormData({ ...formData, priceString: e.target.value })}
                        placeholder="e.g., $30, $25 per child, From $60 per hour"
                      />
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Who Can Join?</label>
                      <Input
                        value={formData.whoCanJoin}
                        onChange={(e) => setFormData({ ...formData, whoCanJoin: e.target.value })}
                        placeholder="e.g., Juniors & Adults, All ages"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Entry Fee Display</label>
                      <Input
                        value={formData.entryFee}
                        onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                        placeholder="e.g., $30 per player or team"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">What's Included?</label>
                    <Textarea
                      value={formData.whatsIncluded}
                      onChange={(e) => setFormData({ ...formData, whatsIncluded: e.target.value })}
                      placeholder="List what participants get..."
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Registration Deadline</label>
                      <Input
                        value={formData.registrationDeadline}
                        onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                        placeholder="e.g., August 1, 2025"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Status</label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: 'active' | 'cancelled' | 'completed') => 
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="featured" className="text-sm font-medium">
                      Featured Event
                    </label>
                  </div>

                  {/* Image URLs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Image URL</label>
                      <Input
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="/images/event-image.png"
                      />
                      <p className="text-xs text-gray-500 mt-1">Card/thumbnail image</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Hero Image URL</label>
                      <Input
                        value={formData.heroImage}
                        onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                        placeholder="/images/event-hero.jpg"
                      />
                      <p className="text-xs text-gray-500 mt-1">Large banner image for event detail page</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Alt Text (Image Description)</label>
                    <Input
                      value={formData.alt}
                      onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                      placeholder="e.g., Tennis Open 2025"
                    />
                    <p className="text-xs text-gray-500 mt-1">Accessibility text for images</p>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseDialog}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-[#030213] text-white hover:bg-[#050525] min-w-[120px]"
                    >
                      {editingEvent?.isMockEvent 
                        ? 'Sync to Backend' 
                        : (editingEvent 
                          ? 'Update Event' 
                          : 'Create Event')}
                    </Button>
                  </div>
                </form>
          </DialogContent>
        </Dialog>
      <div>
        {/* View Mode Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={viewMode === 'all' ? 'default' : 'outline'}
            onClick={() => setViewMode('all')}
            className={viewMode === 'all' ? 'bg-[#030213] text-white' : ''}
          >
            All Events ({allEvents.length})
          </Button>
          <Button
            variant={viewMode === 'backend' ? 'default' : 'outline'}
            onClick={() => setViewMode('backend')}
            className={viewMode === 'backend' ? 'bg-[#030213] text-white' : ''}
          >
            Backend Events ({backendEvents.length})
          </Button>
          <Button
            variant={viewMode === 'mock' ? 'default' : 'outline'}
            onClick={() => setViewMode('mock')}
            className={viewMode === 'mock' ? 'bg-[#030213] text-white' : ''}
          >
            Mock Events ({mockEvents.length})
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Loading events...</div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="py-16 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No events found</h3>
              <div className="text-sm text-gray-600 mb-4 space-y-1 bg-gray-50 p-4 rounded">
                <p className="font-semibold">Debug Info:</p>
                <p>All Events: {allEvents.length} | Backend: {backendEvents.length} | Mock: {mockEvents.length}</p>
                <p>View Mode: {viewMode} | Filtered: {filteredEvents.length}</p>
                {mockEvents.length > 0 && (
                  <p className="text-green-600 font-semibold mt-2">✅ Mock events loaded: {mockEvents.map(e => e.title).join(', ')}</p>
                )}
                {allEvents.length > 0 && (
                  <p className="text-blue-600 font-semibold mt-2">✅ All events: {allEvents.map(e => e.title || e.name).join(', ')}</p>
                )}
              </div>
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
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <div className="text-sm text-gray-600 mb-1">Total Events</div>
                  <div className="text-2xl font-bold text-[#030213]">{filteredEvents.length}</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="text-sm text-gray-600 mb-1">Active Events</div>
                  <div className="text-2xl font-bold text-[#030213]">
                    {filteredEvents.filter(e => e.status === 'active' || !e.status).length}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="pt-4">
                  <div className="text-sm text-gray-600 mb-1">Total Capacity</div>
                  <div className="text-2xl font-bold text-[#030213]">
                    {filteredEvents.reduce((sum, e) => sum + (e.max_players || e.spots || 0), 0)}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-4">
                  <div className="text-sm text-gray-600 mb-1">Avg. Price</div>
                  <div className="text-2xl font-bold text-[#030213]">
                    ${filteredEvents.length > 0 
                      ? (filteredEvents.reduce((sum, e) => sum + (e.price || 0), 0) / filteredEvents.length).toFixed(2)
                      : '0.00'}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image Placeholder */}
                  <div className="relative h-[150px] md:h-[180px] overflow-hidden bg-gradient-to-br from-[#030213] to-[#1a1a2e]">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.alt || event.title || event.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl text-white opacity-50">📅</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(event);
                        }}
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-[#030213]"
                        title="Edit event"
                      >
                        ✏️
                      </Button>
                    </div>
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {event.status && (
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadgeColor(event.status)}`}>
                          {event.status}
                        </span>
                      )}
                      {event.category && (
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getCategoryBadgeColor(event.category)}`}>
                          {event.category}
                        </span>
                      )}
                      {event.isMockEvent && (
                        <span className="px-2 py-1 rounded text-xs font-medium border bg-yellow-100 text-yellow-800 border-yellow-200">
                          Mock
                        </span>
                      )}
                      {event.featured && (
                        <span className="px-2 py-1 rounded text-xs font-medium border bg-[#e0cb23] text-[#030213] border-[#e0cb23]">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-base text-black mb-2 line-clamp-1">
                      {event.title || event.name}
                    </h4>
                    
                    <p className="text-xs md:text-sm text-[#666] mb-3 line-clamp-2 min-h-10">
                      {event.fullDescription || event.description || 'No description'}
                    </p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-xs text-[#888]">
                        <span>📅</span>
                        <span className="line-clamp-1">{event.date || 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#888]">
                        <span>🕐</span>
                        <span>{event.time || 'TBD'}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-xs text-[#888]">
                          <span>📍</span>
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}
                      {event.venue && (
                        <div className="flex items-center gap-2 text-xs text-[#888]">
                          <span>🏟️</span>
                          <span className="line-clamp-1">{event.venue}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                      <div className="text-xs text-[#888]">
                        <span>👥 {event.max_players || event.spots || 0} max</span>
                      </div>
                      <div className="font-semibold text-black">
                        {event.priceString || (event.price ? `$${event.price.toFixed(2)}` : 'Free')}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {event.isMockEvent ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const mockEvent = mockEvents.find(m => m.id === event.id - 10000);
                              if (mockEvent) {
                                setEventToSync(mockEvent);
                                setIsSyncDialogOpen(true);
                              }
                            }}
                            className="flex-1 text-xs border-[#e0cb23] text-[#030213] hover:bg-[#e0cb23]"
                          >
                            Sync to Backend
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(event)}
                            className="flex-1 text-xs border-[#030213] text-[#030213] hover:bg-[#030213] hover:text-white"
                          >
                            View Details
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(event)}
                            className="flex-1 text-xs border-[#030213] text-[#030213] hover:bg-[#030213] hover:text-white"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(event)}
                            className="flex-1 text-xs"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event "{eventToDelete?.title || eventToDelete?.name}". 
              This action cannot be undone. All bookings for this event will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEventToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sync to Backend Dialog */}
      <AlertDialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sync Mock Event to Backend?</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a copy of "{eventToSync?.title}" in the backend database. 
              You can then edit and manage it like any other backend event. The original mock event will remain unchanged.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEventToSync(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => eventToSync && handleSyncToBackend(eventToSync)}
              className="bg-[#e0cb23] text-[#030213] hover:bg-[#d4ba1f]"
            >
              Sync to Backend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
