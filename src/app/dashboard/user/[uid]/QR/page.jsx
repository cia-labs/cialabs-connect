"use client";
import React, { useState, useEffect } from "react";
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
    router.back();
  };

  const [profile, setProfile] = useState({
    name: "",
    profilepic: "",
    branch: "",
  });

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [qrLoading, setQrLoading] = useState(true);

  // QR Code data
  const qrCodeData = `${process.env.NEXT_PUBLIC_SITE_URL}/user/${uid}/answer`;

  useEffect(() => {
    // Generate QR code
    const generateQR = async () => {
      try {
        setQrLoading(true);
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
      } finally {
        setQrLoading(false);
      }
    };

    if (uid) {
      generateQR();
    }
  }, [qrCodeData, uid]);

  useEffect(() => {
    const supabase = createClient();
    async function fetchProfile() {
      if (!uid) return;
      
      try {
        setIsLoading(true);
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
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProfile();
  }, [uid]);

  // Skeleton Components
  const QRSkeleton = () => (
    <div className="w-60 h-60 bg-gray-200/10 rounded-lg animate-pulse flex items-center justify-center">
      <div className="w-48 h-48 bg-[#C2F970] rounded animate-pulse"></div>
    </div>
  );

  const ProfileSkeleton = () => (
    <div className="flex flex-col items-center">
      <div className="h-8 bg-gray-200/30 rounded animate-pulse w-48 mb-3"></div>
      <div className="h-5 bg-gray-100/10 rounded animate-pulse w-32"></div>
    </div>
  );

  const isContentLoaded = !isLoading && !qrLoading;

  return (
    <>
      <div className="fixed -z-10 top-0 w-screen h-[10vh] blur-3xl opacity-40 bg-gradient-to-br from-[#F97070] to-[#64A5FF]"></div>
      <div className="w-screen h-screen text-white flex flex-col">
        <div className="w-full h-[9vh] mt-5 flex flex-row justify-between items-center px-7 lg:px-[10vw]">
          <button
            className="flex flex-row justify-center items-center gap-2 opacity-40 transition-all active:text-lg hover:opacity-100"
            onClick={handleBack}
          >
            <KeyboardBackspaceRoundedIcon fontSize="large" /> Go Back
          </button>
          <div className="flex flex-row gap-5">

          </div>
        </div>

        <div className="mt-32 w-full h-fit flex flex-col justify-center items-center">
          {/* QR Code Section */}
          {qrLoading ? (
            <QRSkeleton />
          ) : (
            <div className="w-60 h-60 overflow-hidden relative rounded-lg p-2 bg-white/5 backdrop-blur-sm">
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className="w-full h-full object-contain rounded"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Failed to generate QR
                </div>
              )}
            </div>
          )}

          {/* Profile Info Section */}
          <div className="mt-6 flex flex-col items-center">
            {isLoading ? (
              <ProfileSkeleton />
            ) : (
              <>
                <div className="text-2xl font-semibold text-center px-4">
                  {profile.name || "Unknown User"}
                </div>
                <div className="mt-1 opacity-40 text-center">
                  {profile.branch || "No Branch Info"}
                </div>
              </>
            )}
          </div>

          {/* Loading indicator when both are loading */}
          {/* {(isLoading || qrLoading) && (
            <div className="mt-8 flex flex-col items-center space-y-2">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <div className="text-sm opacity-40">Loading profile...</div>
            </div>
          )} */}
        </div>
              <footer className="mt-auto py-4 bg-transparent">
        <div className="text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} CIA Labs
        </div>
      </footer>
      </div>
    </>
  );
}

export default page;