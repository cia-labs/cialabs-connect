"use client";

import React, { use, useState } from "react";
import Gradient from "@/components/HighLevelComponents/TopGradient/Gradient";
import Image from "next/image";
import { MultiSelectComboBox } from "@/components/ui/ComboBox";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
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

export default function page() {
  const router = useRouter();

  const [branch, setb] = useState(null);
  const [placeholder, setp] = useState("Select An Option");
  const [color, setc] = useState("gray-400");
  const [loading , setloading] = useState(false)
  //sessionStorage.getItem("branch")

  const handclick = async () => {
    
    if (!branch || branch.length === 0) {
      setc("red-500");
      setp("Please select at least one interest");
      return;
    }

    setloading(true)

    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("User not logged in");
      return;
    }

    const uid = user.id;
    const branchFromStorage = sessionStorage.getItem("branch");

    if (!branchFromStorage) {
      alert("Branch not selected. Please go back and select branch.");
      return;
    }

    // 1. Update profile with branch
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ branch: branchFromStorage })
      .eq("user_id", uid);

    if (profileError) {
      console.error("Failed to update branch:", profileError);
      return;
    }

    // 2. Get interest IDs from interests table
    const { data: interestRows, error: interestLookupError } = await supabase
      .from("interests")
      .select("id, name")
      .in("name", branch); // branch is actually the array of selected interests

    if (interestLookupError || !interestRows) {
      console.error("Failed to fetch interest IDs:", interestLookupError);
      return;
    }

    // 3. Insert into user_interests
    const interestInserts = interestRows.map((interest) => ({
      user_id: uid,
      interest_id: interest.id,
    }));

    const { error: insertError } = await supabase
      .from("user_interests")
      .insert(interestInserts);

    if (insertError) {
      console.error("Failed to insert user interests:", insertError);
      router.push(`/dashboard/user/${uid}`)
      return;
    }

    // ✅ Success
    router.push(`/dashboard/user/${uid}`);
    setloading(false)
  };
  return (
    <>
      <Gradient />

      {
        loading ?       <div className="w-screen h-screen bg-black/30 fixed top-0 backdrop-blur-lg z-50 flex flex-col justify-center items-center text-center font-semibold  text-lg">
        <div className=" text-white/40">Making Sure We got everything right 😊</div>
        <div className="w-10 h-10 mt-8 border-4 rounded-full text-white border-t-black opacity-40 animate-spin"></div>
      </div> : <></>
      }

      <div className=" w-screen h-screen flex flex-col items-center  text-white px-7">
        <div className=" flex flex-row items-center justify-center mt-20">
          <Image src={"/LOGO.png"} width={60} height={60} alt="logo " />
          <div className=" text-3xl">
            CIA <b>Labs</b>
          </div>
        </div>
        <div className="mt-2 opacity-40 font-semibold">Almost Done</div>
        <div className=" w-full mt-14 text-lg font-medium">
          What Are your interests?
        </div>

        <div className="flex items-center justify-center w-full mt-6 text-white">
          <MultiSelectComboBox
            color={color}
            placeholder={placeholder}
            options={interests}
            onSelect={setb}
          />
        </div>

        <button
          onClick={handclick}
          className="w-full h-[6vh] bg-[var(--primary-color)] rounded-[7px] mt-6 text-center transition-all text-black active:text-lg"
        >
          Continue
        </button>
                    <footer className="mt-auto py-4 bg-transparent">
        <div className="text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} CIA Labs
        </div>
      </footer>
      </div>
    </>
  );
}
