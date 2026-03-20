import { createClient } from '@supabase/supabase-js';
import { NextResponse, NextRequest } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', userId)
    .single();
  return data?.is_admin || false;
}

export async function POST(request: NextRequest) {
  try {
    const { field_name, display_name, format, required, description, example } = await request.json();
    const userId = request.headers.get('x-user-id');

    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get the highest field_order
    const { data: existingFields } = await supabase
      .from('field_definitions')
      .select('field_order')
      .order('field_order', { ascending: false })
      .limit(1);

    const nextOrder = (existingFields?.[0]?.field_order ?? 0) + 1;

    const { data, error } = await supabase
      .from('field_definitions')
      .insert([
        {
          field_name,
          display_name,
          format: format || null,
          required: required ?? true,
          description: description || null,
          example: example || null,
          field_order: nextOrder,
          created_by: userId,
        },
      ])
      .select();

    if (error) {
      console.error('[v0] Error creating field:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('[v0] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, display_name, format, required, description, example, field_order } = await request.json();
    const userId = request.headers.get('x-user-id');

    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('field_definitions')
      .update({
        display_name,
        format: format || null,
        required: required ?? true,
        description: description || null,
        example: example || null,
        field_order,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('[v0] Error updating field:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('[v0] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = request.headers.get('x-user-id');

    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Field ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('field_definitions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[v0] Error deleting field:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
