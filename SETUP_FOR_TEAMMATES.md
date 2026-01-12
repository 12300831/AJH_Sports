# 🚀 Setup Guide for Teammates

This guide will help you set up the AJH Sports project on your local machine.

## Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download](https://git-scm.com/)

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd AJH_Sports
```

## Step 2: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd ../frontend
npm install
```

## Step 3: Set Up MySQL Database

### Windows
1. Install MySQL from [mysql.com](https://dev.mysql.com/downloads/mysql/)
2. During installation, set a root password (remember this!)
3. Start MySQL service:
   ```powershell
   # Check if MySQL is running
   Get-Service MySQL*
   
   # Start MySQL if not running
   Start-Service MySQL*
   ```

### macOS
```bash
# Install MySQL via Homebrew
brew install mysql

# Start MySQL service
brew services start mysql

# Set root password (if needed)
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_password';
```

### Linux
```bash
# Install MySQL
sudo apt-get update
sudo apt-get install mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Set root password
sudo mysql_secure_installation
```

## Step 4: Create Environment File

1. Copy the example environment file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` and fill in your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_mysql_root_password_here  # ← Change this!
   DB_PORT=3306
   DB_NAME=ajh_sports
   
   PORT=5001
   NODE_ENV=development
   
   # Generate a random JWT secret (or use: openssl rand -base64 32)
   JWT_SECRET=your_random_secret_here
   
   FRONTEND_URL=http://localhost:5173
   ```

## Using Railway (shared DB)

Want the whole team on one shared cloud database? Use Railway instead of local MySQL:

1) Create a Railway MySQL instance  
   - Sign up at https://railway.app → New Project → Provision MySQL.  
   - Open the MySQL service → Connect tab → copy host, port, user, password, and database name.

2) Configure backend to use Railway  
   ```bash
   cd backend
   cp .env.shared.example .env   # has Railway placeholders
   ```
   Then edit `.env` and replace the `DB_*` values with the Railway credentials you copied. Keep `PORT`, `JWT_SECRET`, and `FRONTEND_URL` as appropriate for local dev.

3) Initialize the shared database (run once)  
   ```bash
   cd backend
   npm run setup-db       # creates tables on Railway
   npm run db:create-admin
   npm run db:seed-events # optional sample events
   ```
   After this, everyone pointing to the same Railway DB will see the same data.

4) Connect and verify  
   ```bash
   # replace placeholders with your Railway values
   mysql -h <DB_HOST> -P <DB_PORT> -u <DB_USER> -p <DB_NAME>
   ```
   If it connects, the backend can, too. If not, double-check creds in `.env`.

5) Share with teammates  
   - Commit `backend/.env.shared.example` (already added) with placeholders only.  
   - Do NOT commit your real `.env`. Share actual Railway creds securely (1Password/Bitwarden/Slack DM).

## Step 5: Create Database and Tables

```bash
cd backend

# Create database and tables
npm run setup-db

# Create admin user
npm run db:create-admin
```

**Note:** If `npm run setup-db` doesn't exist, run:
```bash
node database/setup.js
node database/create-admin.js
```

## Step 6: Seed Events (Optional)

To populate the database with sample events:
```bash
cd backend
node database/seed-events.js
```

## Step 7: Start the Application

### Terminal 1 - Backend
```bash
cd backend
npm start
```

You should see:
```
✅ Database connected: ajh_sports
🚀 Server running on port 5001
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

## Step 8: Access the Application

1. **Frontend:** Open http://localhost:5173
2. **Admin Login:**
   - Email: `admin@gmail.com`
   - Password: `admin`

## Troubleshooting

### "Access denied for user 'root'@'localhost'"
- Check your `DB_PASS` in `.env` matches your MySQL root password
- Try connecting manually: `mysql -u root -p`

### "Unknown database 'ajh_sports'"
- Run: `npm run setup-db` or `node database/setup.js`
- Or create manually:
  ```sql
  CREATE DATABASE ajh_sports;
  ```

### "Cannot connect to MySQL server"
- **Windows:** Check MySQL service is running: `Get-Service MySQL*`
- **macOS:** `brew services list | grep mysql`
- **Linux:** `sudo systemctl status mysql`

### Port Already in Use
- Backend (5001): Change `PORT` in `.env`
- Frontend (5173): Change port in `vite.config.js`

### Module Not Found Errors
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

## Project Structure

```
AJH_Sports/
├── backend/          # Node.js/Express backend
│   ├── config/       # Database, passport configs
│   ├── controllers/  # Route controllers
│   ├── database/     # DB setup scripts
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   └── .env          # Environment variables (create this!)
├── frontend/         # React/Vite frontend
│   └── src/
│       ├── components/
│       ├── Pages/
│       └── services/
└── SETUP_FOR_TEAMMATES.md  # This file
```

## Important Notes

- **Never commit `.env` files** - they contain sensitive passwords
- **Always pull latest changes** before starting work: `git pull`
- **Database changes** should be done via migration scripts in `backend/database/`
- **Admin credentials** are created by `create-admin.js` script

## Getting Help

If you encounter issues:
1. Check the console logs (both frontend and backend)
2. Verify MySQL is running
3. Check `.env` file configuration
4. Try recreating the database: `npm run setup-db`

## Next Steps

Once setup is complete:
- Explore the admin portal: Admin → Events, Coaches, Users
- Check the public events page
- Review the codebase structure

Happy coding! 🎉
