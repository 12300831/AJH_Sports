import React, { useState, useEffect } from "react";
import "./Coaches.css";
import { HomeHeader } from "../../components/HomeHeader";
import { getCoaches } from "../../services/adminService";
import { createCheckoutSession } from "../../services/paymentService";
import michaelImg from "./images/michael.png";
import jamesImg from "./images/James.png";
import markImg from "./images/mark.png";
import kristinImg from "./images/kristin.png";

// Simple modal component for availability
function AvailabilityModal({ coach, isOpen, onClose, onSelectTime }) {
  if (!isOpen) return null;

  // Parse availability
  let availability = [];
  if (Array.isArray(coach.availability)) {
    availability = coach.availability;
  } else if (typeof coach.availability === 'string' && coach.availability.trim() !== '') {
    try {
      availability = JSON.parse(coach.availability);
    } catch (e) {
      availability = [];
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{coach.name} - Availability</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        {availability.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No availability slots available.</p>
        ) : (
          <div className="space-y-3">
            {availability.map((av, index) => (
              <button
                key={index}
                onClick={() => {
                  onSelectTime(av);
                  onClose();
                }}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-[#030213] hover:text-white hover:border-[#030213] transition-all"
              >
                <div className="font-medium">{av.day}</div>
                <div className="text-sm text-gray-600 hover:text-white">
                  {av.start} - {av.end}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Map coach names to images
const coachImageMap = {
  "Michael Rodriguez": michaelImg,
  "James Wilson": jamesImg,
  "Mark Leo": markImg,
  "Kristin Russell": kristinImg,
};

function CoachCard({ coach, onViewProfile, onShowAvailability, onBookNow }) {
  // Get image for coach
  const coachImage = coachImageMap[coach.name] || coachImageMap["Michael Rodriguez"];

  // Check if coach has availability
  let hasAvailability = false;
  if (Array.isArray(coach.availability) && coach.availability.length > 0) {
    hasAvailability = true;
  } else if (typeof coach.availability === 'string' && coach.availability.trim() !== '') {
    try {
      const parsed = JSON.parse(coach.availability);
      hasAvailability = Array.isArray(parsed) && parsed.length > 0;
    } catch (e) {
      hasAvailability = false;
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Photo */}
      <div className="w-[280px] h-[240px] rounded-[24px] overflow-hidden mb-4 shadow-sm">
        <img
          src={coachImage}
          alt={coach.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name + specialty */}
      <div className="text-center mb-3">
        <p className="text-[14px] underline font-medium">{coach.name}</p>
        <p className="text-[12px] text-gray-600 mt-1">{coach.specialty || 'Coach'}</p>
      </div>

      {/* Hourly Rate */}
      <div className="text-center mb-3">
        <p className="text-[13px] font-semibold text-[#030213]">
          ${parseFloat(coach.hourly_rate?.toString() || '0').toFixed(2)}/hr
        </p>
      </div>

      {/* Contact Info */}
      {(coach.email || coach.phone) && (
        <div className="text-center mb-3 text-[10px] text-gray-600 space-y-1">
          {coach.email && (
            <div className="flex items-center justify-center gap-1">
              <span>📧</span>
              <span className="truncate max-w-[200px]">{coach.email}</span>
            </div>
          )}
          {coach.phone && (
            <div className="flex items-center justify-center gap-1">
              <span>📞</span>
              <span>{coach.phone}</span>
            </div>
          )}
        </div>
      )}

      {/* Social icons (simple placeholders – you can replace with real icons) */}
      <div className="flex gap-3 text-[12px] text-gray-600 mb-4">
        {["in", "x", "ig", "f"].map((label) => (
          <span
            key={label}
            className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center"
          >
            {label}
          </span>
        ))}
      </div>

      {/* Availability Button */}
      {hasAvailability && (
        <button
          onClick={() => onShowAvailability(coach)}
          className="mb-3 border border-[#030213] bg-[#030213] text-white text-[12px] px-6 py-2 rounded-[4px] hover:bg-[#050525] transition"
        >
          Select Availability
        </button>
      )}

      {/* Book Now button */}
      <button
        onClick={() => onBookNow?.(coach)}
        className="border border-[#030213] bg-[#030213] text-white text-[12px] px-6 py-2 rounded-[4px] hover:bg-[#050525] transition"
      >
        Book Now
      </button>
    </div>
  );
}

export default function CoachesPage({ onViewProfile, onBack }) {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);

  useEffect(() => {
    loadCoaches();
  }, []);

  const loadCoaches = async () => {
    try {
      setLoading(true);
      const data = await getCoaches();
      
      // Filter to only show the 4 specific coaches
      const targetCoaches = data.filter((coach) => 
        coach.name === 'Michael Rodriguez' ||
        coach.name === 'James Wilson' ||
        coach.name === 'Mark Leo' ||
        coach.name === 'Kristin Russell'
      );
      
      setCoaches(targetCoaches);
    } catch (err) {
      console.error('Error loading coaches:', err);
      setError('Failed to load coaches');
    } finally {
      setLoading(false);
    }
  };

  const handleShowAvailability = (coach) => {
    setSelectedCoach(coach);
    setIsAvailabilityModalOpen(true);
  };

  const handleSelectTime = async (timeSlot) => {
    // Handle time slot selection and proceed to payment
    if (!selectedCoach) return;
    
    try {
      const amount = parseFloat(selectedCoach.hourly_rate?.toString() || '0');
      const bookingName = `Coaching Session with ${selectedCoach.name}`;
      
      // Create checkout session using the same payment API as your friend
      const response = await createCheckoutSession({
        eventId: `coach-${selectedCoach.id}`,
        eventName: bookingName,
        amount: amount,
        currency: 'aud',
        bookingType: 'coach',
        coachId: selectedCoach.id.toString(),
        successUrl: `${window.location.origin}/paymentSuccess?session_id={CHECKOUT_SESSION_ID}&type=coach&coachId=${selectedCoach.id}`,
        cancelUrl: `${window.location.origin}/coaches?canceled=true`,
      });

      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment error: ${error.message || 'Failed to process payment. Please try again.'}`);
    }
  };

  const handleBookNow = async (coach) => {
    if (!coach) return;
    
    try {
      const amount = parseFloat(coach.hourly_rate?.toString() || '0');
      const bookingName = `Coaching Session with ${coach.name}`;
      
      // Create checkout session using the same payment API as your friend
      const response = await createCheckoutSession({
        eventId: `coach-${coach.id}`,
        eventName: bookingName,
        amount: amount,
        currency: 'aud',
        bookingType: 'coach',
        coachId: coach.id.toString(),
        successUrl: `${window.location.origin}/paymentSuccess?session_id={CHECKOUT_SESSION_ID}&type=coach&coachId=${coach.id}`,
        cancelUrl: `${window.location.origin}/coaches?canceled=true`,
      });

      if (response.url) {
        // Redirect to Stripe checkout or success page (in mock mode)
        if (response.mock) {
          // Mock payment - redirect directly to success page using client-side routing
          console.log('Development Mode: Mock payment successful');
          // Navigate to payment success page
          // Handle both relative and absolute URLs
          let url;
          try {
            url = new URL(response.url);
          } catch (e) {
            // If it's a relative URL, make it absolute
            url = new URL(response.url, window.location.origin);
          }
          const path = url.pathname; // Should be /paymentSuccess
          const search = url.search;
          // Update URL and trigger navigation
          window.history.pushState({}, '', path + search);
          // Trigger navigation by dispatching popstate event
          window.dispatchEvent(new PopStateEvent('popstate'));
          // Also trigger a custom event to notify the app
          window.dispatchEvent(new Event('locationchange'));
        } else {
          // Real Stripe checkout - use full redirect
          window.location.href = response.url;
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment error: ${error.message || 'Failed to process payment. Please try again.'}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
      <HomeHeader />

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto pt-16 pb-12 px-4 md:px-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-6 text-sm font-semibold text-black hover:underline"
          >
            ← Back
          </button>
        )}
        <h1 className="text-[28px] md:text-[32px] font-semibold text-center mb-12">
          Our tennis Coaches
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Loading coaches...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-lg text-red-600">{error}</div>
            <button
              onClick={loadCoaches}
              className="mt-4 px-4 py-2 bg-[#030213] text-white rounded hover:bg-[#050525]"
            >
              Retry
            </button>
          </div>
        ) : coaches.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">No coaches available at the moment.</div>
          </div>
        ) : (
          /* 2x2 coach grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-16 gap-y-16 md:gap-y-24">
            {coaches.map((coach) => (
              <CoachCard
                key={coach.id}
                coach={coach}
                onViewProfile={onViewProfile}
                onShowAvailability={handleShowAvailability}
                onBookNow={handleBookNow}
              />
            ))}
          </div>
        )}

        {/* Availability Modal */}
        {selectedCoach && (
          <AvailabilityModal
            coach={selectedCoach}
            isOpen={isAvailabilityModalOpen}
            onClose={() => {
              setIsAvailabilityModalOpen(false);
              setSelectedCoach(null);
            }}
            onSelectTime={handleSelectTime}
          />
        )}
      </main>

      {/* Newsletter + footer */}
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
