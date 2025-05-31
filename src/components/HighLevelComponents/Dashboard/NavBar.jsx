import React from 'react'
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { MyImage } from "@/components/Image/Image";

export default function NavBar({setsearchOpen, setSidebarOpen,profilepic }) {
  return (
            <div className="w-full h-[9vh] mt-5 flex flex-row justify-between items-center px-7 lg:px-[10vw]">
          <div className="w-12 h-12 rounded-full overflow-hidden relative">
            <button onClick={() => setSidebarOpen(true)}>
              <MyImage
                w={60}
                h={60}
                alt="Profile Pic"
                src={profilepic}
              />
            </button>
          </div>
          <div className="flex flex-row gap-5 ">
            <button className=' opacity-40 active:opacity-100 transition-all active:text-lg' onClick={() => setsearchOpen(true)}>
              <SearchOutlinedIcon
                sx={{ fontSize: 28 }}
                color="inherit"
              />
            </button>
            <button className=" text-[#9F3734] active:text-[#ff625c] transition-all active:text-lg">
              <BookmarkIcon sx={{ fontSize: 28 }} htmlColor="#A03734" />
            </button>
          </div>
        </div>
  )
}
