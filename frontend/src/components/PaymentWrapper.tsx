import { MouseEvent } from 'react';
import Payment from '../Pages/Payment/Payment';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'payment' | 'paymentSuccess';

interface PaymentWrapperProps {
  onNavigate: (page: Page) => void;
}

export function PaymentWrapper({ onNavigate }: PaymentWrapperProps) {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const text = target.textContent?.trim();
    const normalizedText = text?.replace(/\u2019/g, "'");

    // Handle navigation clicks
    if (normalizedText === 'Home') {
      onNavigate('home');
    } else if (normalizedText === 'Events' || text === 'Back to Events') {
      onNavigate('events');
    } else if (normalizedText === 'Clubs') {
      onNavigate('clubs');
    } else if (normalizedText === 'Coaches') {
      onNavigate('coaches');
    } else if (normalizedText === 'Contact Us') {
      onNavigate('contact');
    }
  };

  const handlePaymentSuccess = () => {
    onNavigate('paymentSuccess');
  };

  return (
    <div onClick={handleClick}>
      <Payment onNavigate={onNavigate} onPaymentSuccess={handlePaymentSuccess} />
    </div>
  );
}

