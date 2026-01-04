/**
 * Mock Events Service
 * Provides access to the mock events data from the user-facing events page
 * This allows the admin to see and manage the same events that users see
 */

// Import the image paths (same as EventsWrapper)
const Image_tennis_court = '/images/TennisOpen.png';
const Image_tt_table = '/images/TTCup.png';
const Image_kids_in_sports = '/images/KidsSports.png';
const Image_coaching = '/images/OneonOneCoaching.png';
const Image_tennis_hero = '/images/tennis-ball-hero.jpg';
const Image_tt_hero = '/images/table-tennis-players-hero.jpg';
const Image_kids_hero = '/images/kids-tug-of-war-hero.jpg';
const Image_coaching_hero = '/images/tennis-court-hero.jpg';

export type EventCategory = 'all' | 'tournament' | 'coaching' | 'party';

export interface MockEvent {
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

// Original mock events data
const originalMockEvents: MockEvent[] = [
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

// Mutable copy for CRUD operations
let currentMockEvents: MockEvent[] = [...originalMockEvents];

// Ensure we always have the original events if currentMockEvents is empty
const ensureEventsLoaded = () => {
  if (currentMockEvents.length === 0) {
    currentMockEvents = [...originalMockEvents];
  }
};

export const getMockEvents = (): MockEvent[] => {
  ensureEventsLoaded();
  return [...currentMockEvents];
};

export const getMockEventById = (id: number): MockEvent | undefined => {
  return currentMockEvents.find(event => event.id === id);
};

export const createMockEvent = (newEvent: Omit<MockEvent, 'id'>): MockEvent => {
  const newId = Math.max(...currentMockEvents.map(e => e.id), 0) + 1;
  const eventWithId = { ...newEvent, id: newId };
  currentMockEvents.push(eventWithId);
  return eventWithId;
};

export const updateMockEvent = (id: number, updatedEvent: Partial<MockEvent>): MockEvent | undefined => {
  const index = currentMockEvents.findIndex(event => event.id === id);
  if (index > -1) {
    currentMockEvents[index] = { ...currentMockEvents[index], ...updatedEvent };
    return currentMockEvents[index];
  }
  return undefined;
};

export const deleteMockEvent = (id: number): boolean => {
  const initialLength = currentMockEvents.length;
  currentMockEvents = currentMockEvents.filter(event => event.id !== id);
  return currentMockEvents.length < initialLength;
};

/**
 * Convert mock event to backend event format
 * This helps sync mock events to the backend database
 */
export const convertMockEventToBackendFormat = (mockEvent: MockEvent) => {
  // Parse price string to number (e.g., "$30" -> 30)
  const priceMatch = mockEvent.price.match(/\$(\d+(?:\.\d+)?)/);
  const price = priceMatch ? parseFloat(priceMatch[1]) : 0;

  // Try to parse date string to a proper date format
  // For flexible dates like "Every Weekend" or "Book Anytime", use a default future date
  let date = '';
  let time = '';
  
  if (mockEvent.date.includes('-')) {
    // Date range like "August 10-18, 2025" - use start date
    const dateMatch = mockEvent.date.match(/(\w+)\s+(\d+)/);
    if (dateMatch) {
      // This is a simplified parser - in production you'd want a more robust solution
      date = '2025-08-10'; // Default for August
    }
  } else if (mockEvent.date === 'Every Weekend' || mockEvent.date === 'Book Anytime') {
    // Use a placeholder date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    date = futureDate.toISOString().split('T')[0];
  } else {
    // Try to parse other formats
    date = '2025-01-22'; // Default fallback
  }

  // Parse time string to time format
  if (mockEvent.time.includes('-')) {
    // Time range like "9:00 AM - 6:00 PM" - use start time
    const timeMatch = mockEvent.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2];
      const ampm = timeMatch[3].toUpperCase();
      
      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      
      time = `${hours.toString().padStart(2, '0')}:${minutes}:00`;
    }
  } else if (mockEvent.time === 'Flexible Hours') {
    time = '09:00:00'; // Default
  } else {
    time = '09:00:00'; // Default fallback
  }

  return {
    name: mockEvent.title,
    description: mockEvent.fullDescription || mockEvent.description,
    date: date,
    time: time,
    max_players: mockEvent.spots || 20,
    price: price,
    location: mockEvent.location,
    status: 'active' as const,
  };
};

