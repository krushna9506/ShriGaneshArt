# Ganesh Arts — Free Deployment Checklist

## Step 1: Neon (database)
- [ ] Sign up at neon.tech (no credit card)
- [ ] Create project: ganesh-arts, region: Singapore
- [ ] SQL Editor → run 001_init.sql
- [ ] Copy DATABASE_URL connection string

## Step 2: Supabase (file storage only)
- [ ] Sign up at supabase.com
- [ ] Create project: ganesh-arts-storage
- [ ] Storage → New bucket → ganesh-media → Public
- [ ] Copy Project URL and service_role key

## Step 3: Render (backend)
- [ ] Sign up at render.com (no credit card)
- [ ] New Web Service → Connect GitHub → select backend repo
- [ ] Build command: npm install
- [ ] Start command: npm start
- [ ] Add all env vars from .env.example
- [ ] Copy your Render URL: https://ganesh-arts-api.onrender.com

## Step 4: Vercel (frontend)
- [ ] Sign up at vercel.com (no credit card)
- [ ] New Project → Import GitHub → select frontend repo
- [ ] Add env var: VITE_API_URL = your Render URL
- [ ] Add env var: VITE_GOOGLE_CLIENT_ID = your Google Client ID (from Step 8)
- [ ] Deploy → copy your Vercel URL

## Step 5: Update CORS
- [ ] Render dashboard → your service → Environment
- [ ] Set FRONTEND_URL = your Vercel URL
- [ ] Manual deploy → redeploy backend

## Step 6: UptimeRobot (prevent Render sleep)
- [ ] Sign up at uptimerobot.com (free)
- [ ] New Monitor → HTTP(S) → URL: your Render URL + /ping
- [ ] Interval: every 10 minutes
- [ ] Done — Render stays awake 24/7

## Step 7: iPhone (PWA)
- [ ] Open Vercel URL in Safari on iPhone
- [ ] Share → Add to Home Screen → Add

## Step 8: Google Login Setup (Credentials)
- [ ] Go to Google Cloud Console (https://console.cloud.google.com)
- [ ] Create a new project: `ganesh-arts`
- [ ] Navigate to APIs & Services → OAuth Consent Screen
- [ ] Configure OAuth consent as External, fill basic branding names
- [ ] Navigate to Credentials → Create Credentials → OAuth Client ID
- [ ] Application type: Web Application
- [ ] Add Authorized JavaScript Origins: `http://localhost:5173`, `http://localhost:3000` and your production Vercel URL
- [ ] Copy the Client ID and add it as `VITE_GOOGLE_CLIENT_ID` in Vercel/local variables!

## Cost: ₹0/month until December 2026
