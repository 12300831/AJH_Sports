import { FormEvent, useState, useEffect, useCallback } from 'react';
import { createCheckoutSession, PAYMENT_ERROR_CODES } from '../services/paymentService';
import { isUserLoggedIn, getCurrentUser, fetchEvents as apiFetchEvents } from '../services/eventService';
import { toast } from 'sonner';

// Images are served from the public folder at the root path (/images/...)
const Image_tennis = '/images/TT.png';
const Image_tt = '/images/Tennis.png';
const Image_tennis_court = '/images/TennisOpen.png';
const Image_tt_table = '/images/TTCup.png';
const Image_kids_in_sports = '/images/KidsSports.png';
const Image_coaching = '/images/OneonOneCoaching.png';
const imgAjhSportsLogo = '/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png';

// Hero images for event detail pages - High quality images
const Image_tennis_hero = '/images/tennis-ball-hero.jpg';
const Image_tt_hero = '/images/table-tennis-players-hero.jpg';
const Image_kids_hero = '/images/kids-tug-of-war-hero.jpg';
const Image_coaching_hero = '/images/tennis-court-hero.jpg';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup' | 'payment';

interface EventsWrapperProps {
  onNavigate: (page: Page) => void;
}

type EventCategory = 'all' | 'tournament' | 'coaching' | 'party';

interface Event {
  id: number;
  image: string;
  heroImage: string;
  title: string;
  alt: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  spots: number;
  price: string;
  featured: boolean;
  description: string;
  fullDescription?: string;
  whoCanJoin?: string;
  entryFee?: string;
  whatsIncluded?: string;
  registrationDeadline?: string;
  venue?: string;
}

// Default event display data (images, descriptions, etc.)
// This will be merged with live data from the backend
const defaultEventDisplayData: Record<number, Partial<Event>> = {
  1: {
    image: Image_tennis_court,
    heroImage: Image_tennis_hero,
    alt: 'Tennis Open 2025',
    category: 'tournament',
    featured: true,
    fullDescription: 'Experience the thrill of competition at the Tennis Open! Designed for players of all abilities, this event includes round-robin matches followed by knockout rounds. Winners will receive trophies and vouchers for AJH coaching sessions.',
    whoCanJoin: 'Juniors & Adults, Singles & Doubles formats available',
    whatsIncluded: 'Access to practice courts, refreshments, and event photography',
    registrationDeadline: 'August 1, 2025',
    venue: 'Outdoor Tennis Courts',
  },
  2: {
    image: Image_tt_table,
    heroImage: Image_tt_hero,
    alt: 'Table Tennis Tournament 2025',
    category: 'tournament',
    featured: true,
    fullDescription: 'Join us for an exciting table tennis tournament! Compete against players of similar skill levels in this fast-paced event. Categories include singles and doubles for both juniors and adults.',
    whoCanJoin: 'All ages welcome, Beginner to Advanced levels',
    whatsIncluded: 'Equipment provided, refreshments, medals for winners',
    registrationDeadline: 'January 15, 2025',
    venue: 'Indoor Sports Hall',
  },
  3: {
    image: Image_kids_in_sports,
    heroImage: Image_kids_hero,
    alt: 'Kids Sports Parties',
    category: 'party',
    featured: false,
    fullDescription: 'Make your child\'s birthday unforgettable with our sports party package! Kids will enjoy a variety of fun sports activities including tennis, table tennis, and team games. Our experienced coaches ensure a safe and exciting experience.',
    whoCanJoin: 'Kids aged 5-12 years',
    whatsIncluded: 'All equipment, party coordinator, certificates for all participants',
    registrationDeadline: 'Book at least 2 weeks in advance',
    venue: 'Party Area',
  },
  4: {
    image: Image_coaching,
    heroImage: Image_coaching_hero,
    alt: '1-on-1 Coaching',
    category: 'coaching',
    featured: false,
    fullDescription: 'Take your game to the next level with personalized one-on-one coaching. Our Level 3 certified coaches will work with you to improve your technique, strategy, and mental game. Suitable for all ages and skill levels.',
    whoCanJoin: 'All ages and skill levels',
    whatsIncluded: 'Video analysis, personalized training plan, progress tracking',
    registrationDeadline: 'Book 48 hours in advance',
    venue: 'Training Courts',
  },
};

// Fallback events if backend is unavailable
const fallbackEvents: Event[] = [
  {
    id: 1,
    image: Image_tennis_court,
    heroImage: Image_tennis_hero,
    title: 'Tennis Open 2025',
    alt: 'Tennis Open 2025',
    category: 'tournament',
    date: 'August 10-18, 2025',
    time: '9:00 AM - 6:00 PM',
    location: 'AJH Sportscentre',
    spots: 24,
    price: '$30',
    featured: true,
    description: 'Annual tennis championship for all skill levels.',
    fullDescription: 'Experience the thrill of competition at the Tennis Open! Designed for players of all abilities, this event includes round-robin matches followed by knockout rounds. Winners will receive trophies and vouchers for AJH coaching sessions.',
    whoCanJoin: 'Juniors & Adults, Singles & Doubles formats available',
    entryFee: '$30 per player/team',
    whatsIncluded: 'Access to practice courts, refreshments, and event photography',
    registrationDeadline: 'August 1, 2025',
    venue: 'Outdoor Tennis Courts',
  },
  {
    id: 2,
    image: Image_tt_table,
    heroImage: Image_tt_hero,
    title: 'Table Tennis Tournament',
    alt: 'Table Tennis Tournament 2025',
    category: 'tournament',
    date: 'Jan 22, 2025',
    time: '10:00 AM - 4:00 PM',
    location: 'AJH Sportscentre',
    spots: 32,
    price: '$35',
    featured: true,
    description: 'Fast-paced table tennis action for all ages!',
    fullDescription: 'Join us for an exciting table tennis tournament! Compete against players of similar skill levels in this fast-paced event. Categories include singles and doubles for both juniors and adults.',
    whoCanJoin: 'All ages welcome, Beginner to Advanced levels',
    entryFee: '$35 per player',
    whatsIncluded: 'Equipment provided, refreshments, medals for winners',
    registrationDeadline: 'January 15, 2025',
    venue: 'Indoor Sports Hall',
  },
  {
    id: 3,
    image: Image_kids_in_sports,
    heroImage: Image_kids_hero,
    title: 'Kids Sports Party',
    alt: 'Kids Sports Parties',
    category: 'party',
    date: 'Every Weekend',
    time: '2:00 PM - 5:00 PM',
    location: 'AJH Sportscentre',
    spots: 20,
    price: '$25/child',
    featured: false,
    description: 'Fun sports activities for kids aged 5-12.',
    fullDescription: 'Make your child\'s birthday unforgettable with our sports party package! Kids will enjoy a variety of fun sports activities including tennis, table tennis, and team games. Our experienced coaches ensure a safe and exciting experience.',
    whoCanJoin: 'Kids aged 5-12 years',
    entryFee: '$25 per child (minimum 10 children)',
    whatsIncluded: 'All equipment, party coordinator, certificates for all participants',
    registrationDeadline: 'Book at least 2 weeks in advance',
    venue: 'Party Area',
  },
  {
    id: 4,
    image: Image_coaching,
    heroImage: Image_coaching_hero,
    title: '1-ON-1 Coaching',
    alt: '1-on-1 Coaching',
    category: 'coaching',
    date: 'Book Anytime',
    time: 'Flexible Hours',
    location: 'AJH Sportscentre',
    spots: 0,
    price: 'From $60/hr',
    featured: false,
    description: 'Personalized coaching with expert instructors.',
    fullDescription: 'Take your game to the next level with personalized one-on-one coaching. Our Level 3 certified coaches will work with you to improve your technique, strategy, and mental game. Suitable for all ages and skill levels.',
    whoCanJoin: 'All ages and skill levels',
    entryFee: 'From $60 per hour',
    whatsIncluded: 'Video analysis, personalized training plan, progress tracking',
    registrationDeadline: 'Book 48 hours in advance',
    venue: 'Training Courts',
  },
];

