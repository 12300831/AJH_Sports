# 🗄️ Create Database on Azure MySQL

## Problem

The error shows: `Unknown database 'ajh_sports'`

The database doesn't exist yet on your Azure MySQL server. You need to create it first.

---

## Solution: Create Database via Azure Portal

### Step 1: Connect to Azure MySQL

1. **Azure Portal** → Go to your MySQL server: `ajh-sports-mysql`
2. Click **"Query editor"** (or **"Azure Database for MySQL flexible servers"** → **Query editor**)
3. **Login** with:
   - Username: `ajhsportsadmin`
   - Password: `Team404ajhsports` (or your MySQL password)

### Step 2: Create Database

Run this SQL command in the query editor:

```sql
CREATE DATABASE ajh_sports CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 3: Verify

Run this to verify:

```sql
SHOW DATABASES;
```

You should see `ajh_sports` in the list.

---

## Alternative: Use MySQL Command Line

If you have MySQL client installed:

```bash
mysql -h ajh-sports-mysql.mysql.database.azure.com -u ajhsportsadmin -p
```

Then run:
```sql
CREATE DATABASE ajh_sports CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## After Creating Database

Once the database exists, run the setup endpoint again:

```powershell
Invoke-WebRequest -Uri "https://ajh-sports-backend.azurewebsites.net/api/setup" -Method POST
```

This will create all the tables and the admin user.

---

## Quick Reference

- **Database Name:** `ajh_sports`
- **Username:** `ajhsportsadmin`
- **Host:** `ajh-sports-mysql.mysql.database.azure.com`
- **Port:** `3306`
