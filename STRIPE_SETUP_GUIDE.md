# Stripe Payment Integration Guide

This guide will help you set up Stripe payments for your application.

## 📁 Project Structure

```
backend/
├── config/
│   └── stripe.js              # Stripe SDK initialization
├── controllers/
│   └── paymentController.js   # Payment logic
├── routes/
│   └── paymentRoutes.js       # Payment API routes
├── server.js                   # Express server
├── .env                        # Environment variables (create this)
└── .env.example                # Example environment file

frontend/
└── src/
    ├── services/
    │   └── paymentService.ts   # Frontend API service
    └── Pages/
        └── Payment/
            └── Payment.tsx     # Payment page component
```

## 🔐 Security Best Practices

### 1. **Never Commit Secret Keys**
- ✅ Add `.env` to `.gitignore`
- ✅ Use `.env.example` for documentation
- ✅ Never share secret keys in code, emails, or chat

### 2. **Environment Variables**
- Store all sensitive data in `.env` file
- Use different keys for development and production
- Rotate keys if they're ever exposed

### 3. **Stripe Keys**
- **Secret Key** (`sk_test_...` or `sk_live_...`): Only use on backend
- **Publishable Key** (`pk_test_...` or `pk_live_...`): Safe to use in frontend
- **Webhook Secret** (`whsec_...`): Only for webhook signature verification

### 4. **API Security**
- Always validate input on the backend
- Use HTTPS in production
- Implement rate limiting
- Verify webhook signatures

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

This will install Stripe and other dependencies.

### Step 2: Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up or log in
3. Navigate to **Developers** → **API keys**
4. Copy your **Test** keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Step 3: Create `.env` File

In the `backend` directory, create a `.env` file:

```bash
cp .env.example .env
```

Then edit `.env` with your actual values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here

# Optional: For webhooks in production
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Step 4: Start Backend Server

```bash
cd backend
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

You should see:
```
✅ Backend running on port: 5000
🌍 Environment: development
🔗 Frontend URL: http://localhost:5173
```

### Step 5: Configure Frontend

Create or update `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### 1. Create Checkout Session

**Endpoint:** `POST /api/payments/create-checkout-session`

**Request Body:**
```json
{
  "eventId": "1",
  "eventName": "Tennis Tournament",
  "amount": 75.00,
  "currency": "usd",
  "customerEmail": "customer@example.com",
  "successUrl": "http://localhost:5173/payment-success",
  "cancelUrl": "http://localhost:5173/payment"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

### 2. Get Checkout Session

**Endpoint:** `GET /api/payments/session/:sessionId`

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "cs_test_...",
    "payment_status": "paid",
    "customer_email": "customer@example.com",
    "amount_total": 7500,
    "currency": "usd",
    "metadata": {
      "eventId": "1",
      "eventName": "Tennis Tournament"
    }
  }
}
```

### 3. Webhook Endpoint

**Endpoint:** `POST /api/payments/webhook`

This endpoint receives events from Stripe (payment succeeded, failed, etc.)

## 💻 Frontend Integration

### How It Works

1. User clicks "Pay" button on Payment page
2. Frontend calls `createCheckoutSession()` from `paymentService.ts`
3. Backend creates a Stripe Checkout Session
4. Frontend redirects user to Stripe's hosted checkout page
5. User completes payment on Stripe's secure page
6. Stripe redirects back to your `successUrl`
7. Frontend can verify payment using `getCheckoutSession()`

### Example Usage in Payment.tsx

The `Payment.tsx` component is already integrated. When a user clicks "Pay", it:

1. Calls the backend API to create a checkout session
2. Redirects to Stripe Checkout
3. User completes payment
4. Gets redirected back to success page

### Customizing Payment Flow

To pass event details to the payment page, update your navigation:

```typescript
// In EventsWrapper.tsx or wherever you navigate to payment
onNavigate('payment', {
  eventId: '123',
  eventName: 'Tennis Tournament',
  amount: 75.00
});
```

Then in `Payment.tsx`, read from URL params or state:

```typescript
const eventId = new URLSearchParams(window.location.search).get('eventId');
const eventName = new URLSearchParams(window.location.search).get('eventName');
const amount = parseFloat(new URLSearchParams(window.location.search).get('amount') || '75.00');
```

## 🧪 Testing

### Test Cards

Use these test card numbers in Stripe Checkout:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires Authentication:** `4000 0025 0000 3155`

Use any:
- Future expiry date (e.g., 12/34)
- Any 3-digit CVC
- Any ZIP code

### Test the Flow

1. Start backend: `cd backend && npm start`
2. Start frontend: `cd frontend && npm run dev`
3. Navigate to payment page
4. Click "Pay" button
5. Use test card `4242 4242 4242 4242`
6. Complete checkout
7. Verify redirect to success page

## 🔔 Webhooks (Optional - for Production)

Webhooks allow Stripe to notify your server about payment events asynchronously.

### Setup Webhooks

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/payments/webhook`
4. Select events: `checkout.session.completed`, `payment_intent.succeeded`
5. Copy the webhook signing secret
6. Add to `.env`: `STRIPE_WEBHOOK_SECRET=whsec_...`

### Local Testing with Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:5000/api/payments/webhook
```

## 🚨 Common Issues

### "Invalid API Key"
- Check that `STRIPE_SECRET_KEY` is set correctly in `.env`
- Ensure key starts with `sk_test_` (test) or `sk_live_` (production)
- Restart server after changing `.env`

### "CORS Error"
- Check `FRONTEND_URL` in backend `.env` matches your frontend URL
- Ensure CORS is configured in `server.js`

### "Failed to create checkout session"
- Check backend server is running
- Verify API endpoint URL in `paymentService.ts`
- Check browser console for error details

### "Webhook signature verification failed"
- Ensure `STRIPE_WEBHOOK_SECRET` is set
- Use Stripe CLI for local testing
- In production, verify webhook URL matches exactly

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout Guide](https://stripe.com/docs/payments/checkout)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

## ✅ Checklist

- [ ] Installed Stripe package (`npm install` in backend)
- [ ] Created `.env` file with Stripe keys
- [ ] Backend server starts without errors
- [ ] Can create checkout session (test with Postman/curl)
- [ ] Frontend can call backend API
- [ ] Payment flow works end-to-end
- [ ] Test cards work correctly
- [ ] Success page displays after payment
- [ ] Webhooks configured (if needed)

## 🎉 You're Ready!

Your Stripe payment integration is now set up. Users can securely pay for events using Stripe's hosted checkout page.


