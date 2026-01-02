# API Testing Guide

Complete guide to test all backend endpoints for AJH Sports.

## Prerequisites

1. **MySQL is running** (check with `Get-Service MySQL80`)
2. **Database is set up**:
   ```bash
   cd backend
   npm run db:setup
   npm run db:setup-extended
   ```
3. **Backend server is running**:
   ```bash
   cd backend
   npm start
   ```
4. **Environment variables configured** in `backend/.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=ajh_sports
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=sk_test_...
   GOOGLE_CALENDAR_API_KEY=your_key (optional)
   GOOGLE_CALENDAR_ID=primary (optional)
   ```

## Testing Tools

You can use:
- **Postman** (recommended)
- **cURL** (command line)
- **Thunder Client** (VS Code extension)
- **Browser** (for GET requests)

Base URL: `http://localhost:5001/api`

---

## 1. Authentication Endpoints

### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0412345678",
  "location": "Sydney",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Signup successful"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0412345678",
    "location": "Sydney"
  }
}
```

**Save the token** - you'll need it for authenticated requests!

---

## 2. User Management Endpoints

### Get User Profile (Authenticated)
```http
GET /api/users/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

### Update User Profile (Authenticated)
```http
PUT /api/users/profile
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "0498765432",
  "location": "Melbourne"
}
```

### Get All Users (Admin Only)
```http
GET /api/users/all
Authorization: Bearer ADMIN_TOKEN_HERE
```

### Delete User (Admin Only)
```http
DELETE /api/users/:id
Authorization: Bearer ADMIN_TOKEN_HERE
```

**Note:** To create an admin user, manually update the database:
```sql
UPDATE users SET role = 'admin' WHERE id = 1;
```

---

## 3. Event Endpoints

### Get All Events
```http
GET /api/events
```

**Query Parameters:**
- `status=active` - Filter by status
- `date=2025-08-10` - Filter by date
- `dateFrom=2025-01-01` - Events from date

### Get Event by ID
```http
GET /api/events/1
```

### Book Event (Authenticated)
```http
POST /api/events/book
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "event_id": 1
}
```

### Cancel Event Booking (Authenticated)
```http
POST /api/events/cancel/1
Authorization: Bearer YOUR_TOKEN_HERE
```

### Get My Event Bookings (Authenticated)
```http
GET /api/events/bookings/my
Authorization: Bearer YOUR_TOKEN_HERE
```

### Create Event (Admin Only)
```http
POST /api/events
Authorization: Bearer ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "name": "Tennis Championship 2025",
  "description": "Annual tennis tournament",
  "date": "2025-08-15",
  "time": "09:00:00",
  "max_players": 32,
  "price": 50.00,
  "location": "AJH Sportscentre",
  "status": "active"
}
```

### Update Event (Admin Only)
```http
PUT /api/events/1
Authorization: Bearer ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "name": "Updated Event Name",
  "max_players": 40,
  "price": 60.00
}
```

### Delete Event (Admin Only)
```http
DELETE /api/events/1
Authorization: Bearer ADMIN_TOKEN_HERE
```

---

## 4. Coach Endpoints

### Get All Coaches
```http
GET /api/coaches
```

**Query Parameters:**
- `status=active` - Filter by status

### Get Coach by ID
```http
GET /api/coaches/1
```

### Book Coach Session (Authenticated)
```http
POST /api/coaches/book
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "coach_id": 1,
  "date": "2025-02-15",
  "time": "14:00:00",
  "duration": 60,
  "notes": "Focus on backhand technique"
}
```

### Cancel Coach Booking (Authenticated)
```http
POST /api/coaches/cancel/1
Authorization: Bearer YOUR_TOKEN_HERE
```

### Get My Coach Bookings (Authenticated)
```http
GET /api/coaches/bookings/my
Authorization: Bearer YOUR_TOKEN_HERE
```

### Create Coach (Admin Only)
```http
POST /api/coaches
Authorization: Bearer ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "name": "Michael",
  "specialty": "Tennis",
  "email": "michael@ajhsports.com",
  "phone": "+61 0412345678",
  "availability": "Monday-Friday, 9am-5pm",
  "hourly_rate": 60.00,
  "status": "active"
}
```

### Update Coach (Admin Only)
```http
PUT /api/coaches/1
Authorization: Bearer ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "hourly_rate": 65.00,
  "availability": "Monday-Friday, 9am-6pm"
}
```

### Delete Coach (Admin Only)
```http
DELETE /api/coaches/1
Authorization: Bearer ADMIN_TOKEN_HERE
```

---

## 5. Payment Endpoints

### Create Payment for Event Booking
```http
POST /api/booking-payments/event
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "booking_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

### Create Payment for Coach Booking
```http
POST /api/booking-payments/coach
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "booking_id": 1
}
```

### Get Payment Session Status
```http
GET /api/payments/session/:sessionId
```

---

## 6. Complete Test Flow

### Step 1: Create Admin User
1. Sign up a user
2. Update database: `UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';`
3. Login to get admin token

### Step 2: Create Events (Admin)
```bash
# Create event
POST /api/events
{
  "name": "Tennis Open 2025",
  "description": "Annual championship",
  "date": "2025-08-10",
  "time": "09:00:00",
  "max_players": 24,
  "price": 30.00,
  "location": "AJH Sportscentre"
}
```

### Step 3: Create Coaches (Admin)
```bash
# Create coach
POST /api/coaches
{
  "name": "Michael",
  "specialty": "Tennis",
  "email": "michael@ajhsports.com",
  "hourly_rate": 60.00
}
```

### Step 4: User Books Event
```bash
# 1. Login as regular user
POST /api/auth/login

# 2. Book event
POST /api/events/book
{
  "event_id": 1
}

# 3. Create payment
POST /api/booking-payments/event
{
  "booking_id": 1
}

# 4. Complete payment on Stripe checkout page
# 5. Webhook will automatically confirm booking and create Google Calendar event
```

### Step 5: User Books Coach
```bash
# 1. Book coach session
POST /api/coaches/book
{
  "coach_id": 1,
  "date": "2025-02-15",
  "time": "14:00:00",
  "duration": 60
}

# 2. Create payment
POST /api/booking-payments/coach
{
  "booking_id": 1
}
```

---

## 7. Error Responses

All endpoints return consistent error format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 8. Authentication Header Format

For all authenticated endpoints, include:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## 9. Testing with cURL

### Example: Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Example: Get Events (with auth)
```bash
curl -X GET http://localhost:5001/api/events \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Example: Book Event
```bash
curl -X POST http://localhost:5001/api/events/book \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"event_id":1}'
```

---

## 10. Database Verification

Check your database to verify data:

```sql
-- View all events
SELECT * FROM events;

-- View all bookings
SELECT * FROM event_bookings;
SELECT * FROM coach_bookings;

-- View all coaches
SELECT * FROM coaches;

-- View users with roles
SELECT id, name, email, role FROM users;
```

---

## Notes

- **Google Calendar Integration**: Automatically creates calendar events when bookings are confirmed (after payment)
- **Stripe Webhook**: Handles payment confirmations automatically
- **Free Events**: Events with price = 0 are confirmed immediately without payment
- **Admin Role**: Set user role to 'admin' in database to access admin endpoints

