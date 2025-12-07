import { useState, FormEvent } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface SignInProps {
  onNavigate: (page: Page) => void;
}

const LOGO_SRC = '/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png';

export function SignIn({ onNavigate }: SignInProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Connect to backend
    onNavigate('dashboard');
  };

  const handleNavClick = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(page);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex">
      {/* Left Side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-black mb-2">Sign in</h1>
          <p className="text-base text-[#555] mb-8">
            Don't have an account?{' '}
            <button
              onClick={() => handleNavClick('signup')}
              className="text-[#e0cb23] font-semibold hover:underline"
            >
              Create now
            </button>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">E-mail</label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full bg-white pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-black"
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
              className="w-full bg-[#e0cb23] text-black hover:bg-[#cdb720] font-semibold h-12 text-base"
            >
              Sign in
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#ddd]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#f7f7f7] text-[#555]">OR</span>
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

      {/* Right Side - Branding Image */}
      <div className="hidden lg:flex flex-1 bg-black items-center justify-center relative">
        <div className="absolute top-8 left-8">
          <img src={LOGO_SRC} alt="AJH Sports" className="h-12" />
        </div>
        <div className="text-center text-white">
          <div className="flex gap-4 justify-center mb-4">
            <span className="text-4xl">🏃</span>
            <span className="text-4xl">🏒</span>
            <span className="text-4xl">⛳</span>
            <span className="text-4xl">🎾</span>
            <span className="text-4xl">🏀</span>
            <span className="text-4xl">⚽</span>
          </div>
          <h2 className="text-6xl font-bold mb-8">SPORTS</h2>
          <p className="text-2xl">0447827788</p>
        </div>
      </div>
    </div>
  );
}