"use client"

import { SignIn, useUser } from "@clerk/nextjs";
import UserProcess from "../components/UserProcess";

export default function Process() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  if (!isSignedIn) {
    return (
      <div className="flex h-full w-full justify-center items-center">
        <SignIn routing="hash" signUpFallbackRedirectUrl="/process" />
      </div>
    );
  }

  return <UserProcess />;
}
