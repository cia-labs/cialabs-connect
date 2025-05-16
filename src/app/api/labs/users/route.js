import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET all user profiles
export async function GET() {
  const { data, error } = await supabase.from("Users").select("*") // table name is "users"

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

// POST a new user profile
export async function POST(req) {
  const body = await req.json()

  // Type safety
  const newUser = {
    UID: body.UID,
    DisplayName: body.DisplayName,
    AuthType: body.AuthType,
    hobbies: body.hobbies,
    profile_url: body.profile_url,
    rewards: body.rewards,
    pp_i: body.pp_i
  }

  const { data, error } = await supabase.from("Users").insert([newUser])

  if (error) {
    console.log(error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })}

  return NextResponse.json(data, { status: 201 })
}
