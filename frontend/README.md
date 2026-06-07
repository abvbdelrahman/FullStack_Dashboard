# LMS Frontend

React, TypeScript, Vite, and Tailwind CSS frontend for the LMS dashboard.

## Setup

```bash
npm install
```

Create `.env` from `.env.example` and point it at the backend API:

```bash
VITE_API_URL=http://localhost:5000/api
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Backend Dependency

The dashboard expects the backend to be running on the URL configured in `VITE_API_URL`. Courses, assignments, and calendar events are loaded through the API client in `src/services/api.ts`.

## Current Notes

- The product is currently scoped to instructor/admin workflows only.
- Authentication is required for the dashboard. Use the login/register screens to store a local JWT.
- Courses, assignments, calendar, dashboard tasks, notifications, resources, downloads, classes, recordings, discussions, notes, and settings use backend APIs.
- Dashboard data is scoped to the authenticated instructor/admin account.
- Large production bundles may need code splitting later.
