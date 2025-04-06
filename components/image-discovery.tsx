"use client"

import { useState } from "react"
import Image from "next/image"
import { Bookmark, ExternalLink, Heart, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data for demonstration
const mockDiscoveryImages = [
  {
    id: 1,
    url: "/placeholder.svg?height=300&width=300",
    owner: "@travelphotographer",
    likes: 1245,
    tags: ["travel", "nature", "adventure"],
  },
  {
    id: 2,
    url: "/placeholder.svg?height=300&width=300",
    owner: "@foodie_central",
    likes: 876,
    tags: ["food", "cooking", "recipes"],
  },
  {
    id: 3,
    url: "/placeholder.svg?height=300&width=300",
    owner: "@fashion_daily",
    likes: 2103,
    tags: ["fashion", "style", "outfit"],
  },
  {
    id: 4,
    url: "/placeholder.svg?height=300&width=300",
    owner: "@fitness_guru",
    likes: 1532,
    tags: ["fitness", "workout", "health"],
  },
  {
    id: 5,
    url: "/placeholder.svg?height=300&width=300",
    owner: "@art_collective",
    likes: 987,
    tags: ["art", "design", "creative"],
  },
  {
    id: 6,
    url: "/placeholder.svg?height=300&width=300",
    owner: "@pet_lover",
    likes: 1876,
    tags: ["pets", "dogs", "cats"],
  },
]

export function ImageDiscovery() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [savedImages, setSavedImages] = useState<number[]>([])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }

  const handleSaveImage = (imageId: number) => {
    if (savedImages.includes(imageId)) {
      setSavedImages(savedImages.filter((id) => id !== imageId))
    } else {
      setSavedImages([...savedImages, imageId])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for images by hashtag, creator, or description..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <Tabs defaultValue="trending">
        <TabsList>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="mt-4">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <Skeleton className="aspect-square w-full" />
                  </CardContent>
                  <CardFooter className="flex flex-col items-start p-4 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockDiscoveryImages.map((image) => (
                <Card key={image.id} className="overflow-hidden group">
                  <CardContent className="p-0 relative">
                    <div className="relative aspect-square">
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={`Image by ${image.owner}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="mr-2"
                          onClick={() => handleSaveImage(image.id)}
                        >
                          <Bookmark
                            className={`h-4 w-4 mr-1 ${savedImages.includes(image.id) ? "fill-current" : ""}`}
                          />
                          {savedImages.includes(image.id) ? "Saved" : "Save"}
                        </Button>
                        <Button variant="secondary" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start p-4 space-y-2">
                    <div className="flex justify-between w-full">
                      <span className="font-medium">{image.owner}</span>
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        <span className="text-sm">{image.likes}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {image.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="mt-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockDiscoveryImages
              .slice(3)
              .concat(mockDiscoveryImages.slice(0, 3))
              .map((image) => (
                <Card key={image.id} className="overflow-hidden group">
                  <CardContent className="p-0 relative">
                    <div className="relative aspect-square">
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={`Image by ${image.owner}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="mr-2"
                          onClick={() => handleSaveImage(image.id)}
                        >
                          <Bookmark
                            className={`h-4 w-4 mr-1 ${savedImages.includes(image.id) ? "fill-current" : ""}`}
                          />
                          {savedImages.includes(image.id) ? "Saved" : "Save"}
                        </Button>
                        <Button variant="secondary" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start p-4 space-y-2">
                    <div className="flex justify-between w-full">
                      <span className="font-medium">{image.owner}</span>
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        <span className="text-sm">{image.likes}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {image.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="following" className="mt-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockDiscoveryImages.slice(0, 3).map((image) => (
              <Card key={image.id} className="overflow-hidden group">
                <CardContent className="p-0 relative">
                  <div className="relative aspect-square">
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={`Image by ${image.owner}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" className="mr-2" onClick={() => handleSaveImage(image.id)}>
                        <Bookmark className={`h-4 w-4 mr-1 ${savedImages.includes(image.id) ? "fill-current" : ""}`} />
                        {savedImages.includes(image.id) ? "Saved" : "Save"}
                      </Button>
                      <Button variant="secondary" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start p-4 space-y-2">
                  <div className="flex justify-between w-full">
                    <span className="font-medium">{image.owner}</span>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      <span className="text-sm">{image.likes}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {image.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

