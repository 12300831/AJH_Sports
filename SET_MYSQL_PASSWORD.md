# How to Set MySQL Root Password

Your `.env` file has `DB_PASS=ajhsports2024`, but your MySQL root password doesn't match. Here's how to fix it:

## Quick Fix - Set MySQL Password

### Option 1: Using MySQL Command Line (Easiest)

1. **Open Command Prompt or PowerShell**

2. **Connect to MySQL** (you'll be prompted for your current password):
   ```bash
   "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
   ```
   
   - If you have a password, enter it when prompted
   - If you don't have a password, just press Enter

3. **Once connected, run these SQL commands:**
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'ajhsports2024';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **Restart your backend server** - The connection should now work!

### Option 2: Using the Node.js Script

If you can connect to MySQL (with or without password), you can use the script:

```bash
cd backend/database
node set-mysql-password.js
```

### Option 3: If You Don't Know Your Current Password

If you've forgotten your MySQL root password, you'll need to reset it:

1. **Stop MySQL service:**
   ```powershell
   net stop MySQL80
   ```

2. **Start MySQL in safe mode** (skip grant tables):
   ```powershell
   "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" --skip-grant-tables --console
   ```

3. **In a new terminal, connect without password:**
   ```bash
   "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root
   ```

4. **Set the password:**
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'ajhsports2024';
   FLUSH PRIVILEGES;
   EXIT;
   ```

5. **Stop the safe mode MySQL** (Ctrl+C) and **restart the service:**
   ```powershell
   net start MySQL80
   ```

## Verify It Works

After setting the password, restart your backend server and try logging in again. The error should be gone!
