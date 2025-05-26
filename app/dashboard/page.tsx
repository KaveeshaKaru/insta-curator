// ✅ dashboard/page.tsx (Revised)
import { CalendarClock, Grid3X3, ImageIcon, Instagram } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardStats, getUpcomingPosts, getRecentPosts } from "@/lib/dashboard.service"
import { PostTabs } from "@/components/dashboard/PostTabs"
import { auth } from "@/lib/auth"

export default async function DashboardPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ 
    headers: new Headers({
      cookie: headersList.get('cookie') || ''
    })
  });
  
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const stats = await getDashboardStats(session.user.id);
  const upcomingPosts = await getUpcomingPosts(session.user.id);
  const recentPosts = await getRecentPosts(session.user.id);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link href="/schedule">Schedule New Post</Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalImages}</div>
            <p className="text-xs text-muted-foreground">+{stats.lastWeekImages} from last week</p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Series</CardTitle>
            <Grid3X3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.seriesCount}</div>
            <p className="text-xs text-muted-foreground">+{stats.lastMonthSeries} from last month</p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
            <CalendarClock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduledPosts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.nextPostDate ? `Next post ${formatDistanceToNow(stats.nextPostDate)}` : 'No posts scheduled'}
            </p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Posted</CardTitle>
            <Instagram className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.postedCount}</div>
            <p className="text-xs text-muted-foreground">+{stats.thisWeekPosts} this week</p>
          </CardContent>
        </Card>
      </div>

      <PostTabs upcomingPosts={upcomingPosts} recentPosts={recentPosts} />
    </div>
  )
}
