import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  const { data, error } = await supabase
    .from('exhibitions')
    .select('*');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  // Filter out exhibitions where type is null or undefined
  const filteredData = data?.filter(exhibition => 
    exhibition.type !== null && 
    exhibition.type !== undefined && 
    exhibition.type.trim() !== ''
  ) || [];

  return new Response(JSON.stringify(filteredData), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}