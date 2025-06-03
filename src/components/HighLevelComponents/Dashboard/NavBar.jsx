import React, { useState } from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { MyImage } from "@/components/Image/Image";


export default function NavBar({ setsearchOpen, setSidebarOpen, profilepic, bookmark, uid }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="w-full h-[9vh] mt-5 flex flex-row justify-between items-center px-7 lg:px-[10vw]">
      <div className="w-12 h-12 rounded-full overflow-hidden relative">
        <button onClick={() => setSidebarOpen(true)}>
          {!imgLoaded && (
            <div className="w-12 h-12 rounded-full overflow-hidden relative bg-gray-200/20 animate-bounce"></div>
          )}
          <span style={{ display: imgLoaded ? "block" : "none" }}>
            <MyImage
              w={60}
              h={60}
              alt="Profile Pic"
              src={profilepic}
              onLoad={() => setImgLoaded(true)}
            />
          </span>
        </button>
      </div>
      <div className="flex flex-row gap-5 ">
        <button
          className=" opacity-40 active:opacity-100 transition-all active:text-lg"
          onClick={() => setsearchOpen(true)}
        >
          <SearchOutlinedIcon sx={{ fontSize: 28 }} color="inherit" />
        </button>
        <a href={`/dashboard/user/${uid}/bookmarks`} className=" text-gray-200/30 active:gray-200/40 transition-all active:text-lg">
          <BookmarkIcon sx={{ fontSize: 28 }} htmlColor={`${!bookmark ? "A03734" : "#ff625c" }`} />
        </a>
      </div>
    </div>
  );
}
// A03734