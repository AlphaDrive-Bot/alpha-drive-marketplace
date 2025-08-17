import { supabase } from '@/lib/supabase';
import { listingSchema } from '@/lib/validators';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/listings – return all listings with category name
 */
export async function GET() {
  const { data, error } = await supabase
    .from('listings')
    .select('*, categories(name)')
    .order('created_at', { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

/**
 * POST /api/listings – create a new listing
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Honeypot field: if exists and filled then reject as spam
    if (body.hp_field) {
      return NextResponse.json({ error: 'Bot detected' }, { status: 400 });
    }
    const result = listingSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten().fieldErrors }, { status: 400 });
    }
    // Compute price_inc_vat if not provided
    const payload = {
      ...result.data,
      created_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from('listings').insert(payload).select('*').single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/**
 * DELETE /api/listings?id=... – delete a listing
 */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  const { error } = await supabase.from('listings').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'Deleted' });
}