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
      return <p>Loading posts...</p>
    }

    if (posts.length === 0) {
      return <p className="text-muted-foreground">No posts found</p>
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col p-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
        <Button onClick={() => router.push("/schedule")}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Image
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input 
          placeholder="Search images..." 
          className="max-w-sm" 
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

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Images</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="posted">Posted</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderPosts(filteredPosts)}
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          {renderPosts(getPostsByStatus("pending"))}
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          {renderPosts(getPostsByStatus("scheduled"))}
        </TabsContent>

        <TabsContent value="posted" className="mt-6">
          {renderPosts(getPostsByStatus("posted"))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
