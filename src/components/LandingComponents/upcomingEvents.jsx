import React from 'react'
import {NavBar} from './NavBar';
import Link from 'next/link';

const upcomingEvents = () => {
  return (
    <div>
      <NavBar/>
      <h1 className='text-green-500/40 text-center text-5xl mt-100'>Coming Soon....</h1>
      <br/>
      <Link href="/Robo-Leaderboard">
  <span className='border-1 border-green-600 items-center text-green-500 px-4 py-2 rounded-md hover:bg-green-600 hover:text-black mx-auto flex w-fit transition-all duration-300'>
    Robo-LeaderBoard
  </span>
</Link>
    </div>
  )
}

export default upcomingEvents;
