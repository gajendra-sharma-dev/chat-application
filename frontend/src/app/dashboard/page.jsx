"use client";

import { useAuth } from "@/context/AuthProvider";
import React, { useEffect } from "react";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

function page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.replace("/login");
    }
  }, [user, loading]);

  return (
    <>
      <Navbar />
    </>
  );
}

export default page;
