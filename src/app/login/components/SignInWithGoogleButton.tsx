"use client";
import { signInWithGoogle } from "@/lib/auth-actions";
import { Google } from "@mui/icons-material";
import React, { useState } from "react";

const SignInWithGoogleButton = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setLoading(true);
    const redirectTo = `${window.location.origin}/auth/callback`;
    signInWithGoogle(redirectTo);
  };

  return (
    <button
      type="button"
      className="w-full h-[55px] flex flex-row justify-center items-center border border-[#717171] text-white rounded-[7px] mt-6 text-center transition-all overflow-hidden relative"
      onClick={handleGoogleSignIn}
      disabled={loading}
      style={{ position: "relative" }}
    >
      {/* Continue with Google */}
      <span
        className={`flex flex-row items-center absolute left-0 top-0 w-full h-full justify-center transition-transform duration-300 ${
          loading ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        Continue with&nbsp;<b>Google</b>
        <div className="ml-2">
          <Google />
        </div>
      </span>
      {/* Loading */}
      <span
        className={`flex flex-row items-center absolute left-0 top-0 w-full h-full justify-center transition-transform duration-300 ${
          loading ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <span className="animate-pulse">Loading...</span>
      </span>
    </button>
  );
};

export default SignInWithGoogleButton;
