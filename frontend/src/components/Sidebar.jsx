"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function SidebarUser() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="gap-3 p-4">
          <h2 className="text-lg font-semibold">Users</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              // value={query}
              // onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="pl-8"
              aria-label="Search users"
            />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              {/* {filtered.length} {filtered.length === 1 ? "user" : "users"} */}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                  // size="lg"
                  // isActive={selected?.id === user.id}
                  // onClick={() => setSelected(user)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate text-xs text-muted-foreground"></span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <span className="text-sm text-muted-foreground">User details</span>
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
}
