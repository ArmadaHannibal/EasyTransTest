"use client";

import * as React from "react";
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Lifecycle",
      url: "/dashboard",
      icon: ListIcon,
    },
    {
      title: "Analytics",
      url: "/dashboard",
      icon: BarChartIcon,
    },
    {
      title: "Projects",
      url: "/dashboard/Projects",
      icon: FolderIcon,
    },
    {
      title: "Team",
      url: "/dashboard",
      icon: UsersIcon,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "/dashboard",
      items: [
        {
          title: "Active Proposals",
          url: "/dashboard",
        },
        {
          title: "Archived",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "/dashboard",
      items: [
        {
          title: "Active Proposals",
          url: "/dashboard",
        },
        {
          title: "Archived",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "/dashboard",
      items: [
        {
          title: "Active Proposals",
          url: "/dashboard",
        },
        {
          title: "Archived",
          url: "/dashboard",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "/dashboard",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "/dashboard",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "/dashboard",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "/dashboard",
      icon: ClipboardListIcon,
    },
    {
      name: "Demandes de partenariat",
      url: "/dashboard/demandepartenaire",
      icon: FileIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="bg-(--bg-legebluemoyen) text-white"
      collapsible="offcanvas"
      {...props}
    >
      <SidebarHeader className="bg-(--bg-legebluemoyen) text-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-(--bg-legebluemoyen) text-white">
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="bg-(--bg-legebluemoyen) text-white">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
