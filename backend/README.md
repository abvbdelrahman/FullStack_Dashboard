# LMS Backend

Express and MongoDB API for the LMS dashboard.

The current product scope is instructor/admin-only. Student enrollment, checkout, lesson progress, and assignment submission workflows are intentionally disabled.

## Setup

```bash
npm install
```

Create `.env` from `.env.example`, then configure MongoDB, JWT, Stripe, Cloudinary, and client URLs.

## Scripts

```bash
npm run dev
npm start
npm test
npm run seed
```

## Authentication

Protected routes require a JWT bearer token. Users can register or login through `/api/auth/register` and `/api/auth/login`; allowed roles are `instructor` and `admin`.

## Workspace APIs

Authenticated users can manage their own workspace data through `/api/workspace`: dashboard summary, tasks, notifications, notes, resources/downloads, class sessions/recordings, discussions, and settings.

Before production deployment:

- Confirm `JWT_SECRET` is configured with a strong secret.
- Run the backend test suite.

## CORS

Allowed browser origins are loaded from `CLIENT_URL` and comma-separated `CLIENT_URLS`. In non-production mode, `http://localhost:5173` and `http://127.0.0.1:5173` are also allowed for Vite.
