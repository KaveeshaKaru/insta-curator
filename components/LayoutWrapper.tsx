"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ReactNode } from "react"

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAuthRoute = pathname === "/auth/login" || pathname === "/auth/register"
  const isLandingPage = pathname === "/landingPage"

  if (isAuthRoute || isLandingPage) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-auto ml-24">{children}</main>
      </div>
    </SidebarProvider>
  )
}