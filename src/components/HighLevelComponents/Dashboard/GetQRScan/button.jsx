import React from "react";
import QrCodeRoundedIcon from "@mui/icons-material/QrCodeRounded";
import CropFreeRoundedIcon from "@mui/icons-material/CropFreeRounded";

import Link from "next/link";

export default function GetQrScanQrBTN({ uid }) {
  return (
    <div className="fixed bottom-14 z-40 backdrop-blur-lg   bg-black/20 left-1/2 -translate-x-1/2 w-[60vw] lg:w-[30vw] h-[57.2344px] border border-[#717171] rounded-[30px] flex flex-row">
      <button
        onClick={() => {
          history.pushState(null, "", `/dashboard/user/${uid}/QR`);
          location.reload();
        }}
        className="w-[50%] h-full text-white active:text-lg flex flex-row justify-center items-center gap-2 "
      >
        Get QR <QrCodeRoundedIcon />
      </button>
      <Link
        href={`/dashboard/user/${uid}/scan`}
        className="w-[50%] h-full text-black/70  transition-all active:text-lg active:text-black flex flex-row justify-center items-center gap-2 bg-[#C2F970] rounded-r-[30px] "
      >
        Scan <CropFreeRoundedIcon />
      </Link>
    </div>
  );
}
 