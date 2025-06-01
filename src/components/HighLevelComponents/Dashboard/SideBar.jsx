import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MyImage } from "@/components/Image/Image";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import Link from "next/link";

export default function SideBar({
  sidebarOpen,
  setSidebarOpen,
  uid,
  profilepic,
  name,
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [targetPath, setTargetPath] = useState("");


  // Simulate progress
  useEffect(() => {
    if (loading && targetPath && pathname === targetPath) {
      setProgress(100);
      setTimeout(() => setLoading(false), 300);
      setTargetPath("");
    }
  }, [pathname, loading, targetPath]);



  return (
    <>
      {/* Progress Bar */}
      <div
        className={`fixed top-0 left-0 h-1 z-[9999] rounded-r-full transition-all duration-300 ease-out ${
          loading ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #6366f1, #14b8a6)",
          boxShadow: loading ? "0 0 10px rgba(99, 102, 241, 0.5)" : "none",
        }}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-[101] h-full w-[60vw] max-w-xs bg-black/5 text-white backdrop-blur-3xl transition-transform duration-300 flex flex-col items-center ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ willChange: "transform" }}
      >
        <div className="mt-16">
          <div className="w-24 h-24 rounded-full overflow-hidden relative">
            <MyImage w={100} h={100} alt="Profile Pic" src={profilepic} />
          </div>
          <div className="text-xl mt-4 text-center">{name}</div>
        </div>

        <div className="mt-12 w-full h-[1px] bg-white opacity-30"></div>

        <div className="mt-8 flex flex-col w-full px-4 font-medium">
          <Link
            href={`/dashboard/user/${uid}/profile`}
            
            className="text-[#a1a1a1] transition-all active:text-white active:text-sm flex flex-row justify-between items-center py-2 px-2 rounded-lg hover:bg-white/5"
          >
            <span>View Profile</span>
            <NavigateNextIcon />
          </Link>
          <Link href={'/comingsoon'} className="mt-4 flex flex-row justify-between items-center text-[#a1a1a1]   transition-all  active:text-sm   active:text-white py-2 px-2 rounded-lg hover:bg-white/5">
            <span>Connections</span>
            <NavigateNextIcon />
          </Link>
        </div>
      </div>
    </>
  );
}
