"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useSession } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UserProfile() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState<{
    name: string
    email: string
    image: string | null
  } | null>(null)

  useEffect(() => {
    if (session?.user) {
      setUserData({
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || null,
      })
    }
  }, [session])

  if (!userData) {
    return null
  }

  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <Card className="w-full max-w-md">
        <CardHeader className="p-3">
          <CardTitle className="text-base">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="p-3 space-y-1">
          <div className="flex items-center space-x-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userData.image || undefined} alt={userData.name} />
              <AvatarFallback>
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <h2 className="text-base font-semibold">{userData.name}</h2>
              <p className="text-xs text-muted-foreground">{userData.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 