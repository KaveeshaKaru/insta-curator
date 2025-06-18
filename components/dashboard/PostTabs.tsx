"use client"

import Link from "next/link"
import { formatDistanceToNow, format } from "date-fns"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RocketAnimation } from "@/components/RocketAnimation"

interface Post {
  id: number;
  scheduledAt: Date;
  postedAt: Date | null;
  isCarousel: boolean;
  caption: string | null;
  series: {
    name: string;
  } | null;
  photos: Array<{
    photo: {
      url: string;
    };
  }>;
}

interface PostTabsProps {
  upcomingPosts: Post[];
  recentPosts: Post[];
}

export function PostTabs({ upcomingPosts, recentPosts }: PostTabsProps) {
  return (
    <Tabs defaultValue="upcoming" className="flex-1">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Posts</TabsTrigger>
          <TabsTrigger value="recent">Recently Posted</TabsTrigger>
        </TabsList>
        <Button variant="outline" size="sm" asChild>
          <Link href="/posts">View All</Link>
        </Button>
      </div>

      <TabsContent value="upcoming" className="mt-8">
        {upcomingPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {upcomingPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={post.photos[0]?.photo.url || "/placeholder.svg"}
                      alt="Post preview"
                      fill
                      className="object-cover"
                    />
                    {post.isCarousel && (
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                        Multiple Images
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{post.caption || "Untitled Post"}</CardTitle>
                  <CardDescription className="text-sm">
                    Scheduled for {format(new Date(post.scheduledAt), "PPP 'at' p")}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between pb-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/posts/${post.id}`}>Edit</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/posts/${post.id}/publish`}>Post Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-48 h-48">
                <RocketAnimation />
              </div>
              <h3 className="mt-6 text-xl font-semibold">No Scheduled Posts to Show</h3>
              <p className="mt-3 text-base text-muted-foreground text-center max-w-md">
                Ready to blast off? Schedule your first post and watch your content take flight! 🚀
              </p>
              <Button className="mt-8" size="lg" asChild>
                <Link href="/schedule">Schedule Your First Post</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="recent" className="mt-8">
        {recentPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {recentPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={post.photos[0]?.photo.url || "/placeholder.svg"}
                      alt="Post preview"
                      fill
                      className="object-cover"
                    />
                    {post.isCarousel && (
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                        Multiple Images
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{post.caption || "Untitled Post"}</CardTitle>
                  <CardDescription className="text-sm">
                    Posted {formatDistanceToNow(new Date(post.postedAt!), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between pb-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/posts/${post.id}`}>View Stats</Link>
                  </Button>
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/posts/${post.id}/repost`}>Repost</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-48 h-48">
                <RocketAnimation />
              </div>
              <h3 className="mt-6 text-xl font-semibold">No Posts Yet</h3>
              <p className="mt-3 text-base text-muted-foreground text-center max-w-md">
                Time to make your mark on Instagram! Create and publish your first post. 📸
              </p>
              <Button className="mt-8" size="lg" asChild>
                <Link href="/images">Create Your First Post</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
} 