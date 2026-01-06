# Contact Form Setup Guide

## Overview
The Contact Us page's "Quick message" section is now connected to the backend. Messages are stored in the database and can be managed by admins.

## Database Setup

### Step 1: Create the Contact Messages Table

Run the SQL script to create the `contact_messages` table:

```bash
cd backend/database
mysql -u your_username -p ajh_sports < schema-contact.sql
```

Or manually run the SQL in your MySQL client:

```sql
USE ajh_sports;

CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_email (email)
);
```

## API Endpoints

### Public Endpoints

#### Submit Contact Message
- **POST** `/api/contact`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Your message here"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Thank you for your message! We'll get back to you within 24 hours.",
    "id": 1
  }
  ```

### Admin Endpoints (Requires Authentication)

#### Get All Messages
- **GET** `/api/contact?status=new&limit=50&offset=0`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `status` (optional): Filter by status (new, read, replied, archived)
  - `limit` (optional): Number of results (default: 50)
  - `offset` (optional): Pagination offset (default: 0)

#### Get Single Message
- **GET** `/api/contact/:id`
- **Headers:** `Authorization: Bearer <token>`

#### Update Message Status
- **PUT** `/api/contact/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "status": "read",
    "admin_notes": "Responded via email on 2025-01-04"
  }
  ```

#### Delete Message
- **DELETE** `/api/contact/:id`
- **Headers:** `Authorization: Bearer <token>`

## Frontend Implementation

The contact form in `ContactWrapper.tsx` now:
- ✅ Sends messages to the backend API
- ✅ Shows loading state while submitting
- ✅ Displays success/error messages using toast notifications
- ✅ Validates form fields (name, email, message)
- ✅ Resets form after successful submission

## How It Works

1. **User submits form** → Frontend sends POST request to `/api/contact`
2. **Backend validates** → Checks required fields and email format
3. **Message stored** → Saved to `contact_messages` table with status 'new'
4. **Response sent** → Success message returned to user
5. **Admin can view** → Admins can view, update status, and add notes via API

## Message Status Flow

- **new** → Message just received (default)
- **read** → Admin has viewed the message
- **replied** → Admin has responded to the message
- **archived** → Message is archived (no longer active)

## Testing

### Test the Contact Form

1. Navigate to the Contact Us page
2. Fill out the form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Message: "This is a test message"
3. Click "Send message"
4. You should see a success toast notification
5. Check the database to verify the message was saved:

```sql
SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 1;
```

### Test via API (using curl)

```bash
curl -X POST http://localhost:5001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

## Next Steps (Optional Enhancements)

1. **Email Notifications**: Add email sending when a new message is received
2. **Admin Dashboard**: Create a UI in the admin panel to view/manage messages
3. **Auto-reply**: Send automatic confirmation email to users
4. **Spam Protection**: Add CAPTCHA or rate limiting
5. **Message Threading**: If replying via the system, track conversation threads

## Troubleshooting

### Messages not saving?
- Check database connection in `backend/config/db.js`
- Verify the `contact_messages` table exists
- Check backend logs for errors

### API returns 500 error?
- Check backend console for error messages
- Verify database table structure matches schema
- Ensure MySQL is running

### Frontend shows error?
- Check browser console for errors
- Verify API URL is correct (default: `http://localhost:5001/api`)
- Check CORS settings in backend if calling from different origin




