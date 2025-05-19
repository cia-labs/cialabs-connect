"use client";

import { motion } from "motion/react";
import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import Image from "next/image";

export default function Home() {
  return (
    <BackgroundLines className="flex items-center justify-center w-screen h-screen  flex-col px-4">
      {" "}
      <nav className=" fixed top-5 text-white w-[95vw] md:w-[85vw] flex flex-row items-center">
        <div className="w-[40px] h-[40px] md:w-[60px] md:h-[60px]">
          <Image src={"/LOGO.png"} width={60} height={60} alt="logo " />
        </div>

        <h1 className=" text-xl">
          
            CIA <b>Labs</b> Dev Route V1
            
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
        <h1 className=" text-5xl opacity-45"> 
          Coming Soon
        </h1>
      </motion.div>

    </BackgroundLines>
  );
}
