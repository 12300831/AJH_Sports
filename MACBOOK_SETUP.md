# MacBook Setup Guide

Complete setup instructions for MacBook users to get the AJH Sports project running.

## Prerequisites

- macOS (any recent version)
- Git installed
- Node.js (v18 or higher) - Install from [nodejs.org](https://nodejs.org/)
- MySQL installed - Install via Homebrew: `brew install mysql`
- A code editor (VS Code recommended)

---

## Step 1: Clone/Pull the Repository

```bash
# If you haven't cloned yet:
git clone <repository-url>
cd AJH_Sports

# If you already have it cloned:
cd AJH_Sports
git pull origin main
```

---

## Step 2: Install MySQL (if not already installed)

```bash
# Install MySQL via Homebrew
brew install mysql

# Start MySQL service
brew services start mysql
```

---

## Step 3: Set MySQL Root Password

**Important:** Set your MySQL root password to `ajhsports2024` (this matches the project configuration).

### Option A: Using MySQL Command Line (Recommended)

```bash
# Start MySQL (if not running)
brew services start mysql

# Connect to MySQL (initially may not require password)
mysql -u root

# Once connected, run these commands:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'ajhsports2024';
FLUSH PRIVILEGES;
EXIT;
```

### Option B: Using MySQL Secure Installation

```bash
mysql_secure_installation
```

When prompted:
- Enter current password: (press Enter if no password set)
- Set root password: **Yes**
- New password: `ajhsports2024`
- Confirm password: `ajhsports2024`
- Remove anonymous users: **Yes**
- Disallow root login remotely: **Yes**
- Remove test database: **Yes**
- Reload privilege tables: **Yes**

### Verify MySQL Password

```bash
# Test the connection with the new password
mysql -u root -p
# Enter password: ajhsports2024
```

If you can connect, you're good! Type `EXIT;` to leave MySQL.

---

## Step 4: Create Backend Environment File

```bash
cd backend

# Create .env file if it doesn't exist
touch .env

# Open .env in your editor and add these lines:
```

**Copy this into `backend/.env`:**

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=ajhsports2024
DB_NAME=ajhsports_db

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production

# Session Secret (for OAuth)
SESSION_SECRET=your_session_secret_here_change_this_in_production

# OAuth Configuration (Google)
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# OAuth Configuration (Facebook)
FACEBOOK_APP_ID=756002966781845
FACEBOOK_APP_SECRET=2f00f4b24b0016b5ac80769b94202eb7

# Backend URL (for OAuth callbacks)
BACKEND_URL=http://localhost:5001
```

**Important:** Make sure `DB_PASS=ajhsports2024` matches your MySQL root password!

---

## Step 5: Install Backend Dependencies

```bash
cd backend
npm install
```

---

## Step 6: Set Up Database

```bash
# Create the database and tables
npm run setup-db
```

You should see:
```
✅ Database 'ajhsports_db' created or already exists.
✅ Table 'users' created or already exists.
✅ Database setup complete!
```

### Verify Database Connection

```bash
# Test the database connection
npm run test-db
```

You should see:
```
✅ Successfully connected to MySQL server
✅ Database 'ajhsports_db' exists
✅ Users table exists
✅ All connection tests passed!
```

---

## Step 7: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Step 8: Start the Backend Server

```bash
cd ../backend
npm start
```

You should see:
```
✅ Database connected: ajhsports_db
✅ Backend running on port: 5001
```

**Keep this terminal window open!**

---

## Step 9: Start the Frontend Server

Open a **new terminal window** and run:

```bash
cd AJH_Sports/frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

---

## Step 10: Access the Application

Open your browser and go to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001/api

---

## Troubleshooting

### MySQL Won't Start

```bash
# Check MySQL status
brew services list

# Start MySQL
brew services start mysql

# If still not working, try:
sudo /usr/local/mysql/support-files/mysql.server start
```

### "Access Denied" Error

- Verify MySQL password: `mysql -u root -p` (enter `ajhsports2024`)
- Check `backend/.env` has `DB_PASS=ajhsports2024`
- Make sure password matches exactly (no extra spaces)

### "Database doesn't exist" Error

```bash
cd backend
npm run setup-db
```

### Port Already in Use

```bash
# Kill process on port 5001 (backend)
lsof -ti:5001 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Frontend Can't Connect to Backend

- Make sure backend is running on port 5001
- Check `backend/.env` has `FRONTEND_URL=http://localhost:3000`
- Check `frontend/.env` (if exists) has `VITE_API_URL=http://localhost:5001/api`

---

## Quick Reference Commands

```bash
# Start MySQL
brew services start mysql

# Stop MySQL
brew services stop mysql

# Restart MySQL
brew services restart mysql

# Test database connection
cd backend && npm run test-db

# Start backend
cd backend && npm start

# Start frontend
cd frontend && npm run dev

# Create/reset database
cd backend && npm run setup-db
```

---

## Next Steps

Once everything is running:
1. Visit http://localhost:3000
2. Try signing up for a new account
3. Test login functionality
4. Explore the application!

---

## Need Help?

If you encounter issues:
1. Check the `backend/DATABASE_SETUP.md` file
2. Check the `backend/MYSQL_FIX.md` file
3. Verify all environment variables in `backend/.env`
4. Make sure MySQL is running: `brew services list`
5. Check backend logs for error messages

---

**Password:** All team members use `ajhsports2024` as the MySQL root password for consistency.

