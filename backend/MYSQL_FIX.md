# MySQL Access Denied Error - Fix Guide

## Problem
The backend cannot authenticate with MySQL, showing "Access Denied" error.

## Root Cause
The `.env` file contains placeholder values (`your_password`) instead of your actual MySQL password.

## Solution

### Step 1: Find Your MySQL Password

**Option A: If you know your MySQL root password**
- Use that password

**Option B: If you forgot your MySQL password**
- macOS: Try empty password first: `mysql -u root`
- Or reset it: https://dev.mysql.com/doc/refman/8.0/en/resetting-permissions.html

**Option C: Check if MySQL uses a different user**
- Try: `mysql -u root -p` (will prompt for password)
- Or check: `mysql -u your_username -p`

### Step 2: Set MySQL Root Password

**Team Standard:** All team members should use `ajhsports2024` as the MySQL root password.

```bash
# Connect to MySQL
mysql -u root

# Set password (if not already set)
ALTER USER 'root'@'localhost' IDENTIFIED BY 'ajhsports2024';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Update `.env` File

Edit `backend/.env` and update these lines:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=ajhsports2024
DB_NAME=ajhsports_db
```

**Important:**
- Use `DB_PASS` (not `DB_PASSWORD`) - the code supports both but `DB_PASS` is preferred
- **Team Standard:** Use `ajhsports2024` as the password for consistency
- Make sure your MySQL root password matches: `ajhsports2024`

### Step 4: Test the Connection

```bash
cd backend
npm run test-db
```

This will:
- Show your current configuration
- Test MySQL connection
- List available databases
- Check if the target database exists

### Step 5: Create Database (if needed)

If the database doesn't exist:

```bash
npm run setup-db
```

### Step 6: Start the Backend

```bash
npm start
```

You should see: `✅ Database connected successfully!`

## Troubleshooting

### Still getting "Access Denied"?

1. **Verify MySQL is running:**
   ```bash
   brew services list | grep mysql  # macOS
   sudo systemctl status mysql      # Linux
   ```

2. **Test MySQL login manually:**
   ```bash
   mysql -u root -p
   # Enter your password when prompted
   ```

3. **Check MySQL user permissions:**
   ```sql
   SELECT user, host FROM mysql.user WHERE user='root';
   ```

4. **Try connecting without password (if MySQL allows it):**
   ```bash
   mysql -u root
   ```
   If this works, set `DB_PASS=` (empty) in `.env`

5. **Reset MySQL root password** (if needed):
   - macOS: https://dev.mysql.com/doc/refman/8.0/en/resetting-permissions.html
   - Or use MySQL Workbench / phpMyAdmin

### Common Issues

**Issue: "ECONNREFUSED"**
- MySQL server is not running
- Start it: `brew services start mysql` (macOS)

**Issue: "ER_BAD_DB_ERROR"**
- Database doesn't exist
- Run: `npm run setup-db`

**Issue: Password contains special characters**
- Wrap password in quotes in .env: `DB_PASS="my@pass#word"`
- Or escape special characters

## Quick Test Commands

```bash
# Test connection
npm run test-db

# Create database
npm run setup-db

# Start server
npm start
```

## Expected Result

After fixing, you should see:
```
✅ Database connected successfully!
   Host: localhost
   User: root
   Database: ajhsports_db
```

