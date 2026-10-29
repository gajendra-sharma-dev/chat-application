"use client";
import { useEffect, useState } from "react";
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

function Navbar({ children }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [foundUser, setFoundUser] = useState([]);
  const [error, setError] = useState("");
  const { room, setRoom } = useRoom();

  useEffect(() => {
    router.replace("/login");
  }, [user._id, loading]);

  const clearText = () => {
    setUsername("");
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFoundUser(null);

    if (!username.trim()) return;

    try {
      const res = await api.get(`/search?q=${username.trim()}`);
      const result = res.data.data;

      {
        result && result?.length === 0 && setError("user not found");
      }

      setFoundUser(res.data.data); // user object from your API
    } catch (error) {
      setError(error.response?.data?.errors || error?.response?.data?.message);
    }
  };

  const logoutButton = async () => {
    await logout();
    router.replace("/login");
  };

  const UserIdyoRoom = async (userId) => {
    const res = await api.post("/createRoom", { userId });
    setRoom(res.data.data);
  };

  return (
    <>
      <nav className="flex w-full items-center justify-between bg-white px-6 py-3 shadow">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-indigo-600"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 2h16a2 2 0 012 2v12a2 2 0 01-2 2H7l-5 4V4a2 2 0 012-2z" />
          </svg>
          ChatApp
        </a>

        {/* Search dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
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
              {/* Search result */}
              {foundUser &&
                (foundUser.length > 0 ? (
                  foundUser.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <span className="font-medium">{user.username}</span>
                      <Button
                        type="submit"
                        onClick={() => UserIdyoRoom(user._id)}
                      >
                        {" "}
                        Chat
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-red-500">user not found</p>
                ))}
              <DialogFooter>
                <DialogClose
                  render={
                    <Button type="button" variant="outline" onClick={clearText}>
                      Cancel
                    </Button>
                  }
                />
                <Button type="submit">Search</Button>
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
