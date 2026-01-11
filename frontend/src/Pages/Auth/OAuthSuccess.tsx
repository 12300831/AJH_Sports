import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player' | 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

interface OAuthSuccessProps {
  onNavigate: (page: Page) => void;
}

export function OAuthSuccess({ onNavigate }: OAuthSuccessProps) {
  const { login } = useAuth();

  useEffect(() => {
    // Get token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (error) {
      toast.error('OAuth login failed. Please try again.');
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      onNavigate('signin');
      return;
    }

    if (token) {
      // Use auth context to login
      login(token);
      
      toast.success('Login successful!');
      
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Fetch user profile to determine redirect
      // The login function will fetch the profile, but we need to wait a bit
      // to check the role before redirecting
      setTimeout(() => {
        // Check user role from token (basic check)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userRole = payload.role ? String(payload.role).toLowerCase() : '';
          
          if (userRole === 'admin') {
            onNavigate('admin');
          } else {
            onNavigate('player');
          }
        } catch (e) {
          // If we can't parse the token, default to player dashboard
          console.error('Error parsing token:', e);
          onNavigate('player');
        }
      }, 500);
    } else {
      // No token found, redirect to signin
      toast.error('No authentication token received.');
      window.history.replaceState({}, document.title, window.location.pathname);
      onNavigate('signin');
    }
  }, [login, onNavigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e0cb23] mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">Logging you in...</h1>
        <p className="text-gray-600">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
}

