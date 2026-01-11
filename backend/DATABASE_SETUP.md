# Database Setup Guide

## Quick Fix for "Unknown database 'ajh_sports'" Error

### Issue
The backend is trying to connect to a database that doesn't exist or has a different name.

### Solution

1. **Update your `.env` file** in the `backend/` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=ajhsports2024
DB_NAME=ajhsports_db
```

**Important Notes:**
- Use `DB_PASS` (not `DB_PASSWORD`) - the code supports both but `DB_PASS` is preferred
- **Team Standard:** All team members use `ajhsports2024` as the MySQL root password
- Set your MySQL root password to match: `ajhsports2024`
- The database name defaults to `ajhsports_db` if not specified

2. **Create the database** (choose one method):

**Option A: Using the setup script (Recommended)**
```bash
cd backend
npm run setup-db
```

**Option B: Using MySQL command line**
```bash
mysql -u root -p
# Enter your MySQL password when prompted
CREATE DATABASE ajhsports_db;
USE ajhsports_db;
# The setup script will create the tables automatically
```

**Option C: Using phpMyAdmin**
1. Open phpMyAdmin (usually http://localhost/phpmyadmin)
2. Click "New" to create a database
3. Name it `ajhsports_db`
4. Click "Create"

3. **Verify the connection:**
```bash
npm start
```

You should see: `✅ Database connected: ajhsports_db`

### Troubleshooting

**Error: Access denied**
- Check that `DB_PASS` in `.env` matches your MySQL root password
- Verify MySQL is running: `brew services list` (macOS) or `sudo systemctl status mysql` (Linux)

**Error: Database still doesn't exist**
- Make sure you ran `npm run setup-db` or created it manually
- Check the database name in `.env` matches what you created

**Error: ECONNREFUSED**
- MySQL server is not running
- Start MySQL: `brew services start mysql` (macOS) or `sudo systemctl start mysql` (Linux)

### Database Schema

The setup script automatically creates:
- `users` table with columns: id, name, email, phone, location, password, provider, provider_id, created_at, updated_at
- OAuth support columns (provider, provider_id)
- Password field is nullable (for OAuth users)

