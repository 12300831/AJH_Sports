# Backend Implementation Summary

Complete backend implementation for AJH Sports booking system.

## ✅ What Has Been Implemented

### 1. Database Schema
- ✅ `users` table (with `role` column for admin/user)
- ✅ `events` table (id, name, description, date, time, max_players, price, location, status)
- ✅ `event_bookings` table (id, event_id, user_id, status, payment_status, stripe_session_id)
- ✅ `coaches` table (id, name, specialty, email, phone, availability, hourly_rate, status)
- ✅ `coach_bookings` table (id, coach_id, user_id, date, time, duration, status, payment_status, stripe_session_id, google_calendar_event_id)

### 2. Authentication & Authorization
- ✅ JWT token-based authentication
- ✅ Authentication middleware (`authenticate`)
- ✅ Admin middleware (`isAdmin`)
- ✅ User profile management
- ✅ Admin user management (view all, delete users)

### 3. Event Management
- ✅ **Public Endpoints:**
  - `GET /api/events` - List all events (with filters)
  - `GET /api/events/:id` - Get event details
- ✅ **User Endpoints (Authenticated):**
  - `POST /api/events/book` - Book an event
  - `POST /api/events/cancel/:id` - Cancel booking
  - `GET /api/events/bookings/my` - Get user's bookings
- ✅ **Admin Endpoints:**
  - `POST /api/events` - Create event
  - `PUT /api/events/:id` - Update event
  - `DELETE /api/events/:id` - Delete event

### 4. Coach Management
- ✅ **Public Endpoints:**
  - `GET /api/coaches` - List all coaches
  - `GET /api/coaches/:id` - Get coach details
- ✅ **User Endpoints (Authenticated):**
  - `POST /api/coaches/book` - Book coach session
  - `POST /api/coaches/cancel/:id` - Cancel booking
  - `GET /api/coaches/bookings/my` - Get user's bookings
- ✅ **Admin Endpoints:**
  - `POST /api/coaches` - Create coach
  - `PUT /api/coaches/:id` - Update coach
  - `DELETE /api/coaches/:id` - Delete coach

### 5. Payment Integration (Stripe)
- ✅ Payment for event bookings
- ✅ Payment for coach bookings
- ✅ Stripe Checkout Session creation
- ✅ Webhook handler for payment confirmation
- ✅ Automatic booking confirmation after payment
- ✅ Free events (price = 0) confirmed immediately

### 6. Google Calendar Integration
- ✅ Automatic calendar event creation on booking confirmation
- ✅ Calendar event deletion on booking cancellation
- ✅ Calendar event updates
- ✅ Configurable via environment variables

### 7. File Structure
```
backend/
├── config/
│   ├── db.js (database connection)
│   ├── stripe.js (Stripe configuration)
│   └── passport.js
├── controllers/
│   ├── authcontroller.js (signup, login)
│   ├── userController.js (profile, admin user management)
│   ├── eventController.js (event CRUD, bookings)
│   ├── coachController.js (coach CRUD, bookings)
│   ├── paymentController.js (Stripe checkout)
│   └── bookingPaymentController.js (booking payments)
├── middleware/
│   ├── auth.js (authentication & admin middleware)
│   ├── errorHandler.js
│   ├── logger.js
│   └── notFound.js
├── models/
│   ├── Event.js (event database operations)
│   ├── Coach.js (coach database operations)
│   └── Booking.js (booking database operations)
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── eventRoutes.js
│   ├── coachRoutes.js
│   ├── paymentRoutes.js
│   └── bookingPaymentRoutes.js
├── services/
│   └── googleCalendar.js (Google Calendar API integration)
├── database/
│   ├── schema.sql (base schema)
│   ├── schema-extended.sql (events, coaches, bookings)
│   ├── setup.js (base setup)
│   └── setup-extended.js (extended setup)
└── server.js (main server file)
```

---

## 🚀 Setup Instructions

