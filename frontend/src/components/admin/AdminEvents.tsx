import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  type Event,
  type CreateEventData,
} from '../../services/adminService';
import { toast } from 'sonner';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player' | 'payment' | 'paymentSuccess' | 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

interface AdminEventsProps {
  onNavigate: (page: Page) => void;
}

export function AdminEvents({ onNavigate }: AdminEventsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<CreateEventData>({
    name: '',
    description: '',
    date: '',
    time: '',
    max_players: 0,
    price: 0,
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        name: event.name,
        description: event.description || '',
        date: event.date,
        time: event.time,
        max_players: event.max_players,
        price: event.price,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        name: '',
        description: '',
        date: '',
        time: '',
        max_players: 0,
        price: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, formData);
        toast.success('Event updated successfully');
      } else {
        await createEvent(formData);
        toast.success('Event created successfully');
      }
      handleCloseDialog();
      loadEvents();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save event');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await deleteEvent(id);
      toast.success('Event deleted successfully');
      loadEvents();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete event');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <div className="bg-[#030213] text-white py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Manage Events</h1>
            <p className="text-gray-300 mt-1">Create, edit, and delete events</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onNavigate('admin')}
              className="bg-white text-[#030213] hover:bg-gray-100"
            >
              Back to Dashboard
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => handleOpenDialog()}
                  className="bg-[#e0cb23] text-[#030213] hover:bg-[#d4ba1f]"
                >
                  + Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                  <DialogDescription>
                    {editingEvent ? 'Update event details below' : 'Fill in the details to create a new event'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Event Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Tennis Tournament"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Event description..."
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Date *</label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Time *</label>
                      <Input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Max Players *</label>
                      <Input
                        type="number"
                        value={formData.max_players}
                        onChange={(e) => setFormData({ ...formData, max_players: parseInt(e.target.value) || 0 })}
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Price (AUD) *</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseDialog}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-[#030213] text-white hover:bg-[#050525]">
                      {editingEvent ? 'Update Event' : 'Create Event'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Loading events...</div>
          </div>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-gray-500 mb-4">No events found.</div>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-[#e0cb23] text-[#030213] hover:bg-[#d4ba1f]"
              >
                + Create Your First Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Events Grid - Matching user-facing design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image Placeholder */}
                  <div className="relative h-[150px] md:h-[180px] overflow-hidden bg-gradient-to-br from-[#030213] to-[#1a1a2e]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl text-white opacity-50">📅</span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(event);
                        }}
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-[#030213]"
                      >
                        ✏️
                      </Button>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-3 md:p-4">
                    <h4 className="font-semibold text-sm md:text-base text-black mb-2 line-clamp-1">
                      {event.name}
                    </h4>
                    
                    <p className="text-xs md:text-sm text-[#666] mb-3 line-clamp-2 min-h-10">
                      {event.description || 'No description'}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-[#888] mb-3">
                      <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>🕐 {event.time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-[#888] mb-3">
                      <span>👥 {event.max_players} max</span>
                      <span>•</span>
                      <span className="font-semibold text-black">${event.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(event)}
                        className="flex-1 text-xs"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                        className="flex-1 text-xs"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

