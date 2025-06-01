"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Gradient from "@/components/HighLevelComponents/TopGradient/Gradient";
import { MyImage } from "@/components/Image/Image";
import SearchModal from "@dashboard/Search";
import NavBar from "@dashboard/NavBar";
import SideBar from "@dashboard/SideBar";
import { MultiSelectComboBox } from "@/components/ui/ComboBox";
import { BookmarkAdd, Dashboard } from "@mui/icons-material";

const interests = [
  "Music",
  "Sports",
  "Travel",
  "Reading",
  "Movies",
  "Technology",
  "Gaming",
  "Cooking",
  "Fitness",
  "Photography",
  "Art",
  "Dancing",
  "Writing",
  "Fashion",
  "Gardening",
  "Volunteering",
  "DIY",
  "Pets",
  "Science",
  "Finance",
];

// Create mapping from interest name to ID
const interestMap = {
  Music: 1, // Not in CSV, assuming ID 1
  Sports: 2,
  Travel: 3,
  Reading: 4,
  Movies: 5,
  Technology: 6,
  Gaming: 7,
  Cooking: 8,
  Fitness: 9,
  Photography: 10,
  Art: 11,
  Dancing: 12,
  Writing: 13,
  Fashion: 14,
  Gardening: 15,
  Volunteering: 16,
  DIY: 17,
  Pets: 18,
  Science: 19,
  Finance: 20,
};

// Skeleton Components
const ProfileSkeleton = () => (
  <div className="w-full flex flex-row items-center rounded-[7px] py-8">
    {/* Profile Image Skeleton */}
    <div className="w-16 h-16 rounded-full bg-gray-200/10 animate-pulse"></div>
    {/* Name Skeleton */}
    <div className="ml-4 w-48 h-6 bg-gray-200/20 animate-pulse rounded-md"></div>
  </div>
);

const ImageWithSkeleton = ({ src, alt, w, h }) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="w-16 h-16 rounded-full overflow-hidden relative">
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

const InterestsSkeleton = () => (
  <>
    <div className="w-full text-start mt-4">
      <div className="w-64 h-6 bg-gray-200/20 animate-pulse rounded-md"></div>
    </div>
    <div className="w-full mt-6">
      <div className="w-full h-12 bg-gray-200/10 animate-pulse rounded-md"></div>
    </div>
  </>
);

const ButtonSkeleton = () => (
  <div className="w-full h-[55px] bg-gray-200/10 animate-pulse rounded-[7px] mt-10"></div>
);