// Helper to determine category from event name
const getCategoryFromName = (name: string): EventCategory => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('tournament') || lowerName.includes('open') || lowerName.includes('championship')) {
    return 'tournament';
  }
  if (lowerName.includes('party') || lowerName.includes('kids') || lowerName.includes('birthday')) {
    return 'party';
  }
  if (lowerName.includes('coaching') || lowerName.includes('lesson') || lowerName.includes('private')) {
    return 'coaching';
  }
  return 'tournament'; // default
};

// Helper to format date from backend
const formatEventDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch {
    return dateStr;
  }
};

// Helper to format time from backend
const formatEventTime = (timeStr: string): string => {
  try {
    // Handle HH:MM:SS format
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  } catch {
    return timeStr;
  }
};

const categories: Array<{ id: EventCategory; label: string; icon: string }> = [
  { id: 'all', label: 'All Events', icon: '✨' },
  { id: 'tournament', label: 'Tournaments', icon: '🏆' },
  { id: 'coaching', label: 'Coaching', icon: '🎓' },
  { id: 'party', label: 'Parties', icon: '🎉' },
];

const stats = [
  { icon: '👥', number: '100+', text: 'Active Players' },
  { icon: '📅', number: '10+', text: 'Monthly Events' },
  { icon: '🏟️', number: '10', text: 'Courts' },
];

