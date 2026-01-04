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
  type Coach,
  type CreateCoachData,
} from '../../services/adminService';
import { AdminLayout } from './AdminLayout';
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
  const [coachToDelete, setCoachToDelete] = useState<Coach | null>(null);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [formData, setFormData] = useState<CreateCoachData>({
    name: '',
    specialty: '',
    email: '',
    phone: '',
    availability: [],
    hourly_rate: 0,
    status: 'active',
  });
  const [availabilityDay, setAvailabilityDay] = useState('');
  const [availabilityStart, setAvailabilityStart] = useState('');
  const [availabilityEnd, setAvailabilityEnd] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCoaches();
  }, []);

  const loadCoaches = async () => {
    try {
      setLoading(true);
      const data = await getCoaches();
      setCoaches(data);
    } catch (error: any) {
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
      const availability = Array.isArray(coach.availability) 
        ? coach.availability 
        : typeof coach.availability === 'string' 
          ? JSON.parse(coach.availability) 
          : [];
      setFormData({
        name: coach.name,
        specialty: coach.specialty || '',
        email: coach.email || '',
        phone: coach.phone || '',
        availability: availability,
        hourly_rate: coach.hourly_rate,
        status: coach.status || 'active',
      });
    } else {
      setEditingCoach(null);
      setFormData({
        name: '',
        specialty: '',
        email: '',
        phone: '',
        availability: [],
        hourly_rate: 0,
        status: 'active',
      });
    }
    setAvailabilityDay('');
    setAvailabilityStart('');
    setAvailabilityEnd('');
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCoach(null);
    setAvailabilityDay('');
    setAvailabilityStart('');
    setAvailabilityEnd('');
    setFormErrors({});
  };

  const addAvailability = () => {
    if (!availabilityDay || !availabilityStart || !availabilityEnd) {
      toast.error('Please fill in all availability fields (day, start time, and end time)');
      return;
    }
    
    // Check if this day/time slot already exists
    const exists = formData.availability.some(
      av => av.day === availabilityDay && av.start === availabilityStart && av.end === availabilityEnd
    );
    
    if (exists) {
      toast.error('This availability slot already exists');
      return;
    }

    // Check if start time is before end time
    if (availabilityStart >= availabilityEnd) {
      toast.error('Start time must be before end time');
      return;
    }

    setFormData({
      ...formData,
      availability: [
        ...formData.availability,
        { day: availabilityDay, start: availabilityStart, end: availabilityEnd },
      ],
    });
    setAvailabilityDay('');
    setAvailabilityStart('');
    setAvailabilityEnd('');
    toast.success('Availability slot added');
  };

  const removeAvailability = (index: number) => {
    setFormData({
      ...formData,
      availability: formData.availability.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      if (editingCoach) {
        await updateCoach(editingCoach.id, formData);
        toast.success('Coach updated successfully!');
      } else {
        await createCoach(formData);
        toast.success('Coach created successfully!');
      }
      handleCloseDialog();
      loadCoaches();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save coach');
    }
  };

  const handleDeleteClick = (coach: Coach) => {
    setCoachToDelete(coach);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!coachToDelete) return;
    
    try {
      await deleteCoach(coachToDelete.id);
      toast.success('Coach deleted successfully!');
      setIsDeleteDialogOpen(false);
      setCoachToDelete(null);
      loadCoaches();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete coach');
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
                      ? (coaches.reduce((sum, c) => sum + c.hourly_rate, 0) / coaches.length).toFixed(2)
                      : '0.00'}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-4">
                  <div className="text-sm text-gray-600 mb-1">Total Availability Slots</div>
                  <div className="text-2xl font-bold text-[#030213]">
                    {coaches.reduce((sum, c) => {
                      const av = Array.isArray(c.availability) 
                        ? c.availability 
                        : typeof c.availability === 'string' 
                          ? JSON.parse(c.availability) 
                          : [];
                      return sum + av.length;
                    }, 0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coaches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {coaches.map((coach) => {
                const availability = Array.isArray(coach.availability)
                  ? coach.availability
                  : typeof coach.availability === 'string'
                    ? JSON.parse(coach.availability)
                    : [];
                return (
                  <Card
                    key={coach.id}
                    className="bg-white rounded-[24px] overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Photo */}
                    <div className="relative w-full h-[240px] rounded-t-[24px] overflow-hidden bg-gradient-to-br from-[#030213] to-[#1a1a2e]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl text-white opacity-50">👤</span>
                      </div>
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
                          ${coach.hourly_rate.toFixed(2)}/hr
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
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(coach)}
                          className="flex-1"
                        >
                          Delete
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingCoach ? 'Edit Coach' : 'Create New Coach'}
            </DialogTitle>
            <DialogDescription>
              {editingCoach ? 'Update the coach details below' : 'Fill in all the details to create a new coach'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Specialty</label>
                <Input
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="e.g., Tennis, Table Tennis"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'active' | 'inactive') => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
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

            <div>
              <label className="text-sm font-medium mb-2 block">Availability</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <Select
                  value={availabilityDay}
                  onValueChange={setAvailabilityDay}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="time"
                  value={availabilityStart}
                  onChange={(e) => setAvailabilityStart(e.target.value)}
                  placeholder="Start"
                />
                <Input
                  type="time"
                  value={availabilityEnd}
                  onChange={(e) => setAvailabilityEnd(e.target.value)}
                  placeholder="End"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAvailability}
                className="mb-3"
              >
                + Add Availability Slot
              </Button>
              {formData.availability.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                  {formData.availability.map((av, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm">
                        <span className="font-medium">{av.day}:</span> {av.start} - {av.end}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAvailability(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the coach "{coachToDelete?.name}". 
              This action cannot be undone. All bookings for this coach will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCoachToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Coach
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
