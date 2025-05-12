"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Calendar, Grid3X3, Home, Image as LucideImage, Instagram, LogOut, Settings, User, FileTerminal, Handshake } from "lucide-react"
import { useSession, signOut } from "@/lib/auth-client"
import { toast } from "sonner"
import { useState } from "react"
import Image from 'next/image'

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
import { Switch } from "@/components/ui/switch"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

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
      icon: LucideImage,
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
      <Sidebar className="w-80 h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-r-3xl shadow-lg border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between transition-all duration-300">
        <SidebarHeader className="flex flex-col items-center justify-center py-6">
          <div className="flex items-center gap-2 px-2">
            <Image src="/logo/iCurator-logo.png" alt="iCurator Logo" width={140} height={40} priority />
          </div>
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-y-auto px-4">
          <SidebarMenu className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] transition-all duration-200 ${
                      isActive
                        ? "bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-semibold shadow-sm"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>

        <div className="flex items-center justify-between px-20 py-3 ">
          <div className="flex items-center gap-3">
            <span className="text-yellow-400">☀️</span>
            <Switch
              checked={isDarkMode}
              onCheckedChange={(checked) => {
                setIsDarkMode(checked)
                document.documentElement.classList.toggle("dark", checked)
              }}
            />
            <span className="text-blue-500">🌙</span>
          </div>
        </div>

        <SidebarFooter className="px-1 pb-6">
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-xl shadow-inner">
            <Link href="/profile" className="flex items-center gap-3 hover:opacity-90 transition">
              <Avatar className="h-10 w-10">
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
              <div className="flex flex-col text-sm">
                <span className="font-medium">{session?.user?.name || "User Name"}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{session?.user?.email || "@username"}</span>
              </div>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-500 hover:text-red-600 transition"
              onClick={() => setShowLogoutDialog(true)}
            >
              <LogOut className="h-4 w-4" />
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
