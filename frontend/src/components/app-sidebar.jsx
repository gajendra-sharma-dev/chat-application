"use client";
import { useRoom } from "@/context/RoomProvider";
import { Plus } from "lucide-react";
import { ChevronsUpDown, LogOut, Bell, CreditCard } from "lucide-react";
import { UsersRoundCollaboration } from "lucide-react";
import { UserRoundPlus } from "lucide-react";
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
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import api from "@/lib/api";

const projects = [
  { name: "add", url: "http:jhjh" },
  { name: "home", url: "localkkjg" },
  { name: "addss", url: "http:jhjh" },
  { name: "addfff", url: "http:jhjh" },
  { name: "addfgg", url: "http:jhjh" },
];

function AppSidebar() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [room, setRoom] = useState([]);
  console.log(room);
  console.log(user);

  useEffect(() => {
    if (!user) {
      return;
    }
    const getAllGroup = async () => {
      const res = await api.get("/getallroom");
      console.log(res.data.data);
      setRoom(res.data.data);
    };
    getAllGroup();
  }, [user?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const description = formData.get("description");

    try {
      const res = await api.post("/createGroup", { name, description });
      console.log(res.data);
      // fetchRooms();   // sidebar list refresh (agar context mein hai)
      // dialog band
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Dialog>
              <form onSubmit={handleSubmit}>
                <DialogTrigger
                  render={
                    <SidebarMenuButton tooltip="create Group">
                      <UsersRoundCollaboration />
                      <span>Create Group</span>
                    </SidebarMenuButton>
                  }
                />
                <DialogContent className="sm:max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Create Group</DialogTitle>
                    <DialogDescription>
                      Here you make a new group with your friends..
                    </DialogDescription>
                  </DialogHeader>
                  <FieldGroup>
                    <Field>
                      <Label htmlFor="name-1">Group name</Label>
                      <Input
                        id="name-1"
                        name="name"
                        defaultValue="Pedro Duarte"
                      />
                    </Field>
                    <Field>
                      <Label htmlFor="username-1">Username</Label>
                      <Input
                        id="username-1"
                        name="username"
                        defaultValue="@peduarte"
                      />
                    </Field>
                  </FieldGroup>
                  <DialogFooter>
                    <DialogClose
                      render={<Button variant="outline">Cancel</Button>}
                    />
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {room?.map((project) => {
            const other = project.members.find((m) => m._id !== user?._id);
            return (
              <SidebarMenuItem key={other._id}>
                <SidebarMenuButton render={<a href={"/#"} />}>
                  <UserRoundPlus />
                  <span>{other.username}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarHeader>
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
              ></DropdownMenuTrigger>

              <DropdownMenuContent
                side="right"
                align="end"
                className="min-w-56 rounded-lg"
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <CreditCard /> profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell /> Notifications
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
