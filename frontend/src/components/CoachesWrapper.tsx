import { MouseEvent, useState } from 'react';
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

type Page = 'home' | 'clubs' | 'account' | 'events' | 'coaches' | 'contact';
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
  const [view, setView] = useState<CoachView>('landing');

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const text = target.textContent?.trim();
    const normalizedText = text?.replace(/\u2019/g, "'"); // normalize smart quotes in menu items

    if (target.tagName === 'A') {
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
    } else if (normalizedText === 'Contact Us') {
      onNavigate('contact');
      setView('landing');
    } else if (normalizedText === 'Log In' || normalizedText === 'Sign Up') {
      onNavigate('account');
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

  const handlePay = () => {
    setView('paymentsuccess');
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
          onPay={handlePay}
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
        <Coaching onBack={() => setView('landing')} />
      ) : view === 'list' ? (
        <CoachesPage onViewProfile={handleViewProfile} onBack={handleBackToLanding} />
      ) : (
        <Coaches
          onShowCoachesList={() => setView('list')}
          onShowLessons={() => setView('lessons')}
        />
      )}
    </div>
  );
}