// --- COMPONENT ---
export function EventsWrapper({ onNavigate }: EventsWrapperProps) {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('all');
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  
  // Payment unavailable reason - only set when backend returns an actual error
  // Defaults to null (payments available) - we always try the real flow
  const [paymentUnavailableReason, setPaymentUnavailableReason] = useState<string | null>(null);
  
  // Events state - fetched from backend (start empty, load from API)
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  
  // Google Calendar slot availability state (only for Tennis Open 2025)
  const [availableSlots, setAvailableSlots] = useState<Array<{ start: string; end: string; id: string }>>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [gapiLoaded, setGapiLoaded] = useState(false);

  // Fetch events from backend
  const loadEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    setEventsError(null);
    
    try {
      const backendEvents = await apiFetchEvents();
      
      // Transform backend events to frontend format
      // Note: Backend already filters out inactive events for public access
      const transformedEvents: Event[] = backendEvents.map((be) => {
        const displayData = defaultEventDisplayData[be.id] || {};
        const category = displayData.category || getCategoryFromName(be.name);
        
        // Determine images with fallback chain:
        // 1. Backend image_url/hero_image_url (if set by admin)
        // 2. Default display data (hardcoded for known events)
        // 3. Default fallback images
        const cardImage = be.image_url || displayData.image || Image_tennis_court;
        const heroImage = be.hero_image_url || be.image_url || displayData.heroImage || Image_tennis_hero;
        
        return {
          id: be.id,
          title: be.name,
          description: be.description || `Join us for ${be.name}!`,
          date: formatEventDate(be.date),
          time: formatEventTime(be.time),
          location: be.location || 'AJH Sportscentre',
          spots: be.available_spots,
          price: `$${be.price}`,
          // Use backend images if available, otherwise fall back to defaults
          image: cardImage,
          heroImage: heroImage,
          alt: displayData.alt || be.name,
          category: category,
          featured: displayData.featured ?? false,
          fullDescription: displayData.fullDescription || be.description,
          whoCanJoin: displayData.whoCanJoin || 'All ages and skill levels',
          entryFee: `$${be.price} per person`,
          whatsIncluded: displayData.whatsIncluded || 'Equipment and refreshments',
          registrationDeadline: displayData.registrationDeadline || 'Register in advance',
          venue: displayData.venue || be.location || 'AJH Sportscentre',
        };
      });
      
      setEvents(transformedEvents);
      console.log('✅ Loaded', transformedEvents.length, 'events from backend');
      
    } catch (error: any) {
      console.error('Failed to load events:', error);
      
      // Check if this is a connection error (backend not running)
      const isConnectionError = error.message?.includes('Failed to fetch') || 
                                error.message?.includes('NetworkError') ||
                                error.message?.includes('fetch');
      
      if (isConnectionError && import.meta.env.DEV) {
        // In development only: use fallback data if backend is unreachable
        console.warn('⚠️ Backend unreachable in dev mode, using fallback data');
        setEventsError('Backend not available. Showing sample data.');
        setEvents(fallbackEvents);
      } else {
        // In production or for other errors: show error state
        setEventsError('Failed to load events. Please try again later.');
        setEvents([]);
      }
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  // Load events on mount
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Handle Stripe payment return (success or cancel)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    const eventId = params.get('eventId');
    
    if (paymentStatus) {
      console.log('💳 Payment return detected:', { paymentStatus, eventId });
      
      // Clean up URL by removing query params
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
      
      // Clear any pending registration
      sessionStorage.removeItem('pendingEventRegistration');
      
      // Reset all payment UI states
      setSelectedEvent(null);
      setShowPaymentConfirmation(false);
      setPaymentError(null);
      setPaymentUnavailableReason(null);
      setIsProcessingPayment(false);
      
      if (paymentStatus === 'success') {
        toast.success('🎉 Payment successful! Your booking is confirmed.');
        // Refetch events to update available_spots
        loadEvents();
      } else if (paymentStatus === 'cancel') {
        toast.info('Payment cancelled. You can try again when ready.');
      }
    }
  }, []); // Run once on mount

  // Handle pending event registration (user returned after login)
  useEffect(() => {
    // Only check after events are loaded and user is logged in
    if (isLoadingEvents || events.length === 0) return;
    if (!isUserLoggedIn()) return;

    const pendingRegistration = sessionStorage.getItem('pendingEventRegistration');
    if (pendingRegistration) {
      try {
        const pending = JSON.parse(pendingRegistration);
        console.log('📋 Processing pending registration for event:', pending.eventName);
        
        // Find the event by ID
        const event = events.find(e => e.id === pending.eventId);
        if (event) {
          // Clear the pending registration
          sessionStorage.removeItem('pendingEventRegistration');
          
          // Auto-select the event and show payment confirmation step
          setSelectedEvent(event);
          setShowPaymentConfirmation(true); // Go straight to payment confirmation
          toast.success(`Welcome back! Continue your registration for "${event.title}"`);
          
          // Scroll to top to show the event detail
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // Event not found (maybe deleted or inactive)
          sessionStorage.removeItem('pendingEventRegistration');
          toast.error(`Sorry, "${pending.eventName}" is no longer available.`);
        }
      } catch (e) {
        console.error('Failed to process pending registration:', e);
        sessionStorage.removeItem('pendingEventRegistration');
      }
    }
  }, [events, isLoadingEvents]);

  const handleNavClick = (page: Page) => {
    // Always scroll to top first
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    if (onNavigate) {
      onNavigate(page);
    } else {
      const pathMap: Record<Page, string> = {
        home: '/',
        clubs: '/clubs',
        clubsList: '/clubsList',
        account: '/account',
        events: '/events',
        coaches: '/coaches',
        contact: '/contact',
        signin: '/signin',
        signup: '/signup',
        payment: '/payment',
      };
      const path = pathMap[page] || '/';
      window.history.pushState({ page }, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    setIsMobileMenuOpen(false);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    alert(`Thanks for subscribing${email ? ` with ${email}` : ''}!`);
    event.currentTarget.reset();
  };

  const handleViewDetails = (event: Event) => {
    // If it's "1-ON-1 Coaching", navigate to coaches page instead
    if (event.title === '1-ON-1 Coaching') {
      handleNavClick('coaches');
      return;
    }
    setSelectedEvent(event);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setSelectedSlot(null);
    setAvailableSlots([]);
    // Reset payment states
    setShowPaymentConfirmation(false);
    setPaymentError(null);
    setIsProcessingPayment(false);
    setPaymentUnavailableReason(null); // Reset - user can try again
  };

  // Initialize Google API Client Library
  // CONFIGURATION: Replace YOUR_GOOGLE_CLIENT_ID with your actual Google OAuth 2.0 Client ID
  // Get your Client ID from: https://console.cloud.google.com/apis/credentials
  // Make sure to enable "Calendar API" in your Google Cloud Console
  useEffect(() => {
    const initGapi = async () => {
      if (typeof window === 'undefined' || !(window as any).gapi) {
        return;
      }

      const gapi = (window as any).gapi;
      
      // CONFIGURATION: Replace with your Google OAuth 2.0 Client ID
      const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
      
      // CONFIGURATION: Add your API key if using API key instead of OAuth
      // For public calendars, you can use API key instead of OAuth
      const API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY || '';

      try {
        // Load the client library
        await gapi.load('client', async () => {
          // Initialize the client with API key (for public calendar access)
          // For private calendars, you'll need OAuth authentication
          if (API_KEY) {
            await gapi.client.init({
              apiKey: API_KEY,
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            });
          } else if (CLIENT_ID) {
            // Initialize with OAuth (for private calendars)
            await gapi.client.init({
              clientId: CLIENT_ID,
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
              scope: 'https://www.googleapis.com/auth/calendar.readonly',
            });
          }
          
          setGapiLoaded(true);
        });
      } catch (error) {
        console.error('Error initializing Google API:', error);
      }
    };

    // Check if gapi is already loaded
    if ((window as any).gapi && (window as any).gapi.load) {
      initGapi();
    } else {
      // Wait for gapi to load
      const checkGapi = setInterval(() => {
        if ((window as any).gapi && (window as any).gapi.load) {
          clearInterval(checkGapi);
          initGapi();
        }
      }, 100);

      // Cleanup after 10 seconds
      setTimeout(() => clearInterval(checkGapi), 10000);
    }
  }, []);

  // Fetch available slots from Google Calendar using gapi client library
  // CONFIGURATION: 
  // 1. Add VITE_GOOGLE_CLIENT_ID to your .env file (for OAuth) OR
  // 2. Add VITE_GOOGLE_CALENDAR_API_KEY to your .env file (for API key - public calendars only)
  // 3. Add VITE_GOOGLE_CALENDAR_ID to your .env file (e.g., 'primary' or specific calendar ID)
  const fetchAvailableSlots = async () => {
    if (!selectedEvent || selectedEvent.title !== 'Tennis Open 2025') return;
    if (!gapiLoaded || !(window as any).gapi?.client) {
      setSlotsError('Google Calendar API is not loaded. Please refresh the page.');
      return;
    }

    setIsLoadingSlots(true);
    setSlotsError(null);

    try {
      const gapi = (window as any).gapi;
      
      // CONFIGURATION: Replace with your actual Google Calendar ID
      // Use 'primary' for your primary calendar, or a specific calendar ID
      // To find calendar IDs: https://developers.google.com/calendar/api/v3/reference/calendarList/list
      const CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID || 'primary';
      
      // CONFIGURATION: Adjust time range for available slots
      // timeMin: Start date for slot availability (default: now)
      // timeMax: End date for slot availability (default: 30 days from now)
      const now = new Date();
      const timeMin = now.toISOString();
      const timeMax = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now
      
      // Use gapi client to query free/busy information
      const response = await gapi.client.calendar.freebusy.query({
        timeMin: timeMin,
        timeMax: timeMax,
        items: [{ id: CALENDAR_ID }],
      });

      const freebusyData = response.result;
      const busyPeriods = freebusyData.calendars[CALENDAR_ID]?.busy || [];

      // CONFIGURATION: Adjust slot generation parameters
      // slotDuration: Duration of each slot in minutes (default: 60 minutes)
      // startHour: Starting hour for slots (24-hour format, default: 9 = 9 AM)
      // endHour: Ending hour for slots (24-hour format, default: 18 = 6 PM)
      // daysToShow: Number of days ahead to show slots (default: 30 days)
      const slotDuration = 60; // 60 minutes per slot
      const startHour = 9; // 9 AM
      const endHour = 18; // 6 PM
      const daysToShow = 30; // Show slots for next 30 days
      const slots: Array<{ start: string; end: string; id: string }> = [];

      // Generate time slots and filter out busy ones
      for (let day = 0; day < daysToShow; day++) {
        const date = new Date(now);
        date.setDate(date.getDate() + day);
        date.setHours(startHour, 0, 0, 0);

        for (let hour = startHour; hour < endHour; hour++) {
          const slotStart = new Date(date);
          slotStart.setHours(hour, 0, 0, 0);
          
          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

          // Check if this slot overlaps with any busy period
          // Only free slots (not overlapping with busy periods) are added
          const isBusy = busyPeriods.some((busy: { start: string; end: string }) => {
            const busyStart = new Date(busy.start);
            const busyEnd = new Date(busy.end);
            return slotStart < busyEnd && slotEnd > busyStart;
          });

          // Only add free slots that are in the future
          if (!isBusy && slotStart > now) {
            slots.push({
              start: slotStart.toISOString(),
              end: slotEnd.toISOString(),
              id: `slot-${slotStart.getTime()}`,
            });
          }
        }
      }

      setAvailableSlots(slots);
    } catch (error: any) {
      console.error('Error fetching calendar slots:', error);
      
      // Provide helpful error messages
      if (error.status === 403) {
        setSlotsError('Access denied. Please check your Google Calendar API permissions.');
      } else if (error.status === 404) {
        setSlotsError('Calendar not found. Please check your Calendar ID.');
      } else {
        setSlotsError('Failed to load available slots. Please try again later.');
      }
      
      // In development, show mock data for testing
      if (import.meta.env.DEV) {
        console.warn('Using mock slots for development');
        const mockSlots = [];
        for (let i = 1; i <= 10; i++) {
          const date = new Date();
          date.setDate(date.getDate() + i);
          date.setHours(9 + (i % 8), 0, 0, 0);
          mockSlots.push({
            start: date.toISOString(),
            end: new Date(date.getTime() + 60 * 60 * 1000).toISOString(),
            id: `mock-slot-${i}`,
          });
        }
        setAvailableSlots(mockSlots);
      }
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Fetch slots when Tennis Open 2025 is selected and gapi is loaded
  useEffect(() => {
    if (selectedEvent?.title === 'Tennis Open 2025' && gapiLoaded) {
      fetchAvailableSlots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvent, gapiLoaded]);

  const handleRegisterNow = async () => {
    if (!selectedEvent) return;

    // Step 1: Check if user is logged in
    if (!isUserLoggedIn()) {
      // Store the event details so we can redirect back after login
      sessionStorage.setItem('pendingEventRegistration', JSON.stringify({
        eventId: selectedEvent.id,
        eventName: selectedEvent.title,
        price: selectedEvent.price
      }));
      toast.info('Please log in or sign up to register for this event');
      handleNavClick('signin');
      return;
    }

    // Step 2: User is logged in - show payment confirmation
    setShowPaymentConfirmation(true);
    toast.success('You are logged in! Proceeding to payment...');
  };

  // Handle proceeding to payment after confirmation
  const handleProceedToPayment = async () => {
    if (!selectedEvent) return;

    setIsProcessingPayment(true);
    setPaymentError(null);
    setPaymentUnavailableReason(null);

    try {
      // Parse the price from the event
      const priceMatch = selectedEvent.price.match(/\$(\d+(?:\.\d+)?)/);
      if (!priceMatch) {
        throw new Error('Invalid price format');
      }
      const amount = parseFloat(priceMatch[1]);
      const user = getCurrentUser();

      // Create Stripe checkout session and redirect to payment
      const response = await createCheckoutSession({
        eventId: selectedEvent.id.toString(),
        eventName: selectedEvent.title,
        amount: amount,
        currency: 'aud',
        customerEmail: user?.email,
        successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&event_id=${selectedEvent.id}`,
        cancelUrl: `${window.location.origin}/events?canceled=true`,
      });

      if (response.url) {
        // Redirect to Stripe Checkout for payment
        window.location.href = response.url;
      } else {
        throw new Error('No checkout URL received');
      }
      
    } catch (err: any) {
      console.error('Payment error:', { code: err.code, status: err.status, message: err.message });
      
      const errorCode = err.code || '';
      const errorStatus = err.status || 0;
      const errorMessage = err.message || 'An error occurred';
      
      // Handle errors based on structured error codes
      switch (errorCode) {
        case PAYMENT_ERROR_CODES.AUTH_REQUIRED:
          toast.error('Your session has expired. Please log in again.');
          sessionStorage.setItem('pendingEventRegistration', JSON.stringify({
            eventId: selectedEvent.id,
            eventName: selectedEvent.title,
            price: selectedEvent.price
          }));
          handleNavClick('signin');
          return;
        
        case PAYMENT_ERROR_CODES.ALREADY_REGISTERED:
          setPaymentError('You have already registered for this event.');
          setIsProcessingPayment(false);
          return;
        
        case PAYMENT_ERROR_CODES.EVENT_FULL:
          setPaymentError('Sorry, this event is fully booked. Please check other events.');
          setIsProcessingPayment(false);
          return;
        
        case PAYMENT_ERROR_CODES.EVENT_UNAVAILABLE:
        case PAYMENT_ERROR_CODES.EVENT_NOT_FOUND:
          setPaymentError('This event is no longer available for registration.');
          setIsProcessingPayment(false);
          return;
        
        case PAYMENT_ERROR_CODES.STRIPE_CONFIG_MISSING:
          // Stripe not configured - show specific message
          setPaymentUnavailableReason('Payment system is temporarily unavailable. Please contact us to register.');
          setPaymentError(null);
          setIsProcessingPayment(false);
          return;
        
        case PAYMENT_ERROR_CODES.STRIPE_ERROR:
          // Stripe API error - show payment processing error
          setPaymentUnavailableReason('Payment processing is temporarily unavailable. Please try again later.');
          setPaymentError(null);
          setIsProcessingPayment(false);
          return;
        
        default:
          // Handle by status code if no error code
          if (errorStatus === 401) {
            toast.error('Your session has expired. Please log in again.');
            sessionStorage.setItem('pendingEventRegistration', JSON.stringify({
              eventId: selectedEvent.id,
              eventName: selectedEvent.title,
              price: selectedEvent.price
            }));
            handleNavClick('signin');
            return;
          }
          
          // Connection errors
          if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Cannot connect')) {
            setPaymentUnavailableReason('Unable to connect to payment server. Please check your connection and try again.');
            setPaymentError(null);
            setIsProcessingPayment(false);
            return;
          }
          
          // Generic server error
          setPaymentError('Something went wrong. Please try again or contact us.');
          setIsProcessingPayment(false);
      }
    }
  };

  // Cancel payment confirmation
  const handleCancelPayment = () => {
    setShowPaymentConfirmation(false);
    setPaymentError(null);
    setIsProcessingPayment(false);
    setPaymentUnavailableReason(null); // Reset - user can try again
  };

  const filteredEvents =
    selectedCategory === 'all'
      ? events
      : events.filter((e) => e.category === selectedCategory);

  // Header Component (reusable)
  const Header = () => (
    <div className="bg-black h-auto min-h-[124.5px] w-full relative pb-4 md:pb-0 md:h-[124.5px]">
      {/* Logo */}
      <div 
        className="absolute h-[53px] left-[20px] md:left-[39px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[20px] md:top-[43px] w-[80px] cursor-pointer z-10"
        onClick={() => handleNavClick('home')}
      >
        <img 
          alt="AJH Sports Logo" 
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
          src={imgAjhSportsLogo}
        />
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <button 
          className="absolute block cursor-pointer font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[0] left-[190px] not-italic text-[16px] text-white top-[56px] w-[62px] hover:text-[#e0cb23] transition-colors"
          onClick={() => handleNavClick('home')}
        >
          <p className="leading-[normal]">Home</p>
        </button>
        <p 
          className={`absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[309px] not-italic text-[16px] top-[56px] w-[72px] cursor-pointer transition-colors ${
            selectedEvent ? 'text-white hover:text-[#e0cb23]' : 'text-[#e0cb23]'
          }`}
          onClick={selectedEvent ? handleBackToEvents : undefined}
        >
          Events
        </p>
        <p 
          className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[427px] not-italic text-[16px] text-white top-[54px] w-[71px] cursor-pointer hover:text-[#e0cb23] transition-colors"
          onClick={() => handleNavClick('clubs')}
        >
          Clubs
        </p>
        <p 
          className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[544px] not-italic text-[16px] text-white top-[54px] w-[92px] cursor-pointer hover:text-[#e0cb23] transition-colors"
          onClick={() => handleNavClick('coaches')}
        >
          Coaches
        </p>
        <p 
          className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[667px] not-italic text-[16px] text-white top-[54px] w-[88px] cursor-pointer hover:text-[#e0cb23] transition-colors"
          onClick={() => handleNavClick('contact')}
        >
          Contact Us
        </p>
      </div>
      
      {/* Tablet Navigation */}
      <div className="hidden md:flex lg:hidden absolute left-[120px] top-[56px] gap-4 md:gap-6">
        <button 
          className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
          onClick={() => handleNavClick('home')}
        >
          <p>Home</p>
        </button>
        <p 
          className={`font-['Inter:Medium',sans-serif] font-medium text-sm cursor-pointer transition-colors ${
            selectedEvent ? 'text-white hover:text-[#e0cb23]' : 'text-[#e0cb23]'
          }`}
          onClick={selectedEvent ? handleBackToEvents : undefined}
        >
          Events
        </p>
        <p 
          className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
          onClick={() => handleNavClick('clubs')}
        >
          Clubs
        </p>
        <p 
          className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
          onClick={() => handleNavClick('coaches')}
        >
          Coaches
        </p>
        <p 
          className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
          onClick={() => handleNavClick('contact')}
        >
          Contact
        </p>
      </div>
      
      {/* Desktop Auth Buttons - Right */}
      <div className="hidden lg:flex absolute right-[39px] top-[46px] items-center gap-4">
        <button 
          onClick={() => handleNavClick('signin')} 
          className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[12px] text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
        >
          Log In
        </button>
        <div 
          className="bg-[#878787] h-[50px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-4 cursor-pointer hover:bg-[#6d6d6d] transition-colors flex items-center justify-center"
          onClick={() => handleNavClick('signup')}
        >
          <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[12px] text-white">
            Sign Up
          </span>
        </div>
      </div>

      {/* Tablet/Mobile Auth Buttons */}
      <div className="hidden md:flex lg:hidden absolute right-4 top-[46px] items-center gap-3">
        <button 
          onClick={() => handleNavClick('signin')} 
          className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-white cursor-pointer hover:text-[#e0cb23] transition-colors"
        >
          Log In
        </button>
        <div 
          className="bg-[#878787] h-[40px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center px-3 cursor-pointer hover:bg-[#6d6d6d] transition-colors"
          onClick={() => handleNavClick('signup')}
        >
          <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-white">
            Sign Up
          </span>
        </div>
      </div>

      {/* Mobile Menu Button and Auth */}
      <div className="md:hidden absolute right-4 top-[20px] flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex flex-col gap-1.5 w-6 h-6 justify-center items-center"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
        <button 
          onClick={() => handleNavClick('signin')} 
          className="font-semibold text-xs text-white cursor-pointer"
        >
          Log In
        </button>
        <div 
          className="bg-[#878787] h-[40px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center px-3 cursor-pointer hover:bg-[#6d6d6d] transition-colors"
          onClick={() => handleNavClick('signup')}
        >
          <span className="font-semibold text-xs text-white">
            Sign Up
          </span>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-gray-800 z-50">
          <div className="flex flex-col py-4">
            <button 
              className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 text-left hover:bg-gray-900 hover:text-[#e0cb23] transition-colors"
              onClick={() => handleNavClick('home')}
            >
              Home
            </button>
            <p 
              className={`font-['Inter:Medium',sans-serif] font-medium text-base px-6 py-3 cursor-pointer hover:bg-gray-900 transition-colors ${
                selectedEvent ? 'text-white hover:text-[#e0cb23]' : 'text-[#e0cb23]'
              }`}
              onClick={selectedEvent ? handleBackToEvents : undefined}
            >
              Events
            </p>
            <p 
              className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 cursor-pointer hover:bg-gray-900 hover:text-[#e0cb23] transition-colors"
              onClick={() => handleNavClick('clubs')}
            >
              Clubs
            </p>
            <p 
              className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 cursor-pointer hover:bg-gray-900 hover:text-[#e0cb23] transition-colors"
              onClick={() => handleNavClick('coaches')}
            >
              Coaches
            </p>
            <p 
              className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 cursor-pointer hover:bg-gray-900 hover:text-[#e0cb23] transition-colors"
              onClick={() => handleNavClick('contact')}
            >
              Contact Us
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Footer Component (reusable) - Homepage Design
  const Footer = () => (
    <div className="w-full bg-black relative" data-name="MAIN">
      {/* Desktop Layout */}
      <div className="hidden md:block relative min-h-[364px]">
        {/* Newsletter Section - Left Side (matching coaches page) */}
        <div className="absolute left-[30px] top-[30px] flex flex-col gap-[14px] max-w-[520px] text-white">
          {/* Logo */}
          <div 
            className="w-[48px] h-[32px] cursor-pointer"
            data-name="AJHSports-Logo-no-outline-1 3"
            onClick={() => handleNavClick('home')}
          >
            <img 
              alt="AJH Sports Logo" 
              className="w-full h-full object-contain" 
              src={imgAjhSportsLogo}
            />
          </div>
          
          {/* Newsletter Title */}
          <h3 className="text-[24px] font-bold m-0 text-white">
            Join Our Newsletter
          </h3>
          
          {/* Newsletter Description */}
          <p className="text-[14px] text-[#e8e8e8] m-0 mb-2">
            Subscribe to our newsletter to be the first to know about new sessions, competitions and events.
          </p>
          
          {/* Email Input Form */}
          <form onSubmit={handleFormSubmit} className="flex gap-[10px]">
            <input
              type="email"
              name="email"
              placeholder="Your email"
              required
              className="flex-1 px-4 py-[14px] rounded-[6px] border-none bg-white text-black text-[14px] outline-none placeholder:text-[#6b6b6b]"
            />
            <button
              type="submit"
              className="bg-[#4a4a4a] text-white rounded-[24px] border-none px-[22px] py-3 text-[14px] font-bold cursor-pointer min-w-[120px] hover:opacity-90 transition-opacity duration-150"
            >
              Subscribe
            </button>
          </form>
        </div>
        
        {/* Vertical Divider Line - Desktop */}
        <div className="absolute left-[654px] top-[42px] w-[1px] h-[180px] bg-[#807E7E] hidden lg:block" />
        
        {/* About Section - Desktop */}
        <div className="absolute left-[753px] top-[30px] hidden lg:block w-[180px]">
          <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-[16px]">About</p>
          <div className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[2.2] tracking-[-0.32px]">
            <p 
              className="cursor-pointer hover:text-[#e0cb23] transition-colors"
              onClick={() => {
                handleNavClick('home');
                setTimeout(() => {
                  const element = document.querySelector('[data-name="Copy - Why Choose Us"]');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
            >
              Why Choose Us?
            </p>
            <p 
              className="cursor-pointer hover:text-[#e0cb23] transition-colors"
              onClick={() => handleNavClick('events')}
            >
              Events
            </p>
            <p 
              className="cursor-pointer hover:text-[#e0cb23] transition-colors"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                handleNavClick('coaches');
              }}
            >
              1-ON-1 Coaching
            </p>
            <p 
              className="cursor-pointer hover:text-[#e0cb23] transition-colors"
              onClick={() => {
                handleNavClick('home');
                setTimeout(() => {
                  const element = document.querySelector('[data-name="Our Lovely Team"]');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
            >
              Our Team
            </p>
          </div>
        </div>
        
        {/* Wet Weather Section - Desktop */}
        <div className="absolute left-[960px] top-[30px] hidden lg:block w-[200px]">
          <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-[16px]">
            Wet Weather
          </p>
          <div className="flex flex-col gap-3">
            <p className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[1.6] tracking-[-0.32px]">
              Follow us on Twitter for weather updates
            </p>
            <a 
              href="https://x.com/starstv" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A202C] hover:bg-[#e0cb23] text-white hover:text-black rounded-lg transition-all duration-300 w-fit group"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="font-['Inter:Medium',sans-serif] font-medium text-xs">Follow @starstv</span>
            </a>
          </div>
        </div>
        
        {/* Contact Section - Desktop */}
        <div className="absolute left-[1167px] top-[30px] hidden lg:block w-[180px]">
          <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-[16px]">Contact Us</p>
          <div className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[2.2] tracking-[-0.32px]">
            <p>ajh@ajhsports.com.au</p>
            <p>0447827788</p>
            <p>22 Salter Cres, Denistone East NSW 2112</p>
          </div>
        </div>
        
        {/* Bottom Divider - Desktop */}
        <div className="absolute left-[77px] top-[297px] w-[calc(100%-154px)] max-w-[1318.17px] h-[1px] bg-[#807E7E]" />
        
        {/* Copyright - Desktop */}
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[30px] text-[11px] text-slate-200 top-[332px] tracking-[-0.22px]">
          ©2025 Company Name. All rights reserved
        </p>
        
        {/* Privacy & Terms - Desktop */}
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold text-[11px] text-slate-200 text-right top-[335px] tracking-[-0.22px] cursor-pointer hover:text-[#e0cb23] transition-colors" style={{ left: '1061px' }}>
          Privacy & Policy
        </p>
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold text-[11px] text-slate-200 text-right top-[336px] tracking-[-0.22px] cursor-pointer hover:text-[#e0cb23] transition-colors" style={{ left: '1263px' }}>
          Terms & Condition
        </p>
        
        {/* Social Icons - Desktop */}
        <div className="absolute left-[646px] top-[320px] flex gap-[20px]">
          <a 
            href="https://www.facebook.com/aussiestarstv/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-all hover:scale-110"
            aria-label="Facebook"
          >
            <span className="text-[10px] text-white">f</span>
          </a>
          <a 
            href="https://x.com/starstv" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-all hover:scale-110"
            aria-label="Twitter"
          >
            <span className="text-[10px] text-white">𝕏</span>
          </a>
          <a 
            href="https://www.linkedin.com/in/starstv/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-all hover:scale-110"
            aria-label="LinkedIn"
          >
            <span className="text-[10px] text-white">in</span>
          </a>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="md:hidden relative py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Newsletter Section - Mobile (matching coaches page) */}
          <div className="flex flex-col gap-[14px] max-w-[520px] mx-auto text-white mb-8" data-name="AJHSports-Logo-no-outline-1 3">
            {/* Logo */}
            <div 
              className="w-[48px] h-[32px] cursor-pointer"
              onClick={() => handleNavClick('home')}
            >
              <img 
                alt="AJH Sports Logo" 
                className="w-full h-full object-contain" 
                src={imgAjhSportsLogo}
              />
            </div>
            
            {/* Newsletter Title */}
            <h3 className="text-[24px] font-bold m-0 text-white">
              Join Our Newsletter
            </h3>
            
            {/* Newsletter Description */}
            <p className="text-[14px] text-[#e8e8e8] m-0 mb-2">
              Subscribe to our newsletter to be the first to know about new sessions, competitions and events.
            </p>
            
            {/* Email Input Form */}
            <form onSubmit={handleFormSubmit} className="flex gap-[10px]">
              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
                className="flex-1 px-4 py-[14px] rounded-[6px] border-none bg-white text-black text-[14px] outline-none placeholder:text-[#6b6b6b]"
              />
              <button
                type="submit"
                className="bg-[#4a4a4a] text-white rounded-[24px] border-none px-[22px] py-3 text-[14px] font-bold cursor-pointer min-w-[120px] hover:opacity-90 transition-opacity duration-150"
              >
                Subscribe
              </button>
            </form>
          </div>
          
          {/* Footer Links - Mobile/Tablet */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#807E7E]">
            <div>
              <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-lg text-white mb-3 text-center sm:text-left">About</p>
              <div className="font-['Inter:Medium',sans-serif] font-medium text-sm text-slate-200 space-y-2 text-center sm:text-left">
                <p 
                  className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                  onClick={() => {
                    handleNavClick('home');
                    setTimeout(() => {
                      const element = document.querySelector('[data-name="Copy - Why Choose Us"]');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }}
                >
                  Why Choose Us?
                </p>
                <p 
                  className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                  onClick={() => handleNavClick('events')}
                >
                  Events
                </p>
                <p 
                  className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'instant' });
                    handleNavClick('coaches');
                  }}
                >
                  1-ON-1 Coaching
                </p>
                <p 
                  className="cursor-pointer hover:text-[#e0cb23] transition-colors"
                  onClick={() => {
                    handleNavClick('home');
                    setTimeout(() => {
                      const element = document.querySelector('[data-name="Our Lovely Team"]');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }}
                >
                  Our Team
                </p>
              </div>
            </div>
            <div>
              <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-lg text-white mb-3 text-center sm:text-left">
                Wet Weather
              </p>
              <div className="flex flex-col gap-3 items-center sm:items-start">
                <p className="font-['Inter:Medium',sans-serif] font-medium text-sm text-slate-200 text-center sm:text-left">
                  Follow us on Twitter for weather updates
                </p>
                <a 
                  href="https://x.com/starstv" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1A202C] hover:bg-[#e0cb23] text-white hover:text-black rounded-lg transition-all duration-300 w-fit group"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="font-['Inter:Medium',sans-serif] font-medium text-[11px]">Follow @starstv</span>
                </a>
              </div>
            </div>
            <div>
              <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-lg text-white mb-3 text-center sm:text-left">Contact Us</p>
              <div className="font-['Inter:Medium',sans-serif] font-medium text-sm text-slate-200 space-y-2 text-center sm:text-left">
                <p>ajh@ajhsports.com.au</p>
                <p>0447827788</p>
                <p>22 Salter Cres, Denistone East NSW 2112</p>
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="mt-8 pt-6 border-t border-[#807E7E] flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-slate-200 text-center sm:text-left">
              ©2025 Company Name. All rights reserved
            </p>
            <div className="flex items-center gap-4">
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-slate-200 cursor-pointer hover:text-[#e0cb23] transition-colors">
                Privacy & Policy
              </p>
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-slate-200 cursor-pointer hover:text-[#e0cb23] transition-colors">
                Terms & Condition
              </p>
            </div>
            <div className="flex gap-5">
              <a 
                href="https://www.facebook.com/aussiestarstv/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <span className="text-[10px] text-white">f</span>
              </a>
              <a 
                href="https://x.com/starstv" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-all hover:scale-110"
                aria-label="Twitter"
              >
                <span className="text-[10px] text-white">𝕏</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/starstv/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <span className="text-[10px] text-white">in</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // If an event is selected, show the detail view
  if (selectedEvent) {
    return (
      <div className="bg-white relative w-full min-h-screen flex flex-col" data-name="Event Detail Page">
        <Header />
        
        {/* Hero Image Section */}
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative overflow-hidden bg-gradient-to-br from-[#030213] to-[#1a1a2e]">
          <img 
            src={selectedEvent.heroImage} 
            alt={selectedEvent.alt}
            className="w-full h-full object-cover object-center"
            loading="eager"
            decoding="async"
            onError={(e) => {
              // Fallback chain: heroImage -> cardImage -> default
              const target = e.target as HTMLImageElement;
              if (target.src !== selectedEvent.image && selectedEvent.image !== selectedEvent.heroImage) {
                target.src = selectedEvent.image;
              } else {
                target.src = Image_tennis_hero;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/30" />
          
          <button
            onClick={handleBackToEvents}
            className="absolute top-4 left-4 md:top-6 md:left-10 flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-black/40 backdrop-blur-sm text-white font-['Inter:Medium',sans-serif] font-medium text-[16px] hover:bg-black/60 transition-all"
          >
            <span>←</span>
            <span className="hidden sm:inline">Back to Events</span>
            <span className="sm:hidden">Back</span>
          </button>
          
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-10">
            <h1 className="font-['Inter:Bold',sans-serif] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[36px] text-white drop-shadow-lg">
              {selectedEvent.title}
            </h1>
          </div>
        </div>

        {/* Event Info Section */}
        <div className="w-full bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[110px] py-6 md:py-8 lg:py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12">
              {/* Date */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 md:w-11 md:h-11 bg-black/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg md:text-xl">📅</span>
                </div>
                <div>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-[#888] uppercase tracking-wide mb-1">Date</p>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-sm md:text-base text-black">{selectedEvent.date}</p>
                </div>
              </div>
              
              {/* Who Can Join */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 md:w-11 md:h-11 bg-black/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg md:text-xl">👥</span>
                </div>
                <div>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-[#888] uppercase tracking-wide mb-1">Who Can Join?</p>
                  <p className="font-['Inter:Regular',sans-serif] text-sm md:text-base text-black max-w-xs">{selectedEvent.whoCanJoin}</p>
                </div>
              </div>
              
              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 md:w-11 md:h-11 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg md:text-xl">📍</span>
                </div>
                <div>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-[#888] uppercase tracking-wide mb-1">Location</p>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-sm md:text-base text-black">{selectedEvent.location}</p>
                  <p className="font-['Inter:Regular',sans-serif] text-xs md:text-sm text-[#666]">{selectedEvent.venue}</p>
                </div>
              </div>
              
              {/* Available Spots */}
              {selectedEvent.spots > 0 && (
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    selectedEvent.spots <= 5 ? 'bg-red-50' : selectedEvent.spots <= 10 ? 'bg-orange-50' : 'bg-green-50'
                  }`}>
                    <span className="text-lg md:text-xl">🎟️</span>
                  </div>
                  <div>
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-[#888] uppercase tracking-wide mb-1">Availability</p>
                    <p className={`font-['Inter:Semi_Bold',sans-serif] font-semibold text-sm md:text-base ${
                      selectedEvent.spots <= 5 ? 'text-red-600' : selectedEvent.spots <= 10 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {selectedEvent.spots} spots remaining
                    </p>
                    <p className="font-['Inter:Regular',sans-serif] text-xs md:text-sm text-[#666]">
                      {selectedEvent.spots <= 5 ? 'Limited availability - Register soon!' : 'Spaces available'}
                    </p>
                  </div>
                </div>
              )}
              {selectedEvent.spots === 0 && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 md:w-11 md:h-11 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg md:text-xl">❌</span>
                  </div>
                  <div>
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-[#888] uppercase tracking-wide mb-1">Availability</p>
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-sm md:text-base text-red-600">Fully Booked</p>
                    <p className="font-['Inter:Regular',sans-serif] text-xs md:text-sm text-[#666]">Join waitlist for cancellations</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="w-full bg-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[110px] py-8 md:py-10 lg:py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-['Inter:Bold',sans-serif] font-bold text-lg md:text-xl lg:text-2xl text-black mb-4 md:mb-6">Description:</h2>
            <p className="font-['Inter:Regular',sans-serif] text-sm md:text-base text-[#444] leading-relaxed mb-6 md:mb-8">
              {selectedEvent.fullDescription}
            </p>
            
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 bg-gray-50 p-4 md:p-6 rounded-xl">
              <p className="font-['Inter:Regular',sans-serif] text-sm md:text-base text-black">
                <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold">Entry Fee:</span> {selectedEvent.entryFee}
              </p>
              <p className="font-['Inter:Regular',sans-serif] text-sm md:text-base text-black">
                <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold">What's Included:</span> {selectedEvent.whatsIncluded}
              </p>
              <p className="font-['Inter:Regular',sans-serif] text-sm md:text-base text-black">
                <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold">Registration Deadline:</span> {selectedEvent.registrationDeadline}
              </p>
            </div>
            
            {/* Slot Selection - Only for Tennis Open 2025 (disabled - Google Calendar not configured) */}
            {false && selectedEvent.title === 'Tennis Open 2025' && (
              <div className="mb-6 md:mb-8">
                <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-base md:text-lg text-black mb-4">
                  Select Available Time Slot
                </h3>
                
                {isLoadingSlots ? (
                  <div className="p-6 text-center">
                    <p className="font-['Inter:Regular',sans-serif] text-sm text-[#666]">Loading available slots...</p>
                  </div>
                ) : slotsError ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                    <p className="font-['Inter:Regular',sans-serif] text-sm text-yellow-800">{slotsError}</p>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="font-['Inter:Regular',sans-serif] text-sm text-[#666]">No available slots found. Please check back later.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-2">
                      {availableSlots.map((slot) => {
                        const slotDate = new Date(slot.start);
                        const slotTime = slotDate.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        });
                        const slotDateStr = slotDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        });
                        const isSelected = selectedSlot === slot.id;

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setSelectedSlot(slot.id)}
                            disabled={false} // Only free slots are shown, so all are selectable
                            className={`p-3 md:p-4 rounded-lg border-2 text-left transition-all font-['Inter:Medium',sans-serif] font-medium text-sm ${
                              isSelected
                                ? 'border-black bg-black text-white'
                                : 'border-gray-300 bg-white text-black hover:border-black hover:bg-gray-50'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            <div className="font-semibold">{slotTime}</div>
                            <div className="text-xs mt-1 opacity-80">{slotDateStr}</div>
                          </button>
                        );
                      })}
                    </div>
                    {selectedSlot && (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-['Inter:Regular',sans-serif] text-sm text-black">
                          <span className="font-semibold">Selected:</span>{' '}
                          {new Date(availableSlots.find(s => s.id === selectedSlot)?.start || '').toLocaleString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {paymentError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{paymentError}</p>
                <button
                  onClick={handleCancelPayment}
                  className="mt-2 text-sm text-red-700 underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            )}
            
            {/* Login Notice */}
            {!isUserLoggedIn() && !showPaymentConfirmation && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">👤 Not logged in:</span> You'll need to log in or create an account to register for this event.
                </p>
              </div>
            )}

            {/* Payment Confirmation Step */}
            {showPaymentConfirmation && isUserLoggedIn() && (
              <div className="mb-4">
                {/* Payment Unavailable Message */}
                {paymentUnavailableReason ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚠️</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-red-800 mb-1">Payments Temporarily Unavailable</p>
                        <p className="text-sm text-red-700 mb-3">
                          {paymentUnavailableReason}
                        </p>
                        <div className="bg-white p-3 rounded border border-red-100 mb-3">
                          <p className="text-sm text-gray-700">
                            <strong>Event:</strong> {selectedEvent.title}<br />
                            <strong>Price:</strong> {selectedEvent.price}<br />
                            <strong>To register, contact us:</strong><br />
                            📧 <a href="mailto:ajh@ajhsports.com.au" className="text-blue-600 hover:underline">ajh@ajhsports.com.au</a><br />
                            📞 0447827788
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleProceedToPayment}
                            className="bg-gray-600 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Try Again
                          </button>
                          <button
                            onClick={handleCancelPayment}
                            className="bg-white text-gray-700 font-semibold text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                          >
                            Back to Event Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Payment Available - Show Proceed Button */
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">✅</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-800 mb-1">Ready to complete registration!</p>
                        <p className="text-sm text-green-700 mb-3">
                          You're about to register for <strong>{selectedEvent.title}</strong> for <strong>{selectedEvent.price}</strong>.
                        </p>
                        <div className="flex gap-3 flex-wrap">
                          <button
                            onClick={handleProceedToPayment}
                            disabled={isProcessingPayment}
                            className="bg-green-600 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isProcessingPayment ? 'Redirecting to payment...' : 'Proceed to Payment'}
                          </button>
                          <button
                            onClick={handleCancelPayment}
                            disabled={isProcessingPayment}
                            className="bg-white text-gray-700 font-semibold text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Register Now Button (only shown when not in confirmation step) */}
            {!showPaymentConfirmation && (
              <button
                onClick={handleRegisterNow}
                disabled={isProcessingPayment || selectedEvent.spots === 0}
                className={`font-['Inter:Semi_Bold',sans-serif] font-semibold text-sm md:text-base px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedEvent.spots === 0 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-[#333]'
                }`}
              >
                {isProcessingPayment 
                  ? 'Processing...' 
                  : selectedEvent.spots === 0 
                    ? 'Event Fully Booked' 
                    : isUserLoggedIn() 
                      ? 'Register Now' 
                      : 'Log In to Register'}
              </button>
            )}
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Main Events List View
  return (
    <div className="bg-white relative w-full min-h-screen flex flex-col" data-name="Events Page">
      <Header />

      {/* Hero Section */}
      <div className="w-full bg-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[110px] py-8 md:py-12 lg:py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="w-full lg:w-[520px]">
              <h1 className="font-['Inter:Bold',sans-serif] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[48px] text-black leading-tight tracking-wide mb-4 md:mb-6">
                Discover<br />AJH Sports Events
              </h1>
              
              <p className="font-['Inter:Regular',sans-serif] text-sm md:text-base lg:text-[16px] text-[#444] leading-relaxed mb-6 md:mb-8">
                Explore our coaching programs, kids' sports parties, and social matches 
                designed for all ages and skill levels.
              </p>
              
              {/* Stats Row */}
              <div className="flex gap-6 md:gap-8 lg:gap-10 mb-6 md:mb-8">
                {stats.map(({ icon, number, text }) => (
                  <div key={text} className="text-center">
                    <div className="text-base md:text-lg mb-1">{icon}</div>
                    <div className="font-['Inter:Bold',sans-serif] font-bold text-lg md:text-xl lg:text-[22px] text-black">{number}</div>
                    <div className="font-['Inter:Regular',sans-serif] text-xs md:text-sm text-[#666]">{text}</div>
                  </div>
                ))}
              </div>
              
              {/* CTA Button */}
              <button
                type="button"
                className="bg-black text-white font-['Inter:Semi_Bold',sans-serif] font-semibold text-sm md:text-base px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg hover:bg-[#333] transition-colors"
                onClick={() => {
                  const eventsSection = document.getElementById('events-section');
                  if (eventsSection) {
                    eventsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Browse All Events
              </button>
            </div>
            
            {/* Right Images */}
            <div className="flex gap-3 md:gap-4 lg:gap-4 justify-center lg:justify-end w-full lg:w-auto">
              <img
                src={Image_tennis}
                alt="Tennis"
                className="w-[140px] h-[240px] sm:w-[160px] sm:h-[280px] md:w-[180px] md:h-[300px] lg:w-[200px] lg:h-[340px] object-cover rounded-[60px] md:rounded-[80px] border border-gray-200"
              />
              <img
                src={Image_tt}
                alt="Table Tennis"
                className="w-[140px] h-[240px] sm:w-[160px] sm:h-[280px] md:w-[180px] md:h-[300px] lg:w-[200px] lg:h-[340px] object-cover rounded-[60px] md:rounded-[80px] border border-gray-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div id="events-section" className="w-full bg-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[110px] py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6 md:mb-8">
            <h2 className="font-['Inter:Bold',sans-serif] font-bold text-2xl md:text-3xl lg:text-[28px] text-black mb-2">
              Upcoming Events
            </h2>
            <p className="font-['Inter:Regular',sans-serif] text-sm md:text-base text-[#666]">
              Find the perfect event for you
            </p>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8">
            {categories.map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedCategory(id)}
                className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-['Inter:Medium',sans-serif] font-medium text-xs md:text-sm transition-all border ${
                  selectedCategory === id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black hover:bg-black hover:text-white'
                }`}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
          
          {/* Loading State */}
          {isLoadingEvents && (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                <p className="font-['Inter:Medium',sans-serif] text-sm text-[#666]">Loading events...</p>
              </div>
            </div>
          )}
          
          {/* Error State */}
          {eventsError && !isLoadingEvents && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <p className="text-sm text-yellow-800">{eventsError}</p>
            </div>
          )}
          
          {/* Events Grid */}
          {!isLoadingEvents && filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xl text-black mb-2">
                No Events Available
              </h3>
              <p className="font-['Inter:Regular',sans-serif] text-sm text-[#666]">
                {selectedCategory === 'all' 
                  ? 'Check back soon for upcoming events!'
                  : `No ${selectedCategory} events at the moment. Try a different category.`}
              </p>
            </div>
          )}
          
          {!isLoadingEvents && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg overflow-hidden cursor-pointer border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onMouseEnter={() => setHoveredEvent(event.id)}
                onMouseLeave={() => setHoveredEvent(null)}
                onClick={() => handleViewDetails(event)}
              >
                {/* Image */}
                <div className="relative h-[150px] md:h-[180px] overflow-hidden bg-gradient-to-br from-[#030213] to-[#1a1a2e]">
                  <img
                    src={event.image}
                    alt={event.alt}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      hoveredEvent === event.id ? 'scale-110' : 'scale-100'
                    }`}
                    onError={(e) => {
                      // Fallback to default image on error
                      e.currentTarget.src = Image_tennis_court;
                    }}
                  />
                  {event.featured && (
                    <span className="absolute top-2 left-2 bg-black text-white font-['Inter:Bold',sans-serif] text-xs font-bold px-2 py-1 rounded uppercase">
                      Featured
                    </span>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-3 md:p-4">
                  <h4 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-sm md:text-base text-black mb-2">
                    {event.title}
                  </h4>
                  
                  <p className="font-['Inter:Regular',sans-serif] text-xs md:text-sm text-[#666] mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-[#888] mb-2">
                    <span>📅 {event.date}</span>
                    <span>•</span>
                    <span>📍 {event.location}</span>
                  </div>
                  
                  {/* Spots Remaining */}
                  {event.spots > 0 && (
                    <div className="flex items-center gap-2 text-xs mb-3">
                      <span className={`font-semibold ${event.spots <= 5 ? 'text-red-500' : event.spots <= 10 ? 'text-orange-500' : 'text-green-600'}`}>
                        🎟️ {event.spots} spots remaining
                      </span>
                    </div>
                  )}
                  {event.spots === 0 && (
                    <div className="flex items-center gap-2 text-xs mb-3">
                      <span className="font-semibold text-red-500">❌ Fully Booked</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="font-['Inter:Bold',sans-serif] font-bold text-sm md:text-base text-black">{event.price}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(event);
                      }}
                      className={`font-['Inter:Medium',sans-serif] font-medium text-xs px-3 py-1.5 rounded transition-all border ${
                        hoveredEvent === event.id
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-black hover:bg-black hover:text-white'
                      }`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Divider Line */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[110px]">
        <div className="max-w-7xl mx-auto border-t border-gray-200"></div>
      </div>

      {/* Why Choose Us Section */}
      <div className="w-full bg-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[110px] py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="font-['Inter:Bold',sans-serif] font-bold text-xl md:text-2xl lg:text-[24px] text-black">Why Choose Us?</h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
            {[
              { icon: '🎯', title: 'Expert Coaching', desc: '40+ years experience' },
              { icon: '👥', title: 'All Levels', desc: 'Beginner to advanced' },
              { icon: '🤝', title: 'Community', desc: 'Friendly environment' },
              { icon: '🏆', title: 'Quality', desc: 'Modern facilities' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center w-full sm:w-auto">
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 rounded-full bg-white border-2 border-black flex items-center justify-center">
                  <span className="text-xl md:text-2xl">{icon}</span>
                </div>
                <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-sm md:text-base text-black mb-1">{title}</h3>
                <p className="font-['Inter:Regular',sans-serif] text-xs md:text-sm text-[#666]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[110px] py-8 md:py-10 lg:py-12 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-['Inter:Bold',sans-serif] font-bold text-xl md:text-2xl text-black mb-3 md:mb-4">Ready to get started?</h2>
          <p className="font-['Inter:Regular',sans-serif] text-sm md:text-base text-[#666] mb-4 md:mb-6">
            Join our community and start playing today!
          </p>
          <button
            type="button"
            className="bg-black text-white font-['Inter:Semi_Bold',sans-serif] font-semibold text-sm md:text-base px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-[#333] transition-colors"
            onClick={() => handleNavClick('clubs')}
          >
            Join Now
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
