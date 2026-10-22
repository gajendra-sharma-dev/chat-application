"use client";
import api from "@/app/api/route";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       const res = await api.get("/getUser");
  //       setUser(res.data.data);
  //     } catch (error) {
  //       setUser(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   getUser();
  // }, []);

  const register = async ({ username, email, password }) => {
    const res = await api.post("/register", {username, email, password});
    setUser(res.data.data);
    return res.data;
  };

  const login = async ({ email, password }) => {
    const res = await api.post("/login", {email, password});
    setUser(res.data.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ register, user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const usecontext = () => {
  return useContext(UserContext);
};
