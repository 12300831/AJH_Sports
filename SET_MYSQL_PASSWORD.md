# Set MySQL Password - Quick Instructions

## ✅ What's Done
- ✅ `.env` file updated with `DB_PASS=ajhsports2024`

## ⚠️ What You Need to Do

Set your MySQL root password to `ajhsports2024` to match the `.env` file.

### Quick Method (Recommended)

Open a terminal and run:

```bash
sudo mysql
```

When prompted, enter your **macOS password** (not MySQL password).

Once you're in MySQL (you'll see `mysql>` prompt), run:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'ajhsports2024';
FLUSH PRIVILEGES;
EXIT;
```

### Verify It Worked

After setting the password, test the connection:

```bash
cd backend
node database/test-db-connection.js
```

You should see:
```
✅ Successfully connected to database!
```

### Then Start Your Servers

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Try logging in** with `admin@gmail.com` and password `admin`

---

## Summary

- ✅ `.env` file: `DB_PASS=ajhsports2024` 
- ⚠️ MySQL password: Needs to be set to `ajhsports2024` (run `sudo mysql` and follow instructions above)

Once both match, login will work!

