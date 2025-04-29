"use client"

import * as React from "react"
import { Suspense } from "react"
import InstagramConnection from "@/components/InstagramConnection"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="w-full flex flex-col p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Instagram Connection</CardTitle>
            <CardDescription>Connect your Instagram Business Account</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <InstagramConnection />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}