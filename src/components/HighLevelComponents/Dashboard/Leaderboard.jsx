import React, { useEffect, useState } from 'react';
import { MyImage } from "@/components/Image/Image";

function SkeletonRow() {
  return (
    <div className="w-full h-[5vh] flex flex-row animate-pulse">
      <div className="flex flex-col justify-center items-center font-semibold  rounded-full bg-gray-200/30 " />
      <div className="ml-4 flex flex-row items-center w-full h-full justify-between">
        <div className="flex flex-row h-full items-center">
          <div className="rounded-full overflow-hidden bg-gray-200/30" style={{ width: 40, height: 40 }} />
          <div className="ml-3 h-4 w-24 bg-gray-200/30 rounded" />
        </div>
        <div className="h-4 w-12 bg-gray-200/30 rounded" />
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/data/leaderboard');
        const data = await res.json();
        setRanks(data);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex flex-col mt-[4vh] px-7 lg:px-[10vw] ">
      <div className="text-[1rem] font-bold opacity-40 ">
        Leaderboard 
      </div>
      <div className="mt-[2vh] flex flex-col gap-5">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : (
          ranks.map((person, index) => (
            <div key={person.user_id} className="w-full h-[5vh] flex flex-row">
              <div className="h-full flex flex-col justify-center items-center font-semibold w-6">
                {index + 1}
              </div>
              <div className="ml-4 flex flex-row items-center w-full h-full justify-between">
                <div className="flex flex-row h-full items-center">
                  <div className='rounded-full overflow-hidden'>
                    <MyImage
                      src={person.profile_img}
                      alt='profile pic'
                      w={40}
                      h={40}
                    />
                  </div>
                  <h1 className="ml-3 font-semibold">{person.full_name}</h1>
                </div>
                <div className="opacity-40">{person.points} Pts</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
