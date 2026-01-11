# Setup Instructions for Team Members

## Quick Setup Guide

### Step 1: Pull Latest Changes
```bash
git pull
```

### Step 2: Update `.env` File
The `.env` file should already have the correct password, but verify it contains:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=ajhsports2024
DB_NAME=ajhsports_db
```

### Step 3: Set MySQL Root Password to `ajhsports2024`

**If MySQL already has a password:**
```bash
mysql -u root -p
# Enter your current MySQL password when prompted
ALTER USER 'root'@'localhost' IDENTIFIED BY 'ajhsports2024';
FLUSH PRIVILEGES;
exit;
```

**If MySQL has no password:**
```bash
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'ajhsports2024';
FLUSH PRIVILEGES;
exit;
```

**On macOS (if mysql command not found):**
```bash
# Add MySQL to PATH (add to ~/.zshrc or ~/.bash_profile)
export PATH="/usr/local/mysql/bin:$PATH"

# Or use full path:
/usr/local/mysql/bin/mysql -u root -p
```

### Step 4: Create Database
```bash
mysql -u root -pajhsports2024 -e "CREATE DATABASE IF NOT EXISTS ajhsports_db;"
```

### Step 5: Install Dependencies
```bash
cd backend
npm install
```

### Step 6: Setup Database Tables
```bash
npm run db:setup
```

### Step 7: Start Backend Server
```bash
npm start
```

You should see:
```
✅ Database connected: ajhsports_db
✅ Backend running on port: 5001
```

## Troubleshooting

### MySQL Command Not Found
- **macOS:** Install MySQL via Homebrew: `brew install mysql`
- **Windows:** Add MySQL bin directory to PATH
- **Linux:** Install MySQL: `sudo apt-get install mysql-server` (Ubuntu/Debian)

### Access Denied Error
- Verify MySQL root password is set to `ajhsports2024`
- Check `.env` file has `DB_PASS=ajhsports2024`
- Restart MySQL service if needed

### Database Doesn't Exist
- Run: `mysql -u root -pajhsports2024 -e "CREATE DATABASE IF NOT EXISTS ajhsports_db;"`
- Or run: `npm run db:setup`

### Port Already in Use
- Kill process on port 5001: `npm run kill-port`
- Or change PORT in `.env` file

## Standard Configuration

**Team Standard Password:** `ajhsports2024`
- All team members use this MySQL root password
- All documentation references this password
- `.env` files are configured with this password

**Database Name:** `ajhsports_db`
- Consistent across all environments
- Created automatically by setup script

## Verification

Test MySQL connection:
```bash
mysql -u root -pajhsports2024 -e "SELECT 1;"
```

Test backend connection:
```bash
cd backend
npm start
# Should see: ✅ Database connected: ajhsports_db
```

