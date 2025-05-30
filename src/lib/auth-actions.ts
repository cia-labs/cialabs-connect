"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error, data: sessionData } = await supabase.auth.signInWithPassword(
    data
  );

  if (error || !sessionData.user) {
    redirect("/error");
  }

  const uid = sessionData.user.id;

  revalidatePath("/", "layout");
  redirect(`/dashboard/user/${uid}`);
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: `${firstName + " " + lastName}`,
        email: formData.get("email") as string,
      },
    },
  };

  const { error, data: sessionData } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");

  }
  const uid = sessionData.user.id;
  revalidatePath("/", "layout");
  redirect(`/dashboard/user/${uid}`);
}

export async function signout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/logout");
}

export async function signInWithGoogle(redirectTo : string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo      
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect(data.url); // this takes the user to Google
}
