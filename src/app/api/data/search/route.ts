// src/app/api/data/search/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: "Missing `q` query param." }, { status: 400 });
  }

  // Search in profiles
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("user_id, full_name, profile_img, branch, points")
    .or(`full_name.ilike.%${q}%,branch.ilike.%${q}%`);

  // Search in exhibitions
  const { data: exhibitions, error: exhibitionsError } = await supabase
    .from("exhibitions")
    .select("id, title, image_url, type, description")
    .or(`title.ilike.%${q}%,description.ilike.%${q}%,type.ilike.%${q}%`);

  if (profilesError || exhibitionsError) {
    return NextResponse.json({
      error: profilesError?.message || exhibitionsError?.message || "Search failed",
    }, { status: 500 });
  }

  return NextResponse.json({ profiles, exhibitions }, { status: 200 });
}
