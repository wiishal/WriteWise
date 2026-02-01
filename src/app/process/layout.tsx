"use client";

import Sidebar from "../components/Sidebar";
import SideBarRes from "../components/SideBarRes";

export default function EmailPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen flex lg:flex-row  flex-col">
      {/* Sidebar Stays Fixed */}
      <Sidebar />

      {/* Right-hand content changes */}
      <div className="lg:hidden flex  w-full">
        {" "}
        <SideBarRes />
      </div>
      <div className="flex-grow border p-4 overflow-auto">{children}</div>
    </div>
  );
}

