import type React from "react"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get("isAuthenticated")?.value === "true"

  if (!isAuthenticated) {
    redirect("/")
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  )
}

