"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import Gradient from "@/components/HighLevelComponents/TopGradient/Gradient";

import SearchModal from "@dashboard/Search";
import GetQrScanQrBTN from "@dashboard/GetQRScan/button";
import NavBar from "@dashboard/NavBar";
import SideBar from "@dashboard/SideBar";

import { createClient } from "@/utils/supabase/client";
import { MyImage } from "@/components/Image/Image";

export default function UserPage() {
  const { uid } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setsearchOpen] = useState(false);
  const [connectionData, setConnectionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalScans, setTotalScans] = useState(0);

  const [profileData, setProfileData] = useState({
    name: "",
    profilepic: "",
  });

  // Fetch profile data
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
      console.log("id:", data.profile_img);
      setProfileData({
        name: data.full_name ?? "",
        profilepic: data.profile_img ?? "",
        points: data.points ?? 0,
      });
    }

    fetchProfile();
  }, [uid]);

  // Fetch connections data
  useEffect(() => {
    async function fetchConnections() {
      if (!uid) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/data/connections?uid=${uid}`);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch connections');
        }
        
        console.log(result);
        setConnectionData(result.data || []);
        setTotalUsers(result.total_users || 0);
        setTotalScans(result.total_scans || 0);
      } catch (err) {
        console.error('Error fetching connections:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchConnections();
  }, [uid]);

  // Skeleton component for users
  const UserSkeleton = () => (
    <div className="flex flex-row">
      <div className="w-12 h-12 bg-gray-300/20 rounded-full animate-pulse"></div>
      <div className="flex flex-col ml-5 flex-1">
        <div className="h-6 bg-gray-300/30 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-300/20 rounded animate-pulse w-1/2 mt-2"></div>
      </div>
    </div>
  );

  console.log("212", profileData.profilepic);
  
  return (
    <>
      {/* Sidebar */}
      <SideBar
        profilepic={profileData.profilepic}
        name={profileData.name}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        uid={uid}
        dashboard={true}
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
      <GetQrScanQrBTN uid={uid} />

      <div className="w-screen h-screen text-white flex flex-col ">
        {/* NAV */}
        <NavBar
          uid={uid}
          profilepic={profileData.profilepic}
          setSidebarOpen={setSidebarOpen}
          setsearchOpen={setsearchOpen}
        />

        {/* USERS SECTION */}
        <div className="flex flex-col w-full px-7">
          <div className="flex justify-between flex-col mt-8">
            <h1 className="text-xl font-semibold opacity-40">People you connected with</h1>
            {totalUsers > 0 && (
              <div className="text-sm opacity-40 mt-2.5">
                {totalScans} total scans
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="flex flex-col mt-6 gap-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <UserSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="mt-6 text-center text-red-400">Error: {error}</div>
          ) : connectionData.length === 0 ? (
            <div className="mt-6 text-center opacity-60">No connections found</div>
          ) : (
            <div className="flex flex-col mt-8 gap-8">
              {connectionData.map((connection, index) => (
                <div key={`${connection.user_id}-${index}`} className="flex flex-row items-center">
                  <div className="w-12 h-12 bg-gray-100/10 rounded-full overflow-hidden">
                    {connection.profile_img ? (
                      <MyImage 
                        src={connection.profile_img} 
                        alt={connection.full_name || 'User'} 
                        className="w-full h-full object-cover"
                        h={50}
                        w={50}
                      />
                    ) : (
                      <div className="w-full h-full bg-amber-500 flex items-center justify-center text-white font-bold">
                        {connection.full_name ? connection.full_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col ml-5 flex-1">
                    <div className="text-lg">
                      {connection.full_name || 'Unknown User'}
                    </div>
                    <div className="text-xs mt-1 opacity-40 font-bold">
                      {connection.branch || 'No branch specified'}
                    </div>
                  </div>
                  {connection.scan_count > 1 && (
                    <div className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                      {connection.scan_count} scans
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}