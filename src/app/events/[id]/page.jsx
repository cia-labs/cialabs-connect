"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Gradient from "@/components/HighLevelComponents/TopGradient/Gradient";

export default function EventCheckPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      setUserLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setUserLoading(false);
    };
    fetchUser();
  }, []);

  // Redirect authenticated users
  useEffect(() => {
    if (!userLoading && user && id) {
      window.location.href = `/dashboard/user/${user.id}/events/${id}`;
    }
  }, [user, userLoading, id]);

  // Show loading state
  if (userLoading) {
    return (
      <div className="text-white text-center w-screen h-screen flex flex-col gap-5 justify-center items-center">
        <Gradient />
        <div className="w-64 h-8 bg-gray-200/20 animate-pulse rounded-md"></div>
        <div className="w-48 h-6 bg-gray-100/10 animate-pulse rounded-md"></div>
      </div>
    );
  }

  // Show login prompt for unauthenticated users
  if (user === null) {
    localStorage.setItem("redirect", "true")
    localStorage.setItem("redirect_type", "evt")
    localStorage.setItem("redirect_type_uid", id )
    return (
      <div className="text-white text-center w-screen h-screen flex flex-col justify-center items-center">
        <Gradient />
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-semibold">Authentication Required</h1>
          <p className="text-gray-300">Please log in to view this event.</p>
          <a 
            href="/login" 
            className="underline font-bold text-[var(--primary-color)] hover:text-white transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // This shouldn't be reached due to the redirect, but just in case
  return (
    <div className="text-white text-center w-screen h-screen flex justify-center items-center">
      <Gradient />
      <div>Redirecting...</div>
    </div>
  );
}