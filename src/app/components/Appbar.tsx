import Link from "next/link";
import { JSX } from "react";

export default function Appbar(): JSX.Element {
  return (
    <div className=" flex flex-row lg:w-full w-3/4 p-5 align-middle justify-between gap-5 font-medium text-neutral-300 capitalize">
      <h1 className="text-center">
        <Link href="/">Writewise</Link>
      </h1>
      <ul className="">
        <li>
          <Link href="/docs">docs</Link>
        </li>
      </ul>
    </div>
  );
}
