import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./Coaches.css";
import { HomeHeader } from "../../components/HomeHeader";
import { getCoaches } from "../../services/adminService";
import { createCheckoutSession } from "../../services/paymentService";
import { isUserLoggedIn } from "../../services/eventService";
import { useAuth } from "../../contexts/AuthContext";
import { getAPI_URL } from "../../services/api";
import { toast } from "sonner";
import michaelImg from "./images/michael.png";
import jamesImg from "./images/James.png";
import markImg from "./images/mark.png";
import kristinImg from "./images/kristin.png";

// Enhanced booking modal component for date/time selection
function BookingModal({ coach, isOpen, onClose, onConfirmBooking }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedSessions, setSelectedSessions] = useState([]); // Array of { date, time, duration }

  // Parse availability early (before any functions that use it)
  const availability = useMemo(() => {
    if (!coach) return [];
    if (Array.isArray(coach.availability)) {
      return coach.availability;
    } else if (typeof coach.availability === 'string' && coach.availability.trim() !== '') {
      try {
        return JSON.parse(coach.availability);
      } catch (e) {
        return [];
      }
    }
    return [];
  }, [coach?.availability]);

  // Reset sessions when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedSessions([]);
      setSelectedDate('');
      setSelectedStartTime('');
      setSelectedEndTime('');
      setAvailableTimes([]);
    }
  }, [isOpen]);

  // Calculate end time options based on selected start time
  const getEndTimeOptions = useCallback(() => {
    if (!selectedStartTime || !availableTimes.length) return [];
    
    const startTimeStr = typeof selectedStartTime === 'string' ? selectedStartTime : selectedStartTime.time || selectedStartTime;
    const [startHour, startMin] = startTimeStr.split(':').map(Number);
    
    const options = [];
    let currentHour = startHour;
    let currentMin = startMin;
    
    // Find the end time of availability for this date
    let maxEndTime = null;
    if (availability.length > 0 && selectedDate) {
      const dateObj = new Date(selectedDate);
      const dayName = dateObj.toLocaleDateString('en-AU', { weekday: 'long' });
      
      // Find availability for this date
      const dateAv = availability.find(av => {
        if (av.type === 'date' && av.date === selectedDate) return true;
        if ((!av.type || av.type === 'pattern') && av.day && av.day.toLowerCase() === dayName.toLowerCase()) {
          if (av.startDate || av.endDate) {
            const startDate = av.startDate ? new Date(av.startDate) : null;
            const endDate = av.endDate ? new Date(av.endDate) : null;
            const checkDate = new Date(selectedDate);
            if (startDate && checkDate < startDate) return false;
            if (endDate && checkDate > endDate) return false;
          }
          return true;
        }
        return false;
      });
      
      if (dateAv) {
        const [endHour, endMin] = dateAv.end.split(':').map(Number);
        maxEndTime = { hour: endHour, min: endMin };
      }
    }
    
    // Generate 1-hour increment options
    while (true) {
      currentHour += 1; // Add 1 hour
      
      // Check if we've exceeded max end time
      if (maxEndTime && (currentHour > maxEndTime.hour || (currentHour === maxEndTime.hour && currentMin > maxEndTime.min))) {
        break;
      }
      
      const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      
      // Check if this time slot exists in available times
      const slotExists = availableTimes.some(slot => {
        const slotTime = typeof slot === 'string' ? slot : slot.time || slot;
        return slotTime === timeStr;
      });
      
      if (slotExists || options.length === 0) { // Always include at least 1 hour option
        options.push(timeStr);
      } else {
        break; // Stop if slot doesn't exist
      }
      
      // Limit to reasonable number of hours (e.g., max 6 hours)
      if (options.length >= 6) break;
    }
    
    return options;
  }, [selectedStartTime, availableTimes, availability, selectedDate]);

  // Early return after all hooks are called
  if (!isOpen || !coach) {
    return null;
  }

  // Check if a date has availability
  const hasAvailability = (dateStr) => {
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString('en-AU', { weekday: 'long' });
    
    return availability.some(av => {
      // Date-specific availability (type: 'date')
      if (av.type === 'date' && av.date === dateStr) {
        return true;
      }
      
      // Pattern-based availability (type: 'pattern' or no type for backward compatibility)
      if (!av.type || av.type === 'pattern') {
        // Check if day matches
        if (av.day && av.day.toLowerCase() !== dayName.toLowerCase()) return false;
        
        // Check date range if provided
        if (av.startDate || av.endDate) {
          const startDate = av.startDate ? new Date(av.startDate) : null;
          const endDate = av.endDate ? new Date(av.endDate) : null;
          const checkDate = new Date(dateStr);
          
          if (startDate && checkDate < startDate) return false;
          if (endDate && checkDate > endDate) return false;
        }
        
        return true;
      }
      
      return false;
    });
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const isPast = date < today;
      const isAvailable = !isPast && hasAvailability(dateStr);
      
      days.push({
        date,
        dateStr,
        day,
        isPast,
        isAvailable
      });
    }
    
    return days;
  };

  // Format time for display (e.g., "9:00" -> "9am", "14:00" -> "2pm")
  const formatTime = (timeStr) => {
    const [hour, min] = timeStr.split(':').map(Number);
    const hour12 = hour % 12 || 12;
    const ampm = hour < 12 ? 'am' : 'pm';
    return `${hour12}${min === 0 ? '' : `:${String(min).padStart(2, '0')}`}${ampm}`;
  };

  // Format time range (e.g., "9:00" and "10:00" -> "9am-10am")
  const formatTimeRange = (startTime, endTime) => {
    return `${formatTime(startTime)}-${formatTime(endTime)}`;
  };

  // Navigate to previous/next month
  const navigateMonth = useCallback((direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  }, []);

  // Generate time slots based on selected day's availability
  const generateTimeSlots = useCallback((dayName, selectedDateStr) => {
    // First check for date-specific availability
    const dateSpecificAvailability = availability.find(av => 
      av.type === 'date' && av.date === selectedDateStr
    );
    
    if (dateSpecificAvailability) {
      const slots = [];
      const [startHour, startMin] = dateSpecificAvailability.start.split(':').map(Number);
      const [endHour, endMin] = dateSpecificAvailability.end.split(':').map(Number);
      
      let currentHour = startHour;
      let currentMin = startMin;
      
      // Generate hourly slots (1 hour minimum booking)
      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
        slots.push(timeStr);
        
        // Move to next hour
        currentHour += 1;
        // Don't add slots that would exceed the end time
        if (currentHour > endHour || (currentHour === endHour && currentMin >= endMin)) {
          break;
        }
      }
      
      return slots;
    }
    
    // Fallback to pattern-based availability
    const dayAvailability = availability.find(av => 
      (!av.type || av.type === 'pattern') && av.day && av.day.toLowerCase() === dayName.toLowerCase()
    );
    
    if (!dayAvailability) return [];

    const slots = [];
    const [startHour, startMin] = dayAvailability.start.split(':').map(Number);
    const [endHour, endMin] = dayAvailability.end.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMin = startMin;
    
    // Generate hourly slots (1 hour minimum booking)
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      slots.push(timeStr);
      
      // Move to next hour
      currentHour += 1;
      // Don't add slots that would exceed the end time
      if (currentHour > endHour || (currentHour === endHour && currentMin >= endMin)) {
        break;
      }
    }
    
    return slots;
  }, [availability]);

  // Fetch available time slots from backend when date is selected
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate || !coach?.id) {
        setAvailableTimes([]);
        return;
      }

      setIsLoadingSlots(true);
      try {
        const response = await fetch(
          `${getAPI_URL()}/coaches/available-slots?coachId=${coach.id}&date=${selectedDate}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const slots = (data.availableSlots || []).map(s => s.time || s);
            setAvailableTimes(slots);
          } else {
            setAvailableTimes([]);
          }
        } else {
          setAvailableTimes([]);
        }
      } catch (error) {
        console.error('Error fetching available slots:', error);
        // Fallback to client-side generation
        if (coach && selectedDate) {
          const date = new Date(selectedDate);
          const dayName = date.toLocaleDateString('en-AU', { weekday: 'long' });
          const times = generateTimeSlots(dayName, selectedDate);
          setAvailableTimes(times);
        } else {
          setAvailableTimes([]);
        }
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate, coach?.id, availability, generateTimeSlots]);

  // Reset time selection when date changes
  useEffect(() => {
    if (selectedDate) {
      setSelectedStartTime('');
      setSelectedEndTime('');
    }
  }, [selectedDate]);

  // Add current selection to sessions list
  const handleAddSession = () => {
    if (!selectedDate || !selectedStartTime || !selectedEndTime) {
      toast.error('Please select date, start time, and end time');
      return;
    }
    
    // Calculate duration in minutes
    const [startHour, startMin] = selectedStartTime.split(':').map(Number);
    const [endHour, endMin] = selectedEndTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const duration = endMinutes - startMinutes;
    
    if (duration <= 0) {
      toast.error('End time must be after start time');
      return;
    }
    
    if (duration < 60) {
      toast.error('Minimum booking duration is 1 hour');
      return;
    }

    // Check if this session already exists
    const sessionExists = selectedSessions.some(s => 
      s.date === selectedDate && s.time === selectedStartTime
    );

    if (sessionExists) {
      toast.error('This session is already added');
      return;
    }

    // Add to sessions list
    const newSession = {
      date: selectedDate,
      time: selectedStartTime,
      duration: duration
    };

    setSelectedSessions([...selectedSessions, newSession]);
    
    // Reset current selection
    setSelectedDate('');
    setSelectedStartTime('');
    setSelectedEndTime('');
    setAvailableTimes([]);
    
    toast.success('Session added! You can add more sessions or proceed to payment.');
  };

  // Remove a session from the list
  const handleRemoveSession = (index) => {
    setSelectedSessions(selectedSessions.filter((_, i) => i !== index));
  };

  // Confirm booking with all selected sessions
  const handleConfirm = () => {
    // If there's a current selection but no sessions added yet, add it automatically
    if (selectedSessions.length === 0 && selectedDate && selectedStartTime && selectedEndTime) {
      // Calculate duration
      const [startHour, startMin] = selectedStartTime.split(':').map(Number);
      const [endHour, endMin] = selectedEndTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      const duration = endMinutes - startMinutes;
      
      if (duration >= 60) {
        // Auto-add the current selection
        const currentSession = {
          date: selectedDate,
          time: selectedStartTime,
          duration: duration
        };
        
        onConfirmBooking({
          sessions: [currentSession],
          date: currentSession.date,
          time: currentSession.time,
          duration: currentSession.duration
        });
        return;
      }
    }

    if (selectedSessions.length === 0) {
      toast.error('Please select a time slot or add at least one session');
      return;
    }

    // For multiple sessions, we'll process them one by one
    // Pass all sessions to the booking handler
    onConfirmBooking({
      sessions: selectedSessions,
      date: selectedSessions[0].date,
      time: selectedSessions[0].time,
      duration: selectedSessions[0].duration
    });
  };

  // Update end time when start time changes
  useEffect(() => {
    if (selectedStartTime && availableTimes.length > 0) {
      const [hour, min] = selectedStartTime.split(':').map(Number);
      const endHour = hour + 1;
      const endTimeStr = `${String(endHour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      const endOptions = getEndTimeOptions();
      if (endOptions.length > 0 && (!selectedEndTime || selectedEndTime <= selectedStartTime)) {
        setSelectedEndTime(endOptions[0]);
      }
    }
  }, [selectedStartTime, availableTimes]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div 
        className="bg-white rounded-lg p-4 sm:p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold pr-2">Book Session with {coach.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl flex-shrink-0"
          >
            ×
          </button>
        </div>
        
        {availability.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No availability slots available.</p>
        ) : (
          <div className="space-y-4">
            {/* Calendar Date Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Date</label>
              
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-1 hover:bg-gray-100 rounded"
                  type="button"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-sm font-semibold">
                  {currentMonth.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-1 hover:bg-gray-100 rounded"
                  type="button"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Day headers */}
                <div className="grid grid-cols-7 bg-gray-50">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-xs font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar days */}
                <div className="grid grid-cols-7">
                  {generateCalendarDays().map((dayData, index) => {
                    if (!dayData) {
                      return <div key={`empty-${index}`} className="aspect-square border-r border-b border-gray-200 last:border-r-0" />;
                    }
                    
                    const { date, dateStr, day, isPast, isAvailable } = dayData;
                    const isSelected = selectedDate === dateStr;
                    
                    return (
                      <button
                        key={dateStr}
                        type="button"
                        onClick={() => {
                          if (!isPast && isAvailable) {
                            setSelectedDate(dateStr);
                            setSelectedStartTime('');
                            setSelectedEndTime('');
                          }
                        }}
                        disabled={isPast || !isAvailable}
                        className={`aspect-square border-r border-b border-gray-200 last:border-r-0 text-sm transition-colors ${
                          isPast
                            ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                            : isAvailable
                            ? isSelected
                              ? 'bg-[#030213] text-white font-semibold'
                              : 'bg-green-50 hover:bg-green-100 text-green-700 font-medium cursor-pointer'
                            : 'bg-white text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></div>
                  <span>Unavailable</span>
                </div>
              </div>
            </div>

            {/* Time Slot Selection */}
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Available Time Slots for {new Date(selectedDate).toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </label>
                <p className="text-xs text-gray-500 mb-3">Click a time slot to book. Each slot is 1 hour. You can book multiple consecutive slots.</p>
                {isLoadingSlots ? (
                  <div className="text-center py-4 text-gray-600">Loading available slots...</div>
                ) : availableTimes.length > 0 ? (
                  <div>
                    <div className="mb-2 text-xs text-gray-600">
                      💡 Only available (unbooked) time slots are shown. If a slot is already booked, it won't appear here.
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                      {availableTimes.map((time, index) => {
                        const timeStr = typeof time === 'string' ? time : time.time || time;
                        const [hour, min] = timeStr.split(':').map(Number);
                        const timeMinutes = hour * 60 + min;
                        
                        // Calculate end time (1 hour later)
                        const endHour = hour + 1;
                        const endTimeStr = `${String(endHour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
                        const timeRange = formatTimeRange(timeStr, endTimeStr);
                        
                        // Check if this time slot is selected
                        let isSelected = false;
                        let isInRange = false;
                        if (selectedStartTime && selectedEndTime) {
                          const [startHour, startMin] = selectedStartTime.split(':').map(Number);
                          const [endHourSelected, endMinSelected] = selectedEndTime.split(':').map(Number);
                          const startMinutes = startHour * 60 + startMin;
                          const endMinutes = endHourSelected * 60 + endMinSelected;
                          
                          if (timeStr === selectedStartTime) {
                            isSelected = true;
                          } else if (timeMinutes >= startMinutes && timeMinutes < endMinutes) {
                            isInRange = true;
                          }
                        } else if (selectedStartTime && timeStr === selectedStartTime) {
                          isSelected = true;
                        }
                        
                        return (
                          <button
                            key={timeStr}
                            type="button"
                            onClick={() => {
                              if (!selectedStartTime) {
                                // Set start time
                                setSelectedStartTime(timeStr);
                                // Auto-set end time to 1 hour later
                                const endExists = availableTimes.some(t => {
                                  const tStr = typeof t === 'string' ? t : t.time || t;
                                  return tStr === endTimeStr;
                                });
                                if (endExists) {
                                  setSelectedEndTime(endTimeStr);
                                }
                              } else {
                                // Start time already selected
                                const [startHour, startMin] = selectedStartTime.split(':').map(Number);
                                const startMinutes = startHour * 60 + startMin;
                                
                                if (timeMinutes <= startMinutes) {
                                  // Reset and set new start time
                                  setSelectedStartTime(timeStr);
                                  const endExists = availableTimes.some(t => {
                                    const tStr = typeof t === 'string' ? t : t.time || t;
                                    return tStr === endTimeStr;
                                  });
                                  if (endExists) {
                                    setSelectedEndTime(endTimeStr);
                                  } else {
                                    setSelectedEndTime('');
                                  }
                                } else {
                                  // Set as end time (extend booking)
                                  setSelectedEndTime(endTimeStr);
                                }
                              }
                            }}
                            className={`p-3 border rounded-lg text-sm transition-all font-medium text-left ${
                              isSelected
                                ? 'bg-[#e0cb23] text-[#030213] border-[#e0cb23] font-semibold'
                                : isInRange
                                ? 'bg-[#e0cb23]/20 border-[#e0cb23] text-[#030213]'
                                : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400'
                            }`}
                          >
                            {timeRange}
                          </button>
                        );
                      })}
                    </div>
                    {selectedStartTime && selectedEndTime && (
                      <div className="text-sm text-gray-700 mb-2 p-2 bg-gray-50 rounded">
                        <span className="font-semibold">Selected:</span> {formatTimeRange(selectedStartTime, selectedEndTime)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-gray-600 font-medium mb-2">⚠️ No available slots for this date</div>
                    <div className="text-xs text-gray-500">All time slots for this date are already booked. Please select another date.</div>
                  </div>
                )}
              </div>
            )}

            {/* Selected Sessions List */}
            {selectedSessions.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-sm mb-3 text-blue-900">
                  Selected Sessions ({selectedSessions.length})
                </h3>
                <div className="space-y-2 mb-3">
                  {selectedSessions.map((session, index) => {
                    const date = new Date(session.date);
                    const hours = session.duration / 60;
                    const price = (coach.hourly_rate || 0) * hours;
                    return (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-blue-200">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {date.toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-xs text-gray-600">
                            {formatTimeRange(session.time, (() => {
                              const [hour, min] = session.time.split(':').map(Number);
                              const endHour = hour + Math.floor(session.duration / 60);
                              return `${String(endHour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
                            })())} • {hours} {hours === 1 ? 'hour' : 'hours'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#030213]">${price.toFixed(2)}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSession(index)}
                            className="text-red-500 hover:text-red-700 text-lg font-bold"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                  <span className="font-semibold text-blue-900">Total:</span>
                  <span className="text-lg font-bold text-[#030213]">
                    ${(selectedSessions.reduce((sum, session) => {
                      const hours = session.duration / 60;
                      return sum + (coach.hourly_rate || 0) * hours;
                    }, 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Current Selection Price Display */}
            {selectedStartTime && selectedEndTime && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">Current Selection Duration:</span>
                  <span className="text-sm text-gray-600">
                    {(() => {
                      const [startHour, startMin] = selectedStartTime.split(':').map(Number);
                      const [endHour, endMin] = selectedEndTime.split(':').map(Number);
                      const startMinutes = startHour * 60 + startMin;
                      const endMinutes = endHour * 60 + endMin;
                      const hours = (endMinutes - startMinutes) / 60;
                      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
                    })()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Price:</span>
                  <span className="text-lg font-bold text-[#030213]">
                    {(() => {
                      const [startHour, startMin] = selectedStartTime.split(':').map(Number);
                      const [endHour, endMin] = selectedEndTime.split(':').map(Number);
                      const startMinutes = startHour * 60 + startMin;
                      const endMinutes = endHour * 60 + endMin;
                      const hours = (endMinutes - startMinutes) / 60;
                      return `$${((coach.hourly_rate || 0) * hours).toFixed(2)}`;
                    })()}
                  </span>
                </div>
              </div>
            )}

            {/* Add Session Button - Only show after time slot is selected */}
            {selectedDate && selectedStartTime && selectedEndTime && (
              <div className="mt-4 p-4 bg-[#e0cb23]/10 border border-[#e0cb23] rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-[#030213]">Selected Time Slot</p>
                    <p className="text-xs text-gray-600">
                      {formatTimeRange(selectedStartTime, selectedEndTime)} • {(() => {
                        const [startHour, startMin] = selectedStartTime.split(':').map(Number);
                        const [endHour, endMin] = selectedEndTime.split(':').map(Number);
                        const startMinutes = startHour * 60 + startMin;
                        const endMinutes = endHour * 60 + endMin;
                        const hours = (endMinutes - startMinutes) / 60;
                        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
                      })()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#030213]">
                      ${(() => {
                        const [startHour, startMin] = selectedStartTime.split(':').map(Number);
                        const [endHour, endMin] = selectedEndTime.split(':').map(Number);
                        const startMinutes = startHour * 60 + startMin;
                        const endMinutes = endHour * 60 + endMin;
                        const hours = (endMinutes - startMinutes) / 60;
                        return ((coach.hourly_rate || 0) * hours).toFixed(2);
                      })()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleAddSession}
                  className="w-full bg-[#e0cb23] text-[#030213] py-3 rounded-lg font-semibold hover:bg-[#d4ba1f] transition-colors shadow-md"
                >
                  + Add This Session
                </button>
              </div>
            )}

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              disabled={selectedSessions.length === 0 && (!selectedDate || !selectedStartTime || !selectedEndTime)}
              className="w-full bg-[#030213] text-white py-3 rounded-lg font-medium hover:bg-[#050525] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedSessions.length > 0 
                ? `Proceed to Payment (${selectedSessions.length} ${selectedSessions.length === 1 ? 'session' : 'sessions'})`
                : selectedDate && selectedStartTime && selectedEndTime
                ? 'Proceed to Payment'
                : 'Select a time slot to continue'}
            </button>
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
  // Defensive checks - ensure coach object exists and has required properties
  if (!coach || !coach.id) {
    console.error('Invalid coach data:', coach);
    return null;
  }

  // Get image for coach - use image_url from database if available, otherwise use fallback
  const coachImage = coach.image_url || coachImageMap[coach.name] || coachImageMap["Michael Rodriguez"];

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
    <div className="flex flex-col items-center w-full">
      {/* Photo */}
      <div className="w-full max-w-[280px] aspect-[280/240] rounded-[24px] overflow-hidden mb-4 shadow-sm bg-gradient-to-br from-[#030213] to-[#1a1a2e]">
        {coach.image_url ? (
          <img
            src={coach.image_url}
            alt={coach.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={coachImage}
            alt={coach.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Name + specialty */}
      <div className="text-center mb-3 w-full px-2">
        <p className="text-[13px] sm:text-[14px] underline font-medium break-words">{coach.name}</p>
        <p className="text-[11px] sm:text-[12px] text-gray-600 mt-1">{coach.specialty || 'Coach'}</p>
      </div>

      {/* Hourly Rate */}
      <div className="text-center mb-3">
        <p className="text-[12px] sm:text-[13px] font-semibold text-[#030213]">
          ${parseFloat(coach.hourly_rate?.toString() || '0').toFixed(2)}/hr
        </p>
      </div>

      {/* Contact Info */}
      {(coach.email || coach.phone || coach.location) && (
        <div className="text-center mb-3 text-[10px] sm:text-xs text-gray-600 space-y-1 w-full px-2">
          {coach.location && (
            <div className="flex items-center justify-center gap-1">
              <span>📍</span>
              <span className="break-words">{coach.location}</span>
            </div>
          )}
          {coach.email && (
            <div className="flex items-center justify-center gap-1">
              <span>📧</span>
              <span className="truncate max-w-full sm:max-w-[200px]">{coach.email}</span>
            </div>
          )}
          {coach.phone && (
            <div className="flex items-center justify-center gap-1">
              <span>📞</span>
              <span className="break-words">{coach.phone}</span>
            </div>
          )}
        </div>
      )}

      {/* Social icons - only show if URLs are provided, hide completely if none */}
      {(coach.linkedin_url || coach.twitter_url || coach.instagram_url || coach.facebook_url) && (
        <div className="flex gap-2 sm:gap-3 text-[12px] text-gray-600 mb-4 justify-center">
          {coach.linkedin_url && (
            <a
              href={coach.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center hover:border-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-colors cursor-pointer"
              title="LinkedIn"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          )}
          {coach.twitter_url && (
            <a
              href={coach.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
              title="Twitter/X"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          )}
          {coach.instagram_url && (
            <a
              href={coach.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center hover:border-[#E4405F] hover:bg-[#E4405F] hover:text-white transition-colors cursor-pointer"
              title="Instagram"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          )}
          {coach.facebook_url && (
            <a
              href={coach.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors cursor-pointer"
              title="Facebook"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          )}
        </div>
      )}

      {/* Book Now button */}
      <button
        onClick={() => onBookNow?.(coach)}
        className="border border-[#030213] bg-[#030213] text-white text-[11px] sm:text-[12px] px-4 sm:px-6 py-2 rounded-[4px] hover:bg-[#050525] transition w-full sm:w-auto"
      >
        Book Now
      </button>

      {/* Test Payment Button - Only for James Wilson */}
      {coach.name && coach.name.toLowerCase().includes('james wilson') && isUserLoggedIn() && (
        <button
          onClick={async () => {
            try {
              // Use today's date and a default time for test booking
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              const testDate = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD
              const testTime = '10:00'; // Default 10 AM
              const testDuration = 60; // 1 hour default
              
              // Simulate payment success by redirecting to payment success page with test flag
              const mockSessionId = `cs_test_coach_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              const successUrl = `/paymentSuccess?session_id=${mockSessionId}&type=coach&coachId=${coach.id}&test=true&bookingDate=${testDate}&bookingTime=${testTime}&bookingDuration=${testDuration}`;
              
              toast.info('🧪 Test Mode: Simulating payment success...');
              
              // Direct navigation to payment success page with query params
              window.location.href = successUrl;
            } catch (error) {
              console.error('Test payment error:', error);
              toast.error('Failed to simulate payment. Please try the real payment flow.');
            }
          }}
          className="mt-2 font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs sm:text-sm px-4 sm:px-6 py-2 rounded-[4px] transition-colors shadow-lg hover:shadow-xl bg-yellow-500 text-black hover:bg-yellow-600 w-full sm:w-auto"
        >
          🧪 Test Payment Flow
        </button>
      )}
    </div>
  );
}

export default function CoachesPage({ onViewProfile, onBack }) {
  const { user } = useAuth();
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const loadCoaches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading coaches from API...');
      // Add timestamp to ensure fresh data (API already has cache-busting, but double-check)
      const data = await getCoaches();
      
      if (!data || !Array.isArray(data)) {
        console.error('Invalid data received from API:', data);
        setError('Invalid data received from server');
        setCoaches([]);
        setLoading(false);
        return;
      }
      
      // Show all active coaches with defensive filtering
      const activeCoaches = data
        .filter((coach) => {
          // Ensure coach exists and has required properties
          if (!coach || !coach.id) {
            console.warn('Skipping invalid coach:', coach);
            return false;
          }
          // Only show active coaches
          return coach.status === 'active' || !coach.status;
        })
        .map((coach) => {
          // Ensure all required properties exist with defaults
          return {
            id: coach.id,
            name: coach.name || 'Unknown Coach',
            specialty: coach.specialty || 'Coach',
            email: coach.email || '',
            phone: coach.phone || '',
            hourly_rate: coach.hourly_rate || 0,
            availability: coach.availability || [],
            image_url: coach.image_url || null,
            linkedin_url: coach.linkedin_url || null,
            twitter_url: coach.twitter_url || null,
            instagram_url: coach.instagram_url || null,
            facebook_url: coach.facebook_url || null,
            status: coach.status || 'active',
          };
        });
      
      console.log('✅ Loaded', activeCoaches.length, 'active coaches from backend');
      setCoaches(activeCoaches);
    } catch (err) {
      console.error('❌ Error loading coaches:', err);
      setError(err?.message || 'Failed to load coaches. Please try again.');
      setCoaches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load coaches on mount - always fetch fresh data from MySQL
  // When navigating to coaches page, this component remounts and loads fresh data
  useEffect(() => {
    console.log('🔄 CoachesPage mounted - fetching fresh coaches from API');
    loadCoaches();
  }, [loadCoaches]);

  // Reload coaches when view changes to 'list' (triggered by CoachesWrapper)
  useEffect(() => {
    const handleReload = () => {
      console.log('🔄 CoachesPage reload triggered from CoachesWrapper');
      loadCoaches();
    };

    window.addEventListener('coachesPageReload', handleReload);
    return () => {
      window.removeEventListener('coachesPageReload', handleReload);
    };
  }, [loadCoaches]);

  // Reload coaches when page becomes visible (user navigates back to tab)
  // This ensures coaches are fresh if admin made changes while user was on another tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible - always reload to get any admin updates
        console.log('👁️ Page visible - reloading coaches to check for updates');
        loadCoaches();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadCoaches]);

  // Also reload when window gains focus (user clicks back on tab)
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔍 Window focused - reloading coaches to check for updates');
      loadCoaches();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadCoaches]);

  const handleBookNow = async (coach) => {
    if (!coach) return;

    // Step 1: Check if user is logged in
    if (!isUserLoggedIn()) {
      // Store the coach details so we can redirect back after login
      sessionStorage.setItem('pendingCoachBooking', JSON.stringify({
        coachId: coach.id,
        coachName: coach.name,
        hourlyRate: coach.hourly_rate
      }));
      toast.info('Please log in or sign up to book a coaching session');
      // Navigate to signin - you'll need to pass onNavigate prop or use router
      return;
    }

    // Step 2: User is logged in - show booking modal
    setSelectedCoach(coach);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async (bookingDetails) => {
    if (!selectedCoach || !bookingDetails) return;

    setIsProcessingPayment(true);
    setIsBookingModalOpen(false);

    try {
      // Handle multiple sessions
      const sessions = bookingDetails.sessions || [bookingDetails];
      const hourlyRate = parseFloat(selectedCoach.hourly_rate?.toString() || '0');
      
      // Calculate total amount for all sessions
      const totalAmount = sessions.reduce((sum, session) => {
        const durationHours = session.duration / 60;
        return sum + (hourlyRate * durationHours);
      }, 0);

      const bookingName = sessions.length > 1 
        ? `${sessions.length} Coaching Sessions with ${selectedCoach.name}`
        : `Coaching Session with ${selectedCoach.name}`;
      
      // For multiple sessions, use the first session for the main booking
      // The backend will need to handle creating multiple bookings from metadata
      const firstSession = sessions[0];
      
      // Create checkout session with date/time
      // Note: Backend currently handles single sessions only
      // For multiple sessions, we'll process the first one for now
      const response = await createCheckoutSession({
        eventId: `coach-${selectedCoach.id}`,
        eventName: bookingName,
        amount: totalAmount,
        currency: 'aud',
        bookingType: 'coach',
        coachId: selectedCoach.id.toString(),
        bookingDate: firstSession.date,
        bookingTime: firstSession.time,
        bookingDuration: firstSession.duration,
        successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=coach&coachId=${selectedCoach.id}`,
        cancelUrl: `${window.location.origin}/coaches?canceled=true`,
      });

      if (response.url) {
        // Redirect to Stripe Checkout for payment (same as events)
        window.location.href = response.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(`Payment error: ${error.message || 'Failed to process payment. Please try again.'}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
      <HomeHeader />

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-4 sm:mb-6 text-xs sm:text-sm font-semibold text-black hover:underline"
          >
            ← Back
          </button>
        )}
        <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold text-center mb-8 sm:mb-12">
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
          /* Responsive coach grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-12 md:gap-x-16 gap-y-12 sm:gap-y-16 md:gap-y-24">
            {coaches
              .filter((coach) => coach && coach.id) // Filter out any invalid coaches
              .map((coach) => (
                <CoachCard
                  key={coach.id}
                  coach={coach}
                  onViewProfile={onViewProfile}
                  onBookNow={handleBookNow}
                />
              ))}
          </div>
        )}

        {/* Booking Modal */}
        {selectedCoach && (
          <BookingModal
            key={selectedCoach.id}
            coach={selectedCoach}
            isOpen={isBookingModalOpen}
            onClose={() => {
              setIsBookingModalOpen(false);
              setSelectedCoach(null);
            }}
            onConfirmBooking={handleConfirmBooking}
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
