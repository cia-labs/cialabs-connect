"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import Gradient from "@/components/HighLevelComponents/TopGradient/Gradient";
import SearchModal from "@dashboard/Search";
import NavBar from "@dashboard/NavBar";
import SideBar from "@dashboard/SideBar";
import { createClient } from "@/utils/supabase/client";
import { ExternalLink, HeartIcon } from "lucide-react";
import { MyImage } from "@/components/Image/Image";

function SkeletonCard() {
  return (
    <div className="w-full">
      {/* Image Skeleton */}
      <div className="w-full h-[27vh] bg-gray-300/20 rounded-[7px] mt-8 animate-pulse"></div>

      {/* Title and Stats Section */}
      <div className="mt-6 w-full flex flex-row justify-between">
        <div className="flex flex-col flex-1 mr-4">
          {/* Title Skeleton */}
          <div className="h-8 bg-gray-300/30 rounded animate-pulse w-3/4"></div>
          {/* Type Skeleton */}
          <div className="h-6 bg-gray-300/5 rounded animate-pulse w-1/2 mt-2"></div>
        </div>

        {/* Heart Icon and Count Skeleton */}
        <div className="flex flex-col items-center justify-center">
          {/* Heart Icon Skeleton */}
          <div className="w-6 h-6 bg-gray-300/10 rounded animate-pulse"></div>
          {/* Count Skeleton */}
          <div className="w-8 h-5 bg-gray-300/15 rounded animate-pulse mt-2"></div>
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-300/20 rounded animate-pulse w-full"></div>
        <div className="h-4 bg-gray-300/20 rounded animate-pulse w-5/6"></div>
        <div className="h-4 bg-gray-300/20 rounded animate-pulse w-3/4"></div>
      </div>

      {/* Visit Button Skeleton */}
      <div className="w-full h-[6vh] bg-gray-300/10 rounded-[7px] mt-6 animate-pulse"></div>

      {/* Bookmark Button Skeleton */}
      <div className="w-full h-[6vh] bg-gray-300/10x rounded-[7px] mt-6 animate-pulse"></div>
    </div>
  );
}

export default function UserPage() {
  const { uid, id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setsearchOpen] = useState(false);
  const [bookmarkState, setbookmarkState] = useState("Bookmark");

  const [imgLoaded, setImageLoaded] = useState(false);

  const [Text, setTextLoaded] = useState(false);

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
    user_count: 0,
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
        console.log(data);
        setTextLoaded(true);
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
        const url =
          data.url.startsWith("http://") || data.url.startsWith("https://")
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
      setbookmarkState("Bookmarked");
    } catch (err) {
      setbookmarkState("Failed To Bookmark");
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
      <SearchModal
        uid={uid}
        setSearchOpen={setsearchOpen}
        searchOpen={searchOpen}
      />

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
  {Text ? (
    <>
      <div className="w-full h-[27vh] rounded-[7px] mt-8 flex items-center justify-center overflow-hidden relative bg-gray-200/20">
        {eventData.image_url ? (
          <>
            {/* Show skeleton while image loads */}
            {!imgLoaded && (
              <div className="absolute inset-0 bg-gray-300/20 animate-pulse rounded-[7px]"></div>
            )}
            
            {/* Image - always rendered but with opacity control */}
            <MyImage
              w={380}
              h={0}
              src={eventData.image_url}
              alt={eventData.title}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover rounded-[7px] transition-opacity duration-300 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          // Fallback when no image URL
          <div className="w-full h-full bg-gray-300/20 rounded-[7px] flex items-center justify-center">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
      </div>

      <div className="mt-6 w-full flex flex-row justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold">
            {eventData.title || "Just A Sec"}
          </h1>
          <h2 className="mt-2 opacity-80 text-lg">
            {eventData.type || "almost done"}
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center">
          <HeartIcon />
          <div className="mt-2">{eventData.user_count}</div>
        </div>
      </div>

      <div className="mt-4 opacity-40">
        {eventData.description || ""}
      </div>

      <button
        onClick={handleVisit}
        className="w-full h-[6vh] flex flex-row justify-center items-center gap-2 bg-[var(--primary-color)] rounded-[7px] mt-6 text-center transition-all text-black active:text-lg"
      >
        Visit <ExternalLink size={18} />
      </button>

      <button
        onClick={handleBookmark}
        className="w-full h-[6vh] border-2 border-[#717171] text-[#717171] active:bg-[var(--primary-color)] hover:bg-[var(--primary-color)] rounded-[7px] mt-6 text-center transition-all hover:border-none active:border-none hover:text-black active:text-black active:text-lg"
      >
        {bookmarkState}
      </button>
    </>
  ) : (
    <SkeletonCard />
  )}
</div>
      </div>
    </>
  );
}
