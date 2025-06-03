import Image from "next/image";

import React from "react";
import LoginButton from "@/components/LoginLogoutButton";

export default function Home() {
  return (
    <>
      
      {/* <div className=" p-0 m-0 fixed -top-5 w-screen h-[20vh] bg-[var(--primary-color)]/30 blur-3xl"></div> */}
      <div className="flex items-center w-screen h-screen flex-col bg-[var(--bg-color)] py-6">
        <nav className="mt-3 px-7 text-white w-[95vw] md:w-[85vw] flex flex-row items-center justify-between">
          <a href="/" className=" flex flex-row justify-center items-center">
            <div className="w-[40px] h-[40px] relative -left-2 md:w-[60px] md:h-[60px]">
              <Image src={"/LOGO.png"} width={60} height={60} alt="logo " />
            </div>
            <div className=" text-xl ">CIA <b>Labs</b></div>
          </a>

          <a href="/auth/callback" className=" px-6 py-2 flex flex-row justify-center items-center bg-[var(--primary-color)] rounded-[7px]  text-center transition-all text-black active:text-lg disabled:opacity-50 disabled:cursor-not-allowed">Login</a>
        </nav>

        <div className=" text-white text-start px-7 mt-8">
          <p className="mt-4 font-medium text-4xl">
            Communities in Atria
          </p>
          <p className=" text-sm mt-4 opacity-40">
            Of the students, for the students, by the students. Engineering is
            more than just exams - it's creativity, hands-on building,
            collaboration, and problem-solving.
          </p>


          <div className=" rounded-[7px] overflow-hidden w-full h-fit mt-10">
              <Image src={"/CDAY.jpg"} width={400} height={400} alt="community day" />
          </div>
          <p className="mt-14 font-medium text-4xl">
           What is CIA Labs?
          </p>
          <p className=" text-sm mt-4 opacity-40">
CIA Labs was once an active and passionate student community at Atria. It stood for innovation, collaboration, and technical growth – building a space where engineering wasn't just studied but experienced.
Now, us students are reviving that legacy. We're rebuilding CIA Labs as a vibrant, student-led community focused on making engineering fun, practical, and accessible for every student who wants to explore beyond the classroom.
          </p>

           <footer className="py-12 border-t  mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-color mb-4">CIA Labs</div>
            <p className="text-gray-400 mb-6">Communities in Atria</p>
            <p className="text-gray-500 text-sm">
              🚀 A community of builders, thinkers, and tinkerers
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Come build, launch, learn, and most importantly—belong.
            </p>
            
            <div className="mt-8 pt-8 border-t border-border-color">
              <p className="text-gray-500 text-sm">
                © 2025 CIA Labs. Made with ❤️ by students, for students.
              </p>
            </div>
          </div>
        </div>
      </footer>
        </div>
      </div>
    </>
  );
}
