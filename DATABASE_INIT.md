# Database Initialization Instructions

**⚠️ IMPORTANT: You must run this setup before using the app!**

The application requires database tables to be created in Supabase. Follow these steps:

## Method 1: Using Supabase SQL Editor (Easiest)

### Step 1: Go to Supabase Dashboard

1. Visit https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (left sidebar)

### Step 2: Open the Init Script

In v0, copy the contents of `/scripts/init-database.sql`

### Step 3: Run the SQL

1. In Supabase SQL Editor, paste the entire script
2. Click **"Run"** button (or press Ctrl+Enter)
3. You should see: "Database initialized successfully!"

### Step 4: Verify Tables Created

1. Go to **Table Editor** (left sidebar)
2. You should see three new tables:
   - `users`
   - `field_definitions`
   - `naming_conventions`
3. Click on `field_definitions` and verify 11 fields are loaded

### Step 5: Test the App

1. Go back to your app
2. Refresh the page (Ctrl+R or Cmd+R)
3. The generator should now load with fields!

---

## Method 2: Using Node.js Script (Alternative)

If you prefer to run via command line:

```bash
# Install Supabase CLI (one time)
npm install -g supabase

# Login to Supabase
supabase login

# Run the SQL file
supabase db push scripts/init-database.sql
```

---

## Method 3: Manual Creation (Not Recommended)

If you want to create tables manually through the UI:

1. Go to Supabase Dashboard → **SQL Editor**
2. Create each table:
   - `users` (id, email, is_admin, created_at, updated_at)
   - `field_definitions` (id, field_name, display_name, format, required, description, example, field_order, created_by, created_at, updated_at)
   - `naming_conventions` (id, user_id, name, convention_values, separator, created_at, updated_at)
3. Add the 11 default fields to `field_definitions`
4. Enable RLS on all tables
5. Create RLS policies as shown in `init-database.sql`

---

## Troubleshooting

### Script Fails with Permission Error

**Error:** "Permission denied" or "no superuser"

**Solution:**
- Make sure you're using the Supabase dashboard (not local Postgres)
- Your Supabase project must be active
- Ensure you have admin access to the project

### Tables Already Exist

**Error:** "relation already exists"

**Solution:**
- The tables are already created (this is good!)
- You can proceed to test the app
- If you need to reset: go to Supabase Settings → Danger Zone → Reset Database

### Field Definitions Not Inserting

**Error:** "Duplicate key value violates unique constraint"

**Solution:**
- The default fields were already inserted in a previous run
- This is fine - the app will work correctly
- If you want to reset: 
  1. Go to Supabase Table Editor
  2. Delete all rows from `field_definitions`
  3. Run the SQL script again

### Still Getting "Could not find table" Error

**Solution:**
1. Hard refresh the app: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. Wait 5 seconds
3. If still not working:
   - Go to Supabase Dashboard → Table Editor
   - Verify tables exist
   - Check network tab (F12) for API errors
   - Verify environment variables are correct

---

## What Gets Created

### Users Table
```
id (UUID) - Primary key from auth.users
email (TEXT) - User email
is_admin (BOOLEAN) - Admin flag (default: false)
created_at (TIMESTAMP) - Creation time
updated_at (TIMESTAMP) - Last update time
```

### Field Definitions Table
```
id (UUID) - Primary key
field_name (VARCHAR) - Unique field identifier
display_name (VARCHAR) - User-friendly name
format (TEXT) - Format specification
required (BOOLEAN) - Is required field
description (TEXT) - Field description
example (TEXT) - Example value
field_order (INTEGER) - Display order
created_by (UUID) - User who created field
created_at (TIMESTAMP) - Creation time
updated_at (TIMESTAMP) - Last update time
```

### Naming Conventions Table
```
id (UUID) - Primary key
user_id (UUID) - Reference to user
name (VARCHAR) - Convention name
convention_values (JSONB) - Field values as JSON
separator (VARCHAR) - Separator used (_ - . etc)
created_at (TIMESTAMP) - Creation time
updated_at (TIMESTAMP) - Last update time
```

---

## Default Fields Loaded

1. Parent Brief ID (BXXX or NA)
2. Brief ID (BXXX)
3. Creative Strategist (initials/name)
4. Creative Type (UGC, Video, Image, etc.)
5. Brief Type (NN or IT)
6. Angle (PascalCase)
7. Product (PascalCase)
8. Launch Date (YYYY-MM-DD)
9. Market (ISO country code)
10. Editor (2-3 initials)
11. Voice Over (optional, name or NA)

---

## Next Steps

After running the init script:

1. ✅ Refresh your app
2. ✅ Test the generator page
3. ✅ Fill in some fields and generate a convention
4. ✅ Click "Save Convention" to test database write
5. ✅ Go to `/saved` to verify it was saved

---

**Still having issues?** Check the troubleshooting section or review your environment variables to ensure Supabase is correctly connected.
