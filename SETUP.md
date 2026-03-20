# Quick Setup Guide

## Step 1: Install Dependencies

```bash
pnpm install
```

This will install all required packages including Supabase, Next.js, and UI components.

## Step 2: Configure Supabase

Your Supabase integration is already connected! The following environment variables are automatically configured:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `POSTGRES_URL`

## Step 3: Initialize Database

Run the database setup script to create tables and seed default fields:

```bash
pnpm run scripts/setup-db.mjs
```

This will:
- Create the `users` table
- Create the `field_definitions` table
- Create the `naming_conventions` table
- Insert 11 default field definitions
- Set up Row Level Security (RLS) policies

## Step 4: Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Step 5: Access the Application

- **Homepage**: http://localhost:3000
- **Generator**: http://localhost:3000/generator
- **Documentation**: http://localhost:3000/documentation
- **Admin Panel**: http://localhost:3000/admin/fields
- **Saved Conventions**: http://localhost:3000/saved

## What's Included

### Pages
- **Landing Page** - Overview and features
- **Generator** - Main naming convention tool
- **Documentation** - Field reference guide
- **Admin Panel** - Manage custom fields
- **Saved Conventions** - View and manage saved items

### Components
- Convention form with dynamic fields
- Real-time preview card
- Copy to clipboard functionality
- Save convention modal
- Field management interface
- Admin field modal for CRUD operations

### API Routes
- `GET /api/fields` - Fetch all field definitions
- `POST /api/conventions` - Save a new convention
- `GET /api/conventions` - Fetch user's conventions
- `PUT /api/conventions/[id]` - Update a convention
- `DELETE /api/conventions/[id]` - Delete a convention
- `POST /api/admin/fields` - Create new field (admin)
- `PUT /api/admin/fields` - Update field (admin)
- `DELETE /api/admin/fields` - Delete field (admin)

## Default Fields

The system comes pre-configured with these fields:

1. Parent Brief ID (required)
2. Brief ID (required)
3. Creative Strategist (required)
4. Creative Type (required)
5. Brief Type (required)
6. Angle (required)
7. Product (required)
8. Launch Date (required)
9. Market (required)
10. Editor (required)
11. Voice Over (optional)

You can customize these or add new fields through the admin panel.

## Environment Variables

Your `.env.local` should have these variables (already set up via Supabase integration):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
POSTGRES_URL=postgresql://user:password@db.supabase.co/postgres
SUPABASE_JWT_SECRET=your-jwt-secret
POSTGRES_PASSWORD=your-password
POSTGRES_USER=postgres
POSTGRES_DATABASE=postgres
POSTGRES_HOST=your-host.supabase.co
```

## Build for Production

```bash
pnpm build
pnpm start
```

## Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add the Supabase environment variables to Vercel project settings
3. Deploy with a single push to your main branch

## Troubleshooting

### Database Connection Error
- Verify Supabase credentials in environment variables
- Check that Supabase project is active
- Ensure network allows connection to Supabase

### Fields Not Loading
- Check browser console for errors
- Verify `/api/fields` endpoint is working
- Ensure database tables are created

### Can't Save Conventions
- Verify user ID is set (localStorage.getItem('userId'))
- Check that user has permission to write to naming_conventions table
- Ensure SUPABASE_SERVICE_ROLE_KEY is set for admin operations

## Next Steps

1. Customize the default fields in the admin panel
2. Test the naming convention generator
3. Save some conventions to verify persistence
4. Deploy to Vercel for production use

For more detailed information, see [README.md](./README.md)
