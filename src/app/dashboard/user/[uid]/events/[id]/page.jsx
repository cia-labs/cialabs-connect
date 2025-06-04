"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import Gradient from "@/components/HighLevelComponents/TopGradient/Gradient";
import SearchModal from "@dashboard/Search";
import NavBar from "@dashboard/NavBar";
import SideBar from "@dashboard/SideBar";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import { createClient } from "@/utils/supabase/client";
import {
  
  CheckCheck,
  ExternalLink,

  User,
} from "lucide-react";
import { MyImage } from "@/components/Image/Image";
import {
  
  GitHub,
  Instagram,
  LinkedIn,
  StarBorderRounded,
  WhatsApp,
} from "@mui/icons-material";

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

      {/* Social Links Skeleton - Dynamic width based on potential links */}
      <div className="mt-6">
        <div className="flex flex-row h-full w-full justify-center items-center gap-4 opacity-40">
          {/* Show skeleton for potential social links */}
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div
              key={index}
              className="flex-1 flex justify-center p-2 py-3 border-2 border-gray-300/20 rounded-[7px] animate-pulse"
            >
              <div className="w-6 h-6 bg-gray-300/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Visit Button Skeleton */}
      <div className="w-full h-[6vh] bg-gray-300/10 rounded-[7px] mt-6 animate-pulse"></div>

      {/* About section skeleton */}
      <div className="mt-6">
        <div className="h-4 bg-gray-300/20 rounded animate-pulse w-1/3"></div>
        <div className="w-full h-[2px] bg-gray-300/20 mt-2 mb-5"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300/15 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-gray-300/15 rounded animate-pulse w-4/5"></div>
          <div className="h-4 bg-gray-300/15 rounded animate-pulse w-3/5"></div>
        </div>
      </div>

      {/* Bookmark Button Skeleton */}
      <div className="w-full h-[6vh] bg-gray-300/10 rounded-[7px] mt-6 mb-20 animate-pulse"></div>
    </div>
  );
}

