import React from 'react'
import StarIcon from "@mui/icons-material/Star";
import GroupsIcon from "@mui/icons-material/Groups";
import UserGreetText from "@/components/UserGreetText";

export default function WelcomeData({reward, ppI}) {
  return (
    <>
    <div className="mt-[4vh] text-[1.5rem] px-7 lg:px-[10vw]">
          <h1>
            Welcome <b><UserGreetText /></b>
          </h1>
        </div>

        {/* SCORE&POINTS */}
        <div className="px-7 lg:px-[10vw]">
          <div className="mt-[3vh] border-1 flex flex-row border-[#363535] w-full h-[17vh] rounded-[15px]">
            <div className="w-[50%] h-full flex flex-col pl-5 pt-3  border-r-1 border-[#363535]">
              <div className="flex flex-row gap-1  items-center">
                <StarIcon sx={{ fontSize: 15 }} color="inherit" opacity={0.4} />
                <p className=" text-[0.75rem] relative top-[0.2px] opacity-40 font-semibold">
                  Rewards
                </p>
              </div>
              <div className=" text-[4rem]  text-[#C2F970]">{reward}</div>
            </div>
            <div className="w-[50%] h-full flex flex-col pl-5 pt-3 ">
              <div className="flex flex-row gap-2  items-center">
                <GroupsIcon
                  sx={{ fontSize: 15 }}
                  color="inherit"
                  opacity={0.4}
                />
                <p className=" text-[0.75rem] relative top-[0.2px] opacity-40 font-semibold">
                  People Interacted
                </p>
              </div>
              <div className=" text-[4rem]  text-[#C2F970]">{ppI}</div>
            </div>
          </div>
        </div>
    </>
  )
}
