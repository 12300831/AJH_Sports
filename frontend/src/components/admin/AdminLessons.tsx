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
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  hardDeleteLesson,
  sendLessonTestEmail,
  type Lesson,
  type CreateLessonData,
} from '../../services/adminService';
import { toast } from 'sonner';

interface AdminLessonsProps {
  onAddLesson?: () => void;
}

export function AdminLessons({ onAddLesson }: AdminLessonsProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHardDeleteDialogOpen, setIsHardDeleteDialogOpen] = useState(false);
  const [isTestEmailDialogOpen, setIsTestEmailDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  const [lessonToHardDelete, setLessonToHardDelete] = useState<Lesson | null>(null);
  const [lessonToTestEmail, setLessonToTestEmail] = useState<Lesson | null>(null);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [testBookingType, setTestBookingType] = useState<'single' | 'pack'>('single');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState<CreateLessonData>({
    title: '',
    description: '',
    image_url: '',
    pricing: [],
    category: 'Tennis',
    image_position: 'right',
    cta_text: 'Register Now!',
    status: 'active',
    display_order: 0,
  });
  const [pricingLabel, setPricingLabel] = useState('');
  const [pricingSingle, setPricingSingle] = useState('');
  const [pricingPack, setPricingPack] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const data = await getLessons();
      if (Array.isArray(data)) {
        setLessons(data);
      } else {
        console.error('getLessons returned non-array:', data);
        setLessons([]);
        toast.error('Invalid lessons data received');
      }
    } catch (error: any) {
      console.error('Error loading lessons:', error);
      setLessons([]);
      toast.error(error.message || 'Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Lesson title is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenDialog = (lesson?: Lesson) => {
    if (lesson) {
      setEditingLesson(lesson);
      let pricing: Array<{ label: string; single: string; pack: string }> = [];
      if (Array.isArray(lesson.pricing)) {
        pricing = lesson.pricing;
      } else if (typeof lesson.pricing === 'string' && lesson.pricing.trim() !== '') {
        try {
          pricing = JSON.parse(lesson.pricing);
        } catch (e) {
          pricing = [];
        }
      }
      setFormData({
        title: lesson.title,
        description: lesson.description || '',
        image_url: lesson.image_url || '',
        pricing: pricing,
        category: lesson.category || 'Tennis',
        image_position: lesson.image_position || 'right',
        cta_text: lesson.cta_text || 'Register Now!',
        status: lesson.status || 'active',
        display_order: lesson.display_order || 0,
      });
      setImagePreview(lesson.image_url || null);
    } else {
      setEditingLesson(null);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        pricing: [],
        category: 'Tennis',
        image_position: 'right',
        cta_text: 'Register Now!',
        status: 'active',
        display_order: 0,
      });
      setImagePreview(null);
    }
    setPricingLabel('');
    setPricingSingle('');
    setPricingPack('');
    setFormErrors({});
    setIsDraggedOver(false);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingLesson(null);
    setPricingLabel('');
    setPricingSingle('');
    setPricingPack('');
    setFormErrors({});
    setImagePreview(null);
    setIsDraggedOver(false);
  };

  const addPricing = () => {
    if (!pricingLabel.trim() || !pricingSingle.trim() || !pricingPack.trim()) {
      toast.error('Please fill in all pricing fields (label, single, and pack)');
      return;
    }
    
    // Check if this pricing label already exists
    const exists = formData.pricing.some(p => p.label === pricingLabel.trim());
    
    if (exists) {
      toast.error('A pricing option with this label already exists');
      return;
    }

    setFormData({
      ...formData,
      pricing: [
        ...formData.pricing,
        { label: pricingLabel.trim(), single: pricingSingle.trim(), pack: pricingPack.trim() },
      ],
    });
    setPricingLabel('');
    setPricingSingle('');
    setPricingPack('');
    toast.success('Pricing option added');
  };

  const removePricing = (index: number) => {
    setFormData({
      ...formData,
      pricing: formData.pricing.filter((_, i) => i !== index),
    });
  };

  // Handle image upload (convert to base64)
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }
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
      const lessonData: CreateLessonData = {
        ...formData,
        image_url: formData.image_url?.trim() || undefined,
      };
      
      console.log('📝 Submitting lesson form:', { editingLesson: editingLesson?.id, lessonData });
      
      if (editingLesson) {
        console.log('🔄 Updating lesson ID:', editingLesson.id);
        await updateLesson(editingLesson.id, lessonData);
        toast.success('Lesson updated successfully!');
      } else {
        console.log('➕ Creating new lesson');
        await createLesson(lessonData);
        toast.success('Lesson created successfully!');
      }
      
      handleCloseDialog();
      await loadLessons();
      if (onAddLesson) onAddLesson();
    } catch (error: any) {
      console.error('❌ Error saving lesson:', error);
      console.error('Error details:', {
        message: error?.message,
        stack: error?.stack,
        response: error?.response,
      });
      const errorMessage = error?.message || error?.toString() || 'Failed to save lesson';
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const handleDeleteClick = async (lesson: Lesson) => {
    if (lesson.status === 'inactive') {
      try {
        await updateLesson(lesson.id, { ...lesson, status: 'active' });
        toast.success('Lesson unarchived successfully! It will now appear on the public site.');
        setLessons(prevLessons => 
          prevLessons.map(l => 
            l.id === lesson.id 
              ? { ...l, status: 'active' as const }
              : l
          )
        );
        loadLessons();
      } catch (error: any) {
        toast.error(error.message || 'Failed to restore lesson');
      }
    } else {
      setLessonToDelete(lesson);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!lessonToDelete) return;
    
    try {
      await deleteLesson(lessonToDelete.id);
      toast.success('Lesson archived successfully! It will no longer appear on the public site.');
      setIsDeleteDialogOpen(false);
      setLessons(prevLessons => 
        prevLessons.map(lesson => 
          lesson.id === lessonToDelete.id 
            ? { ...lesson, status: 'inactive' as const }
            : lesson
        )
      );
      setLessonToDelete(null);
      loadLessons();
    } catch (error: any) {
      toast.error(error.message || 'Failed to archive lesson');
    }
  };

  const handleHardDeleteClick = (lesson: Lesson) => {
    setLessonToHardDelete(lesson);
    setIsHardDeleteDialogOpen(true);
  };

  const handleHardDeleteConfirm = async () => {
    if (!lessonToHardDelete) return;
    
    try {
      await hardDeleteLesson(lessonToHardDelete.id);
      toast.success('Lesson permanently deleted.');
      setIsHardDeleteDialogOpen(false);
      setLessonToHardDelete(null);
      loadLessons();
    } catch (error: any) {
      toast.error(error.message || 'Failed to permanently delete lesson');
    }
  };

  const handleTestEmailClick = (lesson: Lesson) => {
    setLessonToTestEmail(lesson);
    setTestEmailAddress('');
    setTestBookingType('single');
    setIsTestEmailDialogOpen(true);
  };

  const handleTestEmailConfirm = async () => {
    if (!lessonToTestEmail || !testEmailAddress.trim()) {
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
      const result = await sendLessonTestEmail(lessonToTestEmail.id, testEmailAddress.trim(), testBookingType);
      if (result.success) {
        toast.success(`Test email sent successfully to ${testEmailAddress.trim()}`);
        setIsTestEmailDialogOpen(false);
        setLessonToTestEmail(null);
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

  return (
    <div>
      {loading ? (
        <div className="text-center py-12">
          <div className="text-lg text-gray-600">Loading lessons...</div>
        </div>
      ) : lessons.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="py-16 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No lessons yet</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first lesson</p>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-[#e0cb23] text-[#030213] hover:bg-[#d4ba1f] font-semibold"
            >
              + Add Your First Lesson
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="text-sm text-gray-600 mb-1">Total Lessons</div>
                <div className="text-2xl font-bold text-[#030213]">{lessons.length}</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="text-sm text-gray-600 mb-1">Active Lessons</div>
                <div className="text-2xl font-bold text-[#030213]">
                  {lessons.filter(l => l.status === 'active').length}
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="pt-4">
                <div className="text-sm text-gray-600 mb-1">Categories</div>
                <div className="text-2xl font-bold text-[#030213]">
                  {new Set(lessons.map(l => l.category)).size}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {lessons.map((lesson) => {
              let pricing: Array<{ label: string; single: string; pack: string }> = [];
              if (Array.isArray(lesson.pricing)) {
                pricing = lesson.pricing;
              } else if (typeof lesson.pricing === 'string' && lesson.pricing.trim() !== '') {
                try {
                  pricing = JSON.parse(lesson.pricing);
                } catch (e) {
                  pricing = [];
                }
              }
              return (
                <Card
                  key={lesson.id}
                  className="bg-white rounded-[24px] overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative w-full h-[240px] rounded-t-[24px] overflow-hidden bg-gradient-to-br from-[#030213] to-[#1a1a2e]">
                    {lesson.image_url ? (
                      <img
                        src={lesson.image_url}
                        alt={lesson.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl text-white opacity-50">📚</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(lesson);
                        }}
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-[#030213]"
                        title="Edit lesson"
                      >
                        ✏️
                      </Button>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadgeColor(lesson.status)}`}>
                        {lesson.status || 'active'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-6">
                    {/* Title + Category */}
                    <div className="text-center mb-3">
                      <p className="text-base font-semibold text-black mb-1">{lesson.title}</p>
                      <p className="text-sm text-gray-600">{lesson.category}</p>
                    </div>

                    {/* Description */}
                    {lesson.description && (
                      <div className="mb-3 text-xs text-gray-600 line-clamp-3">
                        {lesson.description}
                      </div>
                    )}

                    {/* Pricing Preview */}
                    {pricing.length > 0 && (
                      <div className="mb-3 pb-3 border-b border-gray-100">
                        <div className="text-xs font-medium text-gray-700 mb-1">Pricing:</div>
                        <div className="space-y-1">
                          {pricing.slice(0, 2).map((p, idx) => (
                            <div key={idx} className="text-xs text-gray-600">
                              <span className="font-medium">{p.label}:</span> {p.single} / {p.pack}
                            </div>
                          ))}
                          {pricing.length > 2 && (
                            <div className="text-xs text-gray-400 italic">+{pricing.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Display Order */}
                    <div className="mb-4 text-xs text-gray-500">
                      Order: {lesson.display_order || 0}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 mt-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(lesson)}
                          className="flex-1 border-[#030213] text-[#030213] hover:bg-[#030213] hover:text-white"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(lesson)}
                          className={`flex-1 ${
                            lesson.status === 'inactive' 
                              ? 'border-green-300 text-green-700 hover:bg-green-50' 
                              : 'border-orange-300 text-orange-700 hover:bg-orange-50'
                          }`}
                        >
                          {lesson.status === 'inactive' ? 'Unarchive' : 'Archive'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleHardDeleteClick(lesson)}
                          className="px-2 border-red-300 text-red-600 hover:bg-red-50"
                          title="Permanently delete lesson"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestEmailClick(lesson)}
                        className="w-full text-xs border-blue-300 text-blue-600 hover:bg-blue-50"
                        title="Send test booking confirmation email"
                      >
                        📧 Test Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
            </DialogTitle>
            <DialogDescription>
              {editingLesson ? 'Update the lesson details below' : 'Fill in all the details to create a new lesson'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4" onClick={(e) => e.stopPropagation()}>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Lesson Title <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (formErrors.title) setFormErrors({ ...formErrors, title: '' });
                }}
                required
                placeholder="e.g., Junior Tennis Lessons"
                className={formErrors.title ? 'border-red-500' : ''}
              />
              {formErrors.title && (
                <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>
              )}
            </div>

            {/* Lesson Image Upload */}
            <div>
              <label className="text-sm font-medium mb-2 block">Lesson Image</label>
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
                  document.getElementById('lesson-image-input')?.click();
                }}
              >
                {imagePreview || formData.image_url ? (
                  <div className="relative">
                    <img
                      src={imagePreview || formData.image_url || ''}
                      alt="Lesson preview"
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
                    <p className="text-xs text-gray-500 mt-1">Lesson image (max 10MB)</p>
                  </div>
                )}
                <input
                  id="lesson-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter lesson description..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(value: 'Tennis' | 'Table Tennis' | 'Modified Sports') =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="!bg-white !border-gray-300 !shadow-2xl !z-[10000] text-gray-900">
                    <SelectItem value="Tennis" className="!text-gray-900 hover:!bg-gray-100 focus:!bg-gray-100 cursor-pointer">Tennis</SelectItem>
                    <SelectItem value="Table Tennis" className="!text-gray-900 hover:!bg-gray-100 focus:!bg-gray-100 cursor-pointer">Table Tennis</SelectItem>
                    <SelectItem value="Modified Sports" className="!text-gray-900 hover:!bg-gray-100 focus:!bg-gray-100 cursor-pointer">Modified Sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Image Position</label>
                <Select
                  value={formData.image_position}
                  onValueChange={(value: 'left' | 'right') =>
                    setFormData({ ...formData, image_position: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="!bg-white !border-gray-300 !shadow-2xl !z-[10000] text-gray-900">
                    <SelectItem value="left" className="!text-gray-900 hover:!bg-gray-100 focus:!bg-gray-100 cursor-pointer">Left</SelectItem>
                    <SelectItem value="right" className="!text-gray-900 hover:!bg-gray-100 focus:!bg-gray-100 cursor-pointer">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">CTA Text</label>
                <Input
                  value={formData.cta_text}
                  onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                  placeholder="Register Now!"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Display Order</label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Pricing */}
            <div>
              <label className="text-sm font-medium mb-2 block">Pricing</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <Input
                  value={pricingLabel}
                  onChange={(e) => setPricingLabel(e.target.value)}
                  placeholder="Label (e.g., Private)"
                />
                <Input
                  value={pricingSingle}
                  onChange={(e) => setPricingSingle(e.target.value)}
                  placeholder="Single (e.g., $80)"
                />
                <Input
                  value={pricingPack}
                  onChange={(e) => setPricingPack(e.target.value)}
                  placeholder="Pack (e.g., $700*)"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addPricing();
                }}
                className="mb-3 cursor-pointer z-10 relative"
              >
                + Add Pricing Option
              </Button>
              {formData.pricing.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                  {formData.pricing.map((p, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm">
                        <span className="font-medium">{p.label}:</span> {p.single} / {p.pack}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePricing(index)}
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
                {editingLesson ? 'Update Lesson' : 'Create Lesson'}
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
              Archive Lesson?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 mt-2">
              This will archive "<span className="font-semibold text-gray-800">{lessonToDelete?.title}</span>" and hide it from the public lessons page. 
              The lesson will remain visible in admin with "Inactive" status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel 
              onClick={() => setLessonToDelete(null)}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Archive Lesson
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Confirmation Dialog */}
      <AlertDialog open={isHardDeleteDialogOpen} onOpenChange={setIsHardDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border border-red-300 shadow-2xl z-[999]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-red-600">
              ⚠️ Permanently Delete Lesson?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 mt-2">
              Are you sure you want to permanently delete "<span className="font-semibold text-gray-800">{lessonToHardDelete?.title}</span>"?
              <br /><br />
              <span className="text-red-600 font-semibold">This action cannot be undone.</span> The lesson and all associated data will be permanently removed from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel 
              onClick={() => setLessonToHardDelete(null)}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleHardDeleteConfirm} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Permanently
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
              Send a test booking confirmation email for "<span className="font-semibold text-gray-800">{lessonToTestEmail?.title}</span>"
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-4 space-y-4">
            <div>
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Type
              </label>
              <Select
                value={testBookingType}
                onValueChange={(value: 'single' | 'pack') => setTestBookingType(value)}
                disabled={isSendingTestEmail}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Session</SelectItem>
                  <SelectItem value="pack">10 Session Pack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-gray-500">
              The email will include lesson booking confirmation details.
            </p>
          </div>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel 
              onClick={() => {
                setIsTestEmailDialogOpen(false);
                setLessonToTestEmail(null);
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
    </div>
  );
}