export default function UserPage() {
  const { uid, id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setsearchOpen] = useState(false);
  const [bookmarkState, setbookmarkState] = useState(
    <>
      Show Interset <StarBorderRounded />
    </>
  );
  const [vtext, setVText] = useState("Visit");
  const [imgLoaded, setImageLoaded] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  const [Text, setTextLoaded] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    profilepic: "",
  });

  const [eventData, setEventData] = useState({
    id: "",
    title: "",
    image_url: "",
    socialmediaHangles: "",
    type: "",
    website_url: "",
    description: "",
    instalink: "",
    whatapplink: "",
    githublink: "",
    linkedinlink: "",
    user_count: 0,
  });

  // Function to get available social links
  const getAvailableSocialLinks = () => {
    const links = [];

    if (eventData.instalink) {
      links.push({
        name: "Instagram",
        url: eventData.instalink,
        icon: <Instagram />,
        key: "instagram",
      });
    }

    if (eventData.linkedinlink) {
      links.push({
        name: "LinkedIn",
        url: eventData.linkedinlink,
        icon: <LinkedIn />,
        key: "linkedin",
      });
    }

    if (eventData.githublink) {
      links.push({
        name: "GitHub",
        url: eventData.githublink,
        icon: <GitHub />,
        key: "github",
      });
    }

    if (eventData.whatapplink) {
      links.push({
        name: "WhatsApp",
        url: eventData.whatapplink,
        icon: <WhatsApp />,
        key: "whatsapp",
      });
    }

    // Add external link if socialmediaHangles exists
    if (eventData.website_url) {
      console.log(eventData.website_url);
      links.push({
        name: "External Link",
        url: eventData.website_url,
        icon: <ExternalLink />,
        key: "external",
      });
    }

    return links;
  };

  // Function to ensure URL has proper protocol
  const formatUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  // Scroll handler for floating button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Show floating button when scrolled down more than one viewport height
      setShowFloatingButton(scrollPosition > windowHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      setVText("Loading");
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
        // Use location.href for better mobile compatibility
        window.location.href = url;
        window.location.reload;
      }
    } catch (err) {
      console.error("Visit failed:", err);
    }
  };

  const handleBookmark = async () => {
    setbookmarkState(
      <>
        Intersted <CheckCheck />
      </>
    );
    try {
      await fetch("/api/data/exhibitions/ID/log-intersets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, event_id: id, type: "bookmark" }),
      });
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

      {/* Floating Interested Button */}
      {showFloatingButton && Text && (
        <div className="fixed bottom-10 left-0 right-0 px-7 z-50">
          <button
            onClick={handleBookmark}
            className="w-full h-[6vh] flex flex-row justify-center items-center gap-2 bg-[var(--primary-color)] rounded-[7px] text-center transition-all text-black active:text-lg shadow-lg backdrop-blur-sm"
          >
            {bookmarkState}
          </button>
        </div>
      )}

      {/* Action Button */}
      <div className="w-screen h-screen text-white flex flex-col">
        {/* NAV */}
        <NavBar
          uid={uid}
          profilepic={profileData.profilepic}
          setSidebarOpen={setSidebarOpen}
          setsearchOpen={setsearchOpen}
        />

        {/* WELCOME */}
        <div className="px-7">
          {Text ? (
            <>
              <div className="w-full h-[27vh] rounded-[7px] mt-12 flex items-center justify-center overflow-hidden relative bg-gray-200/20">
                {eventData.image_url ? (
                  <>
                    {/* Show skeleton while image loads */}
                    {!imgLoaded && (
                      <div className="absolute inset-0 bg-gray-300/20 animate-pulse rounded-[7px]"></div>
                    )}

                    {/* Image - always rendered but with opacity control */}
                    <MyImage
                      fill
                      src={eventData.image_url}
                      alt={eventData.title}
                      onLoad={() => setImageLoaded(true)}
                      className={`w-full h-full object-cover rounded-[7px] transition-opacity duration-300 ${
                        imgLoaded ? "opacity-100" : "opacity-0"
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

              <div className="mt-6 w-full flex flex-col">
                <div className="flex flex-row w-full justify-between items-center">
                  <div>
                    {" "}
                    <h1 className="text-3xl font-semibold">
                      {eventData.title || "Just A Sec"}
                    </h1>
                    <h2 className="mt-1 opacity-80 text-sm">
                      {eventData.type || "almost done"}
                    </h2>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-start mt-6 opacity-40">
                  <User scale={1} />
                  <div className="ml-2">{eventData.user_count}</div>
                  <div className="ml-2">People Showed Intersets</div>
                </div>
              </div>

              {/* Dynamic Social Links Section */}
              {getAvailableSocialLinks().length > 0 && (
                <div className="mt-6">
                  <div
                    className={`flex flex-row h-full w-full justify-center items-center gap-4 opacity-40`}
                  >
                    {getAvailableSocialLinks().map((link) => (
                      <a
                        key={link.key}
                        className={`flex-1 flex justify-center p-2 py-3 border-2 border-gray-500 rounded-[7px] hover:opacity-100 transition-opacity duration-200`}
                        href={formatUrl(link.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.name}
                      >
                        {link.icon}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <button
                  onClick={handleBookmark}
                  className="w-full h-[6vh] flex flex-row justify-center items-center  gap-2 bg-[var(--primary-color)] rounded-[7px] mt-6 text-center transition-all text-black active:text-lg"
                >
                  {bookmarkState}
                </button>
              </div>

              <div className=" text-xs font-semibold mt-6 opacity-30">
                About the exhibitions{" "}
              </div>
              <div className=" w-full h-[2px] bg-white/20 mt-2 mb-5"></div>

              <MarkdownRenderer content={eventData?.description} />

              <div className="w-full h-30"></div>
            </>
          ) : (
            <SkeletonCard />
          )}
        </div>
      </div>
    </>
  );
}
