# AJH Sports Platform

Full-stack sports booking platform for events, coaching sessions, and group lessons—with admin management and Stripe payments.

## Features

- **Public site** — Browse events, book coaches, and manage your profile and bookings
- **Payments** — Stripe checkout for event and coaching bookings
- **Authentication** — Email/password plus Google and Facebook OAuth
- **Admin portal** — Events, coaches, users, bookings, and lessons
- **Email** — Booking confirmations and notifications (Nodemailer)

## Tech stack

| Layer | Technologies |
|--------|----------------|
| Frontend | React, TypeScript, Vite, Radix UI / shadcn-style components |
| Backend | Node.js, Express, Passport, JWT |
| Database | MySQL |
| Payments | Stripe |
| Hosting | Azure App Service, Firebase Hosting (frontend) |

## Project structure

```
AJH_Sports/
├── frontend/          # React app
├── backend/           # Express API
│   └── database/      # schema.sql, setup scripts
└── USER_MANUAL.md     # End-user and admin guide
```

## Getting started

### Prerequisites

- Node.js 18+
- MySQL 8+
- Stripe account (test keys for development)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # configure DB, JWT, Stripe, OAuth, email
npm run db:setup
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Configure the frontend API base URL to point at your backend (see `frontend/src/services/api.ts`).

## Documentation

See [USER_MANUAL.md](./USER_MANUAL.md) for user and admin workflows.

## CI: Firebase Hosting (GitHub Actions)

Pushes to `main` that change `frontend/**` run `.github/workflows/deploy-frontend-firebase.yml`.

If deploy fails with a Firebase email, the build usually succeeded and **authentication** failed. Add this repository secret:

| Secret | Value |
|--------|--------|
| `FIREBASE_SERVICE_ACCOUNT` | Entire JSON from [Firebase Console](https://console.firebase.google.com/) → Project **ajh-sports-308b4** → ⚙️ Project settings → **Service accounts** → **Generate new private key** |

The service account needs permission to deploy Hosting (e.g. **Firebase Hosting Admin**). Optional: `VITE_API_URL` overrides the production API URL used at build time (defaults to Azure backend).

Re-run: **Actions** → **Deploy Frontend to Firebase Hosting** → **Run workflow**.

## License

Private project — all rights reserved unless otherwise noted. Third-party UI attributions: `frontend/src/Attributions.md`.
