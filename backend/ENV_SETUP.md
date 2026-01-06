# Environment Setup Guide

## Quick Fix for Database Connection Error

The error `Access denied for user ''@'localhost' (using password: NO)` means your `.env` file is missing or incomplete.

## Step 1: Create .env File

Create a file named `.env` in the `backend` folder with the following content:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_PORT=3306
DB_NAME=ajh_sports

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Secret for authentication
JWT_SECRET=

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## Step 2: Update MySQL Password (if needed)

If your MySQL root user has a password, update `DB_PASS` in the `.env` file:

```env
DB_PASS=your_mysql_password_here
```

### Common MySQL Setup on macOS:

1. **If MySQL was installed via Homebrew:**
   ```bash
   # Start MySQL
   brew services start mysql
   
   # Check if root has a password (try logging in)
   mysql -u root
   # If it asks for a password, you have one - use it in DB_PASS
   ```

2. **If MySQL asks for a password and you don't know it:**
   ```bash
   # Reset MySQL root password
   mysql -u root -p
   # Or if no password works:
   sudo mysql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
   ```

## Step 3: Run Setup Scripts

After creating `.env`, run these commands:

```bash
cd backend

# Generate JWT_SECRET and setup admin user
npm run db:fix-admin-login

# Restart the server
npm restart
```

## Step 4: Verify

Try logging in with:
- Email: `admin@gmail.com`
- Password: `admin`

## Troubleshooting

### "Access denied for user 'root'@'localhost'"
- Check if `DB_PASS` in `.env` matches your MySQL root password
- Try connecting manually: `mysql -u root -p`

### "Cannot connect to MySQL server"
- Make sure MySQL is running:
  ```bash
  brew services list | grep mysql
  # Or
  mysql.server status
  ```
- Start MySQL if needed:
  ```bash
  brew services start mysql
  # Or
  mysql.server start
  ```

### "Database 'ajh_sports' does not exist"
- Run database setup:
  ```bash
  npm run db:setup
  ```

