"use client"
import React from "react";
import { MyImage } from "@/components/Image/Image";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';

import { useRouter } from "next/navigation";

function page() {
      const router = useRouter();

  const handleBack = () => {
    router.back(); // Navigates to the previous page
  };
  return (
    <>
      <div className="fixed -z-10 top-0 w-screen h-[10vh] blur-3xl opacity-40 bg-gradient-to-br from-[#F97070] to-[#64A5FF]"></div>

      <div className="w-screen h-screen text-white flex flex-col ">
        <div className="w-full h-[9vh] mt-5 flex flex-row justify-between items-center px-7 lg:px-[10vw]">
          
            <button className="flex flex-row justify-center items-center gap-2 opacity-80" onClick={handleBack}><KeyboardBackspaceRoundedIcon fontSize="large" /> Go Back</button>


          <div className="flex flex-row gap-5 ">
            <button>
              <SearchOutlinedIcon
                sx={{ fontSize: 28 }}
                color="inherit"
                opacity={0.4}
              />
            </button>
            <button className=" text-[#9F3734]">
              <BookmarkIcon sx={{ fontSize: 28 }} htmlColor="#A03734" />
            </button>
          </div>
        </div>

        <div className="mt-32 w-full h-fit flex flex-col justify-center items-center">
            <div className="w-60 h-60  overflow-hidden relative">
                <MyImage src="/qr-code.svg" alt="QR" />
            </div>

            <div className=" text-2xl mt-6 font-semibold">
                Yash
            </div>
            <div className=" mt-1 opacity-40">
                CSE
            </div>
            
        </div>
      </div>
    </>
  );
}

export default page;
