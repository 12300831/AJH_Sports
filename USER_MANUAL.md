# AJH Sports Platform - User Manual

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [User Guide](#user-guide)
4. [Admin Guide](#admin-guide)
5. [Payment Process](#payment-process)
6. [Troubleshooting](#troubleshooting)
7. [FAQs](#faqs)

---

## Overview

The AJH Sports Platform is a comprehensive sports management system that allows users to:
- Browse and book sports events (tournaments, coaching sessions, parties)
- Book one-on-one coaching sessions with professional coaches
- Manage their bookings and profile
- View their booking history and payment receipts

Administrators can:
- Create and manage events
- Add and manage coaches with availability schedules
- View and manage all bookings
- Manage user accounts

---

## Getting Started

### Creating an Account

1. **Navigate to the Sign Up page**
   - Click the **"Sign Up"** button in the header (top right)
   - Or navigate directly to the sign-up page

2. **Fill in your details**
   - Full Name
   - Email Address
   - Password (minimum requirements apply)
   - Confirm Password

3. **Submit the form**
   - Click **"Sign Up"**
   - You'll be automatically logged in after successful registration

### Signing In

1. **Click "Sign In"** in the header
2. **Enter your credentials**
   - Email Address
   - Password
3. **Click "Sign In"**
   - You'll be redirected to the home page upon successful login

### Google OAuth Login (Alternative)

1. Click **"Sign in with Google"** on the sign-in page
2. Select your Google account
3. Grant permissions if prompted
4. You'll be automatically logged in

---

## User Guide

### Navigation

The main navigation menu includes:
- **Home**: Return to the homepage
- **Clubs**: View club information
- **Events**: Browse and book events
- **Coaches**: Browse and book coaching sessions
- **Contact**: Contact the AJH Sports team
- **Account**: Access your profile and dashboard (when logged in)

### Home Page

The home page provides:
- Overview of AJH Sports
- Quick links to main sections
- Featured events and coaches
- Statistics and information

### Events

#### Viewing Events

1. **Navigate to Events**
   - Click **"Events"** in the header
   - You'll see all available events

2. **Filter Events**
   - Use category filters: All Events, Tournaments, Coaching, Parties
   - Events are automatically loaded from the database

3. **View Event Details**
   - Click on any event card
   - View:
     - Event name and description
     - Date and time
     - Location
     - Price
     - Available spots (color-coded: green = many, orange = few, red = limited)
     - Important information

#### Booking an Event

1. **Select an Event**
   - Click on the event you want to book
   - Review all details

2. **Click "Register Now"**
   - If not logged in, you'll be redirected to sign in
   - After signing in, you'll return to the booking

3. **Proceed to Payment**
   - You'll be redirected to Stripe checkout
   - Complete payment securely

4. **Confirmation**
   - After successful payment, you'll receive:
     - On-screen confirmation
     - Email confirmation with booking details
     - Booking ID for reference

**Note**: If you cancel the Stripe checkout, you can retry booking the same event. Only paid bookings prevent duplicate registrations.

### Coaches

#### Viewing Coaches

1. **Navigate to Coaches**
   - Click **"Coaches"** in the header
   - View all available coaches

2. **Coach Information**
   Each coach card displays:
   - Name and specialty
   - Hourly rate
   - Location
   - Contact information (email, phone)
   - Social media links (if available)
   - Profile image

#### Booking a Coaching Session

1. **Select a Coach**
   - Click **"Book Now"** on the coach card
   - A booking modal will open

2. **Select Date**
   - Use the calendar to select an available date
   - Available dates are highlighted in green
   - Past dates are disabled

3. **Select Time Slot**
   - After selecting a date, available hourly time slots appear
   - Time slots are displayed as buttons (e.g., "9am-10am", "10am-11am")
   - Click a time slot to select it (it will turn yellow)
   - You can select consecutive hours for longer sessions

4. **Add Multiple Sessions (Optional)**
   - After selecting a time slot, click **"+ Add This Session"**
   - The session is added to your list
   - You can add more sessions before proceeding to payment
   - Each session shows its individual price

5. **Proceed to Payment**
   - Review your selected sessions
   - Total price is calculated automatically
   - Click **"Proceed to Payment"**
   - You'll be redirected to Stripe checkout

6. **Confirmation**
   - After successful payment:
     - On-screen confirmation
     - Email confirmation with session details
     - Booking ID for reference

**Important Notes**:
- Sessions are booked in 1-hour increments
- You can book multiple consecutive hours (e.g., 3-4 PM, 4-5 PM, 5-6 PM)
- Once a time slot is booked, it becomes unavailable for other users
- You cannot book the same coach for the same date and time twice

### Player Dashboard

Access your dashboard by clicking your profile icon in the header (when logged in).

#### Overview Tab
- Summary of your bookings
- Upcoming events and coaching sessions
- Recent activity

#### Personal Info Tab
- View and update your profile information
- Change password
- Update contact details

#### Preferences Tab
- Set notification preferences
- Manage account settings

#### Stats & Activity Tab
- View booking history
- Track your participation
- View statistics

### Contact Page

1. **Navigate to Contact**
   - Click **"Contact"** in the header

2. **Fill out the contact form**
   - Name
   - Email
   - Subject
   - Message

3. **Submit**
   - Click **"Send Message"**
   - You'll receive a confirmation

---

## Admin Guide

### Accessing the Admin Portal

1. **Log in as an admin user**
   - Use admin credentials (e.g., admin@gmail.com)
   - Admin role is required

2. **Navigate to Admin**
   - Click your profile icon
   - Select **"Admin Portal"** from the dropdown

### Admin Dashboard

The dashboard provides:
- **Statistics Overview**:
  - Total Events
  - Total Coaches
  - Total Users
  - Total Bookings
  - Recent bookings summary

- **Quick Actions**:
  - Create New Event
  - Add New Coach

- **Quick Tips**:
  - Guidance on using admin features

### Managing Events

#### Creating an Event

1. **Navigate to "Manage Events"**
   - Click **"Manage Events"** in the admin sidebar

2. **Click "+ Create New Event"**

3. **Fill in Event Details**:
   - **Name**: Event title
   - **Description**: Detailed description
   - **Category**: Tournament, Coaching, or Party
   - **Date**: Event date
   - **Time**: Event start time
   - **Location**: Event venue
   - **Price**: Registration fee (AUD)
   - **Capacity**: Maximum number of participants
   - **Status**: Active (visible to users) or Inactive (hidden)
   - **Image URL**: Link to event image (optional)

4. **Click "Create Event"**
   - Event is immediately available for booking

#### Editing an Event

1. **Find the event** in the events list
2. **Click the "Edit" button** (pencil icon)
3. **Update any fields**
4. **Click "Update Event"**
   - Changes are immediately reflected on the public page

#### Deleting an Event

1. **Find the event** in the events list
2. **Click the "Delete" button** (trash icon)
3. **Confirm deletion**
   - **Soft Delete**: Event is hidden but data is preserved
   - **Hard Delete**: Event is permanently removed (use with caution)

**Note**: Events with existing bookings should be soft-deleted to preserve booking history.

### Managing Coaches

#### Adding a Coach

1. **Navigate to "Manage Coaches"**
   - Click **"Manage Coaches"** in the admin sidebar

2. **Click "+ Add New Coach"**

3. **Fill in Coach Details**:
   - **Name**: Coach's full name
   - **Specialty**: Area of expertise
   - **Email**: Contact email
   - **Phone**: Contact number
   - **Location**: Where the coach operates
   - **Hourly Rate**: Price per hour (AUD)
   - **Status**: Active or Inactive
   - **Image URL**: Link to coach photo (optional)
   - **Social Media URLs**: LinkedIn, Twitter, Instagram, Facebook (optional)

4. **Set Availability**:

   **Option A: Day Pattern (Recurring)**
   - Select **"Day Pattern"** tab
   - Choose day of week (Monday-Sunday)
   - Set start time (e.g., 9:00 AM)
   - Set end time (e.g., 5:00 PM)
   - (Optional) Set date range:
     - Start Date: When availability begins
     - End Date: When availability ends
   - Click **"+ Add Availability Slot"**
   - Repeat for multiple days

   **Option B: Specific Dates**
   - Select **"Specific Dates"** tab
   - **Single Date**:
     - Select date
     - Set start and end times
     - Click **"+ Add Single Date"**
   - **Bulk Add (Date Range)**:
     - Select start and end dates
     - Select days of week to include
     - Set start and end times
     - Click **"+ Add Bulk Dates"**

5. **Click "Create Coach"**
   - Coach is immediately available for booking

#### Editing a Coach

1. **Find the coach** in the coaches list
2. **Click the "Edit" button** (pencil icon)
3. **Update any fields** (including availability)
4. **Click "Update Coach"**
   - Changes are immediately reflected on the public page

#### Managing Coach Availability

- **Add Availability**: Use the availability section in the edit dialog
- **Remove Availability**: Click the "X" next to an availability slot
- **Update Availability**: Edit the coach and modify availability slots

**Important**: When you update a coach's availability, existing bookings are not affected. Only new bookings will use the updated schedule.

#### Deleting a Coach

1. **Find the coach** in the coaches list
2. **Click the "Delete" button** (trash icon)
3. **Confirm deletion**
   - **Soft Delete**: Coach is hidden but data is preserved
   - **Hard Delete**: Coach is permanently removed (use with caution)

**Note**: Coaches with existing bookings should be soft-deleted to preserve booking history.

### Managing Bookings

#### Viewing Bookings

1. **Navigate to "Manage Bookings"**
   - Click **"Manage Bookings"** in the admin sidebar

2. **View by Type**:
   - **Event Bookings**: All event registrations
   - **Coach Bookings**: All coaching session bookings

3. **Filter Options**:
   - **Status Filter**: All, Pending, Confirmed, Cancelled
   - **Search**: Search by user name, event/coach name, or booking ID

#### Updating Booking Status

1. **Find the booking** in the list
2. **Click the status dropdown**
3. **Select new status**:
   - **Pending**: Payment not yet completed
   - **Confirmed**: Payment completed, booking confirmed
   - **Cancelled**: Booking cancelled
   - **Completed**: Event/session has occurred

4. **Status is updated immediately**

#### Booking Information Displayed

For **Event Bookings**:
- Booking ID
- User Name
- Event Name
- Event Date & Time
- Location
- Price
- Payment Status
- Booking Status
- Booking Date

For **Coach Bookings**:
- Booking ID
- User Name
- Coach Name
- Booking Date
- Booking Time
- Duration (minutes)
- Total Price
- Payment Status
- Booking Status
- Booking Created Date

### Managing Users

1. **Navigate to "Manage Users"**
   - Click **"Manage Users"** in the admin sidebar

2. **View User List**:
   - All registered users
   - User details: Name, Email, Role, Status
   - Registration date

3. **User Actions**:
   - View user details
   - Update user status (Active/Inactive)
   - View user's bookings

---

## Payment Process

### Stripe Checkout

1. **After selecting an event or coach session**, click **"Proceed to Payment"**

2. **You'll be redirected to Stripe**
   - Secure payment page hosted by Stripe
   - Enter payment details (card number, expiry, CVC)
   - Billing information

3. **Complete Payment**
   - Click **"Pay"** or **"Confirm Payment"**
   - Payment is processed securely

4. **Payment Success**
   - You'll be redirected to the success page
   - Booking confirmation is displayed
   - Email confirmation is sent automatically

### Payment Confirmation Email

After successful payment, you'll receive an email with:
- **Booking Details**:
  - Event/Coach name
  - Date and time
  - Location
  - Price
  - Booking ID
- **Description**: Event/coach information
- **Important Information**: Instructions and reminders
- **Contact Information**: How to reach AJH Sports

### Payment Failure

If payment fails:
- You'll be redirected back to the booking page
- An error message will be displayed
- You can retry the payment
- No booking is created until payment succeeds

### Test Payment (Development)

For testing purposes (James Wilson coach only):
- A **"🧪 Test Payment Flow"** button appears
- Click to simulate a successful payment
- Useful for testing the booking flow without actual payment

---

## Troubleshooting

### Common Issues

#### "You have already registered this event"
- **Cause**: You have a paid booking for this event
- **Solution**: You can only register once per event
- **Note**: If you cancelled Stripe checkout, you can retry booking

#### "Coach is not available at this time"
- **Cause**: The time slot is already booked or outside coach availability
- **Solution**: Select a different date or time slot

#### "Event is fully booked"
- **Cause**: All available spots are taken
- **Solution**: Check other events or wait for cancellations

#### Payment Page Not Loading
- **Check**: Internet connection
- **Try**: Refreshing the page
- **Contact**: Support if issue persists

#### Email Confirmation Not Received
- **Check**: Spam/junk folder
- **Verify**: Email address is correct in your account
- **Wait**: Emails may take a few minutes
- **Contact**: Support if email is not received after 10 minutes

#### Can't Log In
- **Verify**: Email and password are correct
- **Try**: Password reset (if available)
- **Check**: Account is active (contact admin if needed)

#### Calendar Not Showing Available Dates
- **Cause**: Coach has no availability set
- **Solution**: Contact admin to set coach availability

### Browser Compatibility

The platform works best with:
- **Chrome** (recommended)
- **Firefox**
- **Safari**
- **Edge**

**Minimum Requirements**:
- JavaScript enabled
- Cookies enabled
- Modern browser (last 2 versions)

---

## FAQs

### General

**Q: Do I need to create an account to view events/coaches?**  
A: No, you can browse without an account. An account is required only for booking.

**Q: Can I book multiple events?**  
A: Yes, you can book as many events as you want.

**Q: Can I book multiple coaching sessions?**  
A: Yes, you can book multiple sessions with the same or different coaches.

**Q: Can I cancel a booking?**  
A: Contact AJH Sports support to cancel. Refund policies apply.

**Q: How do I update my profile?**  
A: Click your profile icon → "Player Dashboard" → "Personal Info" tab.

### Events

**Q: When do events appear on the website?**  
A: Events appear immediately after admin creates them (if status is "Active").

**Q: What happens if an event is cancelled?**  
A: You'll be notified via email. Refunds are processed according to policy.

**Q: Can I see how many spots are left?**  
A: Yes, available spots are shown with color coding (green/orange/red).

### Coaches

**Q: How do I know when a coach is available?**  
A: Available dates are highlighted in green on the booking calendar.

**Q: Can I book multiple hours with a coach?**  
A: Yes, select consecutive time slots (e.g., 3-4 PM, 4-5 PM, 5-6 PM).

**Q: What if I need to reschedule?**  
A: Contact AJH Sports support. Rescheduling depends on coach availability.

**Q: How is the price calculated?**  
A: Price = Hourly Rate × Number of Hours. For example, $25/hour × 2 hours = $50.

### Payments

**Q: What payment methods are accepted?**  
A: Credit and debit cards via Stripe (Visa, Mastercard, American Express).

**Q: Is my payment information secure?**  
A: Yes, all payments are processed securely through Stripe. We don't store card details.

**Q: When will I be charged?**  
A: Payment is processed immediately when you complete checkout.

**Q: Will I receive a receipt?**  
A: Yes, you'll receive an email confirmation with booking details.

### Admin

**Q: How do I become an admin?**  
A: Contact the system administrator to request admin access.

**Q: Can I edit bookings after they're created?**  
A: Yes, you can update booking status in "Manage Bookings".

**Q: What's the difference between soft delete and hard delete?**  
A: Soft delete hides the item but preserves data. Hard delete permanently removes it.

---

## Support

For additional support:
- **Email**: ajh@ajhsports.com.au
- **Contact Form**: Use the Contact page on the website
- **Phone**: Check the Contact page for phone number

---

## Version Information

- **Platform Version**: 1.0
- **Last Updated**: January 2025
- **Documentation Version**: 1.0

---

**Thank you for using AJH Sports Platform!**
