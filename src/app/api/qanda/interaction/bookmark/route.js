import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { bookmarked_by, bookmarked_user } = body;

    // Validate required fields
    if (!bookmarked_by || !bookmarked_user) {
      return new Response(
        JSON.stringify({ error: 'bookmarked_by and bookmarked_user are required' }), 
        { status: 400 }
      );
    }

    // Insert into the table
    const { data, error } = await supabase
      .from('bookmarks') // Replace with your actual table name
      .insert([
        {
          bookmarked_by,
          bookmarked_user,
          // created_at will be automatically set by Supabase if it has a default value
          // id will be auto-generated if it's set as auto-increment
        }
      ])
      .select(); // This returns the inserted row(s)

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }), 
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ 
      message: 'Bookmark created successfully', 
      data 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON or server error' }), 
      { status: 400 }
    );
  }
}

// Optional: GET method to retrieve bookmarks
