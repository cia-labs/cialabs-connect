"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Gradient from "@/components/HighLevelComponents/TopGradient/Gradient";
import { MyImage } from "@/components/Image/Image";
import SearchModal from "@dashboard/Search";
import NavBar from "@dashboard/NavBar";
import SideBar from "@dashboard/SideBar";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Skeleton Components
const ProfileSkeleton = () => (
  <div className="border-1 border-[#717171] w-full flex flex-col justify-center items-center rounded-[7px] py-8">
    {/* Profile Image Skeleton */}
    <div className="w-52 h-52 rounded-full bg-gray-200/10 animate-pulse"></div>
    
    {/* Name Skeleton */}
    <div className="mt-6 w-48 h-8 bg-gray-200/20 animate-pulse rounded-md"></div>
    
    {/* Branch Skeleton */}
    <div className="mt-1 w-32 h-5 bg-gray-200/10 animate-pulse rounded-md"></div>
  </div>
);

const ImageWithSkeleton = ({ src, alt, w, h }) => {
  const [imageLoading, setImageLoading] = useState(true);
  
  return (
    <div className="w-40 h-40 rounded-full overflow-hidden relative">
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200/10 animate-pulse rounded-full z-10"></div>
      )}
      <MyImage
        w={w}
        h={h}
        alt={alt}
        src={src}
        onLoad={() => setImageLoading(false)}
      />
    </div>
  );
};

const ButtonSkeleton = () => (
  <div className="w-full h-[6vh] bg-gray-200/10 animate-pulse rounded-[7px] mt-8"></div>
);

const BackButtonSkeleton = () => (
  <div className="w-24 h-[6vh] bg-gray-200/10 animate-pulse rounded-[7px] mt-3"></div>
);

const NavBarSkeleton = () => (
  <div className="w-full h-16 flex flex-row items-center justify-between px-4 bg-gray-200/10 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-gray-200/20 animate-pulse"></div>
    <div className="w-32 h-6 bg-gray-200/20 animate-pulse rounded-md"></div>
    <div className="w-10 h-10 rounded-full bg-gray-200/20 animate-pulse"></div>
  </div>
);

export default function UserPage() {
  const router = useRouter();
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setsearchOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    profilepic: "",
    points: 0,
  });
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

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, profile_img")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile data:", error);
        setLoading(false);
        return;
      }

      console.log("id:", data.profile_img);
      setProfileData({
        name: data.full_name ?? "",
        profilepic: data.profile_img ?? "",
        points: data.points ?? 0,
      });
      setLoading(false);
    }
    fetchProfile();
  }, [user?.id]);

  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      const res = await fetch(`/api/qanda/userdetails?uuid=${uid}`);
      const data = await res.json();
      setProfile(data);
      console.log(profile);
      setProfileLoading(false);
    };
    fetchProfile();
  }, [uid]);

  // Show login prompt if user is not authenticated
  if (userLoading) {
    return (
      <div className="text-white text-center w-screen h-screen flex flex-row justify-center items-center">
        <div className="w-64 h-8 bg-gray-200/20 animate-pulse rounded-md"></div>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="text-white text-center w-screen h-screen flex flex-row justify-center items-center">
        Please log in to view this page.
        <a href="/login" className="underline font-bold ml-2 text-[var(--primary-color)]">
          Go to Login
        </a>
      </div>
    );
  }

  console.log("212", profileData.profilepic);

  return (
    <>
      {/* Sidebar */}
      <SideBar
        profilepic={profileData.profilepic}
        name={profileData.name}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        uid={user.id}
      />
      {/* Search */}
      <SearchModal uid={user.id} setSearchOpen={setsearchOpen} searchOpen={searchOpen} />
      {/* Top Gradient */}
      <Gradient />
      <div className="w-screen h-screen text-white flex flex-col">
        {/* NAV */}
   

       
          <NavBar
            profilepic={profileData.profilepic}
            setSidebarOpen={setSidebarOpen}
            setsearchOpen={setsearchOpen}
          />
    
        
        <div className="mt-12 w-full h-fit flex flex-col justify-center items-center px-7">
          {/* Profile Section */}
          {profileLoading ? (
            <ProfileSkeleton />
          ) : (
            <div className="border-1 border-[#717171] w-full flex flex-col justify-center items-center rounded-[7px] py-8">
              <ImageWithSkeleton
                w={200}
                h={200}
                alt="Profile Pic"
                src={
                  profile?.profile_img ||
                  "https://images.unsplash.com/photo-1748638904723-d833c6cf542b?q=80&w=2520&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
              />
              <div className="text-2xl mt-6 font-semibold">{profile?.full_name}</div>
              <div className="mt-1 opacity-40">{profile?.branch}</div>
            </div>
          )}

          {/* Answer Question Button */}
          {profileLoading ? (
            <ButtonSkeleton />
          ) : (
            <a href="/comingsoon" className="w-full h-[6vh] flex flex-row justify-center items-center gap-2 bg-[var(--primary-color)] rounded-[7px] mt-8 text-center transition-all text-black active:text-lg">
              Answer Question
            </a>
          )}

          {/* Go Back Button */}
          {profileLoading ? (
            <BackButtonSkeleton />
          ) : (
            <Link
              
                href={`/dashboard/user/${user.id}`}
              
              className="w-auto h-[6vh] underline text-[#717171] rounded-[7px] mt-4 text-center transition-all hover:text-white active:text-white active:text-[13px]"
            >
              Go Back
            </Link>
          )}
        </div>
                    <footer className="mt-auto py-4 bg-transparent">
        <div className="text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} CIA Labs
        </div>
      </footer>
      </div>
    </>
  );
}