"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import Gradient from "@/components/HighLevelComponents/TopGradient/Gradient";

import WelcomeData from "@dashboard/Welcome-Data";
import Events from "@dashboard/Events";
import Leaderboard from "@dashboard/Leaderboard";
import SearchModal from "@dashboard/Search";
import GetQrScanQrBTN from "@dashboard/GetQRScan/button";
import NavBar from "@dashboard/NavBar";
import SideBar from "@dashboard/SideBar";

import { createClient } from "@/utils/supabase/client";

export default function UserPage() {
  const { uid } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setsearchOpen] = useState(false);

  const [loadingWelcome, setloadingWelcome] = useState(true)

  const [profileData, setProfileData] = useState({
    name: "",
    profilepic: "",
    points: 0,
  });

  useEffect(() => {
    const supabase = createClient();

    async function fetchProfile() {
      if (!uid) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, profile_img, points")
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
      setloadingWelcome(false)
    }

    fetchProfile();
  }, [uid]);

  console.log("212",profileData.profilepic)
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
    <GetQrScanQrBTN uid={uid} />

    <div className="w-screen h-screen text-white flex flex-col mt-6">
      {/* NAV */}
      <NavBar uid={uid} profilepic={profileData.profilepic} setSidebarOpen={setSidebarOpen} setsearchOpen={setsearchOpen} />

      {/* WELCOME */}
      <WelcomeData loading={loadingWelcome} name={profileData.name} reward={profileData.points} ppI={12} />

      {/* EVENTS */}
      <Events uid={uid} />

      {/* Leaderboard */}
      <Leaderboard />

      {/* Footer */}
      <footer className="mt-auto py-4 bg-transparent">
        <div className="text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} CIA Labs
        </div>
      </footer>
    </div>
  </>
);

}
