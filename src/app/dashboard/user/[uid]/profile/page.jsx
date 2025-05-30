"use client";
import React from "react";
import { MyImage } from "@/components/Image/Image";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";

import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();

  const handleBack = () => {
    router.back(); // Navigates to the previous page
  };
  return (
    <>
      <div className="fixed -z-10 top-0 w-screen h-[10vh] blur-3xl opacity-40 bg-gradient-to-br from-[#F97070] to-[#64A5FF]"></div>

      <div className="w-screen h-screen text-white flex flex-col px-7 ">
        <div className="w-full h-[9vh] mt-5 flex flex-row justify-between items-center lg:px-[10vw]">
          <button
            className="flex flex-row justify-center items-center gap-2 opacity-40 transition-all active:text-lg hover:opacity-100"
            onClick={handleBack}
          >
            <KeyboardBackspaceRoundedIcon fontSize="large" />{" "}
          </button>

          <div className="flex flex-row gap-5 underline opacity-40 ">
            <button>Delete Account</button>
          </div>
        </div>

        <div className="mt-12 w-full h-fit flex flex-col justify-center items-center">
          <div className="w-52 h-52 rounded-full overflow-hidden relative">
            <button onClick={() => setSidebarOpen(true)}>
              <MyImage
                alt="Profile Pic"
                src="https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=2676&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              />
            </button>
          </div>

          <div className=" text-2xl mt-6 font-semibold">Yash</div>
          <div className=" mt-1 opacity-40">xyz@emaple.com | CSE</div>

          <div className="mt-4 underline text-sm">Edit</div>
          <div className=" mt-8 w-full h-[1px] bg-white opacity-30 "></div>

          <div className=" mt-7 text-[2rem] text-center">
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
      </div>
    </>
  );
}

export default page;
