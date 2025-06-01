import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import Image from "next/image";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/auth-actions"
import SignInWithGoogleButton from "./SignInWithGoogleButton"
import Gradient from "@/components/HighLevelComponents/TopGradient/Gradient"

export function LoginForm() {
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
                How you feeling today?
              </div>
              <form action="" className=" w-full">
           
                <div className=" flex flex-col w-full  h-[135px] border border-[#717171] rounded-[7px] mt-10">
                <input
                  id="email"
                  name="email"
                  type="email"
                  className=" text-white w-full h-1/2 border-b border-[#717171] p-4"
                  placeholder="Email"

                  required
                />
              


                <input id="password" name="password" type="password" placeholder="Password"  className=" text-white w-full h-1/2 p-4" required />

                </div>

              
              <button type="submit" formAction={login} className="w-full h-[50px] bg-[var(--primary-color)] rounded-[7px] mt-8 text-center transition-all text-black active:text-lg">
                Login
              </button>
             <SignInWithGoogleButton/> 
          
        </form>
        <div className="mt-4 text-center text-sm opacity-40">
          Don&apos;t have an account?{" "} then Sign Up With Google
          {/* <Link href="/signup" className="underline">
            Sign up
          </Link> */}
        </div>
    </div>
    </>
      
    
  )
}
