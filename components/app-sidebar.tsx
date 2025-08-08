"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/components/auth-provider";
import { Home, LayoutDashboard, LogOut, Users } from 'lucide-react';
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronUp } from 'lucide-react';

export function AppSidebar() {
  const { currentUser, logout } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="#" className="flex items-center gap-2 px-2 py-4 text-lg font-semibold">
          <LayoutDashboard className="h-6 w-6" />
          <span>Project Tracker</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {currentUser && (
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {currentUser.role === "admin" && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <Home />
                        <span>Admin Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {currentUser.role === "member" && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <Home />
                        <span>My Projects</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {/* Add more navigation items if needed */}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        {currentUser ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out ({currentUser.username})</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <div className="p-2 text-center text-sm text-muted-foreground">
            Please log in
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
