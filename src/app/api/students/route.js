import {supabase} from "@/lib/supabase";

export async function GET(request) {
  const { data, error } = await supabase
    .from("students_50days")
    .select("name, usn, current_streak, highest_streak");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
