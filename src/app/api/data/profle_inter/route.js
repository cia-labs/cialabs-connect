import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return new Response(
        JSON.stringify({
          error: "uid parameter is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Try to use the stored procedure first
    const { data, error } = await supabase.rpc(
      "get_user_interests_by_scanner",
      {
        scanner_uid: uid,
      }
    );

    if (error) {
      console.error("Stored procedure error:", error);

      // Fallback to manual query
      const { data: interactions, error: fallbackError } = await supabase
        .from("qr_interactions")
        .select(
          `
          scanned_user,
          guesses!inner(
            interest_id
          )
        `
        )
        .eq("scanned_by", uid);

      if (fallbackError) {
        console.error("Fallback query error:", fallbackError);
        return new Response(
          JSON.stringify({
            error: "Database error",
            message: "Failed to fetch user interests data",
            details: fallbackError.message,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Process fallback data
      // Process fallback data with top 3 interests per scanned_user
      const interestMap = new Map();

      interactions.forEach(({ scanned_user, guesses }) => {
        if (!interestMap.has(scanned_user)) {
          interestMap.set(scanned_user, new Map());
        }

        const userMap = interestMap.get(scanned_user);
        guesses.forEach(({ interest_id }) => {
          userMap.set(interest_id, (userMap.get(interest_id) || 0) + 1);
        });
      });

      const result = [];

      for (const [scanned_user, interestCounts] of interestMap.entries()) {
        const top3 = Array.from(interestCounts.entries())
          .map(([interest_id, count]) => ({ scanned_user, interest_id, count }))
          .sort((a, b) => b.count - a.count || a.interest_id - b.interest_id)
          .slice(0, 3);

        result.push(...top3);
      }

      result.sort((a, b) => {
        if (a.scanned_user !== b.scanned_user) {
          return a.scanned_user.localeCompare(b.scanned_user);
        }
        return b.count - a.count;
      });

      return new Response(
        JSON.stringify({
          message: "User interests retrieved successfully (fallback)",
          data: result,
          total_entries: result.length,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return stored procedure results
    return new Response(
      JSON.stringify({
        message: "User interests retrieved successfully",
        data: data,
        total_entries: data.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
