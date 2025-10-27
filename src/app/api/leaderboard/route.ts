import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("leaderboard")
      .select(
        `
        *,
        teams (
          id,
          team_name
        )
      `
      )
      .order("points", { ascending: false })
      .order("matches_won", { ascending: false });

    if (error) throw error;


    const rankedData = data.map((team, index) => ({
      rank: index + 1,
      team_name: team.teams.team_name,
      matches_played: team.matches_played,
      points: team.points,
      wins: team.matches_won,
      losses: team.matches_lost,
      draws: team.matches_drawn,
    }));

    return NextResponse.json(rankedData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
