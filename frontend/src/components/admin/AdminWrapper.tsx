import { useState, useEffect } from 'react';
import { AdminDashboard } from './AdminDashboard';
import { AdminEvents } from './AdminEvents';
import { AdminCoaches } from './AdminCoaches';
import { AdminUsers } from './AdminUsers';
import { AdminBookings } from './AdminBookings';
import { getUserProfile } from '../../services/adminService';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player' | 'payment' | 'paymentSuccess' | 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

interface AdminWrapperProps {
  onNavigate: (page: Page) => void;
}

type AdminPage = 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

export function AdminWrapper({ onNavigate }: AdminWrapperProps) {
  const [currentAdminPage, setCurrentAdminPage] = useState<AdminPage>('admin');
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      // First check localStorage for quick access
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          console.log('🔍 Stored user from localStorage:', user);
          if (user.role === 'admin') {
            setIsAuthorized(true);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }

      // If not in localStorage or not admin, check via API
      const user = await getUserProfile();
      console.log('🔍 User from API:', user);
      
      // Check if user is admin
      const userRole = user.role || (user as any)?.role;
      console.log('🔍 User role:', userRole);
      
      if (userRole === 'admin') {
        setIsAuthorized(true);
        // Update localStorage with fresh user data
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        setIsAuthorized(false);
        toast.error('Access denied. Admin privileges required.');
      }
    } catch (error: any) {
      console.error('Error checking admin access:', error);
      setIsAuthorized(false);
      if (error.message.includes('Authentication failed')) {
        toast.error('Please log in to access admin portal');
      } else {
        toast.error('Failed to verify admin access');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminNavigate = (page: AdminPage) => {
    setCurrentAdminPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-[#030213]">Checking access...</div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              You need admin privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Please log in with an admin account to continue.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onNavigate('signin')}
                className="flex-1"
              >
                Log In
              </Button>
              <Button
                onClick={() => onNavigate('home')}
                className="flex-1 bg-[#030213] text-white"
              >
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderAdminPage = () => {
    switch (currentAdminPage) {
      case 'admin':
        return <AdminDashboard onNavigate={handleAdminNavigate} />;
      case 'adminEvents':
        return <AdminEvents onNavigate={handleAdminNavigate} />;
      case 'adminCoaches':
        return <AdminCoaches onNavigate={handleAdminNavigate} />;
      case 'adminUsers':
        return <AdminUsers onNavigate={handleAdminNavigate} />;
      case 'adminBookings':
        return <AdminBookings onNavigate={handleAdminNavigate} />;
      default:
        return <AdminDashboard onNavigate={handleAdminNavigate} />;
    }
  };

  return renderAdminPage();
}

