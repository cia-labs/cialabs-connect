import React from 'react'
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function Leaderboard() {
    const ranks = [
    { id: 1, name: "Rahul", points: 313 },
    { id: 2, name: "Priya", points: 289 },
    { id: 3, name: "Amit", points: 275 },
    { id: 4, name: "Sneha", points: 260 },
    { id: 5, name: "Raj", points: 245 },
    { id: 6, name: "Bob", points: 225 },
    { id: 7, name: "Alice", points: 115 },
  ];
  return (
            <div className="flex flex-col mt-[3vh] px-7 lg:px-[10vw] ">
          <a href="/" className="text-[1rem] font-bold opacity-40 ">
            Leaderboard <NavigateNextIcon />
          </a>
          <div className="mt-[2vh] flex flex-col gap-5">
            {ranks.map((person, index) => (
              <div key={person.id} className="w-full h-[5vh] flex flex-row">
                <div className="h-full flex flex-col justify-center items-center font-semibold">
                  {index + 1}
                </div>
                <div className="ml-4 flex flex-row items-center w-full h-full justify-between">
                  <div className="flex flex-row h-full items-center">
                    <div className="rounded-full bg-blue-200 h-8 w-8"></div>
                    <h1 className="ml-3 font-semibold">{person.name}</h1>
                  </div>
                  <div className="opacity-40">{person.points} Pts</div>
                </div>
              </div>
            ))}
          </div>
        </div>
  )
}
