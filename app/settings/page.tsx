"use client"

import { Instagram } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useSearchParams } from "next/navigation"


export default function SettingsPage() {
  const searchParams = useSearchParams()
  const isConnected = searchParams.get("connected") === "true"
  const igId = searchParams.get("ig_id")

  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Your email" defaultValue="john@example.com" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instagram Connection</CardTitle>
            <CardDescription>Connect your Instagram account to enable auto-posting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-4 border rounded-lg">
              <div className="mr-4">
                <Instagram className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Instagram Business Account</h3>
                <p className={`text-sm ${isConnected ? "text-green-600" : "text-muted-foreground"}`}>
                  {isConnected ? `Connected (ID: ${igId})` : "Not connected"}
                </p>
              </div>
              <Button onClick={() => window.location.href = "/api/auth/instagram-login"}>
                {isConnected ? "Reconnect" : "Connect"}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram-username">Instagram Username</Label>
              <Input id="instagram-username" placeholder="@yourusername" />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Posting Preferences</CardTitle>
            <CardDescription>Configure how your posts are scheduled and published</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Default Posting Time</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="default-hour">Hour</Label>
                  <Input id="default-hour" placeholder="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-minute">Minute</Label>
                  <Input id="default-minute" placeholder="00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-ampm">AM/PM</Label>
                  <Input id="default-ampm" placeholder="AM" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Notification Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="post-success" className="cursor-pointer">
                      Post Success Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Get notified when a post is successfully published</p>
                  </div>
                  <Switch id="post-success" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="post-failure" className="cursor-pointer">
                      Post Failure Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Get notified when a post fails to publish</p>
                  </div>
                  <Switch id="post-failure" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="scheduled-reminder" className="cursor-pointer">
                      Scheduled Post Reminders
                    </Label>
                    <p className="text-sm text-muted-foreground">Get reminded before a post is scheduled to publish</p>
                  </div>
                  <Switch id="scheduled-reminder" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Preferences</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

