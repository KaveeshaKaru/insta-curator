import { Plus } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function ImagesPage() {
  return (
    <div className="flex flex-col p-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Image
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input placeholder="Search images..." className="max-w-sm" />
        <Button variant="outline">Search</Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Images</TabsTrigger>
          <TabsTrigger value="unused">Unused</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="posted">Posted</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={`/placeholder.svg?height=300&width=300`}
                      alt="Curated image"
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start p-4 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">Nature</Badge>
                    <Badge variant="outline">Travel</Badge>
                  </div>
                  <div className="flex justify-between w-full">
                    <span className="text-sm text-muted-foreground">@photographer</span>
                    <Button variant="ghost" size="sm">
                      Schedule
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unused" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={`/placeholder.svg?height=300&width=300`}
                      alt="Curated image"
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start p-4 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">Beach</Badge>
                    <Badge variant="outline">Summer</Badge>
                  </div>
                  <div className="flex justify-between w-full">
                    <span className="text-sm text-muted-foreground">@creator</span>
                    <Button variant="ghost" size="sm">
                      Schedule
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={`/placeholder.svg?height=300&width=300`}
                      alt="Curated image"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary">May 20</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start p-4 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">Fashion</Badge>
                    <Badge variant="outline">Style</Badge>
                  </div>
                  <div className="flex justify-between w-full">
                    <span className="text-sm text-muted-foreground">@fashionista</span>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="posted" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={`/placeholder.svg?height=300&width=300`}
                      alt="Curated image"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">Posted</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start p-4 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">Food</Badge>
                    <Badge variant="outline">Lifestyle</Badge>
                  </div>
                  <div className="flex justify-between w-full">
                    <span className="text-sm text-muted-foreground">@foodie</span>
                    <Button variant="ghost" size="sm">
                      Repost
                    </Button>
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
