"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { useAuth } from "@/context/AuthProvider";
import React, { useEffect } from "react";
import { RoomProvider } from "@/context/RoomProvider";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

function page({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.replace("/login");
    }
  }, [user, loading]);

  return (
    <>
      <RoomProvider>
        <SidebarProvider>
          <AppSidebar />
          <div className="flex min-h-svh flex-1 flex-col">
            <header className="flex h-14 items-center gap-2 border-b px-4">
              <SidebarTrigger />
              <Navbar />
            </header>

            <main className="flex-1 p-4">{children}</main>
          </div>
        </SidebarProvider>
      </RoomProvider>
    </>
  );
}

export default page;
