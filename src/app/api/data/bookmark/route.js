import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    // Validate required parameter
    if (!uid) {
      return new Response(
        JSON.stringify({ error: "uid parameter is required" }),
        { status: 400 }
      );
    }

    // Step 1: Get user exhibition likes for bookmark types
    const { data: exhibitionLikes, error: likesError } = await supabase
      .from("user_exhibition_likes")
      .select("exhibition_id, type, created_at")
      .eq("user_id", uid)
      .ilike("type", "%bookmark%")
      .order("created_at", { ascending: false });

    if (likesError) {
      return new Response(JSON.stringify({ error: likesError.message }), {
        status: 500,
      });
    }

    // Step 2: Get bookmarked users from bookmarks table
    const { data: bookmarks, error: bookmarksError } = await supabase
      .from("bookmarks")
      .select("bookmarked_user, created_at")
      .eq("bookmarked_by", uid)
      .order("created_at", { ascending: false });

    if (bookmarksError) {
      return new Response(JSON.stringify({ error: bookmarksError.message }), {
        status: 500,
      });
    }

    let bookmarkedExhibitions = [];
    let bookmarkedUsers = [];

    // Process bookmarked exhibitions
    if (exhibitionLikes && exhibitionLikes.length > 0) {
      const exhibitionIds = [...new Set(exhibitionLikes.map(like => like.exhibition_id))];
      
      const { data: exhibitions, error: exhibitionsError } = await supabase
        .from("exhibitions")
        .select("id, title, type")
        .in("id", exhibitionIds);

      if (exhibitionsError) {
        return new Response(
          JSON.stringify({ error: exhibitionsError.message }),
          { status: 500 }
        );
      }

      bookmarkedExhibitions = exhibitions || [];
    }

    // Process bookmarked users
    if (bookmarks && bookmarks.length > 0) {
      const bookmarkedUserIds = bookmarks.map(bookmark => bookmark.bookmarked_user);

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name, profile_img, branch")
        .in("user_id", bookmarkedUserIds);

      if (profilesError) {
        return new Response(JSON.stringify({ error: profilesError.message }), {
          status: 500,
        });
      }

      // Combine bookmark data with profile data
      bookmarkedUsers = bookmarks.map(bookmark => {
        const profile = profiles?.find(p => p.user_id === bookmark.bookmarked_user);
        return {
          user_id: bookmark.bookmarked_user,
          bookmarked_at: bookmark.created_at,
          profile: {
            full_name: profile?.full_name || null,
            profile_img: profile?.profile_img || null,
            branch: profile?.branch || null,
          }
        };
      });
    }

    // Prepare response based on what data we have
    const response = {
      message: "Bookmarks retrieved successfully",
    };

    // If user has both exhibitions and users bookmarked
    if (bookmarkedExhibitions.length > 0 && bookmarkedUsers.length > 0) {
      response.data = {
        exhibitions: bookmarkedExhibitions,
        users: bookmarkedUsers
      };
      response.count = {
        exhibitions: bookmarkedExhibitions.length,
        users: bookmarkedUsers.length,
        total: bookmarkedExhibitions.length + bookmarkedUsers.length
      };
    }
    // If user has only bookmarked exhibitions
    else if (bookmarkedExhibitions.length > 0) {
      response.data = {
        exhibitions: bookmarkedExhibitions
      };
      response.count = {
        exhibitions: bookmarkedExhibitions.length,
        total: bookmarkedExhibitions.length
      };
    }
    // If user has only bookmarked users
    else if (bookmarkedUsers.length > 0) {
      response.data = {
        users: bookmarkedUsers
      };
      response.count = {
        users: bookmarkedUsers.length,
        total: bookmarkedUsers.length
      };
    }
    // If user has no bookmarks
    else {
      response.message = "No bookmarks found";
      response.data = {};
      response.count = { total: 0 };
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("API Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
