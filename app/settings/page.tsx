// settings/page.tsx
import { Suspense } from "react";
import InstagramConnection from "@/components/InstagramConnection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="w-full flex flex-col p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="max-w-md">
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

        <Card className="min-w-[500px] max-w-[800px]">
          <CardHeader>
            <CardTitle>Instagram Connection</CardTitle>
            <CardDescription>Connect your Instagram account to enable auto-posting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Suspense fallback={<div>Loading Instagram connection...</div>}>
              <InstagramConnection />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
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
  );
}