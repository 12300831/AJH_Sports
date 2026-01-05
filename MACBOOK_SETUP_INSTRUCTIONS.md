# MacBook Setup Instructions - Admin Login Fix

## Step 1: Pull the Latest Changes

Open your terminal and navigate to the project directory, then pull the latest changes:

```bash
cd AJH_Sports
git pull origin main
```

## Step 2: Install/Update Dependencies

Make sure all dependencies are installed:

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd ../frontend
npm install
```

## Step 3: Set Up Environment Variables

### Backend Environment (.env file in `backend/` folder)

Create or update `backend/.env` with the following:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=ajhsports2024
DB_NAME=ajh_sports

# JWT Secret (IMPORTANT - must be set!)
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random

# Server Configuration
PORT=5001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**⚠️ IMPORTANT:** Make sure `JWT_SECRET` is set! This is a common cause of login errors.

### Frontend Environment (if needed)

If you're using a different backend URL, create or update `frontend/.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

## Step 4: Start MySQL Database

Make sure MySQL is running on your Mac:

```bash
# Check if MySQL is running
brew services list | grep mysql

# If not running, start it
brew services start mysql

# Or if installed via MySQL installer
sudo /usr/local/mysql/support-files/mysql.server start
```

## Step 6: Set Up Database (if not already done)

```bash
cd backend
npm run db:setup
npm run db:setup-extended
```

## Step 7: Start the Backend Server

```bash
cd backend
npm start
```

You should see:
```
✅ Backend running on port: 5001
🌍 Environment: development
```

## Step 8: Start the Frontend

Open a new terminal window:

```bash
cd frontend
npm run dev
```

## Step 9: Test Admin Login

1. Open your browser and go to: `http://localhost:3000/signin` (or the port shown in the terminal)
2. Try logging in with admin credentials
3. Check the backend terminal for any error messages - the improved error handling will now show detailed error information

## Troubleshooting

### If you get "Server error" on login:

1. **Check backend terminal logs** - Look for detailed error messages that will now be displayed
2. **Verify JWT_SECRET is set** - Check your `backend/.env` file
3. **Check database connection** - Make sure MySQL is running and credentials are correct
   - **Verify MySQL password** - The password should be `ajhsports2024` (or match what's in your `.env` file)
   - Test connection: `mysql -u root -p` (use password: `ajhsports2024`)
4. **Check if backend is running** - Make sure the backend server started successfully on port 5001

### Common Issues:

- **JWT_SECRET not set**: You'll see "Server configuration error: JWT_SECRET is missing"
- **Database connection error**: Check MySQL is running and credentials in `.env` are correct
- **Port already in use**: Kill the process using port 5001 or change the PORT in `.env`

## What Was Fixed

The following improvements were made to help diagnose and fix login issues:

1. **Better error logging** - Server now logs detailed error information
2. **JWT_SECRET validation** - Server checks if JWT_SECRET is set before processing login
3. **Improved frontend error handling** - Better error messages displayed to users
4. **Development error details** - In development mode, detailed error info is included in responses

If you still encounter issues, check the backend terminal logs and share the error messages you see.

