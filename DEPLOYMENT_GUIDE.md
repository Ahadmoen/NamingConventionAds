# Naming Convention Ease - Complete Deployment Guide

## Table of Contents
1. [Running Locally in VS Code](#running-locally-in-vs-code)
2. [Deploying Frontend to Vercel](#deploying-frontend-to-vercel)
3. [Backend Deployment (Supabase)](#backend-deployment-supabase)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment Setup](#post-deployment-setup)
6. [Troubleshooting](#troubleshooting)

---

## Running Locally in VS Code

### Prerequisites
- **Node.js** 18.17+ ([Download](https://nodejs.org/))
- **pnpm** (package manager) - Install with: `npm install -g pnpm`
- **VS Code** ([Download](https://code.visualstudio.com/))
- **Git** ([Download](https://git-scm.com/))
- **Supabase Account** (already configured in your v0 project)

### Step 1: Clone & Setup Project in VS Code

```bash
# Open VS Code and open the integrated terminal (Ctrl+`)
# Clone the repository (if using Git)
git clone <your-repo-url>
cd naming-convention-ease

# Or navigate to your project folder
cd /path/to/your/project
```

### Step 2: Install Dependencies

```bash
# In VS Code terminal
pnpm install
```

This installs:
- Next.js 16
- React 19
- TypeScript
- Supabase client libraries
- shadcn/ui components
- Tailwind CSS

**Expected output**: "Dependencies are up to date" with no errors

### Step 3: Verify Environment Variables

Your Supabase environment variables should already be set. Check your `.env.local` file:

```bash
# In VS Code, press Ctrl+P and type: .env.local
```

You should see these variables (provided by your Supabase integration):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
POSTGRES_URL=postgresql://postgres:password@db.supabase.co/postgres
SUPABASE_JWT_SECRET=your-jwt-secret
POSTGRES_PASSWORD=your-password
POSTGRES_USER=postgres
POSTGRES_DATABASE=postgres
POSTGRES_HOST=your-host.supabase.co
```

### Step 4: Initialize Database

Run this command to create tables and seed default fields:

```bash
pnpm exec node scripts/setup-db.mjs
```

**What this does:**
- Creates `field_definitions` table with 11 default fields
- Creates `naming_conventions` table for storing user data
- Creates `users` table for user management
- Sets up Row Level Security (RLS) policies
- Seeds default field definitions

**Expected output:**
```
✓ Database initialized successfully
✓ Default fields created
✓ RLS policies configured
```

### Step 5: Start Development Server

```bash
# In VS Code terminal, run:
pnpm dev
```

**Expected output:**
```
▲ Next.js 16.0.0
- Local:        http://localhost:3000
- Environments: .env.local

ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 6: Open Application in Browser

Click the link or open: **http://localhost:3000**

### VS Code Tips for Development

**Useful Extensions to Install:**
1. **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
2. **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
3. **TypeScript Vue Plugin** - Vue.volar
4. **Prettier - Code Formatter** - esbenp.prettier-vscode

**Debug Mode:**
- Open DevTools: Press `F12` or `Ctrl+Shift+I`
- Set breakpoints in VS Code by clicking line numbers
- Debug terminal shows real-time logs

**Hot Reload:** Changes to files automatically reload in browser (no page refresh needed)

**Stop Server:** Press `Ctrl+C` in the terminal

---

## Deploying Frontend to Vercel

### Option A: Deploy with GitHub (Recommended)

#### Step 1: Push Code to GitHub

```bash
# In VS Code terminal
git init
git add .
git commit -m "Initial commit: Naming Convention Ease app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/naming-convention-ease.git
git push -u origin main
```

#### Step 2: Connect to Vercel

1. Go to **https://vercel.com/new**
2. Click **"Import Project"**
3. Select **"Import Git Repository"**
4. Enter your GitHub repo URL
5. Click **"Import"**

#### Step 3: Configure Environment Variables in Vercel

1. In Vercel project settings, go to **Settings → Environment Variables**
2. Add these variables (copy from your `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
POSTGRES_URL=postgresql://...
POSTGRES_PASSWORD=your-password
SUPABASE_JWT_SECRET=your-jwt-secret
```

3. Click **"Save"**

#### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (2-3 minutes)
3. Get your live URL: `https://your-app.vercel.app`

#### Step 5: Enable Automatic Deployments

Now every push to `main` branch automatically deploys:
```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys!
```

### Option B: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# For production
vercel --prod
```

### Verify Deployment

After deployment:
1. Visit your Vercel URL
2. Test the generator at `/generator`
3. Check console for any errors (F12)
4. Test save functionality (requires database connection)

---

## Backend Deployment (Supabase)

### Good News!
Your Supabase backend is **already deployed and configured**. Here's how to verify and manage it:

### Step 1: Access Supabase Dashboard

1. Go to **https://supabase.com/dashboard**
2. Select your project
3. Verify tables exist:
   - Go to **SQL Editor**
   - Run: `SELECT * FROM field_definitions LIMIT 5;`
   - Should show your 11 default fields

### Step 2: Verify Database Schema

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Should show: field_definitions, naming_conventions, users
```

### Step 3: Check RLS Policies

1. Go to **Authentication → Policies**
2. Verify RLS is enabled on each table
3. Policies should restrict access to:
   - Own data only (users can only see their own conventions)
   - Admins can manage fields

### Step 4: Monitor Database Usage

1. Go to **Project Settings → Usage**
2. View:
   - Database size
   - API requests
   - Auth users
   - Storage usage

### Step 5: Backup Your Database

```sql
-- Supabase automatically backs up daily
-- But you can export manually:
-- 1. Go to Settings → Database
-- 2. Click "Backups"
-- 3. Download backup file
```

### Scaling Supabase (if needed)

If your app grows, upgrade your Supabase plan:
1. Go to **Billing → Subscriptions**
2. Choose plan: Pro ($25/month) or Team ($599/month)
3. Auto-scales with your usage

---

## Environment Variables

### Local Development (.env.local)

Create file in root directory:

```env
# Supabase (get from Supabase Dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
SUPABASE_JWT_SECRET=your-jwt-secret

# Database (auto-generated by Supabase)
POSTGRES_URL=postgresql://postgres:password@db.supabase.co/postgres
POSTGRES_PASSWORD=your-password
POSTGRES_USER=postgres
POSTGRES_DATABASE=postgres
POSTGRES_HOST=db.supabase.co
```

### Production (Vercel)

1. Go to Vercel Project **Settings → Environment Variables**
2. Add the same variables as local development
3. Select which environments they apply to:
   - Production
   - Preview
   - Development (if needed)

### Getting Supabase Keys

1. Go to **https://supabase.com/dashboard**
2. Select your project
3. Click **Settings → API**
4. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

---

## Post-Deployment Setup

### Step 1: Verify App Works

```bash
# Test each page:
# Landing: https://your-app.vercel.app/
# Generator: https://your-app.vercel.app/generator
# Documentation: https://your-app.vercel.app/documentation
# Admin: https://your-app.vercel.app/admin/fields
# Saved: https://your-app.vercel.app/saved
```

### Step 2: Test Database Connection

1. Go to `/generator`
2. Fill in a field and check if dropdown populates
3. Generate a convention
4. Click "Save Convention"
5. Check `/saved` page - should see your saved item

### Step 3: Setup Custom Domain (Optional)

In Vercel Dashboard:
1. Go to **Settings → Domains**
2. Add your domain: `myapp.com`
3. Follow DNS instructions
4. Wait for propagation (5-30 minutes)

### Step 4: Enable Analytics (Optional)

Already included with Vercel Analytics, visible in:
- Vercel Dashboard → Analytics
- Shows page views, errors, response times

### Step 5: Setup Monitoring & Alerts

1. In Vercel: **Settings → Monitoring**
2. Set alerts for:
   - Deploy failures
   - High error rates
   - Slow API responses

---

## Troubleshooting

### "Cannot find module" Error

```bash
# Solution: Reinstall dependencies
pnpm install
pnpm cache clean
```

### Database Connection Error

```
Error: SUPABASE_SERVICE_ROLE_KEY not found
```

**Solution:**
1. Check `.env.local` has all variables
2. Copy directly from Supabase Dashboard (no spaces)
3. For Vercel deployment, verify in Settings → Environment Variables
4. Restart dev server: `pnpm dev`

### Fields Not Loading from Database

```bash
# Check API route works:
# In browser console, go to http://localhost:3000/api/fields
# Should return JSON array of fields
```

**Solution:**
1. Verify database tables exist: Run setup script again
2. Check browser network tab (F12) for API errors
3. Check Supabase logs: Dashboard → Logs

### Can't Save Conventions

**Error:** "Permission denied" or "Row Level Security violation"

**Solution:**
1. Verify SUPABASE_SERVICE_ROLE_KEY is set
2. Check RLS policies in Supabase Dashboard
3. Ensure user ID is properly set

### Deployment Fails on Vercel

**Check:**
1. Build logs: Vercel Dashboard → Deployments → View Logs
2. Missing environment variables
3. TypeScript errors: `pnpm build` locally first
4. Check Node version: Vercel uses Node 18+

### Slow Performance

**Solution:**
1. Check Vercel Analytics for slow pages
2. Optimize images/assets
3. Check database query performance
4. Scale Supabase plan if needed

### CORS Errors

If you see "blocked by CORS":
1. Ensure using Supabase client correctly
2. Check Supabase → Settings → Security → CORS
3. Add your Vercel domain to allowed origins

---

## Production Checklist

Before going live, ensure:

- [ ] All environment variables set in Vercel
- [ ] Database initialized with tables
- [ ] Test generator page works
- [ ] Test save/load functionality
- [ ] Test admin field management
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled
- [ ] Database backups configured
- [ ] Error monitoring setup
- [ ] HTTPS enabled (automatic with Vercel)

---

## Support & Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com

---

## Quick Reference Commands

```bash
# Development
pnpm install          # Install dependencies
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm exec node scripts/setup-db.mjs  # Initialize database
pnpm exec node scripts/seed-db.mjs   # Seed data (if available)

# Deployment
vercel                # Deploy to Vercel (staging)
vercel --prod         # Deploy to production
git push origin main  # Auto-deploy via GitHub
```

---

**Last Updated:** March 2026
**Version:** 1.0
