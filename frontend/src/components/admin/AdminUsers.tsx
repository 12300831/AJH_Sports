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
  getUsers,
  deleteUser,
  createUser,
  updateUser,
  getUserById,
  type User,
  type UserFilters,
  type CreateUserData,
  type UpdateUserData,
} from '../../services/adminService';
import { AdminLayout } from './AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player' | 'payment' | 'paymentSuccess' | 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

type AdminPage = 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

interface AdminUsersProps {
  onNavigate: (page: AdminPage) => void;
}

const SPORTS_COLORS: Record<string, string> = {
  Tennis: 'bg-green-100 text-green-800 border-green-200',
  'Table Tennis': 'bg-blue-100 text-blue-800 border-blue-200',
};

export function AdminUsers({ onNavigate }: AdminUsersProps) {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sportsFilter, setSportsFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [sortColumn, setSortColumn] = useState<string>('joinedDate');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  
  // Edit/Add User Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateUserData>({
    fullName: '',
    email: '',
    username: '',
    role: 'User',
    sports: 'Tennis',
    phone: '',
    location: '',
    password: '',
  });

  // Debounce search query (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load users when filters change
  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, debouncedSearchQuery, roleFilter, sportsFilter, dateFilter, sortColumn, sortOrder]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: UserFilters = {
        search: debouncedSearchQuery || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        sports: sportsFilter !== 'all' ? sportsFilter : undefined,
        page,
        limit: rowsPerPage,
        sortBy: sortColumn,
        sortOrder: sortOrder,
      };

      if (dateFilter && dateFilter !== 'all') {
        const now = new Date();
        if (dateFilter === 'today') {
          filters.dateFrom = new Date(now.setHours(0, 0, 0, 0)).toISOString().split('T')[0];
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          filters.dateFrom = weekAgo.toISOString().split('T')[0];
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          filters.dateFrom = monthAgo.toISOString().split('T')[0];
        }
      }

      const response = await getUsers(filters);
      
      // Validate response structure with safe fallbacks
      if (!response) {
        console.error('Invalid API response: response is null/undefined');
        setUsers([]);
        setTotalPages(0);
        setTotal(0);
        setError('Invalid response from server');
        return;
      }

      // Safe access to response data
      const usersArray = Array.isArray(response.users) ? response.users : [];
      const paginationData = response.pagination || { totalPages: 0, total: 0 };
      
      setUsers(usersArray);
      setTotalPages(paginationData.totalPages || 0);
      setTotal(paginationData.total || 0);
      setError(null); // Clear any previous errors
    } catch (error: any) {
      console.error('Error loading users:', error);
      const errorMsg = error?.message || 'Failed to load users. Please check your connection.';
      setError(errorMsg);
      // Don't show toast on initial load to avoid spam
      if (users.length > 0) {
        toast.error(errorMsg);
      }
      // Always set safe fallback state
      setUsers([]);
      setTotalPages(0);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search query (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load users when filters change
  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, debouncedSearchQuery, roleFilter, sportsFilter, dateFilter, sortColumn, sortOrder]);

  const handleDelete = async (id: number) => {
    // Prevent deleting yourself
    if (currentUser?.id === id) {
      toast.error('Cannot delete your own account');
      return;
    }

    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
      // Reload users and reset to page 1 if current page becomes empty
      await loadUsers();
      // If current page is empty and not page 1, go to previous page
      if (users.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const handleEdit = async (user: User) => {
    try {
      const fullUser = await getUserById(user.id);
      if (!fullUser) {
        toast.error('User not found');
        return;
      }
      setEditingUser(fullUser);
      setFormData({
        fullName: fullUser.fullName || fullUser.name || '',
        email: fullUser.email || '',
        username: fullUser.username || '',
        role: fullUser.role || 'User',
        sports: fullUser.sports || 'Tennis',
        phone: fullUser.phone || '',
        location: fullUser.location || '',
        password: '',
        profileImage: fullUser.profileImage || '',
      });
      setProfileImagePreview(fullUser.profileImage || null);
      setIsDialogOpen(true);
    } catch (error: any) {
      console.error('Error loading user details:', error);
      toast.error(error?.message || 'Failed to load user details');
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setProfileImagePreview(null);
    setFormData({
      fullName: '',
      email: '',
      username: '',
      role: 'User',
        sports: 'Tennis',
      phone: '',
      location: '',
      password: '',
      profileImage: '',
    });
    setIsDialogOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        // Update existing user
        const updateData: UpdateUserData = { ...formData };
        
        // OAuth users cannot have passwords changed
        if (editingUser.provider) {
          // Remove password from update data for OAuth users
          delete updateData.password;
        } else {
          // Only include password if it's not empty for regular users
          if (!updateData.password || updateData.password.trim() === '') {
            delete updateData.password;
          }
        }
        
        // Always include profileImage if it exists
        if (formData.profileImage) {
          updateData.profileImage = formData.profileImage;
        }
        await updateUser(editingUser.id, updateData);
        toast.success('User updated successfully');
      } else {
        // Create new user
        if (!formData.fullName || !formData.email) {
          toast.error('Full name and email are required');
          return;
        }
        await createUser(formData);
        toast.success('User created successfully');
        // Reset to first page to see new user
        setPage(1);
      }
      setIsDialogOpen(false);
      setProfileImagePreview(null);
      await loadUsers();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${editingUser ? 'update' : 'create'} user`);
    }
  };

  const handlePageNavigate = (page: Page) => {
    window.location.href = '/';
  };

  const getSportsBadgeClass = (sports: string) => {
    return SPORTS_COLORS[sports] || SPORTS_COLORS.Tennis;
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortColumn(column);
      setSortOrder('ASC');
    }
    setPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '--';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '--';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '--';
    }
  };

  const formatLastActive = (dateString: string | null | undefined) => {
    if (!dateString) return '--';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '--';
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      if (diffMs < 0) return '--'; // Future date, invalid
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      const diffMonths = Math.floor(diffDays / 30);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
      return formatDate(dateString);
    } catch {
      return '--';
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortOrder === 'ASC' ? (
      <svg className="w-4 h-4 text-[#e0cb23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-[#e0cb23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <AdminLayout
      title="User Management"
      description="Manage all users in one place. Control access, assign roles, and monitor activity across your platform."
      currentPage="adminUsers"
      onNavigate={handlePageNavigate}
      onAdminNavigate={onNavigate}
    >
      <div className="space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <Select value={roleFilter} onValueChange={(value) => {
                setRoleFilter(value);
                setPage(1);
              }}>
                <SelectTrigger className="w-[180px] border-gray-300 bg-white hover:bg-gray-50 focus-visible:ring-[#e0cb23]/50 focus-visible:border-[#e0cb23]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg">
                  <SelectItem value="all" className="hover:bg-[#e0cb23]/10 focus:bg-[#e0cb23]/10 focus:text-[#030213] cursor-pointer">All Roles</SelectItem>
                  <SelectItem value="Admin" className="hover:bg-[#e0cb23]/10 focus:bg-[#e0cb23]/10 focus:text-[#030213] cursor-pointer">Admin</SelectItem>
                  <SelectItem value="User" className="hover:bg-[#e0cb23]/10 focus:bg-[#e0cb23]/10 focus:text-[#030213] cursor-pointer">User</SelectItem>
                </SelectContent>
              </Select>

              {/* Sports Filter */}
              <Select value={sportsFilter} onValueChange={(value) => {
                setSportsFilter(value);
                setPage(1);
              }}>
                <SelectTrigger className="w-[180px] border-gray-300 bg-white hover:bg-gray-50 focus-visible:ring-[#e0cb23]/50 focus-visible:border-[#e0cb23]">
                  <SelectValue placeholder="SPORTS" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg">
                  <SelectItem value="all" className="hover:bg-[#e0cb23]/10 focus:bg-[#e0cb23]/10 focus:text-[#030213] cursor-pointer">All Sports</SelectItem>
                  <SelectItem value="Tennis" className="hover:bg-[#e0cb23]/10 focus:bg-[#e0cb23]/10 focus:text-[#030213] cursor-pointer">Tennis</SelectItem>
                  <SelectItem value="Table Tennis" className="hover:bg-[#e0cb23]/10 focus:bg-[#e0cb23]/10 focus:text-[#030213] cursor-pointer">Table Tennis</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Filter */}
              <Select value={dateFilter} onValueChange={(value) => {
                setDateFilter(value);
                setPage(1);
              }}>
                <SelectTrigger className="w-[180px] border-gray-300 bg-white hover:bg-gray-50 focus-visible:ring-[#e0cb23]/50 focus-visible:border-[#e0cb23]">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg">
                  <SelectItem value="all" className="hover:bg-[#e0cb23]/10 focus:bg-[#e0cb23]/10 focus:text-[#030213] cursor-pointer">All Dates</SelectItem>
                  <SelectItem value="today" className="hover:bg-[#e0cb23]/10 focus:bg-[#e0cb23]/10 focus:text-[#030213] cursor-pointer">Today</SelectItem>
                  <SelectItem value="week" className="hover:bg-[#e0cb23]/10 focus:bg-[#e0cb23]/10 focus:text-[#030213] cursor-pointer">Last Week</SelectItem>
                  <SelectItem value="month" className="hover:bg-[#e0cb23]/10 focus:bg-[#e0cb23]/10 focus:text-[#030213] cursor-pointer">Last Month</SelectItem>
                </SelectContent>
              </Select>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export
                </Button>
                <Button onClick={handleAddUser} className="bg-[#e0cb23] hover:bg-[#d4bf1f] gap-2 text-[#030213] font-semibold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  + Add User
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table - Always render table structure */}
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-500">Loading users...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                      <TableRow className="bg-[#030213] text-white hover:bg-[#030213]">
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={selectedUsers.length === users.length && users.length > 0}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="rounded border-gray-300 text-[#e0cb23] focus:ring-[#e0cb23]"
                            disabled={users.length === 0}
                          />
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-[#1a1a2e]" onClick={() => handleSort('fullName')}>
                          <div className="flex items-center gap-2">
                            Full Name
                            <SortIcon column="fullName" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-[#1a1a2e]" onClick={() => handleSort('email')}>
                          <div className="flex items-center gap-2">
                            Email
                            <SortIcon column="email" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-[#1a1a2e]" onClick={() => handleSort('username')}>
                          <div className="flex items-center gap-2">
                            Username
                            <SortIcon column="username" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-[#1a1a2e]" onClick={() => handleSort('sports')}>
                          <div className="flex items-center gap-2">
                            Sports
                            <SortIcon column="sports" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-[#1a1a2e]" onClick={() => handleSort('role')}>
                          <div className="flex items-center gap-2">
                            Role
                            <SortIcon column="role" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-[#1a1a2e]" onClick={() => handleSort('joinedDate')}>
                          <div className="flex items-center gap-2">
                            Joined Date
                            <SortIcon column="joinedDate" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-[#1a1a2e]" onClick={() => handleSort('lastActive')}>
                          <div className="flex items-center gap-2">
                            Last Active
                            <SortIcon column="lastActive" />
                          </div>
                        </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                      {error ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12">
                            <div className="text-red-500">
                              <p className="text-lg font-semibold">Failed to load users</p>
                              <p className="text-sm mt-2">{error}</p>
                              <Button
                                onClick={() => {
                                  setError(null);
                                  loadUsers();
                                }}
                                className="mt-4"
                              >
                                Retry
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                            <p className="text-lg">No users found</p>
                            <p className="text-sm mt-2">
                              {searchQuery || (roleFilter !== 'all') || (sportsFilter !== 'all') || (dateFilter !== 'all')
                                ? 'Try adjusting your filters'
                                : 'Get started by adding a new user'}
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => {
                          // Safe access to all user properties with fallbacks
                          const safeUser = {
                            id: user?.id || 0,
                            fullName: user?.fullName || user?.name || '--',
                            name: user?.name || user?.fullName || '--',
                            email: user?.email || '--',
                            username: user?.username || '--',
                            status: user?.status || 'Active',
                            role: user?.role || 'User',
                            joinedDate: user?.joinedDate || (user as any)?.created_at || null,
                            lastActive: user?.lastActive || (user as any)?.updated_at || null,
                            profileImage: user?.profileImage || null,
                            provider: user?.provider || null, // OAuth provider (google, facebook, or null)
                          };

                          return (
                            <TableRow key={safeUser.id} className="hover:bg-gray-50">
                              <TableCell>
                                <input
                                  type="checkbox"
                                  checked={selectedUsers.includes(safeUser.id)}
                                  onChange={(e) => handleSelectUser(safeUser.id, e.target.checked)}
                                  className="rounded border-gray-300 text-[#e0cb23] focus:ring-[#e0cb23]"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {safeUser.profileImage ? (
                                    <img
                                      key={`${safeUser.id}-${safeUser.profileImage?.substring(0, 50)}`}
                                      src={`${safeUser.profileImage}${safeUser.profileImage.includes('?') ? '&' : '?'}t=${Date.now()}`}
                                      alt={safeUser.fullName}
                                      className="w-8 h-8 rounded-full object-cover"
                                      onError={(e) => {
                                        // Fallback to initials if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        if (target.src.includes('?t=')) {
                                          target.src = safeUser.profileImage || '';
                                        } else {
                                          target.style.display = 'none';
                                        }
                                      }}
                                    />
                                  ) : null}
                                  <div className={`w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium ${safeUser.profileImage ? 'hidden' : ''}`}>
                                    {(safeUser.fullName || safeUser.email || 'U')[0].toUpperCase()}
                                  </div>
                                  <span className="font-medium">{safeUser.fullName}</span>
                                  {safeUser.provider && (
                                    <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200 text-xs">
                                      {safeUser.provider === 'google' ? '🔵 Google' : safeUser.provider === 'facebook' ? '🔵 Facebook' : safeUser.provider}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{safeUser.email}</TableCell>
                              <TableCell>{safeUser.username}</TableCell>
                              <TableCell>
                                <Badge className={getSportsBadgeClass(safeUser.sports || 'Tennis')}>
                                  {safeUser.sports || 'Tennis'}
                        </Badge>
                      </TableCell>
                              <TableCell>{safeUser.role}</TableCell>
                              <TableCell>{formatDate(safeUser.joinedDate || '')}</TableCell>
                              <TableCell>{formatLastActive(safeUser.lastActive || '')}</TableCell>
                      <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(user)}
                                    className="h-8 w-8 p-0 text-[#030213] hover:bg-[#e0cb23]/20 hover:text-[#030213] border border-transparent hover:border-[#e0cb23]/30"
                                    title="Edit User"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(safeUser.id)}
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    disabled={safeUser.role === 'Admin' && safeUser.id === currentUser?.id}
                                    title="Delete"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination - Always show even if no users */}
                {!loading && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Rows per page</span>
                      <Select
                        value={String(rowsPerPage)}
                        onValueChange={(value) => {
                          setRowsPerPage(Number(value));
                          setPage(1);
                        }}
                      >
                        <SelectTrigger className="w-[80px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-gray-600">
                        of {total || 0} rows
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(1)}
                        disabled={page === 1 || totalPages === 0}
                      >
                        &lt;&lt;
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1 || totalPages === 0}
                      >
                        &lt;
                      </Button>
                      {totalPages > 0 && Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      {totalPages > 5 && page < totalPages - 2 && (
                        <span className="px-2">...</span>
                      )}
                      {totalPages > 5 && page < totalPages - 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages || totalPages === 0}
                      >
                        &gt;
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(totalPages)}
                        disabled={page >= totalPages || totalPages === 0}
                      >
                        &gt;&gt;
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Edit/Add User Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl bg-white border-2 border-gray-200 shadow-2xl">
            <DialogHeader className="border-b border-gray-200 pb-4">
              <DialogTitle className="text-2xl font-bold text-[#030213]">{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
                {editingUser ? 'Update user information below.' : 'Fill in the details to create a new user.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Profile Picture Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    {profileImagePreview ? (
                      <img
                        key={editingUser?.id || 'preview'}
                        src={`${profileImagePreview}${profileImagePreview.includes('?') ? '&' : '?'}t=${Date.now()}`}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src.includes('?t=')) {
                            target.src = profileImagePreview;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-[#e0cb23] flex items-center justify-center text-[#030213] text-2xl font-bold border-2 border-gray-300">
                        {formData.fullName ? formData.fullName.substring(0, 2).toUpperCase() : 'U'}
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 bg-[#e0cb23] text-black rounded-full p-2 cursor-pointer hover:bg-[#cdb720] transition-colors shadow-md">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
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
                              setProfileImagePreview(result);
                              setFormData({ ...formData, profileImage: result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 text-center">Click to change photo</p>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Profile Picture</h3>
                  <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 10MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700 mb-2 block">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="border-gray-300 focus:border-[#e0cb23] focus:ring-[#e0cb23]/50"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-gray-300 focus:border-[#e0cb23] focus:ring-[#e0cb23]/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username" className="text-sm font-semibold text-gray-700 mb-2 block">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="border-gray-300 focus:border-[#e0cb23] focus:ring-[#e0cb23]/50"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-2 block">
                    {editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                    {editingUser?.provider && (
                      <span className="ml-2 text-xs text-gray-500 font-normal">
                        (OAuth user - password not applicable)
                      </span>
                    )}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingUser?.provider ? 'OAuth users do not have passwords' : (editingUser ? 'Enter new password...' : '')}
                    className="border-gray-300 focus:border-[#e0cb23] focus:ring-[#e0cb23]/50"
                    disabled={!!editingUser?.provider}
                  />
                  {editingUser?.provider && (
                    <p className="text-xs text-gray-500 mt-1">
                      This user signed in with {editingUser.provider === 'google' ? 'Google' : 'Facebook'}. Password management is not available for OAuth users.
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role" className="text-sm font-semibold text-gray-700 mb-2 block">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger className="border-gray-300 bg-white hover:bg-gray-50 focus-visible:ring-[#e0cb23]/50 focus-visible:border-[#e0cb23]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg z-[102]">
                      <SelectItem value="Admin" className="hover:bg-[#e0cb23]/10 focus:bg-[#e0cb23]/10 focus:text-[#030213] cursor-pointer">Admin</SelectItem>
                      <SelectItem value="User" className="hover:bg-[#e0cb23]/10 focus:bg-[#e0cb23]/10 focus:text-[#030213] cursor-pointer">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sports" className="text-sm font-semibold text-gray-700 mb-2 block">Sports</Label>
                  <Select
                    value={formData.sports || 'Tennis'}
                    onValueChange={(value: any) => setFormData({ ...formData, sports: value })}
                  >
                    <SelectTrigger className="border-gray-300 bg-white hover:bg-gray-50 focus-visible:ring-[#e0cb23]/50 focus-visible:border-[#e0cb23]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg z-[102]">
                      <SelectItem value="Tennis" className="hover:bg-[#e0cb23]/10 focus:bg-[#e0cb23]/10 focus:text-[#030213] cursor-pointer">Tennis</SelectItem>
                      <SelectItem value="Table Tennis" className="hover:bg-[#e0cb23]/10 focus:bg-[#e0cb23]/10 focus:text-[#030213] cursor-pointer">Table Tennis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 mb-2 block">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-gray-300 focus:border-[#e0cb23] focus:ring-[#e0cb23]/50"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-sm font-semibold text-gray-700 mb-2 block">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="border-gray-300 focus:border-[#e0cb23] focus:ring-[#e0cb23]/50"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="border-t border-gray-200 pt-4 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-300 hover:bg-gray-50">
                Cancel
              </Button>
              <Button onClick={handleSaveUser} className="bg-[#e0cb23] hover:bg-[#d4bf1f] text-[#030213] font-semibold">
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
