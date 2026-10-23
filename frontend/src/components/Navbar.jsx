"use client";

import { useRouter } from "next/navigation";
import { usecontext } from "@/context/AuthProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import api from "@/app/api/route";
export default function Navbar() {
  const { logout } = usecontext();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.replace("/login");
    }
  };

  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b px-4 py-3">
        <h1 className="text-xl font-bold">ChatApp</h1>

        <Button type="button" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </header>
    </>
  );
}
