"use client";
import React, {useState, useEffect} from "react";
import { MyImage } from "@/components/Image/Image";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import UserGreetText from "@/components/UserGreetText";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";

function page() {
  const router = useRouter();
  const params = useParams();
  const uid = params.uid;
  
  const handleBack = () => {
    router.back(); // Navigates to the previous page
  };

  const [profile, setProfile] = useState({
    name: "",
    profilepic: "",
    branch: "",
  });

  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // QR Code data - you can update this link later
  const qrCodeData = `${process.env.NEXT_PUBLIC_SITE_URL}/user/${uid}/answer`; // Leave empty as requested

  useEffect(() => {
    // Generate QR code
    const generateQR = async () => {
      try {
        const dataToEncode = qrCodeData || "placeholder";
        const qrDataUrl = await QRCode.toDataURL(dataToEncode, {
          width: 400,
          margin: 0,
          color: {
            dark: '#C2F970',
            light: '#000'
          }
        });
        setQrCodeUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQR();
  }, [qrCodeData]);

  useEffect(() => {
    const supabase = createClient();
    async function fetchProfile() {
      if (!uid) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, profile_img, branch")
        .eq("user_id", uid)
        .single();
      if (error) {
        console.error("Failed to fetch profile", error);
        return;
      }
      setProfile({
        name: data.full_name ?? "",
        profilepic: data.profile_img ?? "",
        branch: data.branch ?? "",
      });
    }
    fetchProfile();
    setQrCodeUrl(`${process.env.NEXT_PUBLIC_SITE_URL}/user/${uid}/answer`)
  }, [uid]);

  return (
    <>
      <div className="fixed -z-10 top-0 w-screen h-[10vh] blur-3xl opacity-40 bg-gradient-to-br from-[#F97070] to-[#64A5FF]"></div>
      <div className="w-screen h-screen text-white flex flex-col ">
        <div className="w-full h-[9vh] mt-5 flex flex-row justify-between items-center px-7 lg:px-[10vw]">
          <button
            className="flex flex-row justify-center items-center gap-2 opacity-40 transition-all active:text-lg hover:opacity-100"
            onClick={handleBack}
          >
            <KeyboardBackspaceRoundedIcon fontSize="large" /> Go Back
          </button>
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
          <div className="w-60 h-60 overflow-hidden relative  rounded-lg p-2">
            {qrCodeUrl ? (
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black">
                Generating QR...
              </div>
            )}
          </div>
          <div className=" text-2xl mt-6 font-semibold">{profile.name}</div>
          <div className=" mt-1 opacity-40">{profile.branch}</div>
        </div>
      </div>
    </>
  );
}

export default page;