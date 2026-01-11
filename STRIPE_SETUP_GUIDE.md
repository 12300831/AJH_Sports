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

## 🔔 Webhooks (REQUIRED for Bookings to Work)

Webhooks are **essential** for the event registration flow to work correctly. When a user pays via Stripe Checkout, the webhook handler receives the payment confirmation and creates the booking in the database.

### How It Works

1. User clicks "Register" → Backend creates Stripe Checkout Session
2. User completes payment on Stripe's page
3. Stripe sends `checkout.session.completed` webhook to your server
4. Webhook handler creates the booking with `status=confirmed`, `payment_status=paid`
5. `available_spots` decreases automatically

### Local Development with Stripe CLI (Recommended)

For local development, use the Stripe CLI to forward webhooks to your local server.

#### Step 1: Install Stripe CLI

**Windows (using Scoop):**
```powershell
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**Windows (using Chocolatey):**
```powershell
choco install stripe-cli
```

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux (Debian/Ubuntu):**
```bash
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update
sudo apt install stripe
```

#### Step 2: Login to Stripe CLI

```bash
stripe login
```

This will open a browser for authentication. Confirm the login.

#### Step 3: Start the Webhook Listener

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

The CLI will output something like:
```
Ready! You are using Stripe API Version [2024-11-20].
Your webhook signing secret is whsec_abc123xyz789...
```

#### Step 4: Copy the Webhook Secret

Copy the `whsec_...` value and add it to your `backend/.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_abc123xyz789...
```

**Important:** The webhook secret from `stripe listen` is temporary and changes each time you restart the CLI. For consistent testing, keep the CLI running.

#### Step 5: Restart Backend

```bash
cd backend
npm start
```

You should see in the logs:
```
💳 Stripe payments are ENABLED.
🔗 Stripe webhooks are CONFIGURED.
```

#### Step 6: Test the Full Flow

1. Start frontend: `cd frontend && npm run dev`
2. Log in as a user
3. Go to Events page
4. Click "Register Now" on an event
5. Complete payment with test card `4242 4242 4242 4242`
6. Watch the Stripe CLI terminal for webhook delivery
7. Verify the booking was created and `available_spots` decreased

#### Webhook Events We Handle

- `checkout.session.completed` - Creates/confirms booking after successful payment
- `payment_intent.succeeded` - Logged for reference
- `payment_intent.payment_failed` - Logged for debugging

### Production Webhooks

For production, set up webhooks in the Stripe Dashboard:

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your production webhook URL: `https://yourdomain.com/api/payments/webhook`
4. Select events:
   - `checkout.session.completed` (Required)
   - `payment_intent.succeeded` (Optional)
   - `payment_intent.payment_failed` (Optional)
5. Copy the signing secret and add to production `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_production_secret
   ```

### Webhook Reliability & Idempotency

Our webhook handler is designed to be **idempotent** and **reliable**:

1. **Signature Verification:** Validates `stripe-signature` header using `STRIPE_WEBHOOK_SECRET`
2. **Session ID Idempotency:** Checks if `stripe_session_id` was already processed
3. **User+Event Idempotency:** Prevents duplicate bookings for same user+event
4. **Capacity Check:** Re-verifies `available_spots` at booking time (race condition protection)
5. **Structured Logging:** Clear logs for debugging:
   ```
   [Webhook] ────────────────────────────────────────
   [Webhook] Received webhook request
   [Webhook] ✅ Signature verified successfully
   [Webhook] Event type: checkout.session.completed
   [Webhook:BookingSuccess] ✅ Created event booking #42
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


