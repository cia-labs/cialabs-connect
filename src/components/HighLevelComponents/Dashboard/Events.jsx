import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function Events() {
  return (
    <div className="flex flex-col mt-[3vh] pl-7 lg:pl-[10vw] lg:pr-[10vw]">
      <a href="/" className="text-[1rem] font-bold opacity-40 ">
        Our Events <NavigateNextIcon />
      </a>
      <div className="mt-[2vh] z-30 overflow-x-scroll flex flex-row gap-5 ">
        {[...Array(5)].map((_, i) => (
          <div className=" flex flex-col" key={i}>
            <div className="w-[27vw] h-[16vh] bg-amber-400 rounded-[7px]"></div>
            <h1 className="mt-2 text-lg  font-medium">Drawing</h1>
            <p className="mt-1 text-xs opacity-40 font-medium ">12th Oct</p>
          </div>
        ))}
      </div>
    </div>
  );
}
