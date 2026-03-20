# Naming Convention Ease

A modern web application for managing ad creative naming conventions. Create consistent, professional naming conventions with customizable fields, real-time preview, and admin field management.

## Features

- **Dynamic Field Generator**: Fill out customizable fields with real-time naming convention preview
- **Multiple Separators**: Choose from underscore, hyphen, dot, or custom separators
- **One-Click Copy**: Instantly copy generated conventions to clipboard
- **Admin Field Management**: Add, edit, delete, and reorder fields
- **Save Conventions**: Store frequently used naming conventions for quick access
- **Field Documentation**: Comprehensive guide for each field with format rules and examples
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS v4
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase project with PostgreSQL database
- Vercel account (optional, for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd naming-convention-ease
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   POSTGRES_URL=your_database_url
   SUPABASE_JWT_SECRET=your_jwt_secret
   ```

4. **Initialize the database**
   
   Run the setup script to create tables and insert default fields:
   ```bash
   pnpm run scripts setup-db.mjs
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## Project Structure

```
app/
├── api/
│   ├── fields/route.ts           # Fetch field definitions
│   ├── conventions/route.ts       # Save/fetch naming conventions
│   ├── conventions/[id]/route.ts  # Update/delete conventions
│   └── admin/fields/route.ts      # Admin field management
├── admin/
│   └── fields/page.tsx            # Admin field management UI
├── documentation/page.tsx         # Field documentation
├── generator/page.tsx             # Main naming convention generator
├── saved/page.tsx                 # User's saved conventions
├── page.tsx                       # Landing page
└── layout.tsx                     # Root layout

components/
├── convention-form.tsx            # Form for entering field values
├── preview-card.tsx               # Real-time preview and copy button
├── save-convention-modal.tsx      # Save convention dialog
├── field-modal.tsx                # Add/edit field dialog
├── field-management-table.tsx     # Admin field management table
└── site-navigation.tsx            # Top navigation bar

lib/
├── supabase.ts                    # Supabase client setup
├── schema.ts                      # TypeScript interfaces
└── conventions.ts                 # Utility functions
```

## Database Schema

### field_definitions
- `id` - UUID primary key
- `field_name` - Unique identifier for the field
- `display_name` - User-friendly field name
- `format` - Format specification for the field
- `required` - Whether the field is required
- `description` - Detailed description of the field
- `example` - Example value for the field
- `field_order` - Order of fields in the form
- `created_by` - User who created the field
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### naming_conventions
- `id` - UUID primary key
- `user_id` - Reference to the user
- `name` - User-friendly name for the convention
- `convention_values` - JSONB storing field values
- `separator` - Separator used (_, -, ., or custom)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### users
- `id` - UUID from auth.users
- `email` - User email
- `is_admin` - Admin flag
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Default Fields

The application comes with 11 pre-configured fields:

1. **Parent Brief ID** - Parent brief identifier (BXXX or NA)
2. **Brief ID** - Brief identifier (BXXX format)
3. **Creative Strategist** - Name or initials
4. **Creative Type** - Type of creative (UGC, Video, Image, etc.)
5. **Brief Type** - NN (new) or IT (iteration)
6. **Angle** - Marketing angle (SocialProof, Discount, Fear, etc.)
7. **Product** - Product name (PascalCase)
8. **Launch Date** - Launch date (YYYY-MM-DD)
9. **Market** - Market code (US, UK, CA, etc.)
10. **Editor** - Editor initials (2-3 chars)
11. **Voice Over** - Voice over artist name (optional)

## Usage

### Generate Naming Convention

1. Navigate to `/generator`
2. Fill in the field values
3. Select a separator (underscore, hyphen, dot, or custom)
4. See the real-time preview
5. Click "Copy to Clipboard" to copy the convention
6. Click "Save Convention" to store for later

### View Documentation

Visit `/documentation` to see detailed information about each field including format specifications and examples.

### Manage Saved Conventions

Visit `/saved` to view, copy, or delete your saved naming conventions.

### Admin Field Management

Visit `/admin/fields` to:
- Add new custom fields
- Edit existing field configurations
- Delete fields
- Reorder fields using drag handles

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect the repository to Vercel
3. Add environment variables in Vercel project settings
4. Vercel will automatically deploy on every push

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## Color Theme

The application uses a zinc, white, and black color scheme:
- Primary: Black
- Secondary: Zinc
- Accent: Zinc
- Background: White
- Text: Black/Zinc

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal and commercial purposes.

## Support

For issues or questions, please open an issue in the repository or contact support.
