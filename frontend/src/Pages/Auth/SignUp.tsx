import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { getAPI_URL } from '../../services/api';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface SignUpProps {
  onNavigate: (page: Page) => void;
}

const LOGO_SRC = '/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png';
const TENNIS_IMAGE = '/images/tennis-rackets-balls.jpg';

export function SignUp({ onNavigate }: SignUpProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    location: '',
    sports: 'Tennis',
  });
  const { login } = useAuth();

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) return false;
    // Check for at least one symbol
    const symbolRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    return symbolRegex.test(password);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        toast.error('Please enter your full name');
        setLoading(false);
        return;
      }

      if (!formData.email.trim()) {
        toast.error('Please enter your email address');
        setLoading(false);
        return;
      }

      if (!formData.phone.trim()) {
        toast.error('Please enter your phone number');
        setLoading(false);
        return;
      }

      if (!formData.password) {
        toast.error('Please enter a password');
        setLoading(false);
        return;
      }

      // Validate password strength
      if (!validatePassword(formData.password)) {
        toast.error('Password must be at least 8 characters and contain at least one symbol (e.g., @.!)');
        setLoading(false);
        return;
      }

      // Normalize email (trim and lowercase)
      const normalizedEmail = formData.email.trim().toLowerCase();

      // Call signup API
      const response = await fetch(`${getAPI_URL()}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: normalizedEmail,
          phone: formData.phone.trim(),
          location: formData.location || null,
          password: formData.password,
          sports: formData.sports || 'Tennis',
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error(`Server returned invalid response (status ${response.status}). Please check if the backend server is running.`);
      }

      if (!response.ok) {
        const errorMessage = data.message || data.error || `Signup failed (${response.status})`;
        console.error('Signup error response:', data);
        throw new Error(errorMessage);
      }

      // Validate response data
      if (!data.token) {
        throw new Error('No token received from server');
      }

      if (!data.user) {
        throw new Error('No user data received from server');
      }

      toast.success('Account created successfully!');

      // Update auth context (this sets localStorage and user state)
      login(data.token, data.user);

      // Redirect to home page
      setTimeout(() => {
        onNavigate('home');
      }, 100);
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account. Please try again.');
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
      {/* Custom Header for Sign Up */}
      <Header onNavigate={onNavigate} currentPage="signup" />
      <div className="flex flex-col lg:flex-row flex-1">
      {/* Left Side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 bg-gradient-to-br from-white to-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-3 tracking-tight">Let's get you started</h1>
            <div className="w-16 h-1 bg-[#e0cb23] mb-4"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full name</label>
              <Input
                type="text"
                placeholder="Enter your fullname"
                className="w-full bg-white border-gray-300 focus:border-[#e0cb23] focus:ring-[#e0cb23] transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white border-gray-300 focus:border-[#e0cb23] focus:ring-[#e0cb23] transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Phone number</label>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full bg-white border-gray-300 focus:border-[#e0cb23] focus:ring-[#e0cb23] transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Create password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full bg-white border-gray-300 focus:border-[#e0cb23] focus:ring-[#e0cb23] transition-all pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-black"
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-[#555]">Password must contain a minimum of 8 characters</p>
                <p className="text-xs text-[#555]">Password must contain at least one symbol e.g. @.!</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location (Optional)</label>
              <select 
                className="w-full h-9 sm:h-10 rounded-md border border-gray-300 bg-white px-3 py-1 text-base md:text-sm outline-none focus:border-[#e0cb23] focus:ring-2 focus:ring-[#e0cb23]/20 transition-all"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={loading}
              >
                <option value="">Select Location</option>
                <option value="Sydney, NSW">Sydney, NSW</option>
                <option value="Melbourne, VIC">Melbourne, VIC</option>
                <option value="Brisbane, QLD">Brisbane, QLD</option>
                <option value="Central Coast, NSW">Central Coast, NSW</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sport <span className="text-red-500">*</span></label>
              <select 
                className="w-full h-9 sm:h-10 rounded-md border border-gray-300 bg-white px-3 py-1 text-base md:text-sm outline-none focus:border-[#e0cb23] focus:ring-2 focus:ring-[#e0cb23]/20 transition-all"
                value={formData.sports}
                onChange={(e) => setFormData({ ...formData, sports: e.target.value })}
                required
                disabled={loading}
              >
                <option value="Tennis">Tennis</option>
                <option value="Table Tennis">Table Tennis</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#e0cb23] text-black hover:bg-[#cdb720] font-semibold h-11 sm:h-12 text-sm sm:text-base mt-4 sm:mt-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] border-0"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          <p className="mt-4 sm:mt-6 text-center text-sm text-[#555]">
            Already a user?{' '}
            <button
              onClick={() => onNavigate('signin')}
              className="text-[#e0cb23] font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Tennis Rackets and Balls Image */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center p-8 xl:p-12 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#e0cb23] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#e0cb23] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
            <img
              src={TENNIS_IMAGE}
              alt="Tennis rackets and balls on court"
              className="w-full h-full max-h-[90vh] object-contain rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                // Fallback to one of the existing tennis images if the file doesn't exist
                const target = e.target as HTMLImageElement;
                target.src = '/images/Tennis.png';
              }}
            />
            {/* Overlay gradient for better image visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
