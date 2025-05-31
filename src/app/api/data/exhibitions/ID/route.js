import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id parameter' }), { status: 400 });
  }

  // Fetch exhibition data
  const { data, error } = await supabase
    .from('exhibitions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  if (!data) {
    return new Response(JSON.stringify({ error: 'Exhibition not found' }), { status: 404 });
  }

  // Fetch count of users who registered for this exhibition
  // Using 'like' operator to match records where type contains 'register'
  const { count, error: countError } = await supabase
    .from('user_exhibition_likes')
    .select('user_id', { count: 'exact', head: true })
    .eq('exhibition_id', id)
    .like('type', '%register%');

  if (countError) {
    return new Response(JSON.stringify({ error: countError.message }), { status: 500 });
  }

  // Return exhibition data along with user count
  return new Response(JSON.stringify({ ...data, user_count: count }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}