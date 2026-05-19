import React, { useState, useEffect, useCallback } from "react";
import "./Coaches.css";
import { HomeHeader } from "../../components/HomeHeader";
import { fetchLessons } from "../../services/eventService";
import { createCheckoutSession, PAYMENT_ERROR_CODES } from "../../services/paymentService";
import { isUserLoggedIn } from "../../services/eventService";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

// Fallback image mapping for lessons without images
const fallbackImages = {
  "Junior Tennis Lessons": "/images/TennisOpen.png",
  "Adult Tennis Lessons": "/images/mytennis.png",
  "Junior Table Tennis Lessons": "/images/TTCup.png",
  "Adult Table Tennis Lessons": "/images/OneonOneCoaching.png",
  "Modified Sport Sessions": "/images/KidsSports.png",
};

const PricingTable = ({ rows }) => {
  return (
    <div className="lesson-pricing">
      <div className="lesson-pricing-header">
        <span>Single Lesson</span>
        <span>10 Lesson Pack</span>
      </div>
      {rows.map((row) => (
        <div key={row.label} className="lesson-pricing-row">
          <span className="lesson-pricing-label">{row.label}</span>
          <span>{row.single}</span>
          <span>{row.pack}</span>
        </div>
      ))}
      <p className="lesson-pricing-note">*pricing includes 10 lessons</p>
    </div>
  );
};

