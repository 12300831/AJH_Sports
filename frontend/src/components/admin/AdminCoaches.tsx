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
} from '../ui/dialog';
import {
  getCoaches,
  createCoach,
  updateCoach,
  deleteCoach,
  type Coach,
  type CreateCoachData,
} from '../../services/adminService';
import { toast } from 'sonner';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player' | 'payment' | 'paymentSuccess' | 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

interface AdminCoachesProps {
  onNavigate: (page: Page) => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function AdminCoaches({ onNavigate }: AdminCoachesProps) {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [formData, setFormData] = useState<CreateCoachData>({
    name: '',
    specialty: '',
    availability: [],
    hourly_rate: 0,
  });
  const [availabilityDay, setAvailabilityDay] = useState('');
  const [availabilityStart, setAvailabilityStart] = useState('');
  const [availabilityEnd, setAvailabilityEnd] = useState('');

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
        availability: availability,
        hourly_rate: coach.hourly_rate,
      });
    } else {
      setEditingCoach(null);
      setFormData({
        name: '',
        specialty: '',
        availability: [],
        hourly_rate: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCoach(null);
    setAvailabilityDay('');
    setAvailabilityStart('');
    setAvailabilityEnd('');
  };

  const addAvailability = () => {
    if (!availabilityDay || !availabilityStart || !availabilityEnd) {
      toast.error('Please fill in all availability fields');
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
  };

  const removeAvailability = (index: number) => {
    setFormData({
      ...formData,
      availability: formData.availability.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCoach) {
        await updateCoach(editingCoach.id, formData);
        toast.success('Coach updated successfully');
      } else {
        await createCoach(formData);
        toast.success('Coach created successfully');
      }
      handleCloseDialog();
      loadCoaches();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save coach');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this coach?')) return;
    
    try {
      await deleteCoach(id);
      toast.success('Coach deleted successfully');
      loadCoaches();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete coach');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <div className="bg-[#030213] text-white py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Manage Coaches</h1>
            <p className="text-gray-300 mt-1">Create, edit, and delete coaches</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onNavigate('admin')}
              className="bg-white text-[#030213] hover:bg-gray-100"
            >
              Back to Dashboard
            </Button>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-[#e0cb23] text-[#030213] hover:bg-[#d4ba1f]"
            >
              + Add Coach
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Loading coaches...</div>
          </div>
        ) : coaches.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-gray-500 mb-4">No coaches found.</div>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-[#e0cb23] text-[#030213] hover:bg-[#d4ba1f]"
              >
                + Create Your First Coach
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Coaches Grid - Matching user-facing design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {coaches.map((coach) => {
                const availability = Array.isArray(coach.availability)
                  ? coach.availability
                  : typeof coach.availability === 'string'
                    ? JSON.parse(coach.availability)
                    : [];
                return (
                  <div
                    key={coach.id}
                    className="bg-white rounded-[24px] overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 p-6"
                  >
                    {/* Photo */}
                    <div className="relative w-full h-[240px] rounded-[24px] overflow-hidden mb-4 shadow-sm bg-linear-to-br from-[#030213] to-[#1a1a2e]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl text-white opacity-50">👤</span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDialog(coach);
                          }}
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-[#030213]"
                        >
                          ✏️
                        </Button>
                      </div>
                    </div>

                    {/* Name + Specialty */}
                    <div className="text-center mb-3">
                      <p className="text-sm underline font-medium text-black">{coach.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{coach.specialty || 'Coach'}</p>
                    </div>

                    {/* Rate */}
                    <div className="text-center mb-3">
                      <p className="text-sm font-semibold text-[#030213]">
                        ${coach.hourly_rate.toFixed(2)}/hr
                      </p>
                    </div>

                    {/* Availability Preview */}
                    {availability.length > 0 && (
                      <div className="mb-4 text-xs text-gray-600">
                        <div className="font-medium mb-1">Availability:</div>
                        <div className="space-y-1">
                          {availability.slice(0, 2).map((av: any, idx: number) => (
                            <div key={idx} className="truncate">
                              {av.day}: {av.start} - {av.end}
                            </div>
                          ))}
                          {availability.length > 2 && (
                            <div className="text-gray-400">+{availability.length - 2} more</div>
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
                        className="flex-1 border-black text-black hover:bg-black hover:text-white"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(coach.id)}
                        className="flex-1"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCoach ? 'Edit Coach' : 'Create New Coach'}</DialogTitle>
            <DialogDescription>
              {editingCoach ? 'Update coach details below' : 'Fill in the details to create a new coach'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Coach Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Specialty</label>
              <Input
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                placeholder="Tennis, Table Tennis, etc."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Hourly Rate (AUD) *</label>
              <Input
                type="number"
                step="0.01"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({ ...formData, hourly_rate: parseFloat(e.target.value) || 0 })}
                required
                min="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Availability</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <select
                  value={availabilityDay}
                  onChange={(e) => setAvailabilityDay(e.target.value)}
                  className="h-9 rounded-md border border-input bg-input-background px-3 text-sm"
                >
                  <option value="">Select Day</option>
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
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
                Add Availability Slot
              </Button>
              {formData.availability.length > 0 && (
                <div className="space-y-2">
                  {formData.availability.map((av, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm">
                        {av.day}: {av.start} - {av.end}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAvailability(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
                {editingCoach ? 'Update Coach' : 'Create Coach'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

