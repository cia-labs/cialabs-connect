import React, {useEffect} from "react";
import QrCodeRoundedIcon from "@mui/icons-material/QrCodeRounded";
import CropFreeRoundedIcon from "@mui/icons-material/CropFreeRounded";
import { useRouter } from "next/navigation";

export default function GetQrScanQrBTN({uid}) {
  const router = useRouter();
    useEffect(() => {
  router.prefetch(`/dashboard/user/${uid}/QR`);
}, [uid]);

  const handleClickOR = () => {
    router.push(`/dashboard/user/${uid}/QR`);
  };

  return (
    <div className="fixed bottom-14 z-40 backdrop-blur-lg   bg-black/20 left-1/2 -translate-x-1/2 w-[60vw] lg:w-[30vw] h-[7vh] border border-[#717171] rounded-[30px] flex flex-row">
      <button
        //href={`/dashboard/user/${uid}/QR`}
        onClick={handleClickOR}
        className="w-[50%] h-full text-white active:text-lg flex flex-row justify-center items-center gap-2 "
      >
        Get QR <QrCodeRoundedIcon />
      </button>
      <button  className="w-[50%] h-full text-black/70  transition-all active:text-lg active:text-black flex flex-row justify-center items-center gap-2 bg-[#C2F970] rounded-r-[30px] ">
        Scan <CropFreeRoundedIcon />
      </button>
    </div>
  );
}