const Coaching = ({ onBack }) => {
  const { user } = useAuth();
  const sectionRefs = React.useRef({});
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedBookingType, setSelectedBookingType] = useState(null);
  const [selectedPricingTier, setSelectedPricingTier] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const loadLessons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading lessons from API...');
      const data = await fetchLessons();
      
      if (!data || !Array.isArray(data)) {
        console.error('Invalid data received from API:', data);
        setError('Invalid data received from server');
        setLessons([]);
        setLoading(false);
        return;
      }
      
      // Filter to only active lessons and sort by display_order
      const activeLessons = data
        .filter((lesson) => {
          if (!lesson || !lesson.id) {
            console.warn('Skipping invalid lesson:', lesson);
            return false;
          }
          return lesson.status === 'active';
        })
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      
      console.log('✅ Loaded', activeLessons.length, 'active lessons from backend');
      setLessons(activeLessons);
    } catch (err) {
      console.error('❌ Error loading lessons:', err);
      setError(err?.message || 'Failed to load lessons. Please try again.');
      // Fallback to empty array on error
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load lessons on mount - always fetch fresh data from MySQL
  useEffect(() => {
    console.log('🔄 Coaching page mounted - fetching fresh lessons from API');
    loadLessons();
  }, [loadLessons]);

  // Reload lessons when custom event is triggered (from CoachesWrapper or admin updates)
  useEffect(() => {
    const handleReload = () => {
      console.log('🔄 Lessons page reload triggered');
      loadLessons();
    };

    window.addEventListener('lessonsPageReload', handleReload);
    return () => {
      window.removeEventListener('lessonsPageReload', handleReload);
    };
  }, [loadLessons]);

  // Reload lessons when page becomes visible (user navigates back to tab)
  // This ensures lessons are fresh if admin made changes while user was on another tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible - always reload to get any admin updates
        console.log('👁️ Page visible - reloading lessons to check for updates');
        loadLessons();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadLessons]);

  // Also reload when window gains focus (user clicks back on tab)
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔍 Window focused - reloading lessons to check for updates');
      loadLessons();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadLessons]);

  const scrollToSection = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Map API lesson format to component format
  const mapLessonToComponent = (lesson) => {
    const isTableTennis = lesson.category === 'Table Tennis';
    const isModified = lesson.category === 'Modified Sports';
    // Generate a stable ID from title for scrolling (used for section refs)
    const scrollId = lesson.title.toLowerCase().replace(/\s+/g, '-');
    
    return {
      id: lesson.id, // Use database ID for API calls
      scrollId, // Use scroll ID for section references
      title: lesson.title,
      copy: lesson.description || '',
      image: lesson.image_url || fallbackImages[lesson.title] || '/images/mytennis.png',
      pricing: lesson.pricing || [],
      cta: lesson.cta_text || 'Register Now!',
      imageLeft: lesson.image_position === 'left',
      category: lesson.category,
    };
  };

  return (
    <div className="coaches-page">
      <HomeHeader />
      <main className="coaches-main">
        <div className="lesson-intro">
          <button
            type="button"
            onClick={() => onBack?.()}
            className="lesson-back"
          >
            ← Back
          </button>
          <p className="lesson-topcopy">
            AJH Sports offers coaching packages for all ages and skill levels. Choose the
            package that suits you best each includes group, semi-private, and private
            options to fit your needs. Every 10-week package includes reduced social session
            entry and catchup group sessions for wet weather.
          </p>
          <div className="lesson-nav lesson-nav-fixed">
            <button type="button" onClick={() => {
              const firstTennis = lessons.find(l => l.category === 'Tennis');
              if (firstTennis) scrollToSection(firstTennis.title.toLowerCase().replace(/\s+/g, '-'));
            }}>
              Tennis
            </button>
            <button type="button" onClick={() => {
              const firstTT = lessons.find(l => l.category === 'Table Tennis');
              if (firstTT) scrollToSection(firstTT.title.toLowerCase().replace(/\s+/g, '-'));
            }}>
              Table Tennis
            </button>
            <button type="button" onClick={() => {
              const firstModified = lessons.find(l => l.category === 'Modified Sports');
              if (firstModified) scrollToSection(firstModified.title.toLowerCase().replace(/\s+/g, '-'));
            }}>
              Modified Sports
            </button>
          </div>
        </div>

        <div className="lessons-stack">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading lessons...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#d32f2f' }}>
              <p>Error loading lessons: {error}</p>
            </div>
          ) : lessons.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No lessons available at the moment.</p>
            </div>
          ) : (
            lessons.map((lesson) => {
              const mappedLesson = mapLessonToComponent(lesson);
              const imageFirst = mappedLesson.imageLeft;
              const isTableTennis = mappedLesson.category === 'Table Tennis';
              const isModified = mappedLesson.category === 'Modified Sports';
              return (
                <section
                  key={mappedLesson.id}
                  ref={(el) => {
                    if (el) sectionRefs.current[mappedLesson.scrollId] = el;
                  }}
                  className={`lesson-block ${imageFirst ? "image-left" : "image-right"} ${
                    isTableTennis ? "table-tennis" : isModified ? "modified" : "tennis"
                  }`}
                >
                  <div className="lesson-image-wrapper">
                    <img 
                      src={mappedLesson.image} 
                      alt={mappedLesson.title} 
                      className="lesson-image"
                      onError={(e) => {
                        // Fallback to default image if base64 fails
                        const target = e.target;
                        if (target) target.src = fallbackImages[mappedLesson.title] || '/images/mytennis.png';
                      }}
                    />
                  </div>
                  <div className="lesson-content">
                    <span className="lesson-pill">
                      {mappedLesson.category}
                    </span>
                    <h2>{mappedLesson.title}</h2>
                    <p className="lesson-copy">{mappedLesson.copy}</p>
                    {mappedLesson.pricing.length > 0 && (
                      <PricingTable rows={mappedLesson.pricing} />
                    )}
                    <button 
                      type="button" 
                      className="lesson-cta"
                      onClick={() => {
                        if (!isUserLoggedIn()) {
                          toast.info('Please log in or sign up to book a lesson');
                          // You can navigate to sign in page here if needed
                          return;
                        }
                        setSelectedLesson(mappedLesson);
                        setSelectedBookingType(null);
                        setSelectedPricingTier(null);
                        setIsBookingModalOpen(true);
                      }}
                    >
                      {mappedLesson.cta}
                    </button>
                  </div>
                </section>
              );
            })
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {isBookingModalOpen && selectedLesson && (
        <div 
          className="booking-modal-overlay"
          onClick={() => {
            if (!isProcessingPayment) {
              setIsBookingModalOpen(false);
              setSelectedLesson(null);
              setSelectedBookingType(null);
              setSelectedPricingTier(null);
            }
          }}
        >
          <div 
            className="booking-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="booking-modal-title">Book {selectedLesson.title}</h3>
            
            {selectedLesson.pricing && selectedLesson.pricing.length > 0 && (
              <div>
                <p className="booking-type-label">Select your preferred option:</p>
                <div>
                  {selectedLesson.pricing.map((priceTier, idx) => (
                    <div 
                      key={idx} 
                      className={`booking-option-card ${selectedPricingTier === idx ? 'selected' : ''}`}
                      onClick={() => {
                        // When clicking the card, don't auto-select a booking type
                        // User must explicitly choose single or pack
                        setSelectedPricingTier(idx);
                      }}
                    >
                      <div className="booking-tier-header">
                        <span className="booking-tier-label">{priceTier.label}</span>
                      </div>
                      <div className="booking-option-row">
                        <label 
                          className="booking-option-label"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="radio"
                            name={`bookingType-${idx}`}
                            value="single"
                            checked={selectedPricingTier === idx && selectedBookingType === 'single'}
                            onChange={() => {
                              setSelectedPricingTier(idx);
                              setSelectedBookingType('single');
                            }}
                          />
                          <span>Single Session</span>
                        </label>
                        <span className="booking-option-price">{priceTier.single}</span>
                      </div>
                      <div className="booking-option-row">
                        <label 
                          className="booking-option-label"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="radio"
                            name={`bookingType-${idx}`}
                            value="pack"
                            checked={selectedPricingTier === idx && selectedBookingType === 'pack'}
                            onChange={() => {
                              setSelectedPricingTier(idx);
                              setSelectedBookingType('pack');
                            }}
                          />
                          <span>10 Session Pack</span>
                        </label>
                        <span className="booking-option-price">{priceTier.pack}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!selectedLesson.pricing || selectedLesson.pricing.length === 0) && (
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                Pricing information not available. Please contact us.
              </p>
            )}

            <div className="booking-modal-actions">
              <button
                type="button"
                onClick={() => {
                  setIsBookingModalOpen(false);
                  setSelectedLesson(null);
                  setSelectedBookingType(null);
                  setSelectedPricingTier(null);
                }}
                disabled={isProcessingPayment}
                className="booking-modal-button booking-modal-button-cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (selectedPricingTier === null || selectedPricingTier === undefined) {
                    toast.error('Please select a pricing option');
                    return;
                  }

                  if (!selectedBookingType) {
                    toast.error('Please select Single Session or 10 Session Pack');
                    return;
                  }

                  if (!selectedLesson.pricing || selectedLesson.pricing.length === 0) {
                    toast.error('Pricing not available for this lesson');
                    return;
                  }

                  setIsProcessingPayment(true);

                  try {
                    // Get price from selected pricing tier
                    const priceOption = selectedLesson.pricing[selectedPricingTier];
                    const priceStr = selectedBookingType === 'single' 
                      ? priceOption.single 
                      : priceOption.pack;
                    const amount = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;

                    if (amount <= 0) {
                      throw new Error('Invalid price');
                    }

                    // Create checkout session
                    const response = await createCheckoutSession({
                      lessonId: selectedLesson.id.toString(),
                      eventName: `${selectedLesson.title} - ${selectedBookingType === 'pack' ? '10 Session Pack' : 'Single Session'}`,
                      amount: amount,
                      currency: 'aud',
                      customerEmail: user?.email || undefined,
                      bookingType: 'lesson',
                      bookingType_lesson: selectedBookingType,
                      successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&lesson_id=${selectedLesson.id}&type=lesson`,
                      cancelUrl: `${window.location.origin}/coaches?canceled=true`,
                    });

                    if (response.url) {
                      // Redirect to Stripe Checkout
                      window.location.href = response.url;
                    } else {
                      throw new Error('No checkout URL received');
                    }
                  } catch (err) {
                    console.error('Payment error:', err);
                    const errorMessage = err?.message || 'An error occurred';
                    toast.error(`Payment error: ${errorMessage}`);
                    setIsProcessingPayment(false);
                  }
                }}
                disabled={isProcessingPayment || selectedPricingTier === null || !selectedBookingType}
                className="booking-modal-button booking-modal-button-submit"
              >
                {isProcessingPayment ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coaching;
