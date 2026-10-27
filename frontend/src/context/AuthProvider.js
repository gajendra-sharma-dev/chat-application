"use client";
import api from "@/lib/api";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await api.get("/getUser");
        setUser(res.data.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setUser(null); // logged-out, normal hai
        } else {
          console.error(err); // asli error
        }
      } finally {
        setLoading(false); // loading hamesha band karo
      }
    };

    getUser();
  }, []);

  const register = async ({ username, email, password }) => {
    const res = await api.post("/register", { username, email, password });
    setUser(res.data.data);
    return res.data;
  };

  const login = async ({ email, password }) => {
    const res = await api.post("/login", { email, password });
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
    <UserContext.Provider
      value={{ register, user, setUser, loading, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(UserContext);
};
