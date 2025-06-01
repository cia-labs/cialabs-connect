"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const [count, setCount] = useState(3);

    useEffect(() => {
        if (count === 0) {
            router.back();
            return;
        }
        const timer = setTimeout(() => setCount(count - 1), 1000);
        return () => clearTimeout(timer);
    }, [count, router]);

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center text-white">
            <h1 className="text-3xl font-semibold">Coming Soon</h1>
            <p className="mt-4 opacity-40">Going Back in {count}s</p>
            <footer className="fixed bottom-3 py-4 bg-transparent">
                <div className="text-center text-gray-400 text-sm">
                    © {new Date().getFullYear()} CIA Labs
                </div>
            </footer>
        </div>
    );
}
