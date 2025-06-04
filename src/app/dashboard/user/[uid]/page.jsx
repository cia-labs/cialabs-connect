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
  const [totalScans, setTotalScans] = useState(0);

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
      async function fetchConnections() {
        if (!uid) return;
        
        try {
          const response = await fetch(`/api/data/connections?uid=${uid}`);
          const result = await response.json();
          
          if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch connections');
          }
          
          console.log(result);
          
          setTotalScans(result.total_scans || 0);
        } catch (err) {
          console.error('Error fetching connections:', err);
          setError(err.message);
        } finally {
          
        }
      }
  
      fetchConnections();
  }, [uid]);

useEffect(() => {
  // Ensure we're on client side and component is mounted
  if (typeof window === "undefined" || !uid) return;
  
  // Add a small delay to ensure localStorage is set by previous page
  const timeoutId = setTimeout(() => {
    try {
      const redirect = localStorage.getItem("redirect");
      console.log("Redirect value:", redirect); // Debug log
      
      if (!redirect || redirect !== "true") return;
      
      const type = localStorage.getItem("redirect_type");
      const id = localStorage.getItem("redirect_type_uid");
      
      console.log("Redirect type:", type, "ID:", id); // Debug log
      
      // Clean up redirect keys first
      localStorage.removeItem("redirect");
      localStorage.removeItem("redirect_type");
      localStorage.removeItem("redirect_type_uid");
      
      // Perform redirects
      if (type === "evt" && id) {
        console.log("Redirecting to event:", `/dashboard/user/${uid}/events/${id}`);
        window.location.replace(`/dashboard/user/${uid}/events/${id}`);
      } else if (type === "ans" && id) {
        console.log("Redirecting to answer:", `/user/${id}/answer`);
        window.location.replace(`/user/${id}/answer`);
      }
    } catch (error) {
      console.error("Error in redirect logic:", error);
      // Clean up on error
      localStorage.removeItem("redirect");
      localStorage.removeItem("redirect_type");
      localStorage.removeItem("redirect_type_uid");
    }
  }, 100); // Small delay to ensure localStorage is available
  
  return () => clearTimeout(timeoutId);
}, [uid]);

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

    <div className="w-screen h-screen text-white flex flex-col ">
      {/* NAV */}
      <NavBar uid={uid} profilepic={profileData.profilepic} setSidebarOpen={setSidebarOpen} setsearchOpen={setsearchOpen} />

      {/* WELCOME */}
      <WelcomeData uid={uid} loading={loadingWelcome} name={profileData.name} reward={profileData.points} ppI={totalScans} />

      {/* EVENTS */}
      <Events uid={uid} />

      {/* Leaderboard */}
      <Leaderboard />

      {/* Footer */}
      <footer className="mt-auto py-4 bg-transparent mb-8">
        <div className="text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} CIA Labs
        </div>
      </footer>
    </div>
  </>
);

}
