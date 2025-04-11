"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function LoginButton() {
  const router = useRouter()

  const handleDashboardClick = () => {
    // Set authentication
    localStorage.setItem("isAuthenticated", "true")
    document.cookie = "isAuthenticated=true; path=/"
    router.push("/dashboard")
  }

  return (
    <Button onClick={handleDashboardClick}>
      Dashboard
    </Button>
  )
}

