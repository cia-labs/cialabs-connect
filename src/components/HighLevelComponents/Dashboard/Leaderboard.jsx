import React, { useEffect, useState } from 'react';

import {MyImage} from "@/components/Image/Image"
export default function Leaderboard() {
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data/leaderboard')
      .then(res => res.json())
      .then(data => {
        setRanks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col mt-[3vh] px-7 lg:px-[10vw] ">
      <div  className="text-[1rem] font-bold opacity-40 ">
        Leaderboard 
      </div>
      <div className="mt-[2vh] flex flex-col gap-5">
        {loading ? (
          <div>Loading...</div>
        ) : (
          ranks.map((person, index) => (
            <div key={person.user_id} className="w-full h-[5vh] flex flex-row">
              <div className="h-full flex flex-col justify-center items-center font-semibold">
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
