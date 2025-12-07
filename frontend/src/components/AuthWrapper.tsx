import { useState, useEffect } from 'react';
import { SignIn } from '../Pages/Auth/SignIn';
import { SignUp } from '../Pages/Auth/SignUp';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player';

interface AuthWrapperProps {
  onNavigate: (page: Page) => void;
  currentPage?: Page;
}

export function AuthWrapper({ onNavigate, currentPage }: AuthWrapperProps) {
  const [authPage, setAuthPage] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    if (currentPage === 'signup') {
      setAuthPage('signup');
    } else if (currentPage === 'signin' || currentPage === 'account') {
      setAuthPage('signin');
    }
  }, [currentPage]);

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