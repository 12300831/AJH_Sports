# ⚠️ IMPORTANT: Restart Backend Server

The backend server **MUST be restarted** for the admin login fix to work!

## Steps to Fix:

1. **Stop the backend server completely:**
   - Press `Ctrl+C` in the terminal where the backend is running
   - Or close that terminal window

2. **Verify it's stopped:**
   - Check that port 5001 is free
   - Or just wait a few seconds

3. **Restart the backend:**
   ```bash
   cd backend
   npm start
   ```

4. **Verify the fix:**
   ```bash
   node test-login.js
   ```
   
   You should see:
   ```
   🔑 Role value: admin
   ✅ SUCCESS: Role is correctly set to "admin"
   ```

5. **Then try logging in from the frontend:**
   - Go to http://localhost:3000/signin
   - Login with admin@gmail.com / admin
   - Should redirect to /admin

## Why This Is Needed:

The backend code has been updated to include the `role` field in the login response, but the running server is still using the old code. Node.js caches the code when it starts, so you must restart to load the new code.

