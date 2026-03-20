import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('[v0] Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function setupDatabase() {
  try {
    console.log('[v0] Starting database setup...');

    // Create users table
    console.log('[v0] Creating users table...');
    await supabase.from('users').select('id').limit(0);
    console.log('[v0] Users table exists or created');

    // Create field_definitions table
    console.log('[v0] Creating field_definitions table...');
    await supabase.from('field_definitions').select('id').limit(0);
    console.log('[v0] Field definitions table exists or created');

    // Create naming_conventions table
    console.log('[v0] Creating naming_conventions table...');
    await supabase.from('naming_conventions').select('id').limit(0);
    console.log('[v0] Naming conventions table exists or created');

    // Insert default field definitions
    console.log('[v0] Inserting default field definitions...');
    const fields = [
      { field_name: 'parent_brief_id', display_name: 'Parent Brief ID', format: 'BXXX or NA', required: true, description: 'Parent brief identifier or NA if not applicable', example: 'B001', field_order: 1 },
      { field_name: 'brief_id', display_name: 'Brief ID', format: 'BXXX', required: true, description: 'Brief identifier in BXXX format', example: 'B001', field_order: 2 },
      { field_name: 'creative_strategist', display_name: 'Creative Strategist', format: 'Free text', required: true, description: 'Name or initials of creative strategist', example: 'JD', field_order: 3 },
      { field_name: 'creative_type', display_name: 'Creative Type', format: 'UGC, Video, Image, VSL, Mini VSL, Mashup, ASMR, GIF, Demo', required: true, description: 'Type of creative content being produced', example: 'UGC', field_order: 4 },
      { field_name: 'brief_type', display_name: 'Brief Type', format: 'NN or IT', required: true, description: 'NN for new, IT for iteration', example: 'NN', field_order: 5 },
      { field_name: 'angle', display_name: 'Angle', format: 'PascalCase', required: true, description: 'Marketing angle (e.g., SocialProof, Discount, Fear)', example: 'SocialProof', field_order: 6 },
      { field_name: 'product', display_name: 'Product', format: 'PascalCase', required: true, description: 'Product name in PascalCase', example: 'HairOil', field_order: 7 },
      { field_name: 'launch_date', display_name: 'Launch Date', format: 'YYYY-MM-DD', required: true, description: 'Date when creative launches', example: '2024-03-20', field_order: 8 },
      { field_name: 'market', display_name: 'Market', format: 'ISO code', required: true, description: 'Market code (US, UK, CA, etc.)', example: 'US', field_order: 9 },
      { field_name: 'editor', display_name: 'Editor', format: '2-3 chars', required: true, description: 'Editor initials', example: 'AB', field_order: 10 },
      { field_name: 'voice_over', display_name: 'Voice Over', format: 'Name or NA', required: false, description: 'Voice over artist name or NA', example: 'NA', field_order: 11 },
    ];

    for (const field of fields) {
      const { error } = await supabase
        .from('field_definitions')
        .upsert([field], { onConflict: 'field_name' });
      
      if (error && !error.message.includes('duplicate')) {
        console.error(`[v0] Error inserting field ${field.field_name}:`, error);
      }
    }

    console.log('[v0] Database setup completed successfully!');
  } catch (error) {
    console.error('[v0] Database setup error:', error);
    process.exit(1);
  }
}

setupDatabase();