### Step 1: Set Up Database
```bash
cd backend
npm run db:setup          # Creates database and users table
npm run db:setup-extended # Creates events, coaches, bookings tables
```

### Step 2: Configure Environment Variables
Edit `backend/.env`:
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=ajh_sports

# JWT
JWT_SECRET=your_jwt_secret_here

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Google Calendar (optional)
GOOGLE_CALENDAR_API_KEY=your_api_key
GOOGLE_CALENDAR_ID=primary

# Server
PORT=5001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Step 3: Create Admin User
After signing up a user, update the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

### Step 4: Start Server
```bash
cd backend
npm start
```

---

## 📋 API Endpoints Summary

### Authentication
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` (auth) - Get profile
- `PUT /api/users/profile` (auth) - Update profile
- `GET /api/users/all` (admin) - Get all users
- `DELETE /api/users/:id` (admin) - Delete user

### Events
- `GET /api/events` - List events
- `GET /api/events/:id` - Get event
- `POST /api/events/book` (auth) - Book event
- `POST /api/events/cancel/:id` (auth) - Cancel booking
- `GET /api/events/bookings/my` (auth) - My bookings
- `POST /api/events` (admin) - Create event
- `PUT /api/events/:id` (admin) - Update event
- `DELETE /api/events/:id` (admin) - Delete event

### Coaches
- `GET /api/coaches` - List coaches
- `GET /api/coaches/:id` - Get coach
- `POST /api/coaches/book` (auth) - Book coach
- `POST /api/coaches/cancel/:id` (auth) - Cancel booking
- `GET /api/coaches/bookings/my` (auth) - My bookings
- `POST /api/coaches` (admin) - Create coach
- `PUT /api/coaches/:id` (admin) - Update coach
- `DELETE /api/coaches/:id` (admin) - Delete coach

### Payments
- `POST /api/booking-payments/event` (auth) - Pay for event booking
- `POST /api/booking-payments/coach` (auth) - Pay for coach booking
- `GET /api/payments/session/:sessionId` - Get payment status
- `POST /api/payments/webhook` - Stripe webhook

---

## 🔐 Authentication

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

Get token from: `POST /api/auth/login`

---

## 🧪 Testing

See `API_TESTING_GUIDE.md` for complete testing instructions.

Quick test:
1. Sign up: `POST /api/auth/signup`
2. Login: `POST /api/auth/login` (save token)
3. Get events: `GET /api/events`
4. Book event: `POST /api/events/book` (with token)
5. Pay: `POST /api/booking-payments/event` (with token)

---

## 📝 Notes

- **No frontend changes** - All backend only
- **Error handling** - All endpoints have proper error handling
- **HTTP status codes** - Proper status codes (200, 201, 400, 401, 403, 404, 500)
- **Database relationships** - Foreign keys with CASCADE delete
- **Google Calendar** - Optional, works without it (logs warning)
- **Stripe** - Required for payments (use test keys for development)

---

## 🐛 Troubleshooting

### Database Connection Error
- Check MySQL is running: `Get-Service MySQL80`
- Verify `.env` database credentials

### Authentication Errors
- Check JWT_SECRET is set in `.env`
- Verify token is in Authorization header: `Bearer <token>`

### Admin Access Denied
- Update user role in database: `UPDATE users SET role = 'admin' WHERE id = 1;`

### Payment Errors
- Check Stripe keys in `.env`
- Use test keys for development

---

## ✅ All Requirements Met

- ✅ User Management (signup, login, profile, admin)
- ✅ Event Booking (CRUD, book, cancel)
- ✅ Coach Booking (CRUD, book, cancel)
- ✅ Payment Integration (Stripe)
- ✅ Google Calendar Integration
- ✅ MySQL Database
- ✅ Models, Controllers, Routes structure
- ✅ Error handling
- ✅ Authentication middleware
- ✅ Admin middleware
- ✅ SQL table creation scripts
- ✅ Testing documentation

**Backend is complete and ready to use!**

