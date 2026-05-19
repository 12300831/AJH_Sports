import { MouseEvent, useState, useEffect } from 'react';
import Coaches from '../Pages/Coaches/Coaches';
import CoachesPage from '../Pages/Coaches/CoachesPage';
import Michael from '../Pages/Coaches/Michael';
import BookNow from '../Pages/Coaches/BookNow';
import BookingSummary from '../Pages/Coaches/BookingSummary';
import PaymentMethod from '../Pages/Coaches/PaymentMethod';
import PaymentSuccess from '../Pages/Coaches/PaymentSuccess';
import PaymentHistory from '../Pages/Coaches/PaymentHistory';
import Receipt from '../Pages/Coaches/Receipt';
import Coaching from '../Pages/Coaches/Coaching';

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup';
type CoachView =
  | 'landing'
  | 'list'
  | 'michael'
  | 'booknow'
  | 'bookingsummary'
  | 'paymentmethod'
  | 'paymentsuccess'
  | 'paymenthistory'
  | 'receipt'
  | 'lessons';

interface CoachesWrapperProps {
  onNavigate: (page: Page) => void;
}

export function CoachesWrapper({ onNavigate }: CoachesWrapperProps) {
  // Check URL for view parameter to determine initial view
  const getInitialView = (): CoachView => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('view') === 'list') {
      return 'list';
    }
    return 'landing';
  };

  const [view, setView] = useState<CoachView>(getInitialView());
  const [coachesListKey, setCoachesListKey] = useState(Date.now());
  const [lessonsListKey, setLessonsListKey] = useState(Date.now());
  
  // Force remount of CoachesPage when view changes to 'list' to ensure fresh data
  useEffect(() => {
    if (view === 'list') {
      // Increment key to force remount, ensuring fresh data fetch
      setCoachesListKey(Date.now());
      // Also trigger a reload event for immediate refresh
      window.dispatchEvent(new CustomEvent('coachesPageReload'));
    }
  }, [view]);

  // Force remount of Coaching page when view changes to 'lessons' to ensure fresh data
  useEffect(() => {
    if (view === 'lessons') {
      // Increment key to force remount, ensuring fresh data fetch
      setLessonsListKey(Date.now());
      // Also trigger a reload event for immediate refresh
      window.dispatchEvent(new CustomEvent('lessonsPageReload'));
    }
  }, [view]);

  // Force reload when component mounts and view is already 'list' or 'lessons'
  // This ensures fresh data when navigating to coaches/lessons page from another page
  useEffect(() => {
    if (view === 'list') {
      console.log('🔄 CoachesWrapper mounted with list view - triggering reload');
      setCoachesListKey(Date.now());
      window.dispatchEvent(new CustomEvent('coachesPageReload'));
    } else if (view === 'lessons') {
      console.log('🔄 CoachesWrapper mounted with lessons view - triggering reload');
      setLessonsListKey(Date.now());
      window.dispatchEvent(new CustomEvent('lessonsPageReload'));
    }
  }, []); // Empty deps - only on mount

  // Ensure page scrolls to top when component mounts or view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);

  // Listen for URL changes to update view if needed
  useEffect(() => {
    const checkUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('view') === 'list' && view !== 'list') {
        setView('list');
      } else if (!urlParams.get('view') && view === 'list') {
        // If URL doesn't have view=list but we're on list view, keep it
        // This prevents switching back to landing when URL is cleaned up
      }
    };

    checkUrl();
    window.addEventListener('popstate', checkUrl);
    window.addEventListener('locationchange', checkUrl);
    
    return () => {
      window.removeEventListener('popstate', checkUrl);
      window.removeEventListener('locationchange', checkUrl);
    };
  }, [view]);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const text = target.textContent?.trim();
    const normalizedText = text?.replace(/\u2019/g, "'"); // normalize smart quotes in menu items

    // Don't interfere with buttons or modals
    if (target.tagName === 'BUTTON' || target.closest('button') || target.closest('[role="dialog"]')) {
      return; // Let buttons and modals handle their own clicks
    }

    // Only prevent default on navigation links (header menu), not social media links
    // Check if it's a social media link by checking if it has target="_blank" and rel="noopener noreferrer"
    if (target.tagName === 'A') {
      const link = target as HTMLAnchorElement;
      // Allow social media links to work normally
      if (link.target === '_blank' && link.rel.includes('noopener')) {
        return; // Don't prevent default for external links
      }
      e.preventDefault();
    }

    if (normalizedText === 'Home') {
      onNavigate('home');
      setView('landing');
    } else if (normalizedText === 'Events') {
      onNavigate('events');
      setView('landing');
    } else if (normalizedText === 'Clubs') {
      onNavigate('clubs');
      setView('landing');
    } else if (normalizedText === 'Coaches') {
      onNavigate('coaches');
    } else if (normalizedText === 'Contact Us' || normalizedText === 'Contact') {
      onNavigate('contact');
      setView('landing');
    } else if (normalizedText === 'Log In' || normalizedText === 'Login') {
      onNavigate('signin');
      setView('landing');
    } else if (normalizedText === 'Sign Up' || normalizedText === 'Signup') {
      onNavigate('signup');
      setView('landing');
    }
  };

  const handleViewProfile = (coachId: string) => {
    if (coachId === 'michael-rodriguez') {
      setView('michael');
    }
  };

  const handleBackToLanding = () => {
    setView('landing');
  };

  const handleBackToList = () => {
    setView('list');
  };

  const handleBookNow = () => {
    setView('booknow');
  };

  const handleBookingSubmit = () => {
    setView('bookingsummary');
  };

  const handleBackToMichael = () => {
    setView('michael');
  };

  const handleBackToBooking = () => {
    setView('booknow');
  };

  const handleProceedToPayment = () => {
    setView('paymentmethod');
  };

  const handleBackToSummary = () => {
    setView('bookingsummary');
  };

  const handleGoToHistory = () => {
    setView('paymenthistory');
  };

  const handleGoToPaymentSuccess = () => {
    setView('paymentsuccess');
  };

  const handleGoToReceipt = () => {
    setView('receipt');
  };

  const handleBookAnotherSession = () => {
    setView('list');
  };

  return (
    <div onClick={handleClick}>
      {view === 'michael' ? (
        <Michael onBack={handleBackToList} onBookNow={handleBookNow} />
      ) : view === 'booknow' ? (
        <BookNow onBack={handleBackToMichael} onSubmit={handleBookingSubmit} />
      ) : view === 'bookingsummary' ? (
        <BookingSummary onBack={handleBackToBooking} onProceed={handleProceedToPayment} />
      ) : view === 'paymentmethod' ? (
        <PaymentMethod
          onBack={handleBackToSummary}
          onSummary={handleBackToSummary}
        />
      ) : view === 'paymentsuccess' ? (
        <PaymentSuccess
          onSummary={handleBackToSummary}
          onMethod={() => setView('paymentmethod')}
          onHistory={handleGoToHistory}
          onReceipt={handleGoToReceipt}
          onBookAnother={handleBookAnotherSession}
        />
      ) : view === 'paymenthistory' ? (
        <PaymentHistory
          onSummary={handleBackToSummary}
          onMethod={() => setView('paymentmethod')}
          onSuccess={handleGoToPaymentSuccess}
          onReceipt={handleGoToReceipt}
        />
      ) : view === 'receipt' ? (
        <Receipt onBack={() => setView('paymentsuccess')} />
      ) : view === 'lessons' ? (
        <Coaching key={`lessons-${lessonsListKey}`} onBack={() => setView('landing')} />
      ) : view === 'list' ? (
        <CoachesPage key={`coaches-list-${coachesListKey}`} onViewProfile={handleViewProfile} onBack={handleBackToLanding} />
      ) : (
        <Coaches
          onShowCoachesList={() => {
            console.log('🔄 View Our Coaches clicked - switching to list view and forcing reload');
            // Force reload by updating key and triggering event
            setCoachesListKey(Date.now());
            window.dispatchEvent(new CustomEvent('coachesPageReload'));
            setView('list');
          }}
          onShowLessons={() => {
            console.log('🔄 View Tennis Lessons clicked - switching to lessons view and forcing reload');
            // Force reload by updating key and triggering event
            setLessonsListKey(Date.now());
            window.dispatchEvent(new CustomEvent('lessonsPageReload'));
            setView('lessons');
          }}
        />
      )}
    </div>
  );
}
