'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage =  () => {
    const router = useRouter();
    useEffect(() => {
        setTimeout(()=> router.push("/"), 2000);
    }, []);
  return <div className=" w-screen h-screen flex flex-row justify-center items-center text-white ">You have logged out... redirecting in a sec.</div>;
};

export default LogoutPage;