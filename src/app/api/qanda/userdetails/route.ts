import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const uuid = searchParams.get('uuid');

    if (!uuid) {
        return new Response(JSON.stringify({ error: 'UUID is required' }), { status: 400 });
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('profile_img, full_name, branch')
        .eq('user_id', uuid)
        .single();

    if (error) {
        console.log(error.message)
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}