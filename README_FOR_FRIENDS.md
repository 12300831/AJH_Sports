# Welcome! Setup Instructions for AJH Sports Project

Hey! 👋 To get the project running on your machine, follow these steps:

## 📋 Quick Setup (5-10 minutes)

### Step 1: Pull Latest Code
```bash
git pull origin main
```

### Step 2: Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### Step 3: Configure Environment

Create/update `backend/.env` file with:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=ajhsports2024
DB_NAME=ajh_sports
PORT=5001
NODE_ENV=development
JWT_SECRET=your_random_secret_here
FRONTEND_URL=http://localhost:5173
```

### Step 4: Set MySQL Password

```bash
sudo mysql
```

Then in MySQL:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'ajhsports2024';
FLUSH PRIVILEGES;
EXIT;
```

### Step 5: Setup Database

```bash
cd backend
brew services start mysql
mysql -u root -pajhsports2024 -e "CREATE DATABASE IF NOT EXISTS ajh_sports;"
mysql -u root -pajhsports2024 ajh_sports < database/schema.sql
mysql -u root -pajhsports2024 ajh_sports -e "ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';" 2>&1 | grep -v "Warning" || true
npm run db:create-admin
```

### Step 6: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 7: Login

1. Go to: `http://localhost:5173/signin`
2. Email: `admin@gmail.com`
3. Password: `admin`

## 🎉 You're Done!

For detailed instructions and troubleshooting, see:
- **Quick Reference:** `QUICK_START_FOR_FRIENDS.md`
- **Full Guide:** `FRIEND_SETUP_GUIDE.md`

## ⚠️ Important Notes

- MySQL password must be: `ajhsports2024` (matches `.env` file)
- Admin credentials: `admin@gmail.com` / `admin`
- Backend runs on port 5001
- Frontend runs on port 5173

## 🆘 Need Help?

If something doesn't work:
1. Check the backend terminal for error messages
2. Verify MySQL is running: `brew services list | grep mysql`
3. Test database: `cd backend && node database/test-db-connection.js`
4. See troubleshooting section in `FRIEND_SETUP_GUIDE.md`

Good luck! 🚀

