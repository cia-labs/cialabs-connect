import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();
  const { scanned_by, scanned_user, interests } = body;

  if (!scanned_by || !scanned_user || !Array.isArray(interests)) {
    return new Response(JSON.stringify({ error: "Invalid input" }), {
      status: 400,
    });
  }

  // Step 1: Check for existing interaction
  const { data: existingInteraction, error: interactionError } = await supabase
    .from("qr_interactions")
    .select("*")
    .eq("scanned_by", scanned_by)
    .eq("scanned_user", scanned_user)
    .maybeSingle();

  if (interactionError) {
    return new Response(JSON.stringify({ error: interactionError.message }), {
      status: 500,
    });
  }

  if (existingInteraction) {
    return new Response(JSON.stringify({ status: "already_answered" }), {
      status: 200,
    });
  }

  // Step 2: Create interaction
  const { data: interaction, error: insertInteractionError } = await supabase
    .from("qr_interactions")
    .insert([{ scanned_by, scanned_user }])
    .select("id")
    .single();

  if (insertInteractionError || !interaction) {
    return new Response(
      JSON.stringify({ error: insertInteractionError?.message }),
      { status: 500 }
    );
  }

  const interaction_id = interaction.id;

  // Step 3: Get scanned_user's interest IDs from user_interests table
  const { data: userInterests, error: interestsError } = await supabase
    .from("user_interests")
    .select("interest_id")
    .eq("user_id", scanned_user);

  if (interestsError || !userInterests) {
    return new Response(
      JSON.stringify({
        error: interestsError?.message || "Failed to fetch user interests",
      }),
      { status: 500 }
    );
  }

  const correctInterestIds = userInterests.map((i) => i.interest_id);

  // Step 4: Prepare guesses
  const guessInserts = interests.map((interest_id: number) => ({
    interaction_id,
    interest_id,
    correct: correctInterestIds.includes(interest_id),
  }));

  const { error: guessInsertError } = await supabase
    .from("guesses")
    .insert(guessInserts);

  if (guessInsertError) {
    return new Response(JSON.stringify({ error: guessInsertError.message }), {
      status: 500,
    });
  }

  // Step 5: Score
  const score = guessInserts.filter((g) => g.correct).length;

  // Step 6: Update scanned_by's points
  console.log(scanned_by)
  console.log(score)
const { data: updatedCount, error: updatePointsError } = await supabase.rpc(
  "increment_user_points",
  {
    user_id_input: scanned_by,
    increment_by: score,
  }
);

if (updatePointsError) {
  return new Response(JSON.stringify({ error: updatePointsError.message }), {
    status: 500,
  });
}

if (updatedCount === 0) {
  return new Response(JSON.stringify({ error: "No profile updated. Invalid user_id?" }), {
    status: 404,
  });
}

  return new Response(
    JSON.stringify({
      status: "success",
      points_earned: score,
    }),
    { status: 200 }
  );
}
