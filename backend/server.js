import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./config/passport.js";

// Load environment variables from .env file
dotenv.config();

// Validate required Stripe configuration at startup
const validateStripeConfig = () => {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  const isKeyMissing = !stripeKey || stripeKey.trim() === '' || stripeKey.includes('placeholder');
  const isWebhookMissing = !webhookSecret || webhookSecret.trim() === '' || webhookSecret.includes('placeholder');
  
  if (isKeyMissing) {
    console.warn('⚠️  STRIPE_SECRET_KEY is not configured. Payments will use mock mode in development or fail in production.');
  } else {
    console.log('✅ STRIPE_SECRET_KEY is configured');
  }
  
  if (isWebhookMissing) {
    console.warn('⚠️  STRIPE_WEBHOOK_SECRET is not configured.');
    console.warn('   ❌ Webhooks will be REJECTED until this is configured.');
    console.warn('   📋 To fix: Run "stripe listen --forward-to localhost:5001/api/payments/webhook"');
    console.warn('   📋 Then copy the webhook secret (whsec_...) to your .env file.');
  } else {
    console.log('✅ STRIPE_WEBHOOK_SECRET is configured');
  }
  
  return { stripeConfigured: !isKeyMissing, webhookConfigured: !isWebhookMissing };
};

// Export config status for use in controllers
export const stripeConfig = validateStripeConfig();

import authRoutes from "./routes/authRoutes.js";
import oauthRoutes from "./routes/oauthRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import coachRoutes from "./routes/coachRoutes.js";
import bookingPaymentRoutes from "./routes/bookingPaymentRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

// Middleware imports
import { logger } from "./middleware/logger.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// CORS configuration
const defaultOrigins = [
  'http://localhost:3000',  // Frontend default port
  'http://127.0.0.1:3000',
  'http://localhost:5173',  // Vite default port
  'http://127.0.0.1:5173',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://localhost:3002',  // Vite fallback port
  'http://127.0.0.1:3002',
];
const envOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const isAllowed =
      allowedOrigins.includes(origin) ||
      /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin) ||
      /^http:\/\/localhost(:\d+)?$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin);
    
    if (isAllowed) {
      callback(null, true);
    } else {
      // In development, allow all localhost origins
      if (process.env.NODE_ENV === 'development' && /^http:\/\/localhost(:\d+)?$/.test(origin)) {
        console.warn(`⚠️  CORS: Allowing localhost origin in development: ${origin}`);
        callback(null, true);
      } else {
        // Log the blocked origin for debugging
        console.warn(`❌ CORS blocked origin: ${origin}`);
        callback(null, false);
      }
    }
  },
  credentials: true
}));

// Request Logger Middleware
app.use(logger);

// Session middleware for Passport.js OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'default_secret_change_in_production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Body parser middleware (JSON)
// Note: Webhook endpoint uses raw body, so we apply JSON parser to all routes except webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    next(); // Skip JSON parsing for webhook endpoint
  } else {
    express.json()(req, res, next);
  }
});

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/auth", oauthRoutes); // OAuth routes (not under /api)
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/coaches", coachRoutes);
app.use("/api/booking-payments", bookingPaymentRoutes);
app.use("/api/contact", contactRoutes);

// Root API endpoint - shows available routes
app.get('/api', (req, res) => {
  res.json({
    message: 'AJH Sports API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login'
      },
      users: {
        profile: 'GET /api/users/profile (auth)',
        updateProfile: 'PUT /api/users/profile (auth)',
        allUsers: 'GET /api/users/all (admin)',
        deleteUser: 'DELETE /api/users/:id (admin)'
      },
      events: {
        list: 'GET /api/events',
        getById: 'GET /api/events/:id',
        book: 'POST /api/events/book (auth)',
        cancel: 'POST /api/events/cancel/:id (auth)',
        myBookings: 'GET /api/events/bookings/my (auth)',
        create: 'POST /api/events (admin)',
        update: 'PUT /api/events/:id (admin)',
        delete: 'DELETE /api/events/:id (admin)'
      },
      coaches: {
        list: 'GET /api/coaches',
        getById: 'GET /api/coaches/:id',
        book: 'POST /api/coaches/book (auth)',
        cancel: 'POST /api/coaches/cancel/:id (auth)',
        myBookings: 'GET /api/coaches/bookings/my (auth)',
        create: 'POST /api/coaches (admin)',
        update: 'PUT /api/coaches/:id (admin)',
        delete: 'DELETE /api/coaches/:id (admin)'
      },
      payments: {
        createCheckoutSession: 'POST /api/payments/create-checkout-session',
        getSession: 'GET /api/payments/session/:sessionId',
        webhook: 'POST /api/payments/webhook',
        eventBooking: 'POST /api/booking-payments/event (auth)',
        coachBooking: 'POST /api/booking-payments/coach (auth)'
      },
      contact: {
        submitMessage: 'POST /api/contact',
        getMessages: 'GET /api/contact (admin)',
        getMessage: 'GET /api/contact/:id (admin)',
        updateMessage: 'PUT /api/contact/:id (admin)',
        deleteMessage: 'DELETE /api/contact/:id (admin)'
      }
    },
    timestamp: new Date().toISOString()
  });
});


// 404 Handler - catches requests to routes that don't exist
app.use(notFound);

// Error Handler - catches all errors and sends formatted response
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
    console.log(`✅ Backend running on port: ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log(`📋 CORS allowed origins: ${allowedOrigins.join(', ')}`);
});

// Handle port already in use error gracefully
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.log(`💡 Try one of these solutions:`);
    console.log(`   1. Kill the process using port ${PORT}: lsof -ti:${PORT} | xargs kill -9`);
    console.log(`   2. Use a different port: PORT=5001 npm start`);
    console.log(`   3. Update PORT in your .env file`);
    process.exit(1);
  } else {
    throw err;
  }
});
