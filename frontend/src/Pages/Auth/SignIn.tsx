import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player' | 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

interface SignInProps {
  onNavigate: (page: Page) => void;
}

const LOGO_SRC = '/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png';
const AJH_SPORTS_IMAGE = '/images/ajhsports.png';

// Get API URL
import { getAPI_URL } from '../../services/api';

export function SignIn({ onNavigate }: SignInProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Normalize email (trim and lowercase) before sending
      const normalizedEmail = email.trim().toLowerCase();
      
      if (!normalizedEmail) {
        toast.error('Please enter your email address');
        setLoading(false);
        return;
      }

      if (!password) {
        toast.error('Please enter your password');
        setLoading(false);
        return;
      }

      const response = await fetch(`${getAPI_URL()}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      // Try to parse JSON, but handle errors gracefully
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error(`Server returned invalid response (status ${response.status}). Please check if the backend server is running.`);
      }

      if (!response.ok) {
        const errorMessage = data.message || data.error || `Login failed (${response.status})`;
        console.error('Login error response:', data);
        throw new Error(errorMessage);
      }

      // Validate response data
      if (!data.token) {
        throw new Error('No token received from server');
      }

      if (!data.user) {
        throw new Error('No user data received from server');
      }

      toast.success('Login successful!');

      // Update auth context first (this sets localStorage and user state)
      login(data.token, data.user);

      // Check for pending event registration (user tried to register before logging in)
      const pendingRegistration = sessionStorage.getItem('pendingEventRegistration');
      if (pendingRegistration) {
        try {
          const pending = JSON.parse(pendingRegistration);
          console.log('📋 Found pending event registration:', pending.eventName);
          toast.info(`Returning to "${pending.eventName}" registration...`);
          // Redirect to events page - EventsWrapper will handle the rest
          onNavigate('events');
          return;
        } catch (e) {
          console.error('Failed to parse pending registration:', e);
          sessionStorage.removeItem('pendingEventRegistration');
        }
      }
      
      // Check if user is admin and redirect accordingly (case-insensitive)
      const userRole = data.user?.role ? String(data.user.role).toLowerCase() : '';
      console.log('🔍 Normalized role:', userRole);
      
      // Small delay to ensure localStorage is saved before navigation
      setTimeout(() => {
        if (userRole === 'admin') {
          console.log('✅ Redirecting to admin portal');
          onNavigate('admin');
        } else {
          console.log('✅ Redirecting to homepage');
          onNavigate('home');
        }
      }, 100);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(page);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col">
      {/* Custom Header for Sign In */}
      <Header onNavigate={onNavigate} currentPage="signin" />
      <div className="flex flex-col lg:flex-row flex-1">
      {/* Left Side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 bg-gradient-to-br from-white to-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-3 tracking-tight">Sign in</h1>
            <p className="text-sm sm:text-base text-[#666]">
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('signup')}
                className="text-[#e0cb23] font-semibold hover:text-[#cdb720] transition-colors underline-offset-2 hover:underline"
              >
                Create now
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail</label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white border-gray-300 focus:border-[#e0cb23] focus:ring-[#e0cb23] transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full bg-white pr-10 border-gray-300 focus:border-[#e0cb23] focus:ring-[#e0cb23] transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-[#555]">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-[#e0cb23] font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#e0cb23] text-black hover:bg-[#cdb720] font-semibold h-12 text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#ddd]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#f7f7f7] text-[#555]">or</span>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white border border-[#ddd] text-black hover:bg-[#f5f5f5] h-12 flex items-center justify-center gap-2"
              onClick={() => {
                // Redirect to backend OAuth endpoint
                const backendUrl = getAPI_URL().replace('/api', '');
                console.log('🔵 Redirecting to Google OAuth:', `${backendUrl}/auth/google`);
                window.location.href = `${backendUrl}/auth/google`;
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white border border-[#ddd] text-black hover:bg-[#f5f5f5] h-12 flex items-center justify-center gap-2"
              onClick={() => {
                // Redirect to backend OAuth endpoint
                const backendUrl = getAPI_URL().replace('/api', '');
                console.log('🔵 Redirecting to Facebook OAuth:', `${backendUrl}/auth/facebook`);
                window.location.href = `${backendUrl}/auth/facebook`;
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Continue with Facebook</span>
            </Button>
          </div>
        </div>
      </div>

    {/* Right Side - Tennis Rackets and Balls Image */}
    <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#e0cb23] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#e0cb23] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
            <img
              src="/images/tennis-rackets-balls.jpg"
              alt="Tennis rackets and balls on court"
              className="w-full h-full max-h-[90vh] object-contain rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                // Fallback to one of the existing tennis images if the file doesn't exist
                const target = e.target as HTMLImageElement;
                target.src = '/images/Tennis.png';
              }}
            />
            {/* Overlay gradient for better image visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
          </div>
        </div>
      </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
