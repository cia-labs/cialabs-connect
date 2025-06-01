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

    // Step 1: Get bookmarked users from bookmarks table
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

    if (!bookmarks || bookmarks.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No bookmarks found",
          data: [],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Extract bookmarked user IDs
    const bookmarkedUserIds = bookmarks.map(
      (bookmark) => bookmark.bookmarked_user
    );

    // Step 2: Get user profiles for bookmarked users
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, full_name, profile_img, branch")
      .in("user_id", bookmarkedUserIds);

    if (profilesError) {
      return new Response(JSON.stringify({ error: profilesError.message }), {
        status: 500,
      });
    }

    // Step 3: Get user exhibition likes with type containing 'bookmark'
    // Using ilike for pattern matching - more reliable approach
    const { data: exhibitionLikes, error: likesError } = await supabase
      .from("user_exhibition_likes")
      .select("user_id, exhibition_id, type, created_at")
      .eq("user_id", uid)
      .ilike("type", "%bookmark%");
    if (likesError) {
      return new Response(JSON.stringify({ error: likesError.message }), {
        status: 500,
      });
    }
    console.log(exhibitionLikes);

    // Step 4: Get exhibition IDs from filtered likes
    const exhibitionIds =
      exhibitionLikes
        ?.filter((like) => like.type && like.type.includes("bookmark"))
        .map((like) => like.exhibition_id) || [];
    console.log(exhibitionIds);
    let exhibitions = [];
    if (exhibitionIds.length > 0) {
      // Remove duplicates
      const uniqueExhibitionIds = [...new Set(exhibitionIds)];

      // Step 5: Get exhibition details
      const { data: exhibitionsData, error: exhibitionsError } = await supabase
        .from("exhibitions")
        .select("id, title, type")
        .in("id", uniqueExhibitionIds);

      if (exhibitionsError) {
        return new Response(
          JSON.stringify({ error: exhibitionsError.message }),
          { status: 500 }
        );
      }
      console.log(exhibitionsData)
      exhibitions = exhibitionsData || [];
    }

    // Step 6: Combine all data
    const result = bookmarks.map((bookmark) => {
      // Find corresponding profile
      const profile = profiles?.find(
        (p) => p.user_id === bookmark.bookmarked_user
      );

      // Find corresponding exhibition likes for this user
      const userExhibitionLikes =
        exhibitionLikes?.filter(
          (like) =>
            like.user_id === bookmark.bookmarked_user &&
            like.type &&
            like.type.includes("bookmark")
        ) || [];

      // Get exhibitions for this user
      const userExhibitions = userExhibitionLikes
        .map((like) => {
          return exhibitions.find((ex) => ex.id === like.exhibition_id);
        })
        .filter(Boolean); // Remove any undefined values

      return {
        bookmarked_user: bookmark.bookmarked_user,
        bookmarked_at: bookmark.created_at,
        profile: {
          full_name: profile?.full_name || null,
          profile_img: profile?.profile_img || null,
          branch: profile?.branch || null,
        },
        exhibitions: exhibitions,
      };
    });

    return new Response(
      JSON.stringify({
        message: "Bookmarks retrieved successfully",
        count: result.length,
        data: result,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("API Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

// Optional: POST method to add a bookmark
