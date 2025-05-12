"use client";

import { motion } from "motion/react";
import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import Image from "next/image";

export default function Home() {
  return (
    <BackgroundLines className="flex items-center justify-center w-screen h-screen  flex-col px-4">
      {" "}
      <div className="absolute w-44 h-44 blur-[100px] opacity-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(to_right,#D9D9D9,#FFEF75)]"></div>
      <nav className=" fixed top-5 text-white w-[95vw] md:w-[85vw] flex flex-row items-center">
        <div className="w-[40px] h-[40px] md:w-[60px] md:h-[60px]">
          <Image src={"/LOGO.png"} width={60} height={60} alt="logo " />
        </div>

        <h1 className=" text-xl">
          
            CIA <b>Labs</b>
            
        </h1>

      </nav>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col  items-center justify-center px-4 text-white"
      >
        <p className=" text-sm md:text-base mb-4 text-[#969696]">
          CIA Labs Presents
        </p>
        <h1 className="text-4xl md:text-8xl text-center font-bold bg-gradient-to-r from-white via-yellow-100 to-gray-400 bg-clip-text text-transparent animate-gradients">
          Game of Throws
        </h1>
        <p className="text-base text-center md:text-xl mt-4">
          You bring The energy, We’ll handle the rest
        </p>
        <div className="w-auto h-auto flex flex-row gap-6 mt-7 f md:mt-10">
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSd7_fIqG_DLoP_j9DtvpHsxlmrlESSXivEec-0W79als79f1Q/viewform?fbclid=PAZXh0bgNhZW0CMTEAAaejbRTQsAdwh08ZU0zTs5TSgcGAsCTiEbO2Dp643yXpX3CUJXWpuaQrr9NXiw_aem_hvO3gVZXeSLBeH8E_dOBWA" className="bg-[#74FFBC] font-medium text-sm md:text-base text-black py-2 px-4 rounded-[5px]">
            Register Now
          </a>
          <a  href="CIA.pdf" target="_blank" rel="noopener noreferrer" className="border-1 text-sm md:text-base border-white text-white py-2 px-6 opacity-45 rounded-[5px]">
            About Us
          </a>
        </div>
      </motion.div>
      <footer className=" fixed bottom-8 text-white flex flex-col justify-center items-center">
        <p className="text-xs mb-3 opacity-30 font-semibold">Our Handles</p>
        <div className="flex flex-row gap-6 opacity-60">
        <a href="https://www.linkedin.com/company/cia-labs-tech/?originalSubdomain=in" className=" w-7"><Image src='/linkedin.svg' height={50} width={50} alt="Linkedin" /></a>
        <a href="https://www.instagram.com/cia_labs_tech/" className=" w-7"><Image src='/insta.svg' height={50} width={50} alt="Linkedin" /></a>
        </div>
      </footer>
    </BackgroundLines>
  );
}
