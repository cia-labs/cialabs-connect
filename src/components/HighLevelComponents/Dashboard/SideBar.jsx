import React , {useEffect} from "react";
import { useRouter } from "next/navigation";
import { MyImage } from "@/components/Image/Image";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function SideBar({ sidebarOpen, setSidebarOpen, uid,profilepic,name }) {
  const router = useRouter();
  useEffect(() => {
    router.prefetch(`/dashboard/user/${uid}/QR`);
  }, [uid]);

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
            w={100}
            h={100}
              alt="Profile Pic"
              src={profilepic}
            />
          </div>
          <div className=" text-xl mt-4 text-center">
            {name}
          </div>
        </div>

        <div className=" mt-12 w-full h-[1px] bg-white opacity-30"></div>

        <div className="mt-8 flex flex-col w-full px-4 font-medium">
          <button onClick={handleClickVP} className=" text-[#a1a1a1] transition-all  active:text-white active:text-lg   flex flex-row justify-between items-center">
              <span>View Profile</span>
            <NavigateNextIcon />
          </button>
          <div className="mt-4 flex flex-row justify-between items-center text-[#a1a1a1] transition-all  active:text-lg active:text-white">
            
              <span>Connentions</span>
            
              <NavigateNextIcon />
          </div>
        </div>
      </div>
    </>
  );
}
