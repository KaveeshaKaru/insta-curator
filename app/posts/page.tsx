"use client"

import { Plus } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface Post {
  id: number
  status: string
  scheduledAt: string
  postedAt: string | null
  photo: {
    id: number
    url: string
    caption: string | null
  }
  series: {
    id: number
    name: string
  } | null
}

const PostCard = ({ post }: { post: Post }) => {
  const formattedDate = format(new Date(post.scheduledAt), "MMM d, yyyy 'at' h:mm a")
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={post.photo.url || `/placeholder.svg?height=300&width=300`}
            alt={post.photo.caption || "Curated image"}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2">
            {post.status === "scheduled" && (
              <Badge className="bg-primary text-primary-foreground">Scheduled</Badge>
            )}
            {post.status === "posted" && (
              <Badge variant="secondary">Posted</Badge>
            )}
            {post.status === "pending" && (
              <Badge variant="outline">Pending</Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardHeader className="p-14 pb-0">
        <div className="flex justify-between items-start w-full">
          <div>
            <CardTitle className="text-lg font-medium">
              {post.series?.name || "Untitled Post"}
            </CardTitle>
            <CardDescription className="text-xs">
              {formattedDate}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {post.photo.caption || "No caption"}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4 pt-0 space-y-2">
        <div className="flex flex-wrap gap-1">
          {post.series && (
            <Badge variant="outline">{post.series.name}</Badge>
          )}
        </div>
        <div className="flex justify-between w-full">
          <Button variant="ghost" size="sm" className="bg-gray-200 hover:bg-gray-300">
            {post.status === "posted" ? "Repost" : post.status === "pending" ? "Schedule" : "Edit"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default function PostsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center w-full min-h-[600px] bg-gray-50 rounded-lg border border-dashed border-gray-300 px-4">
      <Image
        src="/placeholder.svg"
        alt="No images"
        width={120}
        height={120}
        className="mb-6 opacity-50"
      />
      <h3 className="text-xl font-medium text-gray-900 mb-2">No images found</h3>
      <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
        Get started by adding some images to your collection. You can upload images and schedule them for posting.
      </p>
      <Button variant="outline" size="lg" onClick={() => router.push("/schedule")}>
        <Plus className="w-4 h-4 mr-2" />
        Upload Images
      </Button>
    </div>
  )

  const LoadingState = () => (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden animate-pulse">
          <CardContent className="p-0">
            <div className="relative aspect-square bg-gray-200" />
          </CardContent>
          <CardHeader className="p-14 pb-0">
            <div className="w-2/3 h-4 bg-gray-200 rounded" />
            <div className="w-1/2 h-3 bg-gray-200 rounded mt-2" />
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="w-full h-8 bg-gray-200 rounded" />
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <div className="w-1/3 h-6 bg-gray-200 rounded" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allPosts.filter(post => 
        post.photo.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.series?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredPosts(filtered)
    } else {
      setFilteredPosts(allPosts)
    }
  }, [searchQuery, allPosts])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/posts")
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setAllPosts(data.posts)
      setFilteredPosts(data.posts)
    } catch (err: any) {
      setError(err.message || "Failed to fetch posts")
    } finally {
      setIsLoading(false)
    }
  }

  const getPostsByStatus = (status: string) => {
    return filteredPosts.filter(post => post.status === status)
  }

  const renderPosts = (posts: Post[]) => {
    if (isLoading) {
      return <LoadingState />
    }

    if (posts.length === 0) {
      return <EmptyState />
    }

    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 container mx-auto max-w-[1600px] py-8 px-4 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <Button onClick={() => router.push("/schedule")}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Image
          </Button>
        </div>

        <div className="flex items-center space-x-2 max-w-2xl">
          <Input 
            placeholder="Search images..." 
            className="flex-1" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline" onClick={() => setSearchQuery("")}>Clear</Button>
        </div>

        {error && (
          <div className="text-red-600 bg-red-50 p-4 rounded-md">
            {error}
          </div>
        )}

        <div className="flex-1">
          <Tabs defaultValue="all" className="h-full">
            <TabsList className="w-full max-w-2xl">
              <TabsTrigger value="all" className="flex-1">All Images</TabsTrigger>
              <TabsTrigger value="pending" className="flex-1">Pending</TabsTrigger>
              <TabsTrigger value="scheduled" className="flex-1">Scheduled</TabsTrigger>
              <TabsTrigger value="posted" className="flex-1">Posted</TabsTrigger>
            </TabsList>

            <div className="mt-8 min-h-[600px]">
              <TabsContent value="all" className="h-full">
                {renderPosts(filteredPosts)}
              </TabsContent>

              <TabsContent value="pending" className="h-full">
                {renderPosts(getPostsByStatus("pending"))}
              </TabsContent>

              <TabsContent value="scheduled" className="h-full">
                {renderPosts(getPostsByStatus("scheduled"))}
              </TabsContent>

              <TabsContent value="posted" className="h-full">
                {renderPosts(getPostsByStatus("posted"))}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
