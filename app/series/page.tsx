import { Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function SeriesPage() {
  const series = [
    {
      id: 1,
      title: "Summer Collection",
      description: "Beach and summer vibes",
      imageCount: 12,
      scheduledCount: 8,
      startDate: "May 15, 2023",
    },
    {
      id: 2,
      title: "Product Showcase",
      description: "New product line highlights",
      imageCount: 15,
      scheduledCount: 10,
      startDate: "June 1, 2023",
    },
    {
      id: 3,
      title: "Travel Destinations",
      description: "Exotic locations and adventures",
      imageCount: 20,
      scheduledCount: 5,
      startDate: "July 10, 2023",
    },
    {
      id: 4,
      title: "Food & Recipes",
      description: "Delicious meals and cooking tips",
      imageCount: 8,
      scheduledCount: 3,
      startDate: "August 5, 2023",
    },
  ]

  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Series</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create New Series
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {series.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video mb-4">
                <Image
                  src={`/placeholder.svg?height=200&width=400`}
                  alt={item.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {item.scheduledCount}/{item.imageCount} scheduled
                  </span>
                </div>
                <Progress value={(item.scheduledCount / item.imageCount) * 100} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">Starts: {item.startDate}</div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/series/${item.id}`}>Manage</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

