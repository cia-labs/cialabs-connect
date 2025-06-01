import React from 'react'
import StarIcon from "@mui/icons-material/Star";
import GroupsIcon from "@mui/icons-material/Groups";

// Simple skeleton component
function SkeletonBox( ) {
  return (
    <>
      <div className="mt-[5vh] h-[2rem] animate-pulse text-[1.5rem] px-7 lg:px-[10vw] bg-gray-100/20  rounded w-4/6">

      </div>

      <div className="px-7 lg:px-[10vw]">
        <div className="mt-[4vh] border-1 flex flex-row border-[#363535] w-full  h-[125px] rounded-[15px]">
          <div className="w-[50%] h-full flex flex-col pl-5 pt-3 animate-pulse rounded-l-[15px] border-r-1 bg-gray-200/20 border-[#363535]">
            <div className="flex flex-row gap-1  items-center">

            </div>

          </div>
          <div className="w-[50%] h-full flex flex-col pl-5 pt-3 bg-gray-100/10  rounded-r-[15px] animate-pulse">
            <div className="flex flex-row gap-2  items-center">

            </div>

          </div>
        </div>
      </div>

    </>
  );
}

export default function WelcomeData({ reward, ppI, name, loading = false }) {
  return (
    <>

    {
      loading ? <SkeletonBox /> :

      (
        <>
              <div className="mt-[5vh] text-[1.5rem] px-7 lg:px-[10vw]">
        <h1>
          Welcome{" "}
          <b>
            {name}
          </b>
        </h1>
      </div>

      {/* SCORE&POINTS */}
      <div className="px-7 lg:px-[10vw]">
        <div className="mt-[4vh] border-1 flex flex-row border-[#363535] w-full  h-[125px] rounded-[15px]">
          <div className="w-[50%] h-full flex flex-col pl-5 pt-3  border-r-1 border-[#363535] justify-center">
            <div className="flex flex-row gap-1  items-center">
              <StarIcon sx={{ fontSize: 15 }} color="inherit" opacity={0.4} />
              <p className=" text-[0.75rem] relative top-[0.2px] opacity-40 font-semibold">
                Rewards
              </p>
            </div>
            <div className=" text-[4rem]  text-[#C2F970]">
              {reward}
            </div>
          </div>
          <div className="w-[50%] h-full flex flex-col pl-5 pt-3  justify-center">
            <div className="flex flex-row gap-2  items-center">
              <GroupsIcon sx={{ fontSize: 15 }} color="inherit" opacity={0.4} />
              <p className=" text-[0.75rem] relative top-[0.2px] opacity-40 font-semibold">
                People Interacted
              </p>
            </div>
            <div className=" text-[4rem]  text-[#C2F970]">
              {ppI}
            </div>
          </div>
        </div>
      </div>
        </>
      )
    }

    </>
  )
}
