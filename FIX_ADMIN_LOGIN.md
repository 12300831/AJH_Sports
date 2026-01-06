# Fix Admin Login Server Error

## The Problem
When trying to log in with `admin@gmail.com`, you're getting a "Server error". This is because `JWT_SECRET` is missing from your `.env` file.

## Solution

### Step 1: Add JWT_SECRET to .env

1. Open the `.env` file in the `backend` folder:
   ```bash
   cd backend
   nano .env
   # or open in your text editor
   ```

2. Add this line (generate a random secret):
   ```env
   JWT_SECRET=your_random_secret_key_here_at_least_32_characters_long
   ```

3. Or use this command to generate a secure random secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Copy the output and add it to `.env`:
   ```env
   JWT_SECRET=<paste_the_generated_secret_here>
   ```

### Step 2: Make Sure Admin User Exists

Run the admin creation script:
```bash
cd backend
npm run db:create-admin
```

Or manually:
```bash
node database/create-admin.js
```

This will create/update the admin user:
- **Email**: admin@gmail.com
- **Password**: admin
- **Role**: admin

### Step 3: Restart Backend Server

After adding JWT_SECRET, restart your backend:
```bash
cd backend
# Stop with Ctrl+C if running
npm start
```

### Step 4: Test Login

Try logging in again with:
- **Email**: admin@gmail.com
- **Password**: admin

## Complete .env Example

Your `.env` file should have at minimum:

```env
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=ajh_sports

# JWT Secret (REQUIRED for login to work)
JWT_SECRET=your_random_secret_key_here_at_least_32_characters_long

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Verify It's Working

Test the login endpoint:
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"admin"}'
```

You should get a response with a token:
```json
{
  "message": "Login success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@gmail.com",
    "role": "admin"
  }
}
```

