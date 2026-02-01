import { SignedIn, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { ModeToggle } from "./ui/toggle";
import { useEffect, useState } from "react";
import { UserProgress } from "@prisma/client";
import Link from "next/link";
import { fetchUserProgressController } from "@/controllers/controller.user";

export default function SideBarRes() {
  const { isSignedIn, user } = useUser();
  const [userProgress, setUserProgress] = useState<UserProgress>();

  const fetchUserProgress = async () => {
    if (!isSignedIn || !user) return;

    const res = await fetchUserProgressController();
    if (!res.success && !res.userProgress) {
      console.error("Failed to fetch user progress:", res.message);
    }
    setUserProgress(res.userProgress);
  };
  useEffect(() => {
    fetchUserProgress();
  }, [isSignedIn, user]);

  return (
    <div className=" p-4 w-full flex flex-row-reverse items-center justify-between">
      <div className="flex flex-row text-xl font-medium pl-3 justify-between ">
        <div className="flex flex-row items-center gap-2">
          <ModeToggle />
          {isSignedIn ? (
            <SignedIn>
              <UserButton />
            </SignedIn>
          ) : (
            <SignInButton>
              <button className="border px-4 py-2 text-sm rounded ml-4 disabled:opacity-50 cursor-pointer focus:bg-blend-color">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
      <ul className=" flex flex-row gap-3">
        <li className="">
          <Link
            href="/quickwriting"
            className="flex flex-row items-center gap-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
          </Link>
        </li>
        <li className="">
          <Link
            className="flex flex-row items-center gap-3"
            href={`/email/?level=${userProgress?.emailLevel || 1}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
          </Link>
        </li>{" "}
        <li className="">
          <Link href="/process"
           className="flex flex-row items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
              />
            </svg>
          </Link>
        </li>
      </ul>
    </div>
  );
}
