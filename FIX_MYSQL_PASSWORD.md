# Fix MySQL Password Error

## The Problem

You're getting this error when trying to sign in:
```
Access denied for user 'root'@'localhost' (using password: NO)
```

This means your MySQL root user requires a password, but your `.env` file has `DB_PASS` empty or not set.

## Quick Solution

### Step 1: Open the .env file

```bash
cd backend
nano .env
```

Or open it in your preferred text editor (VS Code, etc.)

### Step 2: Find and update DB_PASS

Find the line that says:
```env
DB_PASS=
```

Change it to include your MySQL root password:
```env
DB_PASS=your_mysql_root_password_here
```

**Important:** Make sure there are no spaces around the `=` sign!

### Step 3: If you don't know your MySQL password

Try one of these methods:

#### Option A: Try to connect with password prompt
```bash
mysql -u root -p
```
Enter your password when prompted. If this works, use that password in your `.env` file.

#### Option B: Reset MySQL root password (macOS)

If you can't remember the password, reset it:

1. **Stop MySQL** (if running):
   ```bash
   brew services stop mysql
   ```

2. **Start MySQL in safe mode**:
   ```bash
   mysqld_safe --skip-grant-tables &
   ```

3. **Connect to MySQL**:
   ```bash
   mysql -u root
   ```

4. **Reset the password**:
   ```sql
   FLUSH PRIVILEGES;
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
   EXIT;
   ```

5. **Restart MySQL normally**:
   ```bash
   brew services restart mysql
   ```

6. **Update your .env file** with the new password.

#### Option C: Use sudo (simpler on macOS)

```bash
sudo mysql
```

Then in MySQL:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
FLUSH PRIVILEGES;
EXIT;
```

### Step 4: Verify your .env file

Your `.env` file should look like this:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=your_actual_mysql_password_here
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

### Step 5: Test the database connection

```bash
cd backend
npm run db:test
```

This should show a successful connection. If you still get errors, double-check:
- The password is correct
- MySQL is running: `brew services list | grep mysql`
- No extra spaces or quotes around the password in `.env`

### Step 6: Restart your backend server

After updating the password:
```bash
cd backend
npm restart
```

## Complete Example .env File

Here's a complete example of what your `.env` file should contain:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=MySecurePassword123
DB_PORT=3306
DB_NAME=ajh_sports

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## Troubleshooting

### "MySQL command not found"
Make sure MySQL is installed:
```bash
brew install mysql
brew services start mysql
```

### "Can't connect to MySQL server"
Make sure MySQL is running:
```bash
brew services list | grep mysql
# Should show: mysql started
```

If not running:
```bash
brew services start mysql
```

### Still getting "Access denied" error
1. Double-check the password in `.env` - no quotes, no spaces
2. Try connecting manually: `mysql -u root -p` (use the same password)
3. Check MySQL user exists: `SELECT User, Host FROM mysql.user WHERE User='root';`

## Need Help?

Run this diagnostic script:
```bash
cd backend
node database/check-env.js
```

This will show you what's configured and what's missing.


