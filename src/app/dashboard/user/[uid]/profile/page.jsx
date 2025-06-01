"use client";

import React, { use, useEffect, useState } from "react";
import { MyImage } from "@/components/Image/Image";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

function Page() {
  const router = useRouter();
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [textloaded, settextloaded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

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

      setProfile({
        name: data.full_name ?? "",
        profilepic: data.profile_img ?? "",
        branch: data.branch ?? "",
      });

      settextloaded(true)
    }

    fetchProfile();
  }, [uid]);

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <div className="fixed -z-10 top-0 w-screen h-[10vh] blur-3xl opacity-40 bg-gradient-to-br from-[#F97070] to-[#64A5FF]"></div>

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
                w={300}
                h={300}
                alt="Profile Pic"
                src={profile.profilepic}
                onLoad={() => setImgLoaded(true)}
              />
            </span>

            <MyImage
              w={300}
              h={300}
              alt="Profile Pic"
              src={profile.profilepic}
            />
          </div>

          {!textloaded ? (
            <>
              <div className="text-2xl mt-6 font-semibold w-3/5 h-6 rounded-2xl bg-gray-200/20 animate-pluse"></div>
              <div className="mt-5 w-4/5 h-2 rounded-2xl bg-gray-200/20 animate-pulse">
                
              </div>
            </>
          ) : (
            <>
              {" "}
              <div className="text-2xl mt-6 font-semibold">{profile.name}</div>
              <div className="mt-1 opacity-40">
                {user?.email} | {profile.branch}
              </div>
            </>
          )}

          <div className="mt-4 underline text-sm">Edit</div>
          <div className="mt-8 w-full h-[1px] bg-white opacity-30 "></div>

          {/* Static Top Hobbies */}
          <div className="mt-7 text-[2rem] text-center">
            Your Top Hobbies Was{" "}
            <span className="font-bold bg-gradient-to-r from-[#FF7878] to-[#B3A2FF] bg-clip-text text-transparent">
              Cycling,
            </span>{" "}
            <span className="font-bold bg-gradient-to-r from-[#D7FF78]  to-[#5EF9D8] bg-clip-text text-transparent">
              Dancing
            </span>{" "}
            and{" "}
            <span className="font-bold bg-gradient-to-r from-[#D7FF78] to-blue-400 bg-clip-text text-transparent">
              Coding
            </span>
          </div>

          <div className="mt-4 opacity-40">People's Response</div>
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

export default Page;
