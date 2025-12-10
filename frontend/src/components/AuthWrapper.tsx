import { useState } from 'react';
import { SignIn } from '../Pages/Auth/SignIn';
import { SignUp } from '../Pages/Auth/SignUp';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player' | 'payment' | 'paymentSuccess';

interface AuthWrapperProps {
  onNavigate: (page: Page) => void;
}

export function AuthWrapper({ onNavigate }: AuthWrapperProps) {
  const [authPage, setAuthPage] = useState<'signin' | 'signup'>('signin');

  const handleNavigate = (page: Page) => {
    if (page === 'signin' || page === 'signup') {
      setAuthPage(page);
    } else {
      onNavigate(page);
    }
  };

  return authPage === 'signin' ? (
    <SignIn onNavigate={handleNavigate} />
  ) : (
    <SignUp onNavigate={handleNavigate} />
  );
}

