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
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        {children}
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto px-6 py-8 bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
