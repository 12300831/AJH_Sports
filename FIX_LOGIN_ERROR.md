# Fix Login Server Error - Complete Guide

## The Problem
Login with `admin@gmail.com` returns "Server error" because:
1. ✅ JWT_SECRET was added (but server needs restart)
2. ❌ DB_PASS is missing from .env file
3. ❌ Admin user might not exist

## Complete Fix Steps

### Step 1: Add Database Password to .env

1. Open the `.env` file in the `backend` folder:
   ```bash
   cd backend
   nano .env
   # or open in your text editor
   ```

2. Add this line (replace with your actual MySQL password):
   ```env
   DB_PASS=your_mysql_password_here
   ```

   Your `.env` should have:
   ```env
   PORT=5001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_mysql_password_here
   DB_NAME=ajh_sports
   
   JWT_SECRET=e85fef2e4e55aa45faf9c790854e0002043ef3f74168b7144bf1dbbfa646b755
   ```

### Step 2: Restart Backend Server

**IMPORTANT**: The backend server MUST be restarted to load the new environment variables.

1. Find the terminal/console where your backend server is running
2. Stop it: Press `Ctrl+C`
3. Start it again:
   ```bash
   cd backend
   npm start
   ```

### Step 3: Create Admin User

After adding DB_PASS and restarting:

```bash
cd backend
npm run db:create-admin
```

This creates:
- **Email**: admin@gmail.com
- **Password**: admin
- **Role**: admin

### Step 4: Test Login

Try logging in with:
- **Email**: admin@gmail.com
- **Password**: admin

## Verify Everything is Set Up

Check your `.env` file has all required variables:
```bash
cd backend
cat .env | grep -E "DB_|JWT_SECRET"
```

Should show:
- DB_HOST=localhost
- DB_USER=root
- DB_PASS=your_password
- DB_NAME=ajh_sports
- JWT_SECRET=e85fef2e4e55aa45faf9c790854e0002043ef3f74168b7144bf1dbbfa646b755

## Common Issues

### "Access denied" error
- Make sure DB_PASS is correct in .env
- Make sure MySQL is running
- Try connecting manually: `mysql -u root -p`

### "Server error" still appears
- Make sure you restarted the backend server after adding JWT_SECRET and DB_PASS
- Check the backend console/terminal for the actual error message
- The improved error logging will show the real error

### "Email not found"
- Run `npm run db:create-admin` to create the admin user
- Make sure DB_PASS is set correctly so the script can connect

## Quick Test Commands

Test if backend is running:
```bash
curl http://localhost:5001/api/health
```

Test login (after setup):
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"admin"}'
```

You should get a response with a token if everything works!

