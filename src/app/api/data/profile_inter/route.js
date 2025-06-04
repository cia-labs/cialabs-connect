import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET user interests by user_uuid
export async function GET(request) {
  try {
    // Extract user_uuid from URL parameters
    const { searchParams } = new URL(request.url);
    const user_uuid = searchParams.get('user_uuid');
    
    if (!user_uuid) {
      return new Response(
        JSON.stringify({ 
          error: 'user_uuid parameter is required' 
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(user_uuid)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid UUID format' 
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Query user interests with JOIN to interests table, limit to 3
    const { data, error } = await supabase
      .from('user_interests')
      .select(`
        interest_id,
        interests!inner(
          id,
          name
        )
      `)
      .eq('user_id', user_uuid)
      .limit(3);

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch user interests',
          details: error.message 
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Transform data to return only the interests
    const interests = data.map(item => ({
      id: item.interests.id,
      name: item.interests.name
    }));

    if (interests.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No interests found for this user',
          user_id: user_uuid,
          interests: [],
          count: 0
        }), 
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        user_id: user_uuid,
        interests: interests,
        count: interests.length
      }), 
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

