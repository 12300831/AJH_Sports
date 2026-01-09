import React, { useEffect, useState } from 'react';
import { HomepageWrapper } from './components/HomepageWrapper';
import { ClubMainWrapper } from './components/ClubMainWrapper';
import { OurClubsWrapper } from './components/OurClubsWrapper';
import { ClubAccountWrapper } from './components/ClubAccountWrapper';
import { ContactWrapper } from './components/ContactWrapper';
import { EventsWrapper } from './events/EventsWrapper';
import { CoachesWrapper } from './components/CoachesWrapper';
import { PaymentWrapper } from './components/PaymentWrapper';
import { PaymentSuccessWrapper } from './components/PaymentSuccessWrapper';
import { AuthWrapper } from './components/AuthWrapper';
import { DashboardWrapper } from './components/Dashboardwrapper';
import { PlayerWrapper } from './components/Playerwrapper';
import { AdminWrapper } from './components/admin/AdminWrapper';
import { Toaster } from './components/ui/sonner';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player' | 'payment' | 'paymentSuccess' | 'admin' | 'adminEvents' | 'adminCoaches' | 'adminUsers' | 'adminBookings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Map URL paths to page states
  const pathToPage: Record<string, Page> = {
    '/': 'home',
    '/home': 'home',
    '/clubs': 'clubs',
    '/clubsList': 'clubsList',
    '/account': 'account',
    '/events': 'events',
    '/coaches': 'coaches',
    '/contact': 'contact',
    '/signin': 'signin',
    '/signup': 'signup',
    '/dashboard': 'dashboard',
    '/player': 'player',
    '/payment': 'payment',
    '/paymentSuccess': 'paymentSuccess',
    '/admin': 'admin',
    '/admin/events': 'adminEvents',
    '/admin/coaches': 'adminCoaches',
    '/admin/users': 'adminUsers',
    '/admin/bookings': 'adminBookings',
  };

  // Map page states to URL paths
  const pageToPath: Record<Page, string> = {
    home: '/',
    clubs: '/clubs',
    clubsList: '/clubsList',
    account: '/account',
    events: '/events',
    coaches: '/coaches',
    contact: '/contact',
    signin: '/signin',
    signup: '/signup',
    dashboard: '/dashboard',
    player: '/player',
    payment: '/payment',
    paymentSuccess: '/paymentSuccess',
    admin: '/admin',
    adminEvents: '/admin/events',
    adminCoaches: '/admin/coaches',
    adminUsers: '/admin/users',
    adminBookings: '/admin/bookings',
  };

  // Handle URL-based routing on initial load and URL changes
  useEffect(() => {
    const updatePageFromPath = () => {
      const path = window.location.pathname;
      const page = pathToPage[path] || 'home';
      setCurrentPage(page);
    };

    updatePageFromPath();

    // Listen for browser back/forward navigation
    const handlePopState = () => {
      updatePageFromPath();
    };

    // Listen for custom location change events
    const handleLocationChange = () => {
      updatePageFromPath();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('locationchange', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('locationchange', handleLocationChange);
    };
  }, []);

  const handleNavigate = (page: Page) => {
    // Scroll to top on page change (use instant for immediate scroll)
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentPage(page);
    
    // Update URL without page reload
    // Preserve query parameters if they exist (they might have been set before navigation)
    const path = pageToPath[page] || '/';
    const currentSearch = window.location.search;
    const finalPath = currentSearch ? `${path}${currentSearch}` : path;
    // Only update if the path is different to avoid unnecessary history entries
    if (window.location.pathname !== path || window.location.search !== currentSearch) {
      window.history.pushState({ page }, '', finalPath);
    }
    
    // Ensure scroll after a brief delay to handle any async rendering
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomepageWrapper onNavigate={handleNavigate} />;
      case 'clubs':
        // "Clubs" in the header shows the Join Our Club page
        return <ClubMainWrapper onNavigate={handleNavigate} />;
    case 'clubsList':
        // Detailed youth/adult clubs page
        return <OurClubsWrapper onNavigate={handleNavigate} />;
      case 'events':
        return <EventsWrapper onNavigate={handleNavigate} />;
      case 'account':
        return <ClubAccountWrapper onNavigate={handleNavigate} />;
      case 'signin':
      case 'signup':
        return <AuthWrapper onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardWrapper onNavigate={handleNavigate} />;
      case 'player':
        return <PlayerWrapper onNavigate={handleNavigate} />;
      case 'coaches':
        return <CoachesWrapper onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactWrapper onNavigate={handleNavigate} />;
      case 'payment':
        return <PaymentWrapper onNavigate={handleNavigate} />;
      case 'paymentSuccess':
        return <PaymentSuccessWrapper onNavigate={handleNavigate} />;
      case 'admin':
      case 'adminEvents':
      case 'adminCoaches':
      case 'adminUsers':
      case 'adminBookings':
        return <AdminWrapper onNavigate={handleNavigate} />;
      default:
        return <ClubMainWrapper onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden flex flex-col">
      <div className="w-full relative flex-1 flex flex-col">
        {renderPage()}
      </div>
      <Toaster />
    </div>
  );
}
