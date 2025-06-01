"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import Gradient from "@/components/HighLevelComponents/TopGradient/Gradient";

import SearchModal from "@dashboard/Search";
import GetQrScanQrBTN from "@dashboard/GetQRScan/button";
import NavBar from "@dashboard/NavBar";
import SideBar from "@dashboard/SideBar";

import { createClient } from "@/utils/supabase/client";

export default function UserPage() {
  const { uid } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setsearchOpen] = useState(false);
  const [bookmarkData, setBookmarkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setProfileData({
        name: data.full_name ?? "",
        profilepic: data.profile_img ?? "",
        points: data.points ?? 0,
      });
    }

    fetchProfile();
  }, [uid]);

  // Fetch bookmark data
  useEffect(() => {
    async function fetchBookmarks() {
      if (!uid) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/data/bookmark?uid=${uid}`);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch bookmarks');
        }
        setBookmarkData(result.data || []);
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBookmarks();
  }, [uid]);

  // Get all unique exhibitions from all bookmarked users
  const allExhibitions = bookmarkData.reduce((acc, bookmark) => {
    if (bookmark.exhibitions && bookmark.exhibitions.length > 0) {
      bookmark.exhibitions.forEach(exhibition => {
        if (exhibition && !acc.find(ex => ex.id === exhibition.id)) {
          acc.push(exhibition);
        }
      });
    }
    return acc;
  }, []);

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

  // Skeleton component for exhibitions
  const ExhibitionSkeleton = () => (
    <div className="flex flex-row">
      <div className="flex flex-col flex-1">
        <div className="h-6 bg-gray-300/30 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-300/20 rounded animate-pulse w-1/2 mt-2"></div>
      </div>
    </div>
  );

  
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
          bookmark={true}
          profilepic={profileData.profilepic}
          setSidebarOpen={setSidebarOpen}
          setsearchOpen={setsearchOpen}
        />

        {/* USERS SECTION */}
        <div className="flex flex-col w-full px-7">
          <h1 className="mt-8 text-xl font-semibold opacity-40">Users</h1>
          
          {loading ? (
            <div className="flex flex-col mt-6 gap-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <UserSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="mt-6 text-center text-red-400">Error: {error}</div>
          ) : bookmarkData.length === 0 ? (
            <div className="mt-6 text-center opacity-60">No bookmarked users found</div>
          ) : (
            <div className="flex flex-col mt-8 gap-7">
              {bookmarkData.map((bookmark, index) => (
                <div key={`${bookmark.bookmarked_user}-${index}`} className="flex flex-row">
                  <div className="w-12 h-12 bg-amber-500 rounded-full overflow-hidden">
                    {bookmark.profile.profile_img ? (
                      <img 
                        src={bookmark.profile.profile_img} 
                        alt={bookmark.profile.full_name || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-amber-500 flex items-center justify-center text-white font-bold">
                        {bookmark.profile.full_name ? bookmark.profile.full_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col ml-5">
                    <div className="text-lg">
                      {bookmark.profile.full_name || 'Unknown User'}
                    </div>
                    <div className="text-xs mt-1 opacity-40 font-bold">
                      {bookmark.profile.branch || 'No branch specified'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EXHIBITIONS SECTION */}
        <div className="flex flex-col w-full px-7">
          <h1 className="mt-10 text-xl font-semibold opacity-40">Exhibitions</h1>
          
          {loading ? (
            <div className="flex flex-col mt-6 gap-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <ExhibitionSkeleton key={index} />
              ))}
            </div>
          ) : allExhibitions.length === 0 ? (
            <div className="mt-6 text-center opacity-60">No bookmarked exhibitions found</div>
          ) : (
            <div className="flex flex-col mt-6 gap-5">
              {allExhibitions.map((exhibition, index) => (
                <a href={`/dashboard/user/${uid}/events/${exhibition.id}`} key={`${exhibition.id}-${index}`} className="flex flex-row">
                  <div className="flex flex-col">
                    <div className="text-lg">
                      
                      {exhibition.title || 'Untitled Exhibition'}
                    </div>
                    <div className="text-xs mt-1 opacity-40 font-bold">
                      {exhibition.type || 'No type specified'}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}