"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Calendar, Grid3X3, Home, Image as LucideImage, BookImage, LogOut, Settings, User, FileTerminal, Handshake } from "lucide-react"
import { useSession, signOut } from "@/lib/auth-client"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import Image from 'next/image'
import { motion } from "framer-motion"

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

const menuCategories = {
  main: [
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
      title: "Posts",
      href: "/posts",
      icon: BookImage,
    },
  ],
  settings: [
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ],
  legal: [
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
  ],
}

interface MenuItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"))
  }, [])

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

  const MenuItem = ({ item, isActive }: { item: MenuItem; isActive: boolean }) => (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] transition-all duration-150 ${
          isActive
            ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold"
            : "hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300"
        }`}
      >
        <Link href={item.href} className="flex items-center gap-3 w-full">
          <item.icon className={`h-5 w-5 transition-colors duration-150 ${isActive ? "text-blue-500" : ""}`} />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )

  return (
    <>
      <Sidebar className="w-80 h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-r-[2rem] shadow-xl border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between transition-colors duration-150">
        <SidebarHeader className="flex flex-col items-center justify-center py-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 px-2"
          >
            <Image src="/logo/iCurator-logo.png" alt="iCurator Logo" width={140} height={40} priority className="hover:opacity-80 transition-opacity" />
          </motion.div>
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-y-auto px-4 space-y-6">
          <div>
            <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main Menu</h2>
            <SidebarMenu className="space-y-1">
              {menuCategories.main.map((item) => (
                <MenuItem key={item.href} item={item} isActive={pathname === item.href} />
              ))}
            </SidebarMenu>
          </div>

          <SidebarSeparator className="mx-4 bg-gray-200 dark:bg-gray-700" />

          <div>
            <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Settings</h2>
            <SidebarMenu className="space-y-1">
              {menuCategories.settings.map((item) => (
                <MenuItem key={item.href} item={item} isActive={pathname === item.href} />
              ))}
            </SidebarMenu>
          </div>

          <div>
            <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Legal</h2>
            <SidebarMenu className="space-y-1">
              {menuCategories.legal.map((item) => (
                <MenuItem key={item.href} item={item} isActive={pathname === item.href} />
              ))}
            </SidebarMenu>
          </div>
        </SidebarContent>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center px-4 py-4 "
        >
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full shadow-inner">
            <span className="text-yellow-400 text-lg">☀️</span>
            <Switch
              checked={isDarkMode}
              onCheckedChange={(checked) => {
                setIsDarkMode(checked)
                document.documentElement.classList.toggle("dark", checked)
              }}
              className="data-[state=checked]:bg-blue-500"
            />
            <span className="text-blue-500 text-lg">🌙</span>
          </div>
        </motion.div>

        <SidebarFooter className="px-4 pb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between bg-gray-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-2xl shadow-lg"
          >
            <Link href="/profile" className="flex items-center gap-3 hover:opacity-90 transition group">
              <Avatar className="h-10 w-10 ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all">
                <AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || "User"} />
                <AvatarFallback className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {session?.user?.name
                    ? session.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{session?.user?.name || "User Name"}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{session?.user?.email || "@username"}</span>
              </div>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
              onClick={() => setShowLogoutDialog(true)}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </motion.div>
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