-- Naming Convention Ease - Database Initialization Script
-- Run this in Supabase SQL Editor to set up your database

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create field_definitions table
CREATE TABLE IF NOT EXISTS field_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_name VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  format TEXT NOT NULL,
  required BOOLEAN DEFAULT TRUE,
  description TEXT,
  example TEXT,
  field_order INTEGER NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create naming_conventions table
CREATE TABLE IF NOT EXISTS naming_conventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  convention_values JSONB NOT NULL,
  separator VARCHAR(10) DEFAULT '_',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_naming_conventions_user_id ON naming_conventions(user_id);
CREATE INDEX IF NOT EXISTS idx_field_definitions_order ON field_definitions(field_order);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE naming_conventions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own data
CREATE POLICY "Users can only read their own data" ON naming_conventions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conventions" ON naming_conventions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conventions" ON naming_conventions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conventions" ON naming_conventions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policy: Everyone can read field_definitions (they are public)
CREATE POLICY "Everyone can read field definitions" ON field_definitions
  FOR SELECT USING (true);

-- RLS Policy: Only admins can manage field_definitions
CREATE POLICY "Admins can insert field definitions" ON field_definitions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update field definitions" ON field_definitions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete field definitions" ON field_definitions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Insert default field definitions
INSERT INTO field_definitions (field_name, display_name, format, required, description, example, field_order) VALUES
  ('parent_brief_id', 'Parent Brief ID', 'BXXX or NA', TRUE, 'Parent brief identifier. Use format BXXX (e.g., B123) or NA if not applicable.', 'B001', 1),
  ('brief_id', 'Brief ID', 'BXXX', TRUE, 'Unique brief identifier. Must follow BXXX format where X are numbers.', 'B123', 2),
  ('creative_strategist', 'Creative Strategist', 'Free text', TRUE, 'Name or initials of the creative strategist who created this brief.', 'JD', 3),
  ('creative_type', 'Creative Type', 'UGC, Video, Image, VSL, Mini VSL, Mashup, ASMR, GIF, Demo', TRUE, 'Type of creative asset. Choose from: UGC, Video, Image, VSL, Mini VSL, Mashup, ASMR, GIF, or Demo.', 'Video', 4),
  ('brief_type', 'Brief Type', 'NN (New) or IT (Iteration)', TRUE, 'NN for new brief, IT for iteration. Indicates if this is a new creative or a variation of an existing one.', 'NN', 5),
  ('angle', 'Angle', 'PascalCase (no spaces)', TRUE, 'Marketing angle in PascalCase. Examples: SocialProof, Discount, Fear, Urgency, Lifestyle, etc.', 'SocialProof', 6),
  ('product', 'Product', 'PascalCase (no spaces)', TRUE, 'Product name in PascalCase without spaces.', 'HairOil', 7),
  ('launch_date', 'Launch Date', 'YYYY-MM-DD', TRUE, 'Planned launch or go-live date in ISO format (YYYY-MM-DD).', '2026-03-20', 8),
  ('market', 'Market', 'ISO Country Code', TRUE, 'Target market as 2-letter ISO country code. Examples: US, UK, CA, AU, DE, FR, etc.', 'US', 9),
  ('editor', 'Editor', '2-3 character initials', TRUE, 'Editor initials (2-3 characters). Used to identify who edited the final creative.', 'AB', 10),
  ('voice_over', 'Voice Over', 'Free text or NA', FALSE, 'Name of voice over artist or talent. Use NA if no voice over is needed.', 'JohnSmith', 11)
ON CONFLICT (field_name) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_field_definitions_updated_at BEFORE UPDATE ON field_definitions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_naming_conventions_updated_at BEFORE UPDATE ON naming_conventions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT, UPDATE, DELETE ON naming_conventions TO authenticated;
GRANT SELECT ON field_definitions TO authenticated;

-- Print confirmation
DO $$
BEGIN
  RAISE NOTICE 'Database initialized successfully!';
  RAISE NOTICE 'Tables created: users, field_definitions, naming_conventions';
  RAISE NOTICE 'RLS policies configured';
  RAISE NOTICE 'Default field definitions loaded';
END
$$;
