"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

const UserGreetText = () => {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);
  if (user !== null) {
    console.log(user);
    return (
      <div className=" text-center">
      <div
        className=" relative left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 
        backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30"
      >
        <p>Welcome</p> <p className=" ml-2 font-bold">
          {user.user_metadata.full_name ?? "user"}
        
        </p>
        
      </div>
      <div className="mt-2 text-sm opacity-40">{user.email ?? "user"}</div>
</div>
    );
  }
  return (
    <p
      className="relative left-0 top-0 flex w-auto justify-center rounded-xl border border-gray-300 bg-gray-200 p-4 
backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30
"
    >

      <code className="font-mono font-bold">Please <a href="/login" className=" underline">Login</a></code>
    </p>
  );
};

export default UserGreetText;