export default function UserPage() {
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [placeholder, setPlaceholder] = useState("Select An Option");
  const [color, setColor] = useState("gray-400");
  const [branch, setBranch] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [bookmarkText, setbookmarktext] = useState("Bookmark")

  // Overlay states
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [showAlreadyAnsweredOverlay, setShowAlreadyAnsweredOverlay] = useState(false);
  const [showFailureOverlay, setShowFailureOverlay] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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

      setProfileData({
        name: data.full_name ?? "",
        profilepic: data.profile_img ?? "",
        points: data.points ?? 0,
      });
      localStorage.getItem("user_uid", user?.id);
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
      setProfileLoading(false);
    };
    fetchProfile();
  }, [uid]);

  const handleBookmark = async () => {
    try {
      const response = await fetch("/api/qanda/interaction/bookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookmarked_by: user?.id,
          bookmarked_user: uid,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setbookmarktext("Bookmarked")
        console.log("Bookmark added successfully:", data);
        // You can add a toast notification here
      } else {
        alert("Already bookmarked")
        console.log("Error adding bookmark:", data.error);
      }
    } catch (error) {
      console.log("Error bookmarking user:", error);
    }
  };



  const closeOverlays = () => {
    setShowSuccessOverlay(false);
    setShowAlreadyAnsweredOverlay(false);
    setShowFailureOverlay(false);
  };

  const handleSubmit = async () => {
    // Validation
    console.log(branch);
    if (!branch || branch.length === 0) {
      setColor("red-500");
      setPlaceholder("Please select at least one interest");
      return;
    }

    setSubmitting(true);

    try {
      const interestIds = branch.map((name) => interestMap[name]);

      const response = await fetch("/api/qanda/interaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scanned_by: user?.id,
          scanned_user: uid,
          interests: interestIds,
        }),
      });

      const data = await response.json();
      console.log("Server response:", data);

      // Handle different response statuses
      if (response.ok) {
        if (data.status === "success") {
          setPointsEarned(data.points_earned);
          setShowSuccessOverlay(true);
        } else if (data.status === "already_answered") {
          setShowAlreadyAnsweredOverlay(true);
        }
      } else {
        // Show failure overlay for any error response
        setShowFailureOverlay(true);
      }

      // Reset validation styling on success
      setColor("gray-400");
      setPlaceholder("Select An Option");
    } catch (error) {
      console.error("Error submitting interaction:", error);
      setShowFailureOverlay(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Show login prompt if user is not authenticated
  if (userLoading) {
    return (
      <div className="text-white text-center w-screen h-screen flex flex-col gap-5 justify-center items-center">
        <Gradient />
        <div className="w-64 h-8 bg-gray-200/20 animate-pulse rounded-md"></div>
        <div className="w-72 h-8 bg-gray-100/10 animate-pulse rounded-md"></div>
        <div className="w-64 h-8 bg-gray-100/40 animate-pulse rounded-md"></div>
        <div className="w-80 h-8 bg-gray-200/30 animate-pulse rounded-md"></div>
        <div className=" flex flex-row gap-5">
          <div className="w-22 h-8 bg-gray-100/40 animate-pulse rounded-md"></div>
          <div className="w-32 h-8 bg-gray-200/30 animate-pulse rounded-md"></div>
          <div className="w-8 h-8 bg-gray-200/30 animate-pulse rounded-full"></div>
        </div>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="text-white text-center w-screen h-screen flex flex-row justify-center items-center">
        Please log in to view this page.
        <a
          href="/login"
          className="underline font-bold ml-2 text-[var(--primary-color)]"
        >
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <>
      {/* Sidebar */}
      <SideBar
        profilepic={profileData.profilepic}
        name={profileData.name}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        uid={user.id}
        dashboard={true}
      />
      {/* Search */}
      <SearchModal
        uid={user.id}
        setSearchOpen={setSearchOpen}
        searchOpen={searchOpen}
      />

      {/* Success Overlay */}
      {showSuccessOverlay && (
        <div className="w-screen h-screen bg-black/30 fixed top-0 backdrop-blur-2xl z-50 flex flex-col justify-center items-center text-center text-lg">
          <div className="text-9xl">🏆</div>
          <div className="text-white mt-8 text-xl font-semibold">
            Congrats you got +{pointsEarned} Points
          </div>
          <div className="w-full px-7 flex flex-col mt-8">
            <a 
              href={`/dashboard/user/${user?.id}`}
              className="w-full h-[6vh] flex flex-row justify-center items-center gap-2 bg-[var(--primary-color)] rounded-[7px] mt-6 text-center transition-all text-black active:text-lg"
            >
              Go to Dashboard <Dashboard size={18} />
            </a>
            <button 
              onClick={handleBookmark}
              className="w-full h-[6vh] underline opacity-40 text-white active:bg-[var(--primary-color)] hover:bg-[var(--primary-color)] rounded-[7px] mt-6 text-center transition-all hover:border-none active:border-none hover:text-black active:text-black active:text-lg"
            >
              {bookmarkText} {profile?.full_name} <BookmarkAdd className="ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Already Answered Overlay */}
      {showAlreadyAnsweredOverlay && (
        <div className="w-screen h-screen bg-black/30 fixed top-0 backdrop-blur-2xl z-50 flex flex-col justify-center items-center text-center text-lg">
          <div className="text-9xl">☠️</div>
          <div className="text-white mt-8 text-xl font-semibold">
            Fam Already Answered
          </div>
          <div className="w-full px-7 flex flex-col mt-3">
            <a 
            href={`/dashboard/user/${user?.id}`}
              
              className="w-full h-[6vh] flex flex-row justify-center items-center gap-2 bg-[var(--primary-color)] rounded-[7px] mt-6 text-center transition-all text-black active:text-lg"
            >
              Go to Dashboard <Dashboard size={18} />
            </a>
            <button 
              onClick={handleBookmark}
              className="w-full h-[6vh] underline opacity-40 text-white active:bg-[var(--primary-color)] hover:bg-[var(--primary-color)] rounded-[7px] mt-6 text-center transition-all hover:border-none active:border-none hover:text-black active:text-black active:text-lg"
            >
               {bookmarkText} {profile?.full_name} <BookmarkAdd className="ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Failure Overlay */}
      {showFailureOverlay && (
        <div className="w-screen h-screen bg-black/30 fixed top-0 backdrop-blur-2xl z-50 flex flex-col justify-center items-center text-center text-lg">
          <div className="text-9xl">🐈</div>
          <div className="text-white mt-8 text-xl font-semibold">
            Better Luck Next time
          </div>
          <div className="w-full px-7 flex flex-col mt-3">
            <a 
            href={`/dashboard/user/${user?.id}`}
              
              className="w-full h-[6vh] flex flex-row justify-center items-center gap-2 bg-[var(--primary-color)] rounded-[7px] mt-6 text-center transition-all text-black active:text-lg"
            >
              Go to Dashboard <Dashboard size={18} />
            </a>
            <button 
              onClick={handleBookmark}
              className="w-full h-[6vh] underline opacity-40 text-white active:bg-[var(--primary-color)] hover:bg-[var(--primary-color)] rounded-[7px] mt-6 text-center transition-all hover:border-none active:border-none hover:text-black active:text-black active:text-lg"
            >
              {bookmarkText} {profile?.full_name} <BookmarkAdd className="ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Top Gradient */}
      <Gradient />
      <div className="w-screen h-screen text-white flex flex-col">
        {/* NAV */}
        <NavBar
          profilepic={profileData.profilepic}
          setSidebarOpen={setSidebarOpen}
          setsearchOpen={setSearchOpen}
        />

        <div className="mt-0 w-full flex flex-col justify-center items-center px-7">
          {/* Profile Section */}
          {profileLoading ? (
            <ProfileSkeleton />
          ) : (
            <div className="w-full flex flex-row items-center rounded-[7px] py-8">
              <ImageWithSkeleton
                w={100}
                h={100}
                alt="Profile Pic"
                src={
                  profile?.profile_img ||
                  "https://images.unsplash.com/photo-1748638904723-d833c6cf542b?q=80&w=2520&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
              />
              <div className="text-lg ml-4 font-semibold">
                {profile?.full_name}
              </div>
            </div>
          )}

          {/* Interests Section */}
          {profileLoading ? (
            <InterestsSkeleton />
          ) : (
            <>
              <div className="w-full text-start text-xl mt-4">
                What are {profile?.full_name}'s interests?
              </div>
              <div className="flex items-center justify-center w-full mt-6 text-white">
                <MultiSelectComboBox
                  color={color}
                  placeholder={placeholder}
                  options={interests}
                  onSelect={setBranch}
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          {profileLoading ? (
            <ButtonSkeleton />
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full h-[55px] flex flex-row justify-center items-center gap-2 bg-[var(--primary-color)] rounded-[7px] mt-10 text-center transition-all text-black active:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
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