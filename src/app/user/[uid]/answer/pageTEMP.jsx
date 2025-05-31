"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

function Page() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const supabase = createClient();



    useEffect(() => {
        const fetchProfile = async () => {
            if (!params?.uid) return;
            setLoading(true);
            const res = await fetch(`/api/qanda/userdetails?uuid=${params.uid}`);
            const data = await res.json();
            setProfile(data);
            setLoading(false);
        };
        fetchProfile();
    }, [params?.uid]);

    if (user === null) {
        return <div className=" text-white">Please log in to view this page.</div>;
    }

    if (loading) {
        return <div className=" text-white">Loading profile...</div>;
    }

    if (!profile || profile.error) {
        return <div className=" text-white">Profile not found.</div>;
    }

    return (
        <div className=" text-white">
            <h2>{profile.full_name}</h2>
            <p>Branch: {profile.branch}</p>
            <img src={profile.profile_img} alt="Profile" width={100} />
        </div>
    );
}

export default Page;