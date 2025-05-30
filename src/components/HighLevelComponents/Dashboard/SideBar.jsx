import React from "react";
import { useRouter } from "next/navigation";
import { MyImage } from "@/components/Image/Image";
import UserGreetText from "@/components/UserGreetText";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function SideBar({ sidebarOpen, setSidebarOpen, uid }) {
  const router = useRouter();
    const handleClickVP = () => {
    router.push(`/dashboard/user/${uid}/profile`);
  };
  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/40  transition-opacity"
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
          <div className=" w-24 h-24 rounded-full overflow-hidden relative">
            <MyImage
              alt="Profile Pic"
              src="https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=2676&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </div>
          <div className=" text-xl mt-4 text-center">
            <UserGreetText />
          </div>
        </div>

        <div className=" mt-12 w-full h-[1px] bg-white opacity-30"></div>

        <div className="mt-8 flex flex-col w-full px-4 font-medium">
          <div className=" flex flex-row justify-between items-center">
            <button onClick={handleClickVP}>
              <span>View Profile</span>
              <NavigateNextIcon />
            </button>
          </div>
          <div className="mt-4 flex flex-row justify-between items-center">
            <button>
              <span>Connentions</span>
              <NavigateNextIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
