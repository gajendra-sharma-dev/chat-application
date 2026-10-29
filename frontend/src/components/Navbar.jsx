"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Search } from "lucide-react";
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

  const [foundUser, setFoundUser] = useState(null);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

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
    if (!value) resetSearch();
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

      const users = Array.isArray(result) ? result : result ? [result] : [];

      setFoundUser(users);
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
    <nav className="flex w-full items-center justify-between gap-2 bg-white px-3 py-2 shadow sm:gap-4 sm:px-6 sm:py-3">
      {/* Logo */}
      <Link
        href="/"
        className="flex shrink-0 items-center gap-2 text-lg font-bold text-indigo-600 sm:text-xl"
      >
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 2h16a2 2 0 012 2v12a2 2 0 01-2 2H7l-5 4V4a2 2 0 012-2z" />
        </svg>

        <span className="hidden min-[400px]:inline">ChatApp</span>
      </Link>

      {/* Search dialog */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger
          render={
            <Button variant="outline" aria-label="Search user">
              <Search className="size-4 sm:hidden" />
              <span className="hidden sm:inline">Search User</span>
            </Button>
          }
        />
        <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto sm:max-w-sm">
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
                  className="text-base sm:text-sm"
                />
              </Field>
            </FieldGroup>

            {/* Search result */}
            {foundUser?.length > 0 && (
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {foundUser.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between gap-2 rounded-lg border p-3"
                  >
                    <span className="truncate font-medium">{u.username}</span>

                    <Button
                      type="button"
                      className="shrink-0"
                      onClick={() => startChat(u._id)}
                    >
                      Chat
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {foundUser?.length === 0 && !error && (
              <p className="text-sm text-red-500">User not found</p>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
              <DialogClose
                render={
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetSearch}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                }
              />
              <Button
                type="submit"
                disabled={searching}
                className="w-full sm:w-auto"
              >
                {searching ? "Searching..." : "Search"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <h3 className="hidden min-w-0 flex-1 truncate text-center text-base font-extrabold sm:block md:text-xl">
        Welcome, {user?.username}
      </h3>

      <button
        onClick={logoutButton}
        aria-label="Logout"
        className="ml-auto flex shrink-0 items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600 sm:ml-0 sm:px-4"
      >
        <LogOut className="size-4 sm:hidden" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </nav>
  );
}

export default Navbar;
