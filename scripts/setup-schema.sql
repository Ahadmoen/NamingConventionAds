-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- Create field_definitions table (admin-managed fields)
CREATE TABLE IF NOT EXISTS public.field_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  format TEXT,
  required BOOLEAN DEFAULT TRUE,
  description TEXT,
  example TEXT,
  field_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- Create naming_conventions table (user-saved conventions)
CREATE TABLE IF NOT EXISTS public.naming_conventions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  convention_values JSONB NOT NULL,
  separator TEXT DEFAULT '_',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- Create indexes for performance
CREATE INDEX idx_naming_conventions_user_id ON public.naming_conventions(user_id);
CREATE INDEX idx_field_definitions_field_order ON public.field_definitions(field_order);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.naming_conventions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for field_definitions (public read, admin write)
CREATE POLICY "Anyone can read field definitions" ON public.field_definitions
  FOR SELECT USING (TRUE);

CREATE POLICY "Only admins can create fields" ON public.field_definitions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Only admins can update fields" ON public.field_definitions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Only admins can delete fields" ON public.field_definitions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- RLS Policies for naming_conventions (users see only their own)
CREATE POLICY "Users can create their own conventions" ON public.naming_conventions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own conventions" ON public.naming_conventions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own conventions" ON public.naming_conventions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conventions" ON public.naming_conventions
  FOR DELETE USING (auth.uid() = user_id);

-- Insert default field definitions
INSERT INTO public.field_definitions (field_name, display_name, format, required, description, example, field_order)
VALUES
  ('parent_brief_id', 'Parent Brief ID', 'BXXX or NA', TRUE, 'Parent brief identifier or NA if not applicable', 'B001', 1),
  ('brief_id', 'Brief ID', 'BXXX', TRUE, 'Brief identifier in BXXX format', 'B001', 2),
  ('creative_strategist', 'Creative Strategist', 'Free text', TRUE, 'Name or initials of creative strategist', 'JD', 3),
  ('creative_type', 'Creative Type', 'UGC, Video, Image, VSL, Mini VSL, Mashup, ASMR, GIF, Demo', TRUE, 'Type of creative content being produced', 'UGC', 4),
  ('brief_type', 'Brief Type', 'NN or IT', TRUE, 'NN for new, IT for iteration', 'NN', 5),
  ('angle', 'Angle', 'PascalCase', TRUE, 'Marketing angle (e.g., SocialProof, Discount, Fear)', 'SocialProof', 6),
  ('product', 'Product', 'PascalCase', TRUE, 'Product name in PascalCase', 'HairOil', 7),
  ('launch_date', 'Launch Date', 'YYYY-MM-DD', TRUE, 'Date when creative launches', '2024-03-20', 8),
  ('market', 'Market', 'ISO code', TRUE, 'Market code (US, UK, CA, etc.)', 'US', 9),
  ('editor', 'Editor', '2-3 chars', TRUE, 'Editor initials', 'AB', 10),
  ('voice_over', 'Voice Over', 'Name or NA', FALSE, 'Voice over artist name or NA', 'NA', 11)
ON CONFLICT (field_name) DO NOTHING;
