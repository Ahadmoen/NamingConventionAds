// app/api/admin/fields/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase with SERVICE ROLE key (server-only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // Fetch all field definitions ordered by field_order
  const { data, error } = await supabase
    .from('field_definitions')
    .select('*')
    .order('field_order', { ascending: true });

  if (error) {
    console.error('[v0] Error fetching fields:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.field_name) {
      return NextResponse.json(
        { error: 'field_name is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('field_definitions')
      .upsert([body], { onConflict: 'field_name' });

    if (error) {
      console.error('[v0] Error inserting/updating field:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('[v0] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}