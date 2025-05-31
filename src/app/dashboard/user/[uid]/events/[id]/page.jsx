"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import Gradient from "@/components/HighLevelComponents/TopGradient/Gradient";
import SearchModal from "@dashboard/Search";
import NavBar from "@dashboard/NavBar";
import SideBar from "@dashboard/SideBar";
import { createClient } from "@/utils/supabase/client";
import { ExternalLink, HeartIcon } from "lucide-react";









export default function UserPage() {
  const { uid, id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setsearchOpen] = useState(false);
  const [bookmarkState , setbookmarkState] = useState("Bookmark")



  const [profileData, setProfileData] = useState({
    name: "",
    profilepic: "",
  });

  const [eventData, setEventData] = useState({
    id: "",
    title: "",
    image_url: "",
    type: "",
    description: "",
    user_count: 0
  });

  useEffect(() => {
    const supabase = createClient();

    async function fetchProfile() {
      if (!uid) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, profile_img")
        .eq("user_id", uid)
        .single();

      if (error) {
        console.error("Error fetching profile data:", error);
        return;
      }
      setProfileData({
        name: data.full_name ?? "",
        profilepic: data.profile_img ?? "",
        points: data.points ?? 0,
      });
    }

    fetchProfile();
  }, [uid]);

  useEffect(() => {
    async function fetchEvent() {
      if (!id) return;
      try {
        const res = await fetch(`/api/data/exhibitions/ID?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch event data");
        const data = await res.json();
        setEventData(data);
        console.log(data)
      } catch (err) {
        console.error("Error fetching event data:", err);
      }
    }
    fetchEvent();
  }, [id]);

  const handleVisit = async () => {
    try {
      const res = await fetch("/api/data/exhibitions/ID/log-intersets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, event_id: id, type: "register" }),
      });
      const data = await res.json();
      if (data.url) {
        // Ensure the URL has a protocol, default to https if missing
        const url = data.url.startsWith("http://") || data.url.startsWith("https://")
          ? data.url
          : `https://${data.url}`;
        window.open(url, "_blank");
      }
    } catch (err) {
      console.error("Visit failed:", err);
    }
  };


  const handleBookmark = async () => {
    try {
      await fetch("/api/data/exhibitions/ID/log-intersets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, event_id: id, type: "bookmark" }),
        
      });
            setbookmarkState("Bookmarked")

    } catch (err) {
      setbookmarkState("Failed To Bookmark")
      console.error("Bookmark failed:", err);
    }
  };
  return (
    <>
      {/* Sidebar */}
      <SideBar
        profilepic={profileData.profilepic}
        name={profileData.name}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        uid={uid}
      />

      {/* Search */}
      <SearchModal uid={uid} setSearchOpen={setsearchOpen} searchOpen={searchOpen} />

      {/* Top Gradient */}
      <Gradient />

      {/* Action Button */}
      <div className="w-screen h-screen text-white flex flex-col">
        {/* NAV */}
        <NavBar
          profilepic={profileData.profilepic}
          setSidebarOpen={setSidebarOpen}
          setsearchOpen={setsearchOpen}
        />

        {/* WELCOME */}
        <div className="px-7">
          <div className="w-full h-[27vh] bg-gray-800 rounded-[7px] mt-8 flex items-center justify-center overflow-hidden">
            {eventData.image_url && (
              <img
                src={eventData.image_url}
                alt={eventData.title}
                className="object-cover w-full h-full rounded-[7px]"
              />
            )}
          </div>

          <div className="mt-6 w-full flex flex-row justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold">{eventData.title || "Just A Sec"}</h1>
              <h2 className="mt-2 opacity-80 text-lg">{eventData.type || "almost done"}</h2>
            </div>
            <div className="flex flex-col items-center justify-center">
              <HeartIcon />
              <div className="mt-2">{eventData.user_count}</div>
            </div>
          </div>
          <div className="mt-4 opacity-40">
            {eventData.description ||
              ""}
          </div>
          <button onClick={handleVisit} className="w-full h-[6vh] flex flex-row justify-center items-center gap-2 bg-[var(--primary-color)] rounded-[7px] mt-6 text-center transition-all text-black active:text-lg">
            Visit <ExternalLink size={18} />
          </button>
          <button onClick={handleBookmark} className="w-full h-[6vh] border-2 border-[#717171] text-[#717171] active:bg-[var(--primary-color)] hover:bg-[var(--primary-color)] rounded-[7px] mt-6 text-center transition-all hover:border-none active:border-none hover:text-black acitve:text-black active:text-lg">
            {bookmarkState}
          </button>
        </div>
        {/* Leaderboard */}
      </div>
    </>
  );
}
