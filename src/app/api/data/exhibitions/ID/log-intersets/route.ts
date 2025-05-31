import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, event_id, type } = body;

    if (!uid || !event_id || !type) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Check if user_id and exhibition_id already exist
    const { data: existing, error: checkError } = await supabase
      .from('user_exhibition_likes')
      .select('type')
      .eq('user_id', uid)
      .eq('exhibition_id', event_id)
      .maybeSingle();

    if (checkError) {
      return new Response(JSON.stringify({ error: checkError.message }), { status: 500 });
    }

    let responseData: any = {};
    let updatedType = type;

    if (existing) {
      // If record exists, merge the types
      const existingTypes = existing.type.split(',');
      const newTypes = type.split(',');
      
      // Combine and deduplicate types
      const combinedTypes = [...new Set([...existingTypes, ...newTypes])];
      updatedType = combinedTypes.join(',');

      // Update the existing record
      const { error: updateError } = await supabase
        .from('user_exhibition_likes')
        .update({ type: updatedType })
        .eq('user_id', uid)
        .eq('exhibition_id', event_id);

      if (updateError) {
        return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
      }

      responseData.status = 'type updated';
    } else {
      // Insert new record if doesn't exist
      const { error: insertError } = await supabase
        .from('user_exhibition_likes')
        .insert([
          {
            user_id: uid,
            exhibition_id: event_id,
            type: updatedType,
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        console.log(insertError.message);
        return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
      }

      responseData.status = 'inserted';
    }

    // If the type includes 'register', fetch the exhibition URL
    if (updatedType.includes('register')) {
      const { data: exhibitionData, error: fetchError } = await supabase
        .from('exhibitions')
        .select('url')
        .eq('id', event_id)
        .single();

      if (fetchError) {
        return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 });
      }

      responseData.url = exhibitionData.url;
      responseData.registered = true;
    }

    // Check if bookmarked
    if (updatedType.includes('bookmark')) {
      responseData.bookmarked = true;
    }

    responseData.type = updatedType;

    return new Response(JSON.stringify(responseData), { status: 200 });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Server error' }), { status: 500 });
  }
}