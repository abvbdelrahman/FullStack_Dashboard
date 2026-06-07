# FullStack Dashboard

Full-stack LMS dashboard with a React/Vite frontend and an Express/MongoDB backend.

## Project Structure

- `frontend` - React, Vite, Tailwind CSS dashboard.
- `backend` - Express API, MongoDB models, auth, workspace resources, and seed script.

## Local Setup

Install dependencies:

```bash
npm --prefix frontend install
npm --prefix backend install
```

Create environment files:

```bash
copy frontend\.env.example frontend\.env
copy backend\.env.example backend\.env
```

Run the apps:

```bash
npm run dev:backend
npm run dev:frontend
```

Seed demo data:

```bash
npm run seed
```

Demo login:

```text
instructor@knowledgepulse.com / password123
admin@knowledgepulse.com / password123
```

## Validation

```bash
npm run build
npm run test
```

## Vercel

The root `vercel.json` is prepared for deploying the frontend and backend from the same repository.

Set these environment variables in Vercel:

```text
MONGODB_URI
JWT_SECRET
JWT_EXPIRES_IN
CLIENT_URL
CLIENT_URLS
NODE_ENV=production
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
CLOUDINARY_LECTURES_FOLDER
```

If frontend and backend are deployed as separate Vercel projects, set this in the frontend project:

```text
VITE_API_URL=https://your-backend-domain.vercel.app/api
```

## GitHub

```bash
git init
git add .
git commit -m "Initial fullstack dashboard"
git branch -M main
git remote add origin https://github.com/abvbdelrahman/FullStack_Dashboard.git
git push -u origin main
```
