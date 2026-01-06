# Quick Fix: Login Server Error

## The Problem
You're getting "Server error" when trying to log in because MySQL root user requires a password, but your `.env` file has `DB_PASS` empty.

## Quick Solution (5 minutes)

### Option 1: If you know your MySQL password (RECOMMENDED)

1. **Open your `.env` file**:
   ```bash
   cd backend
   nano .env
   # or open in VS Code: code .env
   ```

2. **Find the line**:
   ```env
   DB_PASS=
   ```

3. **Add your MySQL password**:
   ```env
   DB_PASS=your_mysql_password_here
   ```
   ⚠️ **Important:** No spaces around the `=` sign! No quotes!

4. **Save the file** (Ctrl+X, then Y, then Enter in nano)

5. **Restart the backend server**:
   ```bash
   npm restart
   ```

6. **Try logging in again!**

---

### Option 2: If you don't know your MySQL password

#### Step 1: Connect to MySQL without password (macOS)

Open a terminal and run:
```bash
sudo mysql
```

This will prompt for your macOS password (not MySQL password). Enter it.

#### Step 2: Set a new password

Once you're in MySQL (you'll see `mysql>` prompt), run:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'admin123';
FLUSH PRIVILEGES;
EXIT;
```

(Replace `admin123` with whatever password you want)

#### Step 3: Update your .env file

1. **Open `.env` file**:
   ```bash
   cd backend
   nano .env
   ```

2. **Update DB_PASS**:
   ```env
   DB_PASS=admin123
   ```
   (Use the same password you set in MySQL)

3. **Save the file**

#### Step 4: Restart backend

```bash
npm restart
```

#### Step 5: Test login

Try logging in with `admin@gmail.com` and password `admin`

---

## Verify It's Working

After updating the password and restarting, test the connection:

```bash
cd backend
node database/test-db-connection.js
```

You should see:
```
✅ Successfully connected to database!
```

If you still get errors, double-check:
- ✅ The password in `.env` matches the MySQL password (no spaces, no quotes)
- ✅ MySQL is running: `brew services list | grep mysql` (should show "started")
- ✅ Backend server is running: `lsof -ti:5001` (should return a number)

---

## Complete .env File Example

Your `.env` file should look like this:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=admin123
DB_PORT=3306
DB_NAME=ajh_sports

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Secret for authentication
JWT_SECRET=your_jwt_secret_here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Replace `admin123` with your actual MySQL password!**

