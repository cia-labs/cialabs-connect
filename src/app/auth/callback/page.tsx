"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

const UserGreetText = () => {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkOnboarding = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("Error fetching user:", error);
        return;
      }

      setUser(user);
      const uid = user.id;

      // Step 1: Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("branch")
        .eq("user_id", uid)
        .single();

      // Step 2: Fetch user interests
      const { data: interests, error: interestsError } = await supabase
        .from("user_interests")
        .select("interest_id")
        .eq("user_id", uid);

      // Step 3: Redirect logic
      if (
        profileError ||
        !profile?.branch || // missing branch
        interestsError ||
        !interests ||
        interests.length === 0 // no interests
      ) {
        window.location.href = "/onboarding"; // 🚀 Redirect to onboarding
      } else {
        window.location.href = `/dashboard/user/${uid}`; // ✅ Profile ready
      }
    };

    checkOnboarding();
  }, []);

  return (
    <p className="relative text-white left-0 top-0 flex w-auto justify-center rounded-xl border border-gray-300 bg-gray-200 p-4 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30">
      <code className="font-mono font-bold">
        Authenticating... please wait
      </code>
    </p>
  );
};

export default UserGreetText;
