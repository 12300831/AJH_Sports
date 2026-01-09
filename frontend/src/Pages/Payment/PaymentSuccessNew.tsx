import React, { useState, useEffect } from "react";
import { getCheckoutSession } from "../../services/paymentService";
import { getCoachById } from "../../services/adminService";
import { HomeHeader } from "../../components/HomeHeader";

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
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [coachDetails, setCoachDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        // Get session_id from URL params
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get('session_id');

        if (!sessionId) {
          setError('No payment session found');
          setLoading(false);
          return;
        }

        // Fetch payment details from Stripe via backend
        const response = await getCheckoutSession(sessionId);
        
        if (response.success && response.session) {
          const session = response.session;
          const details: PaymentDetails = {
            sessionId: session.id,
            amount: session.amount_total / 100, // Convert from cents to dollars
            currency: session.currency.toUpperCase(),
            paymentStatus: session.payment_status,
            customerEmail: session.customer_email,
            metadata: session.metadata || {},
          };

          setPaymentDetails(details);

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
  }, []);

  const handleDownloadReceipt = () => {
    // Generate receipt data
    const receiptData = {
      sessionId: paymentDetails?.sessionId,
      amount: paymentDetails?.amount,
      currency: paymentDetails?.currency,
      item: paymentDetails?.metadata.eventName || (coachDetails ? `Coaching Session with ${coachDetails.name}` : 'Booking'),
      date: new Date().toLocaleDateString('en-AU', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
    };

    // Create receipt text
    const receiptText = `
AJH SPORTS - PAYMENT RECEIPT
============================

Session ID: ${receiptData.sessionId}
Date: ${receiptData.date}
Item: ${receiptData.item}
Amount: ${receiptData.currency} ${receiptData.amount.toFixed(2)}

Payment Status: Paid

Thank you for your booking!

AJH Sports
ajh@ajhsports.com.au
0447827788
`;

    // Create blob and download
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receiptData.sessionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBookAnother = () => {
    if (paymentDetails?.metadata.booking_type === 'coach') {
      if (onNavigate) onNavigate('coaches');
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
                  {paymentDetails.currency} {(paymentDetails.amount).toFixed(2)}
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
              onClick={handleDownloadReceipt}
              className="px-6 py-3 border-2 border-black bg-white text-black rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Receipt
            </button>
            
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
