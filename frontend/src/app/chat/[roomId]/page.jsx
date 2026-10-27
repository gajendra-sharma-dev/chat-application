"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ChatWindow } from "@/components/ChatWindow";
import { useAuth } from "@/context/AuthProvider";
function page() {
  const { user } = useAuth();
  const { roomId } = useParams();
  return (
    <>
      <ChatWindow roomId={roomId} currentUserId={user?._id} />
    </>
  );
}

export default page;
