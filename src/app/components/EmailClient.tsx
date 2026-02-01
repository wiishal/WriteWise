"use client";

import { useEffect } from "react";
import { SignIn, useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import Loading from "@/app/components/ui/Loading";
import RenderEmailTextArea from "./RenderEmailTextArea";
import { logUserIdController } from "@/controllers/controller.user";

export default function EmailClient() {

  const searchParams = useSearchParams();
  const level = Number(searchParams.get("level") || "1");

  const { isLoaded, isSignedIn, user } = useUser();
  
  useEffect(() => {
    if (!isSignedIn) return;
    logUserIdController();
  }, [isSignedIn, user]);

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isSignedIn && level >= 2) {
    return (
      <div className="flex h-full w-full justify-center items-center">
        <SignIn routing="hash" />
      </div>
    );
  }

  return <RenderEmailTextArea level={level} />;
}
