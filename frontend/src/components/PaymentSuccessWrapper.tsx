import { MouseEvent } from 'react';
import PaymentSuccess from '../Pages/Payment/PaymentSuccess';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'payment' | 'paymentSuccess';

interface PaymentSuccessWrapperProps {
  onNavigate: (page: Page) => void;
}

export function PaymentSuccessWrapper({ onNavigate }: PaymentSuccessWrapperProps) {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const text = target.textContent?.trim();
    const normalizedText = text?.replace(/\u2019/g, "'");

    // Handle navigation clicks
    if (normalizedText === 'Home') {
      onNavigate('home');
    } else if (normalizedText === 'Events') {
      onNavigate('events');
    } else if (normalizedText === 'Clubs') {
      onNavigate('clubs');
    } else if (normalizedText === 'Coaches') {
      onNavigate('coaches');
    } else if (normalizedText === 'Contact Us') {
      onNavigate('contact');
    }
  };

  const handleBookAnother = () => {
    onNavigate('events');
  };

  return (
    <div onClick={handleClick}>
      <PaymentSuccess onNavigate={onNavigate} onBookAnother={handleBookAnother} />
    </div>
  );
}

