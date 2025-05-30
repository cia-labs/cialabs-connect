"use client";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth-actions";
import React from "react";

const SignInWithGoogleButton = () => {
  const handleGoogleSignIn = () => {
    const redirectTo = `${window.location.origin}/auth/callback`;
    signInWithGoogle(redirectTo);
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full bg-white text-black"
      onClick={handleGoogleSignIn}
    >
      Login with&nbsp;<b>Google</b>
    </Button>
  );
};

export default SignInWithGoogleButton;
