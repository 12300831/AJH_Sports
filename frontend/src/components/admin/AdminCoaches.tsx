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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../ui/tabs';
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
  getCoaches,
  createCoach,
  updateCoach,
  deleteCoach,
  hardDeleteCoach,
  type Coach,
  type CreateCoachData,
} from '../../services/adminService';
import { AdminLayout } from './AdminLayout';
import { AdminLessons } from './AdminLessons';
import { toast } from 'sonner';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player' | 'payment' | 'paymentSuccess' | 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

type AdminPage = 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

interface AdminCoachesProps {
  onNavigate: (page: AdminPage) => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function AdminCoaches({ onNavigate }: AdminCoachesProps) {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHardDeleteDialogOpen, setIsHardDeleteDialogOpen] = useState(false);
  const [coachToDelete, setCoachToDelete] = useState<Coach | null>(null);
  const [coachToHardDelete, setCoachToHardDelete] = useState<Coach | null>(null);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [formData, setFormData] = useState<CreateCoachData>({
    name: '',
    specialty: '',
    email: '',
    phone: '',
    location: '',
    availability: [],
    hourly_rate: 0,
    allowed_durations: [60],
    status: 'active',
    image_url: '',
  });
  // Pattern-based availability (day of week)
  const [availabilityDay, setAvailabilityDay] = useState('');
  const [availabilityStart, setAvailabilityStart] = useState('');
  const [availabilityEnd, setAvailabilityEnd] = useState('');
  const [availabilityStartDate, setAvailabilityStartDate] = useState(''); // Optional: start date for availability range
  const [availabilityEndDate, setAvailabilityEndDate] = useState(''); // Optional: end date for availability range
  
