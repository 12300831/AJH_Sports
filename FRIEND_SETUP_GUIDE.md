# Setup Guide for Friends - Get to Working State

This guide will help you set up the AJH Sports project from scratch and get to a working state where you can log in to the admin dashboard.

## Prerequisites

- macOS (or Linux with MySQL)
- Node.js and npm installed
- MySQL installed via Homebrew
- Git installed

## Step 1: Clone/Pull the Repository

```bash
# If you don't have the repo yet:
git clone <repository-url>
cd AJH_Sports

# If you already have it, pull latest changes:
git pull origin main
```

## Step 2: Install Dependencies

### Backend Dependencies
```bash
cd backend
npm install
```

### Frontend Dependencies
```bash
cd ../frontend
npm install
```

## Step 3: Set Up Environment Variables

### Backend `.env` File

Navigate to the `backend` folder and create/update the `.env` file:

```bash
cd backend
nano .env
# or open in your code editor: code .env
```

Make sure your `.env` file contains:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=ajhsports2024
DB_PORT=3306
DB_NAME=ajh_sports

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Secret for authentication (will be auto-generated if missing)
JWT_SECRET=your_jwt_secret_here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**⚠️ IMPORTANT:** Make sure `DB_PASS=ajhsports2024` is set correctly (no spaces around `=`).

## Step 4: Start MySQL

Make sure MySQL is running:

```bash
# Check if MySQL is running
brew services list | grep mysql

# If not running, start it
brew services start mysql

# Wait a few seconds for MySQL to start
sleep 3
```

## Step 5: Set MySQL Root Password

Set your MySQL root password to match the `.env` file:

```bash
sudo mysql
```

When prompted, enter your **macOS password** (not MySQL password).

Once you're in MySQL (you'll see `mysql>` prompt), run:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'ajhsports2024';
FLUSH PRIVILEGES;
EXIT;
```

**Alternative Method (if sudo doesn't work):**

If you can't use `sudo mysql`, you can reset the password using safe mode:

```bash
# Stop MySQL
brew services stop mysql

# Start MySQL in safe mode
mysqld_safe --skip-grant-tables --skip-networking &

# Wait a moment
sleep 3

# Connect and change password
mysql -u root <<EOF
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'ajhsports2024';
FLUSH PRIVILEGES;
EOF

# Stop safe mode MySQL
pkill mysqld_safe
pkill mysqld

# Start MySQL normally
brew services start mysql
```

## Step 6: Create Database and Tables

```bash
cd backend

# Create the database
mysql -u root -pajhsports2024 -e "CREATE DATABASE IF NOT EXISTS ajh_sports;" 2>&1 | grep -v "Warning"

# Run the schema to create tables
mysql -u root -pajhsports2024 ajh_sports < database/schema.sql 2>&1 | grep -v "Warning"

# Add role column to users table (if not exists)
mysql -u root -pajhsports2024 ajh_sports -e "ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';" 2>&1 | grep -v "Warning" || echo "Column may already exist"
```

## Step 7: Create Admin User

```bash
cd backend
npm run db:create-admin
```

This will create the admin user:
- **Email:** `admin@gmail.com`
- **Password:** `admin`
- **Role:** `admin`

## Step 8: Start the Backend Server

```bash
cd backend
npm start
```

You should see:
```
✅ Backend running on port: 5001
🌍 Environment: development
```

**Keep this terminal open!** The backend needs to keep running.

## Step 9: Start the Frontend Server

Open a **new terminal window** and run:

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v... ready in ... ms
➜  Local:   http://localhost:5173/
```

## Step 10: Test Login

1. Open your browser and go to: `http://localhost:5173/signin`
2. Enter credentials:
   - **Email:** `admin@gmail.com`
   - **Password:** `admin`
3. Click "Sign in"

You should be redirected to the admin dashboard!

## Troubleshooting

### "Access denied for user 'root'@'localhost'"

**Problem:** MySQL password doesn't match `.env` file.

**Solution:**
1. Make sure `DB_PASS=ajhsports2024` in your `.env` file (no spaces!)
2. Set MySQL password: `sudo mysql` then run the ALTER USER command from Step 5

### "Cannot connect to MySQL server"

**Problem:** MySQL is not running.

**Solution:**
```bash
brew services start mysql
# Wait a few seconds
brew services list | grep mysql
# Should show "started"
```

### "Unknown database 'ajh_sports'"

**Problem:** Database doesn't exist.

**Solution:**
```bash
cd backend
mysql -u root -pajhsports2024 -e "CREATE DATABASE IF NOT EXISTS ajh_sports;"
mysql -u root -pajhsports2024 ajh_sports < database/schema.sql
```

### "Table 'users' doesn't exist"

**Problem:** Tables weren't created.

**Solution:**
```bash
cd backend
mysql -u root -pajhsports2024 ajh_sports < database/schema.sql
mysql -u root -pajhsports2024 ajh_sports -e "ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';"
npm run db:create-admin
```

### "Failed to fetch" or "Server error" on login

**Problem:** Backend server is not running.

**Solution:**
1. Check if backend is running: `lsof -ti:5001`
2. If not, start it: `cd backend && npm start`
3. Check backend terminal for error messages

### Port Already in Use

**Problem:** Port 5001 or 5173 is already in use.

**Solution:**
```bash
# Kill process on port 5001 (backend)
lsof -ti:5001 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9

# Then restart servers
```

## Quick Verification Checklist

Before trying to log in, verify:

- [ ] MySQL is running: `brew services list | grep mysql` shows "started"
- [ ] `.env` file has `DB_PASS=ajhsports2024`
- [ ] MySQL password is set to `ajhsports2024`
- [ ] Database `ajh_sports` exists
- [ ] Users table exists with `role` column
- [ ] Admin user exists: `admin@gmail.com`
- [ ] Backend server is running on port 5001
- [ ] Frontend server is running on port 5173

## Test Database Connection

To verify everything is set up correctly:

```bash
cd backend
node database/test-db-connection.js
```

You should see:
```
✅ Successfully connected to database!
✅ Users table exists
✅ Admin user found
```

## Summary

**Key Points:**
- MySQL password: `ajhsports2024` (must match `.env` file)
- Admin email: `admin@gmail.com`
- Admin password: `admin`
- Backend runs on: `http://localhost:5001`
- Frontend runs on: `http://localhost:5173`

**If you get stuck:**
1. Check the backend terminal for error messages
2. Verify MySQL is running
3. Verify `.env` file has correct password
4. Test database connection: `node database/test-db-connection.js`

Good luck! 🚀

