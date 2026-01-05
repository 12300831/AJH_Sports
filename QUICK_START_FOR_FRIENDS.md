# Quick Start Guide - Get Running in 5 Minutes

## TL;DR - Quick Setup

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Create backend/.env file with:
DB_HOST=localhost
DB_USER=root
DB_PASS=ajhsports2024
DB_NAME=ajh_sports
PORT=5001
NODE_ENV=development
JWT_SECRET=your_random_secret_here
FRONTEND_URL=http://localhost:5173

# 4. Set MySQL password
sudo mysql
# Then in MySQL:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'ajhsports2024';
FLUSH PRIVILEGES;
EXIT;

# 5. Start MySQL
brew services start mysql

# 6. Setup database
cd backend
mysql -u root -pajhsports2024 -e "CREATE DATABASE IF NOT EXISTS ajh_sports;"
mysql -u root -pajhsports2024 ajh_sports < database/schema.sql
mysql -u root -pajhsports2024 ajh_sports -e "ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';" 2>&1 | grep -v "Warning" || true
npm run db:create-admin

# 7. Start backend (keep terminal open)
npm start

# 8. Start frontend (new terminal)
cd ../frontend
npm run dev

# 9. Login at http://localhost:5173/signin
# Email: admin@gmail.com
# Password: admin
```

## Important Notes

- **MySQL Password:** Must be `ajhsports2024` (matches `.env` file)
- **Admin Credentials:** `admin@gmail.com` / `admin`
- **Backend Port:** 5001
- **Frontend Port:** 5173

For detailed troubleshooting, see `FRIEND_SETUP_GUIDE.md`

