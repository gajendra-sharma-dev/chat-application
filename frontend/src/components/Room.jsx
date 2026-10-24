import api from "@/lib/api/route";
import { usecontext } from "@/context/AuthProvider";
import React from "react";

function Room() {
  const { user } = usecontext();
  const createRoom = async (userId) => {
    const res = await api.post("/createRoom");
    console.log(res.data);
    console.log(res.data.data);
    return res.data;
  };
  return (
    <>
      <div>room</div>
    </>
  );
}

export default Room;
