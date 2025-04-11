import { CalendarClock, Grid3X3, ImageIcon, Instagram } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link href="/schedule">Schedule New Post</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+12 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Series</CardTitle>
            <Grid3X3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
            <CalendarClock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Next post in 2 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Posted</CardTitle>
            <Instagram className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+3 this week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Posts</TabsTrigger>
            <TabsTrigger value="recent">Recently Posted</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" asChild>
            <Link href="/schedule">View All</Link>
          </Button>
        </div>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={`/placeholder.svg?height=400&width=400`}
                      alt="Post preview"
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                </CardContent>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Summer Collection</CardTitle>
                  <CardDescription>Scheduled for May 15, 2023 at 10:00 AM</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button size="sm">Post Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={`/placeholder.svg?height=400&width=400`}
                      alt="Post preview"
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                </CardContent>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Spring Collection</CardTitle>
                  <CardDescription>Posted on April 28, 2023 at 2:15 PM</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    View Stats
                  </Button>
                  <Button variant="secondary" size="sm">
                    Repost
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
