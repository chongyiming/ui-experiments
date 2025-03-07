"use client"

import * as React from "react"
import { ArchiveX, Command, File, Inbox, Send, Trash2 } from "lucide-react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

// This is sample data
const navigationItems = [
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
    isActive: true,
  },
  {
    title: "Drafts",
    url: "#",
    icon: File,
    isActive: false,
  },
  {
    title: "Sent",
    url: "#",
    icon: Send,
    isActive: false,
  },
  {
    title: "Junk",
    url: "#",
    icon: ArchiveX,
    isActive: false,
  },
  {
    title: "Trash",
    url: "#",
    icon: Trash2,
    isActive: false,
  }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="none" className="w-20 border-r" {...props}>
      <SidebarHeader className="items-center py-4">
        <Link className="inline-flex" href="/" aria-label="Go to homepage">
          <svg 
            className="text-foreground" 
            xmlns="http://www.w3.org/2000/svg" 
            width="32" 
            height="32" 
            fill="currentColor"
          >
            <title>Logo</title>
            <path d="M16.8 32c8.465-.417 15.2-7.417 15.2-15.99 0-2.631-.634-5.114-1.758-7.304-4.506 2.604-6.76 3.905-8.463 5.66a17.614 17.614 0 0 0-4.313 7.474C16.8 24.193 16.8 26.796 16.8 32Zm-1.6 0C6.735 31.583 0 24.583 0 16.01c0-2.631.634-5.114 1.758-7.304 4.506 2.604 6.76 3.905 8.463 5.66a17.613 17.613 0 0 1 4.313 7.474c.666 2.353.666 4.956.666 10.16ZM2.56 7.32c4.505 2.604 6.758 3.905 9.129 4.505 2.83.715 5.793.715 8.622 0 2.371-.6 4.624-1.901 9.13-4.504C26.59 2.915 21.635 0 16 0 10.365 0 5.41 2.915 2.56 7.32Z" />
          </svg>
        </Link>
      </SidebarHeader>
      <SidebarContent className="overflow-visible">
        <SidebarGroup className="p-4">
          <SidebarMenu className="gap-4">
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.title} className="flex items-center justify-center">
                <span className="relative before:absolute before:inset-0 before:rounded-full before:bg-primary/48 before:blur-md before:-left-1">
                  <SidebarMenuButton
                    asChild
                    className="relative size-11 p-0 items-center justify-center rounded-full bg-linear-to-b from-background/64 to-background shadow-lg"
                    tooltip={{
                      children: item.title,
                      hidden: false,
                    }}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span className="sr-only">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </span>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
