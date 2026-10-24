"use client";

import { useAuth } from "@/context/AuthProvider";

export default function ChatWindow({ room }) {
  const { user, loading } = useAuth();

  return (
    <>
      <div>{room?._id}</div>
    </>
  );
}
