"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Grid3X3, Home, Image, Instagram, LogOut, Settings, User ,FileTerminal,Handshake } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Images",
      href: "/images",
      icon: Image,
    },
    {
      title: "Series",
      href: "/series",
      icon: Grid3X3,
    },
    {
      title: "Schedule",
      href: "/schedule",
      icon: Calendar,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
    {
      title: "Privacy Policy",
      href: "/privacy-policy",
      icon: FileTerminal,
    },
    {
      title: "Terms of Service",
      href: "/terms",
      icon: Handshake,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center justify-center py-6">
        <div className="flex items-center gap-2 px-2">
          <Instagram className="h-6 w-6" />
          <h1 className="text-xl font-bold">iCurator</h1>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">User Name</span>
              <span className="text-xs text-muted-foreground">@username</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
