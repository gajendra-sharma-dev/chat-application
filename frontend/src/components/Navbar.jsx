"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";

import { useRoom } from "@/context/RoomProvider";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

// Backend ka error string ya array, dono ko ek string bana deta hai
const getErrorMessage = (err) => {
  const msg = err?.response?.data?.errors || err?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(", ");
  return msg || "Something went wrong";
};

function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const { setRoom } = useRoom();

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  // null = abhi search hi nahi hua, [] = search hua par koi nahi mila
  const [foundUser, setFoundUser] = useState(null);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

  // Sirf tab login par bhejo jab loading khatam ho aur user na ho
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  const resetSearch = () => {
    setUsername("");
    setFoundUser(null);
    setError("");
  };

  const handleOpenChange = (value) => {
    setOpen(value);
    if (!value) resetSearch(); // dialog band hone par sab clear
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFoundUser(null);

    const query = username.trim();
    if (!query) return;

    try {
      setSearching(true);
      const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
      const result = res.data.data;

      // Backend array de ya single object, dono handle
      const users = Array.isArray(result) ? result : result ? [result] : [];

      setFoundUser(users); // khali array hua to neeche "user not found" dikhega
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSearching(false);
    }
  };

  const logoutButton = async () => {
    await logout();
    router.replace("/login");
  };

  const startChat = async (userId) => {
    try {
      setError("");
      const res = await api.post("/createRoom", { userId });
      setRoom(res.data.data);
      handleOpenChange(false);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <>
      <nav className="flex w-full items-center justify-between bg-white px-6 py-3 shadow">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-indigo-600"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 2h16a2 2 0 012 2v12a2 2 0 01-2 2H7l-5 4V4a2 2 0 012-2z" />
          </svg>
          ChatApp
        </Link>

        {/* Search dialog */}
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger
            render={<Button variant="outline">Search User</Button>}
          />
          <DialogContent className="sm:max-w-sm">
            <form onSubmit={handlerSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Search user</DialogTitle>
                <DialogDescription>
                  Search your friend here by giving username....
                </DialogDescription>
              </DialogHeader>

              <FieldGroup>
                <Field>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                </Field>
              </FieldGroup>

              {/* Search result */}
              {foundUser?.length > 0 &&
                foundUser.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <span className="font-medium">{u.username}</span>
                    {/* type="button" zaroori hai, warna form dobara submit ho jata hai */}
                    <Button type="button" onClick={() => startChat(u._id)}>
                      Chat
                    </Button>
                  </div>
                ))}

              {foundUser?.length === 0 && !error && (
                <p className="text-sm text-red-500">User not found</p>
              )}

              {error && <p className="text-sm text-red-500">{error}</p>}

              <DialogFooter>
                <DialogClose
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetSearch}
                    >
                      Cancel
                    </Button>
                  }
                />
                <Button type="submit" disabled={searching}>
                  {searching ? "Searching..." : "Search"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <h3 className="text-xl font-extrabold">Welcome, {user?.username}</h3>

        <button
          onClick={logoutButton}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
        >
          Logout
        </button>
      </nav>
    </>
  );
}

export default Navbar;
