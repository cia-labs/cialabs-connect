"use client"
import { useEffect } from "react";
import Image from "next/image";
import React from "react";

export default function Home() {


  return (
    <div className="flex items-center justify-center w-screen h-screen  flex-col px-4 bg-[var(--bg-color)]">
      <nav className=" fixed top-5 text-white w-[95vw] md:w-[85vw] flex flex-row items-center justify-between">
        <a href="/" className=" flex flex-row justify-center items-center">
          <div className="w-[40px] h-[40px] md:w-[60px] md:h-[60px]">
            <Image src={"/LOGO.png"} width={60} height={60} alt="logo " />
          </div>
          <h1 className=" text-xl">
            CIA <b>Labs</b> Dev Branch
          </h1>
        </a>
      </nav>
      <div className=" text-white"></div>
    </div>
  );
}
