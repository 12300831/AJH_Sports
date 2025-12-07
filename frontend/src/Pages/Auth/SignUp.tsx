import { useState, FormEvent } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface SignUpProps {
  onNavigate: (page: Page) => void;
}

const TENNIS_IMAGE = '/images/adult.jpg';

export function SignUp({ onNavigate }: SignUpProps) {
  const [showPassword, setShowPassword] = useState(false);

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
      {/* Left Side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-black mb-8">Let's get you started</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Full name</label>
              <Input
                type="text"
                placeholder="Enter your fullname"
                className="w-full bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Email address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Role</label>
              <select
                className="w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-base outline-none focus:border-[#e0cb23] focus:ring-2 focus:ring-[#e0cb23]/20"
                required
              >
                <option value="">Select your role</option>
                <option value="player">Player</option>
                <option value="coach">Coach</option>
                <option value="club">Club</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Phone number</label>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Create password</label>
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
              <div className="mt-2 space-y-1">
                <p className="text-xs text-[#555]">Password must contain a minimum of 8 characters</p>
                <p className="text-xs text-[#555]">Password must contain at least one symbol e.g. @.!</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Location (Optional)</label>
              <select className="w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-base outline-none focus:border-[#e0cb23] focus:ring-2 focus:ring-[#e0cb23]/20">
                <option value="">Select Location</option>
                <option value="sydney">Sydney, NSW</option>
                <option value="melbourne">Melbourne, VIC</option>
                <option value="brisbane">Brisbane, QLD</option>
                <option value="central-coast">Central Coast, NSW</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#e0cb23] text-black hover:bg-[#cdb720] font-semibold h-12 text-base mt-6"
            >
              Sign Up
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#555]">
            Already a user?{' '}
            <button
              onClick={() => handleNavClick('signin')}
              className="text-[#e0cb23] font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Tennis Image */}
      <div className="hidden lg:flex flex-1 bg-[#f7f7f7] items-center justify-center p-8">
        <img
          src={TENNIS_IMAGE}
          alt="Tennis Court"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
}