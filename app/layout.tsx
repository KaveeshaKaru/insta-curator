import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Instagram Curator",
  description: "Curate, organize, and schedule Instagram posts",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <div className="flex h-screen">
              <AppSidebar />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
