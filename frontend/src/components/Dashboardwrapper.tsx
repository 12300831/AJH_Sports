import { SportsBookingDashboard } from '../Pages/Dashboard/SportsBookingDashboard';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'dashboard' | 'player' | 'payment' | 'paymentSuccess';

interface DashboardWrapperProps {
  onNavigate: (page: Page) => void;
}

export function DashboardWrapper({ onNavigate }: DashboardWrapperProps) {
  return <SportsBookingDashboard onNavigate={onNavigate} />;
}

