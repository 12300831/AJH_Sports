# Deployment Checklist

## Pre-Deployment Requirements

### Backend Environment Variables (.env)

Required variables for production:

```env
# Database Configuration
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=ajh_sports

# Server Configuration
PORT=5001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Stripe Configuration (if using payments)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OAuth (if using Google/Facebook login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

### Frontend Environment Variables

Create `.env.production` file:

```env
VITE_API_URL=https://your-backend-api-domain.com/api
```

Or set it in your hosting platform's environment variables.

### Database Setup

1. **Run database migrations** (if not already done):
   ```bash
   cd backend
   node database/migrate-user-management.js
   node database/migrate-profile-image-size.js
   ```

2. **Create admin user** (if needed):
   ```bash
   cd backend
   npm run db:create-admin
   ```

3. **Seed initial data** (if needed):
   ```bash
   cd backend/database
   node seed-events.js
   node add-coaches-from-frontend.js
   ```

## Deployment Steps

### Backend Deployment

1. **Install dependencies**:
   ```bash
   cd backend
   npm install --production
   ```

2. **Set environment variables** on your hosting platform

3. **Start the server**:
   ```bash
   npm start
   ```

   Or use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name ajh-sports-backend
   pm2 save
   pm2 startup
   ```

### Frontend Deployment

1. **Build the production bundle**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy the `dist` folder** to your static hosting service (Vercel, Netlify, etc.)

3. **Set environment variable** `VITE_API_URL` in your hosting platform

## Important Notes

### CORS Configuration

The backend CORS is configured to accept:
- All origins from `FRONTEND_URL` environment variable
- Default localhost origins (for development)

Make sure `FRONTEND_URL` in backend `.env` matches your frontend production URL.

### Security Checklist

- [ ] `NODE_ENV=production` is set
- [ ] Strong `JWT_SECRET` is set (not the default)
- [ ] Database credentials are secure
- [ ] Stripe keys are production keys (not test keys)
- [ ] `.env` file is NOT committed to git (check `.gitignore`)
- [ ] CORS is properly configured for production domain
- [ ] Error messages don't expose sensitive information (error handler hides stack traces in production)

### Database

- [ ] All migrations have been run
- [ ] Database connection is stable
- [ ] Database backup strategy is in place
- [ ] ProfileImage column is TEXT (not VARCHAR(500)) - run migration if needed

### Testing Checklist

- [ ] User registration/login works
- [ ] Profile picture upload works
- [ ] Password changes work
- [ ] Admin portal is accessible
- [ ] Event booking flow works
- [ ] Payment integration works (if enabled)
- [ ] OAuth login works (if enabled)

## Troubleshooting

### Profile Picture Upload Issues

If profile pictures aren't uploading:
1. Check database column type: Should be `TEXT`, not `VARCHAR(500)`
2. Run migration: `node backend/database/migrate-profile-image-size.js`
3. Check file size limits in your hosting platform

### CORS Errors

If you see CORS errors:
1. Verify `FRONTEND_URL` in backend `.env` matches your frontend domain
2. Include protocol (http:// or https://) in the URL
3. Restart the backend server after changing environment variables

### Database Connection Issues

1. Verify database credentials in `.env`
2. Check database is accessible from your hosting platform
3. Verify database exists: `DB_NAME=ajh_sports`
4. Test connection: `npm run test-connection` (if script exists)

## Post-Deployment

1. Monitor logs for errors
2. Test all critical user flows
3. Set up monitoring/alerting
4. Configure SSL/HTTPS certificates
5. Set up database backups
6. Configure CDN for static assets (optional but recommended)
