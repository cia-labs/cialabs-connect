"use client";
import { useState } from "react";
import { useParams } from "next/navigation";

import Gradient from "@/components/HighLevelComponents/TopGradient/Gradient"

import WelcomeData from "@dashboard/Welcome-Data"
import Events from "@dashboard/Events"
import Leaderboard  from "@dashboard/Leaderboard";
import SearchModal from "@dashboard/Search"
import GetQrScanQrBTN from "@dashboard/GetQRScan/button"
import NavBar from "@dashboard/NavBar"
import SideBar from "@dashboard/SideBar"

export default function UserPage() {

const { uid } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setsearchOpen] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} uid={uid} />

      {/* Search */}
      <SearchModal setSearchOpen={setsearchOpen} searchOpen={searchOpen} />

      {/* Top Gradient */}
      <Gradient />

      {/* Action Button */}
      <GetQrScanQrBTN uid={uid} />

      <div className="w-screen h-screen text-white flex flex-col ">

        {/* NAV */}
        <NavBar setSidebarOpen={setSidebarOpen} setsearchOpen={setsearchOpen} />

        {/* WELCOME */}
        <WelcomeData reward={322} ppI={12} />

        {/* EVENTS */}
        <Events />

        {/* Leaderboard */}
        <Leaderboard />

      </div>
    </>
  );
}
