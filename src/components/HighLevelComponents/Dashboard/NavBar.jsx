import React from 'react'
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { MyImage } from "@/components/Image/Image";

export default function NavBar({setsearchOpen, setSidebarOpen }) {
  return (
            <div className="w-full h-[9vh] mt-5 flex flex-row justify-between items-center px-7 lg:px-[10vw]">
          <div className="w-12 h-12 rounded-full overflow-hidden relative">
            <button onClick={() => setSidebarOpen(true)}>
              <MyImage
                alt="Profile Pic"
                src="https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=2676&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              />
            </button>
          </div>
          <div className="flex flex-row gap-5 ">
            <button onClick={() => setsearchOpen(true)}>
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
  )
}
