# Mac Terminal Setup & Deployment Guide

## Part 1: Setup & Run Locally on Mac

### Prerequisites
- **Git** (usually pre-installed on Mac)
- **Node.js 18+** (download from nodejs.org or use: `brew install node`)
- **pnpm** (install with: `npm install -g pnpm`)

### Step 1: Clone or Open Your Project

```bash
# If you have the project ZIP file:
unzip naming-convention-app.zip
cd naming-convention-app

# OR if using Git:
git clone <your-github-repo-url>
cd naming-convention-app
```

### Step 2: Install Dependencies

```bash
pnpm install
```

This downloads all required packages (~500MB).

### Step 3: Create Environment File

```bash
# Create .env.local file
touch .env.local

# Open it in a text editor and add:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Get these values from:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click Settings → API
4. Copy the URL and "anon" key

### Step 4: Initialize Your Database

**IMPORTANT:** Run this FIRST before starting the app:

```bash
# Open Supabase SQL Editor:
# 1. Go to https://supabase.com/dashboard
# 2. Select your project
# 3. Click SQL Editor (left sidebar)
# 4. Click "New Query"
# 5. Copy entire content from: scripts/init-database.sql
# 6. Paste into SQL Editor
# 7. Click "Run"

# Verify it worked:
# - Go to Table Editor in Supabase
# - You should see 3 new tables:
#   - field_definitions (11 rows)
#   - naming_conventions
#   - users
```

### Step 5: Start Development Server

```bash
# In the project directory:
pnpm dev
```

**Output will show:**
```
> next dev

  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.3s
```

### Step 6: Open in Browser

```bash
# Automatically opens, or manually visit:
http://localhost:3000
```

**You should see:**
- Landing page with "Naming Convention Ease"
- Navigation menu at top
- "Get Started" button works
- Generator page shows form fields

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Naming Convention app"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/naming-convention-app.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

```bash
# Option A: Using Vercel CLI (simplest)
pnpm install -g vercel
vercel

# Follow prompts:
# - Connect with GitHub
# - Select your repository
# - Select "Next.js" framework
# - Keep defaults and deploy

# Option B: Manual on Vercel website
# 1. Go to https://vercel.com/new
# 2. Click "Import Git Repository"
# 3. Paste your GitHub repo URL
# 4. Click Import
```

### Step 3: Add Environment Variables to Vercel

After deployment starts:

```bash
# Using Vercel CLI:
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste: your_supabase_url
# Select: Production, Preview, Development

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste: your_supabase_anon_key
# Select: Production, Preview, Development
```

**OR manually in Vercel dashboard:**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add both variables for all environments
5. Redeploy

### Step 4: Verify Deployment

```bash
# Get your deployment URL:
vercel --prod

# Output will show:
# Production: https://your-project-name.vercel.app
```

Visit that URL - your app is live!

---

## Part 3: Backend (Supabase) - Already Deployed!

Your backend is **automatically deployed** when you set it up. Here's what's live:

### Supabase Hosted
- ✅ PostgreSQL Database (cloud-hosted)
- ✅ Authentication system ready
- ✅ Row Level Security policies active
- ✅ Real-time subscriptions enabled
- ✅ Automatic backups daily

### Nothing else needed!
Just make sure your environment variables are correct in Vercel settings.

---

## Part 4: Ongoing Development

### Daily Workflow

```bash
# 1. Start dev server
pnpm dev

# 2. Make code changes in VS Code/editor

# 3. Browser auto-refreshes (HMR)

# 4. When ready, commit and push
git add .
git commit -m "Feature: Add new functionality"
git push origin main

# 5. Vercel auto-deploys (usually ~30 seconds)
```

### Build and Test Locally

```bash
# Build for production (finds errors before deploy)
pnpm build

# If it fails, fix the errors and try again

# Run production build locally
pnpm start
# Visit http://localhost:3000
```

---

## Part 5: Troubleshooting

### Issue: "Cannot find module" errors

```bash
# Solution: Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### Issue: "field_definitions table not found"

```bash
# Solution: Re-run database initialization
# (See Part 1, Step 4)
```

### Issue: Environment variables not loading

```bash
# Verify .env.local exists:
ls -la .env.local

# Check format (no quotes):
cat .env.local

# Should look like:
# NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...
```

### Issue: Vercel build fails

```bash
# View detailed logs:
vercel logs --tail

# Common fixes:
# 1. Check env vars are set in Vercel dashboard
# 2. Run 'pnpm build' locally to find errors
# 3. Check git push succeeded
```

---

## Part 6: Monitoring & Maintenance

### Check App Health

```bash
# View Vercel analytics:
# https://vercel.com/dashboard/project-name/analytics

# View Supabase metrics:
# https://supabase.com/dashboard/project-name/reports
```

### View Database Backups

```bash
# Supabase automatically backs up daily
# Access at: https://supabase.com/dashboard/project-name/backups
```

### Check Server Logs

```bash
# Vercel logs:
vercel logs --tail

# Real-time monitoring:
# https://vercel.com/dashboard/project-name/monitoring
```

---

## Part 7: Custom Domain (Optional)

### Add Domain to Vercel

```bash
# In Vercel dashboard:
# 1. Settings → Domains
# 2. Click "Add Domain"
# 3. Enter your domain (e.g., naming.yourdomain.com)
# 4. Update DNS settings at your domain provider
# 5. Wait for SSL certificate (5-10 minutes)
```

---

## Quick Command Reference

```bash
# Installation
pnpm install                    # Install dependencies
pnpm install -g vercel          # Install Vercel CLI

# Development
pnpm dev                        # Start dev server (localhost:3000)
pnpm build                      # Build for production
pnpm start                      # Run production build locally

# Deployment
git push origin main            # Push to GitHub (auto-deploys)
vercel                          # Deploy with Vercel CLI
vercel --prod                   # Deploy to production
vercel logs --tail              # View live server logs

# Database
# Initialize: Copy scripts/init-database.sql to Supabase SQL Editor and Run

# Git
git status                      # Check changes
git add .                       # Stage all changes
git commit -m "message"         # Create commit
git push origin main            # Push to GitHub
```

---

## Summary

1. **Local Development:** `pnpm dev` → http://localhost:3000
2. **Database Setup:** Run SQL script in Supabase console (one-time)
3. **Deploy Frontend:** Push to GitHub → Vercel auto-deploys
4. **Backend:** Supabase handles everything (no action needed)
5. **Updates:** `git push` → Vercel deploys automatically (~30s)

**That's it!** Your app is now live on the internet and automatically updates whenever you push code changes.

