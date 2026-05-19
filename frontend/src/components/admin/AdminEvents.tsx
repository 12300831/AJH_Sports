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
  hardDeleteEvent,
  sendTestEmail,
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
  const [isHardDeleteDialogOpen, setIsHardDeleteDialogOpen] = useState(false);
  const [isTestEmailDialogOpen, setIsTestEmailDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [eventToHardDelete, setEventToHardDelete] = useState<Event | null>(null);
  const [eventToTestEmail, setEventToTestEmail] = useState<Event | null>(null);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
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
    age_group: '' as string,
    whats_included: '' as string,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Image preview states
  const [cardImagePreview, setCardImagePreview] = useState<string | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [draggedImageType, setDraggedImageType] = useState<'card' | 'hero' | null>(null);

  // Load events on mount - always fetch fresh data from MySQL
  useEffect(() => {
    console.log('🔄 AdminEvents mounted - fetching fresh events from API');
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Always fetch fresh data from MySQL - no caching
      const data = await getEvents();
      setEvents(Array.isArray(data) ? data : []);
      console.log('✅ AdminEvents: Loaded', Array.isArray(data) ? data.length : 0, 'events from database');
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

  // Handle image upload (convert to base64)
  const handleImageUpload = (file: File, type: 'card' | 'hero') => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }
    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === 'card') {
        setCardImagePreview(result);
        setFormData({ ...formData, image_url: result });
      } else {
        setHeroImagePreview(result);
        setFormData({ ...formData, hero_image_url: result });
      }
      toast.success(`${type === 'card' ? 'Card' : 'Hero'} image uploaded successfully`);
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent, type: 'card' | 'hero') => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedImageType(type);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedImageType(null);
  };

  const handleDrop = (e: React.DragEvent, type: 'card' | 'hero') => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedImageType(null);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file, type);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'card' | 'hero') => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, type);
    }
  };

  // Clear image
  const clearImage = (type: 'card' | 'hero') => {
    if (type === 'card') {
      setCardImagePreview(null);
      setFormData({ ...formData, image_url: '' });
    } else {
      setHeroImagePreview(null);
      setFormData({ ...formData, hero_image_url: '' });
    }
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
        age_group: event.age_group || '',
        whats_included: event.whats_included || '',
      });
      // Set preview images
      setCardImagePreview(event.image_url || null);
      setHeroImagePreview(event.hero_image_url || null);
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
        age_group: '',
        whats_included: '',
      });
      // Clear preview images
      setCardImagePreview(null);
      setHeroImagePreview(null);
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
      console.log('📝 Submitting event form:', { editingEvent: editingEvent?.id, formData });
      
      // Format date to YYYY-MM-DD (remove time if present)
      const formattedDate = formData.date ? formData.date.split('T')[0] : formData.date;
      
      const eventData: CreateEventData = {
        name: formData.name.trim(),
        description: formData.description.trim() || '',
        date: formattedDate,
        time: formData.time,
        max_players: formData.max_players,
        price: formData.price,
        location: formData.location.trim() || '',
        image_url: formData.image_url?.trim() || undefined,
        hero_image_url: formData.hero_image_url?.trim() || undefined,
        age_group: formData.age_group?.trim() || undefined,
        whats_included: formData.whats_included?.trim() || undefined,
      };

      console.log('📤 Sending event data:', eventData);

      if (editingEvent) {
        console.log('🔄 Updating event ID:', editingEvent.id);
        await updateEvent(editingEvent.id, eventData);
        toast.success('Event updated successfully!');
      } else {
        console.log('➕ Creating new event');
        await createEvent(eventData);
        toast.success('Event created successfully!');
      }
      
      handleCloseDialog();
      await loadEvents();
    } catch (err: any) {
      console.error('❌ Error saving event:', err);
      console.error('Error details:', {
        message: err?.message,
        stack: err?.stack,
        response: err?.response,
      });
      const errorMessage = err?.message || err?.toString() || 'Failed to save event';
      toast.error(`Error: ${errorMessage}`);
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

  const handleHardDeleteClick = (event: Event) => {
    setEventToHardDelete(event);
    setIsHardDeleteDialogOpen(true);
  };

  const handleTestEmailClick = (event: Event) => {
    setEventToTestEmail(event);
    setTestEmailAddress('');
    setIsTestEmailDialogOpen(true);
  };

  const handleTestEmailConfirm = async () => {
    if (!eventToTestEmail || !testEmailAddress.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmailAddress.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSendingTestEmail(true);
    try {
      const result = await sendTestEmail(eventToTestEmail.id, testEmailAddress.trim());
      if (result.success) {
        toast.success(`Test email sent successfully to ${testEmailAddress.trim()}`);
        setIsTestEmailDialogOpen(false);
        setEventToTestEmail(null);
        setTestEmailAddress('');
      } else {
        toast.error(result.message || 'Failed to send test email');
      }
    } catch (err: any) {
      console.error('Error sending test email:', err);
      toast.error(err.message || 'Failed to send test email');
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const handleHardDeleteConfirm = async () => {
    if (!eventToHardDelete) return;
    
    try {
      await hardDeleteEvent(eventToHardDelete.id);
      toast.success('Event permanently deleted.');
      setIsHardDeleteDialogOpen(false);
      setEventToHardDelete(null);
      loadEvents();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete event');
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

            {/* Image Upload Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card Image Upload */}
              <div>
                <label className="text-sm font-medium mb-2 block">Card Image</label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer ${
                    draggedImageType === 'card'
                      ? 'border-[#e0cb23] bg-[#e0cb23]/10'
                      : 'border-gray-300 hover:border-[#e0cb23]'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDragOver(e, 'card');
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDragLeave(e);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDrop(e, 'card');
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('card-image-input')?.click();
                  }}
                >
                  {cardImagePreview || formData.image_url ? (
                    <div className="relative">
                      <img
                        src={cardImagePreview || formData.image_url || ''}
                        alt="Card preview"
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearImage('card');
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">Drag & drop or click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">Image shown on event cards (max 10MB)</p>
                    </div>
                  )}
                  <input
                    id="card-image-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileInputChange(e, 'card')}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Hero Image Upload */}
              <div>
                <label className="text-sm font-medium mb-2 block">Hero Image</label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer ${
                    draggedImageType === 'hero'
                      ? 'border-[#e0cb23] bg-[#e0cb23]/10'
                      : 'border-gray-300 hover:border-[#e0cb23]'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDragOver(e, 'hero');
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDragLeave(e);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDrop(e, 'hero');
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('hero-image-input')?.click();
                  }}
                >
                  {heroImagePreview || formData.hero_image_url ? (
                    <div className="relative">
                      <img
                        src={heroImagePreview || formData.hero_image_url || ''}
                        alt="Hero preview"
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearImage('hero');
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">Drag & drop or click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">Large image for event details (max 10MB)</p>
                    </div>
                  )}
                  <input
                    id="hero-image-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileInputChange(e, 'hero')}
                    className="hidden"
                  />
                </div>
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
                      <label className="text-sm font-medium mb-1 block">Age Group</label>
                      <Input
                        value={formData.age_group}
                        onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
                        placeholder="e.g., All ages welcome, Beginner to Advanced levels"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">What's Included</label>
                    <Textarea
                      value={formData.whats_included}
                      onChange={(e) => setFormData({ ...formData, whats_included: e.target.value })}
                      placeholder="e.g., Equipment and refreshments"
                      rows={3}
                    />
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

      {/* Permanent Delete Confirmation Dialog */}
      <AlertDialog open={isHardDeleteDialogOpen} onOpenChange={setIsHardDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border border-red-300 shadow-2xl z-[999]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-red-600">
              ⚠️ Permanently Delete Event?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 mt-2">
              Are you sure you want to permanently delete "<span className="font-semibold text-gray-800">{eventToHardDelete?.name}</span>"?
              <br /><br />
              <span className="text-red-600 font-semibold">This action cannot be undone.</span> The event and all associated data will be permanently removed from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel 
              onClick={() => setEventToHardDelete(null)}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleHardDeleteConfirm} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Test Email Dialog */}
      <AlertDialog open={isTestEmailDialogOpen} onOpenChange={setIsTestEmailDialogOpen}>
        <AlertDialogContent className="bg-white border border-blue-300 shadow-2xl z-[999] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-blue-600">
              📧 Send Test Email
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 mt-2">
              Send a test booking confirmation email for "<span className="font-semibold text-gray-800">{eventToTestEmail?.name}</span>"
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Email Address
            </label>
            <Input
              type="email"
              value={testEmailAddress}
              onChange={(e) => setTestEmailAddress(e.target.value)}
              placeholder="test@example.com"
              className="w-full"
              disabled={isSendingTestEmail}
            />
            <p className="text-xs text-gray-500 mt-2">
              The email will include the session availability message: "For session availability, AJH Sports will contact you soon"
            </p>
          </div>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel 
              onClick={() => {
                setIsTestEmailDialogOpen(false);
                setEventToTestEmail(null);
                setTestEmailAddress('');
              }}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
              disabled={isSendingTestEmail}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleTestEmailConfirm} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSendingTestEmail || !testEmailAddress.trim()}
            >
              {isSendingTestEmail ? 'Sending...' : 'Send Test Email'}
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
                  <div className="flex flex-col gap-2">
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleHardDeleteClick(event)}
                      className="px-2 text-xs border-red-300 text-red-600 hover:bg-red-50"
                            title="Permanently delete event"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestEmailClick(event)}
                      className="w-full text-xs border-blue-300 text-blue-600 hover:bg-blue-50"
                      title="Send test booking confirmation email"
                    >
                      📧 Test Email
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


















