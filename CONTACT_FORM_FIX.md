# Quick Fix for Contact Form Error

## The Problem
The contact form shows an error because:
1. Database credentials are missing (no `.env` file)
2. The `contact_messages` table doesn't exist yet

## Quick Fix Steps

### Step 1: Create Backend .env File

Create a file named `.env` in the `backend` folder with your database credentials:

```bash
cd backend
nano .env
```

Add these lines (replace with your actual MySQL password):

```env
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password_here
DB_NAME=ajh_sports

# JWT Secret (generate a random string)
JWT_SECRET=your_random_secret_key_here

# Stripe (optional - for payments)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL root password.

### Step 2: Create the Contact Messages Table

Run this SQL command in MySQL:

```bash
mysql -u root -p ajh_sports < backend/database/schema-contact.sql
```

Or connect to MySQL and run:

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

### Step 3: Restart the Backend Server

After creating the `.env` file:

```bash
cd backend
# Stop the current server (Ctrl+C if running in foreground)
npm start
```

### Step 4: Test the Contact Form

1. Go to the Contact Us page
2. Fill out the form
3. Click "Send message"
4. You should see a success message!

## Verification

Test if the backend can connect to the database:

```bash
curl -X POST http://localhost:5001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"test message"}'
```

If successful, you'll see:
```json
{"message":"Thank you for your message! We'll get back to you within 24 hours.","id":1}
```

## Common Issues

### "Access denied for user"
- Check your MySQL password in the `.env` file
- Make sure MySQL is running: `brew services list` (on Mac) or check Services (on Windows)

### "Table doesn't exist"
- Make sure you ran the SQL script to create the `contact_messages` table
- Verify the database name is `ajh_sports`

### "Cannot connect to database"
- Make sure MySQL is running
- Check your DB_HOST, DB_USER, DB_PASS, and DB_NAME in `.env`


