"use client";

import React, { useState } from "react";
import Gradient from "@/components/HighLevelComponents/TopGradient/Gradient";
import Image from "next/image";
import {ComboBox} from "@/components/ui/ComboBox";
import { useRouter } from "next/navigation";


const fruits = ["CSE", "EC", "MECH", "CIVIL", "ISE", "ECE"];


export default function page() {
const router = useRouter();
    
  const [branch, setb] = useState(null);
  const [btnText , setBtnText] = useState("Continue")
  const [placeholder, setp] = useState("Select An Option");
  const [color, setc] = useState("gray-400");
  const handclick = () => {
    if(!branch){ 
        setc("red-500")
        setp("Please Fill this Feild")
    } else{
    sessionStorage.setItem("branch" , branch);
    setBtnText("Loading...")
    router.push("/onboarding/interests")
    }


  }
  return (
    <>
      <Gradient />

      <div className=" w-screen h-screen flex flex-col items-center  text-white px-7">
        <div className=" flex flex-row items-center justify-center mt-20">
          <Image src={"/LOGO.png"} width={60} height={60} alt="logo " />
          <div className=" text-3xl">
            CIA <b>Labs</b>
          </div>
        </div>
        <div className="mt-2 opacity-40 font-semibold">
          Lets get few things right
        </div>
        <div className=" w-full mt-14 text-lg font-medium">
          What branch Are you part of?
        </div>

        <div className="flex items-center justify-center w-full mt-6 text-white">
          <ComboBox color={color} placeholder={placeholder} options={fruits} onSelect={setb} />
        </div>

        <button onClick={handclick} className="w-full h-[6vh] bg-[var(--primary-color)] rounded-[7px] mt-6 text-center transition-all text-black active:text-lg">
            {btnText}
        </button>
                    <footer className="mt-auto py-4 bg-transparent">
        <div className="text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} CIA Labs
        </div>
      </footer>
      </div>

    </>
  );
}
