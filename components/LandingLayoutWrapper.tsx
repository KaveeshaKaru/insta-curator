"use client"

import { ReactNode } from "react"

export default function LandingLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="h-full w-full">
        {children}
      </div>
    </div>
  )
} 