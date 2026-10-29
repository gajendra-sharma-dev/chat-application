"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  ChevronsUpDown,
  LogOut,
  CreditCard,
  CircleQuestionMark,
  UserRoundPlus,
  UsersRoundCollaboration,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "./ui/field";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthProvider";
import api from "@/lib/api";

function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  // Mobile par sidebar sheet hota hai, uska state yahan se milta hai
  const { isMobile, setOpenMobile } = useSidebar();

  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [leavingId, setLeavingId] = useState(null);

  const [groupName, setGroupName] = useState("");
  const [username, setUsername] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const getErrorMessage = (err, fallback) =>
    err?.response?.data?.errors?.toString() ||
    err?.response?.data?.message ||
    fallback;

  const fetchRooms = async () => {
    try {
      const res = await api.get("/getallroom");
      setRooms(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user?._id) return;
    fetchRooms();
  }, [user?._id]);

  const resetDialog = () => {
    setGroupName("");
    setUsername("");
    setSearchResults([]);
    setMembers([]);
    setError("");
  };

  const handleMemberSearch = async () => {
    const q = username.trim();
    if (!q) return;
    setError("");

    try {
      const res = await api.get(`/search?q=${encodeURIComponent(q)}`);
      const result = res.data.data;

      if (!result || result.length === 0) {
        setSearchResults([]);
        setError("user not found");
        return;
      }
      setSearchResults(Array.isArray(result) ? result : [result]);
    } catch (err) {
      setError(getErrorMessage(err, "something went wrong"));
    }
  };

  const addMember = (u) => {
    if (u._id === user?._id) return;
    if (members.some((m) => m._id === u._id)) return;
    setMembers((prev) => [...prev, u]);
  };

  const removeMember = (id) =>
    setMembers((prev) => prev.filter((m) => m._id !== id));

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return setError("group name is required");
    if (members.length < 1) return setError("add at least one member");

    try {
      setCreating(true);
      setError("");

      const res = await api.post("/createGroup", {
        name: groupName.trim(),
        members: members.map((m) => m._id),
      });

      const newRoom = res.data.data;

      setRooms((prev) => [newRoom, ...prev]); // sidebar me turant dikhe
      setOpen(false);
      resetDialog();
      setOpenMobile(false);
      router.push(`/chat/${newRoom._id}`);
    } catch (err) {
      setError(getErrorMessage(err, "room not create yet"));
    } finally {
      setCreating(false);
    }
  };

  const handleLeave = async (roomId) => {
    if (!window.confirm("you want to leave this group?")) return;

    try {
      setLeavingId(roomId);
      await api.patch(`/${roomId}`);

      setRooms((prev) => prev.filter((r) => r._id !== roomId));

      if (pathname === `/chat/${roomId}`) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.log(err?.response?.data);
      alert(getErrorMessage(err, "can not leave"));
    } finally {
      setLeavingId(null);
    }
  };

  const getRoomName = (room) => {
    if (room.isGroup && room.name) return room.name;
    const other = room.members?.find((m) => m._id !== user?._id);
    return other?.username || room.name || "Unknown";
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Dialog
              open={open}
              onOpenChange={(v) => {
                setOpen(v);
                if (!v) resetDialog();
              }}
            >
              <DialogTrigger
                render={
                  <SidebarMenuButton tooltip="Create Group">
                    <UsersRoundCollaboration />
                    <span>Create Group</span>
                  </SidebarMenuButton>
                }
              />

              {/* Mobile: screen ke andar, scrollable. Tablet+: fixed width */}
              <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto sm:max-w-sm md:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Group</DialogTitle>
                  <DialogDescription>
                    Here you make a new group with your friends..
                  </DialogDescription>
                </DialogHeader>

                <FieldGroup>
                  <Field>
                    <Label htmlFor="group-name">Group name</Label>
                    <Input
                      id="group-name"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="text-base sm:text-sm" // iOS zoom rokne ke liye
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="member-search">Add members</Label>
                    <div className="flex gap-2">
                      <Input
                        id="member-search"
                        placeholder="Search username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="min-w-0 flex-1 text-base sm:text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleMemberSearch();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        className="shrink-0"
                        onClick={handleMemberSearch}
                      >
                        Search
                      </Button>
                    </div>

                    {searchResults.length > 0 && (
                      <ul className="mt-2 max-h-32 overflow-y-auto rounded-md border sm:max-h-40">
                        {searchResults.map((u) => {
                          const added = members.some((m) => m._id === u._id);
                          return (
                            <li
                              key={u._id}
                              className="flex items-center justify-between gap-2 px-3 py-2 text-sm"
                            >
                              <span className="truncate">{u.username}</span>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="shrink-0"
                                disabled={added}
                                onClick={() => addMember(u)}
                              >
                                {added ? "Added" : "Add"}
                              </Button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </Field>

                  {members.length > 0 && (
                    <div className="flex max-h-24 flex-wrap gap-2 overflow-y-auto">
                      {members.map((m) => (
                        <span
                          key={m._id}
                          className="flex max-w-full items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs"
                        >
                          <span className="truncate">{m.username}</span>
                          <button
                            type="button"
                            aria-label={`Remove ${m.username}`}
                            className="px-1"
                            onClick={() => removeMember(m._id)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {error && <p className="text-sm text-red-500">{error}</p>}
                </FieldGroup>

                <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
                  <DialogClose
                    render={
                      <Button variant="outline" className="w-full sm:w-auto">
                        Cancel
                      </Button>
                    }
                  />
                  <Button
                    type="button"
                    className="w-full sm:w-auto"
                    onClick={handleCreateGroup}
                    disabled={creating}
                  >
                    {creating ? "Creating..." : "Create Group"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Rooms list ab apne scroll area me hai, isliye lambi list footer ko nahi dabayegi */}
      <SidebarContent>
        <SidebarMenu className="px-2">
          {rooms.map((room) => (
            <SidebarMenuItem key={room._id}>
              <SidebarMenuButton
                tooltip={getRoomName(room)}
                isActive={pathname === `/chat/${room._id}`}
                render={
                  <Link
                    href={`/chat/${room._id}`}
                    onClick={() => setOpenMobile(false)} // mobile par chat khulte hi sidebar band
                  />
                }
              >
                {room.isGroup ? <UsersRoundCollaboration /> : <UserRoundPlus />}
                <span className="truncate">{getRoomName(room)}</span>
              </SidebarMenuButton>

              {room.isGroup && (
                <SidebarMenuAction
                  title="Leave group"
                  aria-label="Leave group"
                  disabled={leavingId === room._id}
                  onClick={() => handleLeave(room._id)}
                >
                  <LogOut />
                </SidebarMenuAction>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton size="lg">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                        className="grayscale"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {user?.username}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto mr-1" />
                  </SidebarMenuButton>
                }
              />

              {/* Mobile par right side screen ke bahar jaata hai, isliye upar kholo */}
              <DropdownMenuContent
                side={isMobile ? "top" : "right"}
                align="end"
                className="w-56 min-w-56 max-w-[calc(100vw-2rem)] rounded-lg"
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem render={<Link href="/profile" />}>
                    <CreditCard /> profile
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/help" />}>
                    <CircleQuestionMark /> help
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