  // Date-specific availability
  const [availabilityMode, setAvailabilityMode] = useState<'pattern' | 'dates'>('pattern');
  const [specificDate, setSpecificDate] = useState('');
  const [specificDateStart, setSpecificDateStart] = useState('');
  const [specificDateEnd, setSpecificDateEnd] = useState('');
  const [bulkStartDate, setBulkStartDate] = useState('');
  const [bulkEndDate, setBulkEndDate] = useState('');
  const [bulkSelectedDays, setBulkSelectedDays] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    loadCoaches();
  }, []);

  const loadCoaches = async () => {
    try {
      setLoading(true);
      const data = await getCoaches();
      // Ensure data is an array
      if (Array.isArray(data)) {
        // Show all coaches
        setCoaches(data);
      } else {
        console.error('getCoaches returned non-array:', data);
        setCoaches([]);
        toast.error('Invalid coaches data received');
      }
    } catch (error: any) {
      console.error('Error loading coaches:', error);
      setCoaches([]);
      toast.error(error.message || 'Failed to load coaches');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Coach name is required';
    }
    if (formData.hourly_rate < 0) {
      errors.hourly_rate = 'Hourly rate cannot be negative';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenDialog = (coach?: Coach) => {
    if (coach) {
      setEditingCoach(coach);
      let availability: any[] = [];
      if (Array.isArray(coach.availability)) {
        availability = coach.availability;
      } else if (typeof coach.availability === 'string' && coach.availability.trim() !== '') {
        try {
          availability = JSON.parse(coach.availability);
        } catch (e) {
          availability = [];
        }
      }
      // Parse allowed_durations
      let allowedDurations = [60];
      if (coach.allowed_durations) {
        try {
          if (typeof coach.allowed_durations === 'string') {
            allowedDurations = JSON.parse(coach.allowed_durations);
          } else if (Array.isArray(coach.allowed_durations)) {
            allowedDurations = coach.allowed_durations;
          }
        } catch (e) {
          console.error('Error parsing allowed_durations:', e);
        }
      }

      setFormData({
        name: coach.name,
        specialty: coach.specialty || '',
        email: coach.email || '',
        phone: coach.phone || '',
        location: coach.location || '',
        availability: availability,
        hourly_rate: coach.hourly_rate,
        allowed_durations: allowedDurations,
        status: coach.status || 'active',
        image_url: coach.image_url || '',
        linkedin_url: coach.linkedin_url || '',
        twitter_url: coach.twitter_url || '',
        instagram_url: coach.instagram_url || '',
        facebook_url: coach.facebook_url || '',
      });
      setImagePreview(coach.image_url || null);
    } else {
      setEditingCoach(null);
      setFormData({
        name: '',
        specialty: '',
        email: '',
        phone: '',
        location: '',
        availability: [],
        hourly_rate: 0,
        allowed_durations: [60],
        status: 'active',
        image_url: '',
      });
      setImagePreview(null);
    }
    setAvailabilityDay('');
    setAvailabilityStart('');
    setAvailabilityEnd('');
    setAvailabilityStartDate('');
    setAvailabilityEndDate('');
    setSpecificDate('');
    setBulkStartDate('');
    setBulkEndDate('');
    setBulkSelectedDays([]);
    setAvailabilityMode('pattern');
    setFormErrors({});
    setIsDraggedOver(false);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCoach(null);
    setAvailabilityDay('');
    setAvailabilityStart('');
    setAvailabilityEnd('');
    setAvailabilityStartDate('');
    setAvailabilityEndDate('');
    setSpecificDate('');
    setBulkStartDate('');
    setBulkEndDate('');
    setBulkSelectedDays([]);
    setAvailabilityMode('pattern');
    setFormErrors({});
    setImagePreview(null);
    setIsDraggedOver(false);
  };

  const addAvailability = () => {
    if (!availabilityDay || !availabilityStart || !availabilityEnd) {
      toast.error('Please fill in all availability fields (day, start time, and end time)');
      return;
    }
    
    // Validate date range if provided
    if (availabilityStartDate && availabilityEndDate) {
      if (new Date(availabilityStartDate) > new Date(availabilityEndDate)) {
        toast.error('Start date must be before or equal to end date');
        return;
      }
    }

    // Check if start time is before end time
    if (availabilityStart >= availabilityEnd) {
      toast.error('Start time must be before end time');
      return;
    }

    // Create availability object with optional date range
    const newAvailability: any = {
      type: 'pattern',
      day: availabilityDay,
      start: availabilityStart,
      end: availabilityEnd
    };

    // Add date range if provided
    if (availabilityStartDate) {
      newAvailability.startDate = availabilityStartDate;
    }
    if (availabilityEndDate) {
      newAvailability.endDate = availabilityEndDate;
    }

    // Check if this day/time slot already exists (ignoring date ranges for duplicate check)
    const exists = formData.availability.some(
      av => av.type === 'pattern' && av.day === availabilityDay && av.start === availabilityStart && av.end === availabilityEnd
    );
    
    if (exists) {
      toast.error('This availability slot already exists');
      return;
    }

    setFormData({
      ...formData,
      availability: [
        ...formData.availability,
        newAvailability,
      ],
    });
    setAvailabilityDay('');
    setAvailabilityStart('');
    setAvailabilityEnd('');
    setAvailabilityStartDate('');
    setAvailabilityEndDate('');
    toast.success('Availability slot added');
  };

  const addSpecificDate = () => {
    if (!specificDate || !specificDateStart || !specificDateEnd) {
      toast.error('Please fill in date, start time, and end time');
      return;
    }

    if (specificDateStart >= specificDateEnd) {
      toast.error('Start time must be before end time');
      return;
    }

    // Check if this date/time already exists
    const exists = formData.availability.some(
      av => av.type === 'date' && av.date === specificDate && av.start === specificDateStart && av.end === specificDateEnd
    );

    if (exists) {
      toast.error('This date and time slot already exists');
      return;
    }

    const newAvailability: any = {
      type: 'date',
      date: specificDate,
      start: specificDateStart,
      end: specificDateEnd
    };

    setFormData({
      ...formData,
      availability: [
        ...formData.availability,
        newAvailability,
      ],
    });
    setSpecificDate('');
    toast.success('Date added');
  };

  const addBulkDates = () => {
    if (!bulkStartDate || !bulkEndDate || !specificDateStart || !specificDateEnd) {
      toast.error('Please fill in start date, end date, and time range');
      return;
    }

    if (new Date(bulkStartDate) > new Date(bulkEndDate)) {
      toast.error('Start date must be before or equal to end date');
      return;
    }

    if (specificDateStart >= specificDateEnd) {
      toast.error('Start time must be before end time');
      return;
    }

    const start = new Date(bulkStartDate);
    const end = new Date(bulkEndDate);
    const newAvailabilities: any[] = [];
    const existingDates = formData.availability
      .filter(av => av.type === 'date')
      .map(av => `${av.date}_${av.start}_${av.end}`);

    // Generate all dates in range
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-AU', { weekday: 'long' });

      // If days are selected, only add matching days
      if (bulkSelectedDays.length > 0 && !bulkSelectedDays.includes(dayName)) {
        continue;
      }

      // Check if this date/time combination already exists
      const key = `${dateStr}_${specificDateStart}_${specificDateEnd}`;
      if (!existingDates.includes(key)) {
        newAvailabilities.push({
          type: 'date',
          date: dateStr,
          start: specificDateStart,
          end: specificDateEnd
        });
      }
    }

    if (newAvailabilities.length === 0) {
      toast.info('No new dates to add (all dates already exist)');
      return;
    }

    setFormData({
      ...formData,
      availability: [
        ...formData.availability,
        ...newAvailabilities,
      ],
    });
    setBulkStartDate('');
    setBulkEndDate('');
    setBulkSelectedDays([]);
    toast.success(`Added ${newAvailabilities.length} date(s)`);
  };

  const removeAvailability = (index: number) => {
    setFormData({
      ...formData,
      availability: formData.availability.filter((_, i) => i !== index),
    });
  };

  // Handle image upload (convert to base64)
  const handleImageUpload = (file: File) => {
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
      setImagePreview(result);
      setFormData({ ...formData, image_url: result });
      toast.success('Image uploaded successfully');
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggedOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggedOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggedOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Clear image
  const handleClearImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, image_url: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
        const coachData: CreateCoachData = {
          ...formData,
          image_url: formData.image_url?.trim() || undefined,
          linkedin_url: formData.linkedin_url?.trim() || undefined,
          twitter_url: formData.twitter_url?.trim() || undefined,
          instagram_url: formData.instagram_url?.trim() || undefined,
          facebook_url: formData.facebook_url?.trim() || undefined,
        };
      
      console.log('📝 Submitting coach form:', { editingCoach: editingCoach?.id, coachData });
      
      if (editingCoach) {
        console.log('🔄 Updating coach ID:', editingCoach.id);
        await updateCoach(editingCoach.id, coachData);
        toast.success('Coach updated successfully!');
      } else {
        console.log('➕ Creating new coach');
        await createCoach(coachData);
        toast.success('Coach created successfully!');
      }
      
      handleCloseDialog();
      await loadCoaches();
    } catch (error: any) {
      console.error('❌ Error saving coach:', error);
      console.error('Error details:', {
        message: error?.message,
        stack: error?.stack,
        response: error?.response,
      });
      const errorMessage = error?.message || error?.toString() || 'Failed to save coach';
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const handleDeleteClick = async (coach: Coach) => {
    // If coach is already inactive, restore it immediately
    if (coach.status === 'inactive') {
      try {
        await updateCoach(coach.id, { ...coach, status: 'active' });
        toast.success('Coach unarchived successfully! It will now appear on the public site.');
        // Update the coach status in the local state immediately
        setCoaches(prevCoaches => 
          prevCoaches.map(c => 
            c.id === coach.id 
              ? { ...c, status: 'active' as const }
              : c
          )
        );
        loadCoaches();
      } catch (error: any) {
        toast.error(error.message || 'Failed to restore coach');
      }
    } else {
      // If coach is active, show archive confirmation dialog
      setCoachToDelete(coach);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!coachToDelete) return;
    
    try {
      await deleteCoach(coachToDelete.id);
      toast.success('Coach archived successfully! It will no longer appear on the public site.');
      setIsDeleteDialogOpen(false);
      // Update the coach status in the local state immediately
      setCoaches(prevCoaches => 
        prevCoaches.map(coach => 
          coach.id === coachToDelete.id 
            ? { ...coach, status: 'inactive' as const }
            : coach
        )
      );
      setCoachToDelete(null);
      // Also reload from server to ensure consistency
      loadCoaches();
    } catch (error: any) {
      toast.error(error.message || 'Failed to archive coach');
    }
  };

  const handleHardDeleteClick = (coach: Coach) => {
    setCoachToHardDelete(coach);
    setIsHardDeleteDialogOpen(true);
  };

  const handleHardDeleteConfirm = async () => {
    if (!coachToHardDelete) return;
    
    try {
      await hardDeleteCoach(coachToHardDelete.id);
      toast.success('Coach permanently deleted.');
      setIsHardDeleteDialogOpen(false);
      setCoachToHardDelete(null);
      loadCoaches();
    } catch (error: any) {
      toast.error(error.message || 'Failed to permanently delete coach');
    }
  };

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handlePageNavigate = (page: Page) => {
    window.location.href = '/';
  };

  return (
    <AdminLayout
      title="Manage Coaches"
      description="Create, edit, and delete coaches"
      currentPage="adminCoaches"
      onNavigate={handlePageNavigate}
      onAdminNavigate={onNavigate}
      headerAction={
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#e0cb23] text-[#030213] hover:bg-[#d4ba1f] font-semibold"
        >
          + Add New Coach
        </Button>
      }
    >
      <Tabs defaultValue="coaches" className="space-y-4">
        <TabsList>
          <TabsTrigger value="coaches">
            Coaches ({coaches.length})
          </TabsTrigger>
          <TabsTrigger value="lessons">
            Lessons
          </TabsTrigger>
        </TabsList>

        <TabsContent value="coaches">
          <div>
            {loading ? (
              <div className="text-center py-12">
                <div className="text-lg text-gray-600">Loading coaches...</div>
              </div>
            ) : coaches.length === 0 ? (
              <Card className="border-2 border-dashed">
                <CardContent className="py-16 text-center">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No coaches yet</h3>
                  <p className="text-gray-500 mb-6">Get started by adding your first coach</p>
                  <Button
                    onClick={() => handleOpenDialog()}
                    className="bg-[#e0cb23] text-[#030213] hover:bg-[#d4ba1f] font-semibold"
                  >
                    + Add Your First Coach
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <div className="text-sm text-gray-600 mb-1">Total Coaches</div>
                  <div className="text-2xl font-bold text-[#030213]">{coaches.length}</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="text-sm text-gray-600 mb-1">Active Coaches</div>
                  <div className="text-2xl font-bold text-[#030213]">
                    {coaches.filter(c => c.status === 'active').length}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="pt-4">
                  <div className="text-sm text-gray-600 mb-1">Avg. Hourly Rate</div>
                  <div className="text-2xl font-bold text-[#030213]">
                    ${coaches.length > 0 
                      ? (coaches.reduce((sum, c) => sum + parseFloat(c.hourly_rate?.toString() || '0'), 0) / coaches.length).toFixed(2)
                      : '0.00'}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-4">
                  <div className="text-sm text-gray-600 mb-1">Total Availability Slots</div>
                  <div className="text-2xl font-bold text-[#030213]">
                    {coaches.reduce((sum, c) => {
                      let av: any[] = [];
                      if (Array.isArray(c.availability)) {
                        av = c.availability;
                      } else if (typeof c.availability === 'string' && c.availability.trim() !== '') {
                        try {
                          av = JSON.parse(c.availability);
                        } catch (e) {
                          av = [];
                        }
                      }
                      return sum + av.length;
                    }, 0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coaches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {coaches.map((coach) => {
                let availability: any[] = [];
                if (Array.isArray(coach.availability)) {
                  availability = coach.availability;
                } else if (typeof coach.availability === 'string' && coach.availability.trim() !== '') {
                  try {
                    availability = JSON.parse(coach.availability);
                  } catch (e) {
                    // If parsing fails, it's a plain string - set empty array
                    availability = [];
                  }
                }
                return (
                  <Card
                    key={coach.id}
                    className="bg-white rounded-[24px] overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Photo */}
                    <div className="relative w-full h-[240px] rounded-t-[24px] overflow-hidden bg-gradient-to-br from-[#030213] to-[#1a1a2e]">
                      {coach.image_url ? (
                        <img
                          src={coach.image_url}
                          alt={coach.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl text-white opacity-50">👤</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDialog(coach);
                          }}
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-[#030213]"
                          title="Edit coach"
                        >
                          ✏️
                        </Button>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadgeColor(coach.status)}`}>
                          {coach.status || 'active'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-6">
                      {/* Name + Specialty */}
                      <div className="text-center mb-3">
                        <p className="text-base font-semibold text-black mb-1">{coach.name}</p>
                        <p className="text-sm text-gray-600">{coach.specialty || 'Coach'}</p>
                      </div>

                      {/* Contact Info */}
                      {(coach.email || coach.phone) && (
                        <div className="mb-3 space-y-1 text-xs text-gray-600">
                          {coach.email && (
                            <div className="flex items-center gap-1">
                              <span>📧</span>
                              <span className="truncate">{coach.email}</span>
                            </div>
                          )}
                          {coach.phone && (
                            <div className="flex items-center gap-1">
                              <span>📞</span>
                              <span>{coach.phone}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Rate */}
                      <div className="text-center mb-3 pb-3 border-b border-gray-100">
                        <p className="text-lg font-bold text-[#030213]">
                          ${parseFloat(coach.hourly_rate?.toString() || '0').toFixed(2)}/hr
                        </p>
                      </div>

                      {/* Availability Preview */}
                      {availability.length > 0 && (
                        <div className="mb-4 text-xs text-gray-600">
                          <div className="font-medium mb-2 text-gray-700">Availability:</div>
                          <div className="space-y-1 max-h-24 overflow-y-auto">
                            {availability.slice(0, 3).map((av: any, idx: number) => (
                              <div key={idx} className="truncate">
                                <span className="font-medium">{av.day}:</span> {av.start} - {av.end}
                              </div>
                            ))}
                            {availability.length > 3 && (
                              <div className="text-gray-400 italic">+{availability.length - 3} more</div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(coach)}
                          className="flex-1 border-[#030213] text-[#030213] hover:bg-[#030213] hover:text-white"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(coach)}
                          className={`flex-1 ${
                            coach.status === 'inactive' 
                              ? 'border-green-300 text-green-700 hover:bg-green-50' 
                              : 'border-orange-300 text-orange-700 hover:bg-orange-50'
                          }`}
                        >
                          {coach.status === 'inactive' ? 'Unarchive' : 'Archive'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleHardDeleteClick(coach)}
                          className="px-2 border-red-300 text-red-600 hover:bg-red-50"
                          title="Permanently delete coach"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="lessons">
          <AdminLessons />
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingCoach ? 'Edit Coach' : 'Create New Coach'}
            </DialogTitle>
            <DialogDescription>
              {editingCoach ? 'Update the coach details below' : 'Fill in all the details to create a new coach'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4" onClick={(e) => e.stopPropagation()}>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Coach Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                }}
                required
                placeholder="e.g., John Doe"
                className={formErrors.name ? 'border-red-500' : ''}
              />
              {formErrors.name && (
                <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
              )}
            </div>

            {/* Coach Image Upload */}
            <div>
              <label className="text-sm font-medium mb-2 block">Coach Photo</label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer ${
                  isDraggedOver
                    ? 'border-[#e0cb23] bg-[#e0cb23]/10'
                    : 'border-gray-300 hover:border-[#e0cb23]'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDragOver(e);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDragLeave(e);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDrop(e);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById('coach-image-input')?.click();
                }}
              >
                {imagePreview || formData.image_url ? (
                  <div className="relative">
                    <img
                      src={imagePreview || formData.image_url || ''}
                      alt="Coach preview"
                      className="w-full h-48 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearImage();
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">Drag & drop or click to upload</p>
                    <p className="text-xs text-gray-500 mt-1">Coach photo (max 10MB)</p>
                  </div>
                )}
                <input
                  id="coach-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Specialty</label>
                <Input
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="e.g., Tennis, Table Tennis"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                  }}
                  placeholder="coach@example.com"
                  className={formErrors.email ? 'border-red-500' : ''}
                />
                {formErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Phone</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+61 4XX XXX XXX"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Location</label>
                <Input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., AJH Sportscentre, Sydney"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Hourly Rate (AUD) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.hourly_rate}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setFormData({ ...formData, hourly_rate: value });
                  if (formErrors.hourly_rate) setFormErrors({ ...formErrors, hourly_rate: '' });
                }}
                required
                min="0"
                placeholder="0.00"
                className={formErrors.hourly_rate ? 'border-red-500' : ''}
              />
              {formErrors.hourly_rate && (
                <p className="text-xs text-red-500 mt-1">{formErrors.hourly_rate}</p>
              )}
            </div>


            {/* Social Media Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#030213]">Social Media Links</h3>
              
              <div>
                <label className="text-sm font-medium mb-1 block">LinkedIn URL</label>
                <Input
                  id="linkedin-url"
                  type="url"
                  value={formData.linkedin_url || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Twitter/X URL</label>
                <Input
                  id="twitter-url"
                  type="url"
                  value={formData.twitter_url || ''}
                  onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                  placeholder="https://twitter.com/username or https://x.com/username"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Instagram URL</label>
                <Input
                  id="instagram-url"
                  type="url"
                  value={formData.instagram_url || ''}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Facebook URL</label>
                <Input
                  id="facebook-url"
                  type="url"
                  value={formData.facebook_url || ''}
                  onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                  placeholder="https://facebook.com/username"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-3 block">Availability Settings</label>
                <p className="text-xs text-gray-500 mb-4">Set when this coach is available for bookings</p>
              </div>

              {/* Use Tabs for better organization */}
              <Tabs value={availabilityMode} onValueChange={(v) => setAvailabilityMode(v as 'pattern' | 'dates')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pattern">Day Pattern</TabsTrigger>
                  <TabsTrigger value="dates">Specific Dates</TabsTrigger>
                </TabsList>

                <TabsContent value="pattern" className="space-y-4 mt-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900 mb-1">Day Pattern Mode</p>
                    <p className="text-xs text-blue-700">Set recurring availability by day of week (e.g., Every Monday 9 AM - 5 PM)</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Day & Time</label>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">Day of Week</label>
                          <select
                            value={availabilityDay}
                            onChange={(e) => setAvailabilityDay(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm"
                          >
                            <option value="">Select day...</option>
                            {DAYS_OF_WEEK.map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">Start Time</label>
                          <Input
                            type="time"
                            value={availabilityStart}
                            onChange={(e) => setAvailabilityStart(e.target.value)}
                            className="h-10"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">End Time</label>
                          <Input
                            type="time"
                            value={availabilityEnd}
                            onChange={(e) => setAvailabilityEnd(e.target.value)}
                            className="h-10"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-3">
                      <label className="text-sm font-medium mb-2 block">Date Range (Optional)</label>
                      <p className="text-xs text-gray-500 mb-2">Limit this pattern to a specific date range</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">From Date</label>
                          <Input
                            type="date"
                            value={availabilityStartDate}
                            onChange={(e) => setAvailabilityStartDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="h-10"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">To Date</label>
                          <Input
                            type="date"
                            value={availabilityEndDate}
                            onChange={(e) => setAvailabilityEndDate(e.target.value)}
                            min={availabilityStartDate || new Date().toISOString().split('T')[0]}
                            className="h-10"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Leave empty for ongoing availability</p>
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addAvailability();
                      }}
                      className="w-full cursor-pointer"
                      disabled={!availabilityDay || !availabilityStart || !availabilityEnd}
                    >
                      + Add Day Pattern
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="dates" className="space-y-4 mt-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-900 mb-1">Specific Dates Mode</p>
                    <p className="text-xs text-green-700">Set availability for individual dates or bulk add date ranges</p>
                  </div>

                  {/* Single Date */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <label className="text-sm font-medium mb-3 block">Add Single Date</label>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">Date</label>
                          <Input
                            type="date"
                            value={specificDate}
                            onChange={(e) => setSpecificDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="h-10"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">Start Time</label>
                          <Input
                            type="time"
                            value={specificDateStart}
                            onChange={(e) => setSpecificDateStart(e.target.value)}
                            className="h-10"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">End Time</label>
                          <Input
                            type="time"
                            value={specificDateEnd}
                            onChange={(e) => setSpecificDateEnd(e.target.value)}
                            className="h-10"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addSpecificDate();
                        }}
                        className="w-full cursor-pointer"
                        disabled={!specificDate || !specificDateStart || !specificDateEnd}
                      >
                        + Add This Date
                      </Button>
                    </div>
                  </div>

                  {/* Bulk Date Range */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <label className="text-sm font-medium mb-3 block">Bulk Add Date Range</label>
                    <p className="text-xs text-gray-500 mb-3">Add multiple dates at once (e.g., entire month)</p>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">Start Date</label>
                          <Input
                            type="date"
                            value={bulkStartDate}
                            onChange={(e) => setBulkStartDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="h-10"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">End Date</label>
                          <Input
                            type="date"
                            value={bulkEndDate}
                            onChange={(e) => setBulkEndDate(e.target.value)}
                            min={bulkStartDate || new Date().toISOString().split('T')[0]}
                            className="h-10"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Time Range</label>
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            type="time"
                            value={specificDateStart}
                            onChange={(e) => setSpecificDateStart(e.target.value)}
                            className="h-10"
                          />
                          <Input
                            type="time"
                            value={specificDateEnd}
                            onChange={(e) => setSpecificDateEnd(e.target.value)}
                            className="h-10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-600 mb-2 block">Filter by Days (Optional)</label>
                        <div className="flex flex-wrap gap-2 p-2 bg-white rounded border">
                          {DAYS_OF_WEEK.map((day) => (
                            <label key={day} className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-100">
                              <input
                                type="checkbox"
                                checked={bulkSelectedDays.includes(day)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setBulkSelectedDays([...bulkSelectedDays, day]);
                                  } else {
                                    setBulkSelectedDays(bulkSelectedDays.filter(d => d !== day));
                                  }
                                }}
                                className="w-4 h-4 text-[#030213]"
                              />
                              <span className="text-xs font-medium">{day.substring(0, 3)}</span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {bulkSelectedDays.length === 0 
                            ? 'All days in range will be added' 
                            : `Only ${bulkSelectedDays.join(', ')} will be added`}
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addBulkDates();
                        }}
                        className="w-full cursor-pointer"
                        disabled={!bulkStartDate || !bulkEndDate || !specificDateStart || !specificDateEnd}
                      >
                        + Add All Dates in Range
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Display All Availability - Better organized */}
              {formData.availability.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold">Current Availability ({formData.availability.length})</label>
                    <span className="text-xs text-gray-500">Click remove to delete</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                    {formData.availability.map((av: any, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded border hover:border-[#030213] transition-colors"
                      >
                        <div className="flex-1">
                          {av.type === 'date' ? (
                            <div>
                              <span className="font-medium text-sm">{new Date(av.date).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                              <span className="text-gray-600 ml-2 text-sm">{av.start} - {av.end}</span>
                              <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">Specific Date</span>
                            </div>
                          ) : (
                            <div>
                              <span className="font-medium text-sm">{av.day}</span>
                              <span className="text-gray-600 ml-2 text-sm">{av.start} - {av.end}</span>
                              {av.startDate || av.endDate ? (
                                <span className="text-gray-500 ml-2 text-xs">
                                  ({av.startDate || 'ongoing'} to {av.endDate || 'ongoing'})
                                </span>
                              ) : (
                                <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">Ongoing</span>
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAvailability(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                {editingCoach ? 'Update Coach' : 'Create Coach'}
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
              Archive Coach?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 mt-2">
              This will archive "<span className="font-semibold text-gray-800">{coachToDelete?.name}</span>" and hide them from the public coaches page. 
              The coach will remain visible in admin with "Inactive" status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel 
              onClick={() => setCoachToDelete(null)}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Archive Coach
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Confirmation Dialog */}
      <AlertDialog open={isHardDeleteDialogOpen} onOpenChange={setIsHardDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border border-red-300 shadow-2xl z-[999]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-red-600">
              ⚠️ Permanently Delete Coach?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 mt-2">
              Are you sure you want to permanently delete "<span className="font-semibold text-gray-800">{coachToHardDelete?.name}</span>"?
              <br /><br />
              <span className="text-red-600 font-semibold">This action cannot be undone.</span> The coach and all associated data will be permanently removed from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel 
              onClick={() => setCoachToHardDelete(null)}
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
    </AdminLayout>
  );
}
