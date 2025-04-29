"use client"

import { ReactNode } from "react"

export default function LandingLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
} 