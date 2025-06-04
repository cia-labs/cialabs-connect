"use client";

import React, { use, useEffect, useState } from "react";
import { MyImage } from "@/components/Image/Image";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Page() {
  const router = useRouter();
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [textloaded, settextloaded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [interests, setInterests] = useState([]);
  const [interestsLoaded, setInterestsLoaded] = useState(false);

  // Edit form states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const [profile, setProfile] = useState({
    name: "",
    profilepic: "",
    branch: "",
  });

  useEffect(() => {
    const supabase = createClient();

    async function fetchProfile() {
      if (!uid) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, profile_img, branch")
        .eq("user_id", uid)
        .single();

      if (error) {
        console.error("Failed to fetch profile", error);
        return;
      }

      const profileData = {
        name: data.full_name ?? "",
        profilepic: data.profile_img ?? "",
        branch: data.branch ?? "",
      };

      setProfile(profileData);
      setEditName(profileData.name); // Initialize edit form with current name
      settextloaded(true);
    }

    fetchProfile();
  }, [uid]);

  // Fetch user interests
  useEffect(() => {
    const fetchInterests = async () => {
      if (!uid) return;

      try {
        const response = await fetch(
          `/api/data/profile_inter?user_uuid=${uid}`
        );
        const data = await response.json();

        if (response.ok) {
          setInterests(data.interests || []);
        } else {
          console.error("Failed to fetch interests:", data.error);
          setInterests([]); // Set empty array if no interests found
        }
      } catch (error) {
        console.error("Error fetching interests:", error);
        setInterests([]);
      } finally {
        setInterestsLoaded(true);
      }
    };

    fetchInterests();
  }, [uid]);

  const handleBack = () => {
    router.back();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setIsUpdating(true);
    setUpdateError("");
    setUpdateSuccess("");

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: editName })
        .eq("user_id", user.id); // Ensures only self-update due to RLS

      if (error) {
        throw new Error(error.message || "Failed to update profile");
      }

      setProfile((prev) => ({
        ...prev,
        name: editName,
      }));

      setUpdateSuccess("Profile updated successfully!");

      // Close dialog after successful update
      setTimeout(() => {
        setIsDialogOpen(false);
        setUpdateError("");
        setUpdateSuccess("");
      }, 1500);
    } catch (err) {
      setUpdateError(
        err.message || "An error occurred while updating your profile"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setUpdateError("");
    setUpdateSuccess("");
    setEditName(profile.name); // Reset to original name
  };

  // Color gradients for interests
  const interestGradients = [
    "from-[#FF7878] to-[#B3A2FF]",
    "from-[#D7FF78] to-[#5EF9D8]",
    "from-[#D7FF78] to-blue-400",
  ];

  const renderInterests = () => {
    if (!interestsLoaded) {
      return (
        <div className="flex flex-wrap gap-2 justify-center">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-20 h-6 rounded-2xl bg-gray-200/20 animate-pulse"
            />
          ))}
        </div>
      );
    }

    if (interests.length === 0) {
      return (
        <span className="font-bold bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
          No interests found
        </span>
      );
    }

    return interests.map((interest, index) => {
      const isLast = index === interests.length - 1;
      const isSecondToLast = index === interests.length - 2;
      const gradient = interestGradients[index % interestGradients.length];

      return (
        <span key={interest.id}>
          <span
            className={`font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
          >
            {interest.name}
          </span>
          {!isLast && (isSecondToLast ? " and " : ", ")}
        </span>
      );
    });
  };

  return (
    <>
      <div className="fixed -z-10 top-0 w-screen h-[10vh] blur-3xl opacity-40 bg-gradient-to-br from-[#F97070] to-[#64A5FF]"></div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-black flex flex-col text-white text-start">
          <DialogHeader className="bg-black flex flex-col text-white text-start">
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription className={"mt-2"}>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input
                id="name-1"
                name="name"
                className="w-full h-[45px]"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                disabled={isUpdating}
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {updateError && (
            <div className="mt-2 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
              {updateError}
            </div>
          )}

          {/* Success Message */}
          {updateSuccess && (
            <div className="mt-2 p-3 bg-green-900/50 border border-green-500 rounded text-green-200 text-sm">
              {updateSuccess}
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-full h-[45px]"
                onClick={handleDialogClose}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              className="w-full mt-4 mb-2 h-[45px] flex flex-row justify-center items-center gap-2 bg-[var(--primary-color)] rounded-[7px] text-center transition-all text-black active:text-lg shadow-lg backdrop-blur-sm disabled:active:text-base"
              onClick={handleEditSubmit}
              disabled={isUpdating || !editName.trim()}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>

        <div className="w-screen h-screen text-white flex flex-col px-7 ">
          {/* Top Bar */}
          <div className="w-full h-[9vh] mt-5 flex flex-row justify-between items-center lg:px-[10vw]">
            <button
              className="flex flex-row justify-center items-center gap-2 opacity-40 transition-all active:text-lg hover:opacity-100"
              onClick={handleBack}
            >
              <KeyboardBackspaceRoundedIcon fontSize="large" />
            </button>

            <div className="flex flex-row gap-5 underline opacity-40 ">
              <a href="/logout">Log Out</a>
            </div>
          </div>

          {/* Profile Section */}
          <div className="mt-12 w-full h-fit flex flex-col justify-center items-center">
            <div className="w-52 h-52 rounded-full overflow-hidden relative">
              {!imgLoaded && (
                <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-200/20 animate-ping"></div>
              )}
              <span style={{ display: imgLoaded ? "block" : "none" }}>
                <MyImage
                  fill
                  alt="Profile Pic"
                  src={profile.profilepic}
                  onLoad={() => setImgLoaded(true)}
                />
              </span>

              <MyImage
                fill
                alt="Profile Pic"
                src={profile.profilepic}
              />
            </div>

            {!textloaded ? (
              <>
                <div className="text-2xl mt-6 font-semibold w-3/5 h-6 rounded-2xl bg-gray-200/20 animate-pulse"></div>
                <div className="mt-5 w-4/5 h-2 rounded-2xl bg-gray-200/20 animate-pulse"></div>
              </>
            ) : (
              <>
                <div className="text-2xl mt-6 font-semibold">
                  {profile.name}
                </div>
                <div className="mt-1 opacity-40">
                  {user?.email} | {profile.branch}
                </div>
              </>
            )}

            <DialogTrigger asChild>
              <Button
                className="mt-4 underline text-sm"
                onClick={() => setIsDialogOpen(true)}
              >
                Edit
              </Button>
            </DialogTrigger>

            <div className="mt-8 w-full h-[1px] bg-white opacity-30 "></div>

            {/* Dynamic Interests */}
            <div className="mt-7 text-[2rem] text-center">
              Your Interests are {renderInterests()}
            </div>
          </div>

          <footer className="mt-auto py-4 bg-transparent">
            <div className="text-center text-gray-400 text-sm">
              © {new Date().getFullYear()} CIA Labs
            </div>
          </footer>
        </div>
      </Dialog>
    </>
  );
}

export default Page;