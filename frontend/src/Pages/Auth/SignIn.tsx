import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface SignInProps {
  onNavigate: (page: Page) => void;
}

const LOGO_SRC = '/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png';
const AJH_SPORTS_IMAGE = '/images/ajhsports.png';

export function SignIn({ onNavigate }: SignInProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Connect to backend
    onNavigate('player');
  };

  const handleNavClick = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(page);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col">
      {/* Custom Header for Sign In */}
      <Header onNavigate={onNavigate} />
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
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full bg-white pr-10 border-gray-300 focus:border-[#e0cb23] focus:ring-[#e0cb23] transition-all"
                  required
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
            >
              Sign in
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
              className="w-full bg-white border border-[#ddd] text-black hover:bg-[#f5f5f5] h-12"
            >
              <span className="text-xl mr-3">G</span>
              Continue with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white border border-[#ddd] text-black hover:bg-[#f5f5f5] h-12"
            >
              <span className="text-xl mr-3">f</span>
              Continue with Facebook
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
