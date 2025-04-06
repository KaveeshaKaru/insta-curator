"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Calendar, Compass, Grid3X3, Home, Image, Instagram, LogOut, Settings, User } from "lucide-react"

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
  const { data: session } = useSession()

  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Discover",
      href: "/dashboard/discover",
      icon: Compass,
    },
    {
      title: "Images",
      href: "/dashboard/images",
      icon: Image,
    },
    {
      title: "Series",
      href: "/dashboard/series",
      icon: Grid3X3,
    },
    {
      title: "Schedule",
      href: "/dashboard/schedule",
      icon: Calendar,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center justify-center py-6">
        <div className="flex items-center gap-2 px-2">
          <Instagram className="h-6 w-6" />
          <h1 className="text-xl font-bold">Curator</h1>
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
              <AvatarImage src={session?.user?.image || "/placeholder.svg"} alt={session?.user?.name || "User"} />
              <AvatarFallback>
                {session?.user?.name ? session.user.name[0] : <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{session?.user?.name || "User Name"}</span>
              <span className="text-xs text-muted-foreground">{session?.user?.email || "@username"}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

