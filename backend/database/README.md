# MySQL Database Setup Guide

This guide will help you set up MySQL for production use on Windows.

## Quick Start

### Step 1: Install MySQL as Windows Service (One-time setup)

**Run as Administrator:**

1. Open PowerShell as Administrator (Right-click → Run as Administrator)
2. Navigate to the database folder:
   ```powershell
   cd C:\Users\xRytz\AJH_Sports\backend\database
   ```
3. Run the setup script:
   ```powershell
   .\setup-mysql-service.ps1
   ```

This will:
- Install MySQL as a Windows service
- Configure it to start automatically on boot
- Start the service immediately

### Step 2: Start MySQL (if not running)

**Option A: Using npm script (recommended)**
```bash
cd backend
npm run db:start
```

**Option B: Using PowerShell script**
```powershell
cd backend\database
.\start-mysql.ps1
```

**Option C: Using Windows Services**
1. Press `Win + R`, type `services.msc`, press Enter
2. Find "MySQL80"
3. Right-click → Start

**Option D: Using Command Prompt (as Administrator)**
```cmd
net start MySQL80
```

### Step 3: Create Database and Tables

Once MySQL is running:
```bash
cd backend
npm run db:setup
```

This will create the `ajh_sports` database and `users` table.

## Configuration

### Environment Variables

Make sure your `backend/.env` file has the correct MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=ajhsports2024
DB_NAME=ajh_sports
```

**Note:** The default password for this project is `ajhsports2024`. If your MySQL root password is different, you'll need to either:
- Set your MySQL root password to match: `ajhsports2024`
- Or update `DB_PASS` in your `.env` file to match your MySQL root password

### Default MySQL Settings

- **Host:** localhost
- **Port:** 3306
- **Default User:** root
- **Default Password:** (set during MySQL installation)

## Troubleshooting

### MySQL Service Not Found

If the service doesn't exist, run the setup script as Administrator:
```powershell
.\setup-mysql-service.ps1
```

### Cannot Connect to MySQL

1. Check if MySQL is running:
   ```powershell
   Get-Service MySQL80
   ```

2. Test connection:
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 3306
   ```

3. Check MySQL error logs:
   - Location: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err`

### Access Denied Error

- Verify your password in `backend/.env`
- Reset MySQL root password if needed:
  ```sql
  ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
  ```

### Port Already in Use

If port 3306 is in use:
1. Check what's using it:
   ```powershell
   netstat -ano | findstr :3306
   ```
2. Stop the conflicting service or change MySQL port in `my.ini`

## Production Best Practices

✅ **Recommended Setup:**
- MySQL installed as Windows service
- Auto-start enabled
- Strong root password set
- Firewall configured (port 3306)
- Regular backups configured

✅ **Security:**
- Use strong passwords
- Create dedicated database user (not root) for the application
- Restrict database access to localhost only
- Enable SSL for remote connections (if needed)

## Useful Commands

**Check MySQL Status:**
```powershell
Get-Service MySQL80
```

**Stop MySQL:**
```powershell
net stop MySQL80
```

**Restart MySQL:**
```powershell
net stop MySQL80
net start MySQL80
```

**Connect via Command Line:**
```bash
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
.\mysql.exe -u root -p
```

## Next Steps

After MySQL is running and the database is set up:
1. ✅ Verify connection: `npm run db:setup`
2. ✅ Start backend server: `npm start`
3. ✅ Test API endpoints

