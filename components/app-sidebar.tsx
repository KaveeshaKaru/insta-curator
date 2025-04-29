"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Calendar, Grid3X3, Home, Image, Instagram, LogOut, Settings, User, FileTerminal, Handshake } from "lucide-react"
import { useSession, signOut } from "@/lib/auth-client"
import { toast } from "sonner"
import { useState } from "react"

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/auth/login')
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Failed to log out')
    }
  }

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
    <>
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
            <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || "User"} />
                <AvatarFallback>
                  {session?.user?.name
                    ? session.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{session?.user?.name || "User Name"}</span>
                <span className="text-xs text-muted-foreground">{session?.user?.email || "@username"}</span>
              </div>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setShowLogoutDialog(true)}
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You'll need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
