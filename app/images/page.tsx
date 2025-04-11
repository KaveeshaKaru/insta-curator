"use client"

import { useState } from "react"
import { CalendarIcon, Clock } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export default function SchedulePage() {
  const [date, setDate] = useState<Date>()
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [selectedSeries, setSelectedSeries] = useState<string>("")

  const images = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    src: `/placeholder.svg?height=200&width=200`,
    alt: `Image ${i + 1}`,
  }))

  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Schedule Post</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">1. Select Image</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={cn(
                    "relative aspect-square cursor-pointer rounded-md overflow-hidden border-2",
                    selectedImage === image.id ? "border-primary" : "border-transparent",
                  )}
                  onClick={() => setSelectedImage(image.id)}
                >
                  <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">2. Select Series</h2>
            <Select value={selectedSeries} onValueChange={setSelectedSeries}>
              <SelectTrigger>
                <SelectValue placeholder="Select a series" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summer">Summer Collection</SelectItem>
                <SelectItem value="product">Product Showcase</SelectItem>
                <SelectItem value="travel">Travel Destinations</SelectItem>
                <SelectItem value="food">Food & Recipes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">3. Write Caption</h2>
            <Textarea placeholder="Write your caption here..." className="min-h-[120px]" />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">4. Schedule Date & Time</h2>
            <div className="grid gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>

              <div className="flex space-x-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <SelectItem key={i} value={`${i + 1}`}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Minute" />
                  </SelectTrigger>
                  <SelectContent>
                    {["00", "15", "30", "45"].map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="am">AM</SelectItem>
                    <SelectItem value="pm">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">5. Preview</h2>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Image
                      src="/placeholder.svg?height=32&width=32"
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                  <span className="font-medium">your_instagram_handle</span>
                </div>

                <div className="relative aspect-square mb-3">
                  {selectedImage ? (
                    <Image
                      src={`/placeholder.svg?height=400&width=400`}
                      alt="Selected image"
                      fill
                      className="object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                      <p className="text-muted-foreground">Select an image</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{date ? format(date, "PPP") : "Not scheduled yet"}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline">Save as Draft</Button>
            <Button>Schedule Post</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
