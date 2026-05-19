import React, { useState, useEffect } from "react";
import { getCheckoutSession } from "../../services/paymentService";
import { getCoachById } from "../../services/adminService";
import { HomeHeader } from "../../components/HomeHeader";
import { getAPI_URL } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

interface PaymentSuccessProps {
  onNavigate?: (page: string) => void;
  onBookAnother?: () => void;
}

interface PaymentDetails {
  sessionId: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  customerEmail: string | null;
  metadata: {
    eventId?: string;
    eventName?: string;
    booking_type?: string;
    coach_id?: string;
    bookingId?: string;
  };
}

export default function PaymentSuccessNew({ onNavigate, onBookAnother }: PaymentSuccessProps) {
  const { user } = useAuth();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [coachDetails, setCoachDetails] = useState<any>(null);
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        // Get session_id from URL params
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get('session_id');
        const isTest = params.get('test') === 'true';
        const eventId = params.get('event_id');
        const coachId = params.get('coachId');
        const bookingType = params.get('type'); // 'coach' or 'event'
        const bookingDate = params.get('bookingDate');
        const bookingTime = params.get('bookingTime');
        const bookingDuration = params.get('bookingDuration');

        if (!sessionId) {
          setError('No payment session found');
          setLoading(false);
          return;
        }

        // Handle test mode - show mock payment details
        if (isTest || sessionId.startsWith('cs_test_') || sessionId.startsWith('cs_mock_')) {
          console.log('🧪 Test Mode: Using mock payment data');
          
          let amount = 0;
          let eventData = null;
          let coachData = null;

          // Handle coach test payments
          if (bookingType === 'coach' && coachId) {
            try {
              const API_URL = getAPI_URL();
              
              console.log('🧪 Test mode: Fetching coach data from database for coach ID:', coachId);
              const response = await fetch(`${API_URL}/coaches/${coachId}`);
              if (response.ok) {
                const coachResponse = await response.json();
                if (coachResponse.coach) {
                  coachData = coachResponse.coach;
                  setCoachDetails(coachData);
                  
                  // Calculate amount based on hourly rate and duration
                  const hourlyRate = parseFloat(coachData.hourly_rate?.toString() || '0');
                  const durationHours = parseFloat(bookingDuration || '60') / 60;
                  amount = hourlyRate * durationHours;
                  
                  console.log('🧪 Test mode: Coach hourly rate:', hourlyRate, 'Duration:', durationHours, 'Total:', amount);
                }
              } else {
                console.error('❌ Test mode: Failed to fetch coach:', response.status);
              }
            } catch (err) {
              console.error('❌ Test mode: Error fetching coach:', err);
            }
          }
          // Handle event test payments
          else if (eventId) {
            try {
              // Use centralized API URL function
              const API_URL = getAPI_URL();
              
              console.log('🧪 Test mode: Fetching event price from database for event ID:', eventId);
              const response = await fetch(`${API_URL}/events/${eventId}`);
              if (response.ok) {
                eventData = await response.json();
                if (eventData.event) {
                  setEventDetails(eventData.event);
                  
                  // ALWAYS use event price from database
                  let eventPrice = eventData.event.price;
                  console.log('🧪 Test mode: Event price from database:', eventPrice, 'Type:', typeof eventPrice);
                  
                  if (eventPrice !== null && eventPrice !== undefined) {
                    if (typeof eventPrice === 'number') {
                      amount = eventPrice;
                      console.log('✅ Test mode: Using numeric price:', amount);
                    } else if (typeof eventPrice === 'string') {
                      const priceMatch = eventPrice.match(/\$?(\d+(?:\.\d+)?)/);
                      if (priceMatch) {
                        amount = parseFloat(priceMatch[1]);
                        console.log('✅ Test mode: Parsed string price:', amount);
                      } else {
                        const parsed = parseFloat(eventPrice);
                        if (!isNaN(parsed)) {
                          amount = parsed;
                          console.log('✅ Test mode: Direct parseFloat price:', amount);
                        }
                      }
                    }
                  }
                  
                  console.log('🧪 Test mode: Final amount to display:', amount);
                }
              } else {
                console.error('❌ Test mode: Failed to fetch event:', response.status);
              }
            } catch (err) {
              console.error('❌ Test mode: Error fetching event:', err);
            }
          }

          const details: PaymentDetails = {
            sessionId: sessionId,
            amount: amount,
            currency: 'AUD',
            paymentStatus: 'paid',
            customerEmail: user?.email || null,
            metadata: {
              eventId: eventId || '',
              coach_id: coachId || '',
              booking_type: bookingType || 'event',
              bookingDate: bookingDate || '',
              bookingTime: bookingTime || '',
              bookingDuration: bookingDuration || '',
              test: 'true'
            },
          };

          setPaymentDetails(details);
          
          // Send test payment confirmation email
          if (bookingType === 'coach' && coachData && user?.email) {
            try {
              const API_URL = getAPI_URL();
              const token = localStorage.getItem('token');
              
              // Call backend endpoint to send test payment email for coach
              await fetch(`${API_URL}/payments/send-test-email-coach`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  coachId: coachId,
                  coachName: coachData.name,
                  amount: amount,
                  bookingDate: bookingDate,
                  bookingTime: bookingTime,
                  bookingDuration: bookingDuration,
                  bookingId: null // Test payments don't have booking ID yet
                })
              });
              
              console.log('✅ Test payment confirmation email sent for coach');
            } catch (emailError) {
              console.error('⚠️ Failed to send test payment email:', emailError);
              // Don't fail the test payment flow if email fails
            }
          } else if (eventData?.event && user?.email) {
            try {
              const API_URL = getAPI_URL();
              const token = localStorage.getItem('token');
              
              // Call backend endpoint to send test payment email
              await fetch(`${API_URL}/payments/send-test-email`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  eventId: eventId,
                  eventName: eventData.event.name || eventData.event.title,
                  amount: amount,
                  bookingId: null // Test payments don't have booking ID yet
                })
              });
              
              console.log('✅ Test payment confirmation email sent');
            } catch (emailError) {
              console.error('⚠️ Failed to send test payment email:', emailError);
              // Don't fail the test payment flow if email fails
            }
          }
          
          setLoading(false);
          return;
        }

        // Fetch payment details from Stripe via backend
        const response = await getCheckoutSession(sessionId);
        
        if (response.success && response.session) {
          const session = response.session;
          
          // Start with Stripe amount (convert from cents to dollars)
          let amount = session.amount_total / 100;
          let eventData = null;

          // If it's an event booking, ALWAYS fetch event details FIRST to get accurate price from database
          // This ensures we show the current price even if admin changed it after booking
          if (session.metadata?.booking_type === 'event' && session.metadata?.eventId) {
            try {
              // Use centralized API URL function
              const API_URL = getAPI_URL();
              
              console.log('💰 Fetching event price from database for event ID:', session.metadata.eventId);
              const eventResponse = await fetch(`${API_URL}/events/${session.metadata.eventId}`);
              
              if (eventResponse.ok) {
                eventData = await eventResponse.json();
                if (eventData.event) {
                  setEventDetails(eventData.event);
                  
                  // ALWAYS use event price from database (this is the source of truth)
                  // Price is stored as DECIMAL(10,2) in MySQL, so it comes as a number
                  let eventPrice = eventData.event.price;
                  
                  console.log('💰 Event price from database:', eventPrice, 'Type:', typeof eventPrice);
                  
                  // Handle different formats: number, string with $, or string without $
                  if (eventPrice !== null && eventPrice !== undefined) {
                    if (typeof eventPrice === 'number') {
                      amount = eventPrice;
                      console.log('✅ Using numeric price:', amount);
                    } else if (typeof eventPrice === 'string') {
                      // Try to parse string formats like "$35", "35", "35.00", etc.
                      const priceMatch = eventPrice.match(/\$?(\d+(?:\.\d+)?)/);
                      if (priceMatch) {
                        amount = parseFloat(priceMatch[1]);
                        console.log('✅ Parsed string price:', amount);
                      } else {
                        // Try direct parseFloat as fallback
                        const parsed = parseFloat(eventPrice);
                        if (!isNaN(parsed)) {
                          amount = parsed;
                          console.log('✅ Direct parseFloat price:', amount);
                        } else {
                          console.warn('⚠️ Could not parse event price:', eventPrice);
                        }
                      }
                    }
                  } else {
                    console.warn('⚠️ Event price is null/undefined, using Stripe amount:', amount);
                  }
                  
                  console.log('💰 Final amount to display:', amount);
                } else {
                  console.warn('⚠️ Event data missing event object');
                }
              } else {
                console.error('❌ Failed to fetch event:', eventResponse.status, eventResponse.statusText);
              }
            } catch (err) {
              console.error('❌ Error fetching event details:', err);
              // Continue without event details, use Stripe amount as fallback
              console.warn('⚠️ Using Stripe amount as fallback:', amount);
            }
          } else {
            console.log('ℹ️ Not an event booking or missing eventId, using Stripe amount:', amount);
          }

          const details: PaymentDetails = {
            sessionId: session.id,
            amount: amount, // Use the correct amount (from event if available, otherwise from Stripe)
            currency: session.currency.toUpperCase(),
            paymentStatus: session.payment_status,
            customerEmail: session.customer_email,
            metadata: session.metadata || {},
          };

          // If it's a coach booking, fetch coach details
          if (details.metadata.booking_type === 'coach' && details.metadata.coach_id) {
            try {
              const coachData = await getCoachById(details.metadata.coach_id);
              setCoachDetails(coachData);
            } catch (err) {
              console.error('Error fetching coach details:', err);
              // Continue without coach details
            }
          }

          setPaymentDetails(details);

        } else {
          setError('Failed to load payment details');
        }
      } catch (err: any) {
        console.error('Error fetching payment details:', err);
        setError(err.message || 'Failed to load payment details');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [user]); // Include user in dependencies for test payment email

  // Download Receipt removed - emails are now sent automatically via Gmail SMTP

  const handleBookAnother = () => {
    if (!paymentDetails) return;
    
    // Check if it's a coach booking - use multiple checks for reliability
    const isCoach = paymentDetails.metadata?.booking_type === 'coach' || 
                    paymentDetails.metadata?.coach_id !== undefined ||
                    coachDetails !== null;
    
    if (isCoach) {
      if (onNavigate) {
        // Update URL first to include view=list parameter
        window.history.pushState({}, '', '/coaches?view=list');
        // Then navigate to coaches page - this will trigger the CoachesWrapper to show list view
        onNavigate('coaches');
        // Dispatch locationchange event to ensure CoachesWrapper picks up the URL change
        window.dispatchEvent(new Event('locationchange'));
      }
    } else {
      if (onNavigate) onNavigate('events');
    }
    if (onBookAnother) onBookAnother();
  };

  const handleGoHome = () => {
    if (onNavigate) onNavigate('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
        <HomeHeader />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#030213] border-t-transparent mb-4"></div>
            <p className="text-lg text-gray-600">Loading payment details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !paymentDetails) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
        <HomeHeader />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-black mb-2">Payment Details Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'Unable to load payment information.'}</p>
            <button
              onClick={handleGoHome}
              className="px-6 py-3 bg-[#030213] text-white rounded-lg hover:bg-[#050525] transition"
            >
              Go to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  const isCoachBooking = paymentDetails.metadata.booking_type === 'coach';
  // Get booking title from metadata or coach details
  let bookingTitle = paymentDetails.metadata.eventName;
  if (!bookingTitle && isCoachBooking && coachDetails) {
    bookingTitle = `Coaching Session with ${coachDetails.name}`;
  } else if (!bookingTitle && !isCoachBooking) {
    bookingTitle = 'Event Registration';
  } else if (!bookingTitle) {
    bookingTitle = 'Booking Confirmed';
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
      <HomeHeader />

      <main className="flex-1 flex flex-col items-center px-4 pb-16 pt-8 md:pt-12">
        <div className="w-full max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">
              Payment Successful!
            </h1>
            {paymentDetails?.metadata?.test === 'true' && (
              <div className="mb-3 px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-sm font-semibold text-yellow-800">🧪 TEST MODE - This is a simulated payment</p>
              </div>
            )}
            <p className="text-lg text-gray-600">
              Your payment has been processed and your booking is confirmed.
            </p>
          </div>

          {/* Payment Details Card */}
          <div className="bg-white rounded-[20px] shadow-lg border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-xl font-semibold text-black mb-6">Payment Summary</h2>
            
            {/* Booking Details */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-2xl">📋</div>
                <div className="flex-1">
                  <p className="text-sm text-blue-700 font-medium mb-1">Booking</p>
                  <p className="text-lg font-semibold text-blue-900">{bookingTitle}</p>
                  {coachDetails && (
                    <p className="text-sm text-blue-700 mt-1">Specialty: {coachDetails.specialty || 'Coach'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border-b border-gray-200 pb-4 md:border-b-0 md:border-r md:pr-4">
                <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                <p className="text-lg font-semibold text-black capitalize">{paymentDetails.paymentStatus}</p>
              </div>
              
              <div className="pb-4">
                <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                <p className="text-2xl font-bold text-[#030213]">
                  {paymentDetails.currency} {(() => {
                    // Use event price from database if available (current price), otherwise use payment amount
                    if (eventDetails?.price !== null && eventDetails?.price !== undefined) {
                      const eventPrice = typeof eventDetails.price === 'number' 
                        ? eventDetails.price 
                        : (() => {
                            const priceMatch = String(eventDetails.price).match(/\$?(\d+(?:\.\d+)?)/);
                            return priceMatch ? parseFloat(priceMatch[1]) : paymentDetails.amount;
                          })();
                      return eventPrice.toFixed(2);
                    }
                    return paymentDetails.amount.toFixed(2);
                  })()}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4 md:border-t-0 md:border-r md:pr-4">
                <p className="text-sm text-gray-600 mb-1">Session ID</p>
                <p className="text-sm font-mono text-gray-800 break-all">{paymentDetails.sessionId}</p>
              </div>

              {paymentDetails.customerEmail && (
                <div className="pt-4">
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-sm font-medium text-black">{paymentDetails.customerEmail}</p>
                </div>
              )}
            </div>

            {/* Booking Type Badge */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                <span className="text-xs font-medium text-gray-600">Booking Type:</span>
                <span className="text-xs font-semibold text-gray-900 capitalize">
                  {isCoachBooking ? 'Coach Booking' : 'Event Registration'}
                </span>
              </div>
            </div>
          </div>

          {/* Coach Details Card (if coach booking) */}
          {isCoachBooking && coachDetails && (
            <div className="bg-white rounded-[20px] shadow-lg border border-gray-200 p-6 md:p-8 mb-6">
              <h2 className="text-xl font-semibold text-black mb-4">Coach Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Coach Name</p>
                  <p className="font-semibold text-black">{coachDetails.name}</p>
                </div>
                {coachDetails.specialty && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Specialty</p>
                    <p className="font-semibold text-black">{coachDetails.specialty}</p>
                  </div>
                )}
                {coachDetails.hourly_rate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Hourly Rate</p>
                    <p className="font-semibold text-black">
                      ${parseFloat(coachDetails.hourly_rate.toString()).toFixed(2)}/hr
                    </p>
                  </div>
                )}
                {coachDetails.email && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Contact Email</p>
                    <p className="font-semibold text-black">{coachDetails.email}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBookAnother}
              className="px-6 py-3 bg-[#030213] text-white rounded-lg font-semibold hover:bg-[#050525] transition"
            >
              {isCoachBooking ? 'Book Another Coach' : 'Register for Another Event'}
            </button>
            
            <button
              onClick={handleGoHome}
              className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Go to Home
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-2">
              A confirmation email has been sent to {paymentDetails.customerEmail || 'your email address'}.
            </p>
            <p className="text-xs text-gray-500">
              If you have any questions, please contact us at{' '}
              <a href="mailto:ajh@ajhsports.com.au" className="text-[#030213] hover:underline">
                ajh@ajhsports.com.au
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="coaches-footer">
        <div className="footer-top">
          <div className="footer-left">
            <div className="footer-logo" aria-label="AJH Sports">
              <img
                src="/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png"
                alt="AJH Sports"
              />
            </div>
            <h3>Join Our Newsletter</h3>
            <p>
              Subscribe to our newsletter to be the first to know about new
              sessions, competitions and events.
            </p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email" />
              <button type="button">Subscribe</button>
            </div>
          </div>

          <div className="footer-divider" aria-hidden="true" />

          <div className="footer-columns">
            <div className="footer-column">
              <h4>About</h4>
              <a href="#why">Why Choose Us?</a>
              <a href="#featured">Featured</a>
              <a href="#partnership">Partnership</a>
              <a href="#team">Our Team</a>
            </div>

            <div className="footer-column">
              <h4>Community</h4>
              <a href="#events">Events</a>
              <a href="#blog">Blog</a>
              <a href="#podcast">Podcast</a>
              <a href="#invite">Invite a friend</a>
            </div>

            <div className="footer-column">
              <h4>Contact Us</h4>
              <p>ajhsports.com.au</p>
              <p>+61 0412345678</p>
              <p>123 Ave, Sydney, NSW</p>
            </div>
          </div>
        </div>

        <div className="footer-separator" aria-hidden="true" />

        <div className="footer-bottom">
          <span className="footer-copy">©2025 Company Name. All rights reserved</span>
          <div className="footer-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="footer-links">
            <a href="#privacy">Privacy & Policy</a>
            <a href="#terms">Terms & Condition</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
