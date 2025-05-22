"use client"

import { useState, useRef, useEffect, Suspense, useCallback } from "react"
import { CalendarIcon, Clock, GripVertical, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { DragDropContext, Droppable, Draggable, type DropResult, type DroppableProvided, type DraggableProvided } from "@hello-pangea/dnd"
import InstagramUsername from "@/components/InstagramUsername"
import { Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { LoadingDialog } from "@/components/ui/loading-dialog"

export default function SchedulePage() {
  const [date, setDate] = useState<Date>()
  const [hour, setHour] = useState<string>("")
  const [minute, setMinute] = useState<string>("")
  const [ampm, setAmpm] = useState<string>("")
  const [selectedImages, setSelectedImages] = useState<{ id: number; url: string; alt: string }[]>([])
  const [selectedSeries, setSelectedSeries] = useState<string>("")
  const [caption, setCaption] = useState<string>("")
  const [sessionPhotos, setSessionPhotos] = useState<{ id: number; url: string; alt: string }[]>([])
  const [seriesList, setSeriesList] = useState<{ id: number; name: string }[]>([])
  const [isScheduling, setIsScheduling] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Function to enhance caption
  const enhanceCaption = useCallback(async () => {
    if (!caption.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a caption to enhance.🤓"
      })
      return
    }

    setIsEnhancing(true)

    try {
      const response = await fetch("/api/enhance-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption }),
      })

      const data = await response.json()
      if (data.enhancedCaption) {
        setCaption(data.enhancedCaption)
        toast({
          title: "Success",
          description: "Caption enhanced successfully! ✨"
        })
      }
    } catch (err) {
      console.error("Error enhancing caption:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while enhancing the caption.😔"
      })
    } finally {
      setIsEnhancing(false)
    }
  }, [caption, toast])

  // Generate all minutes (00–59)
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

  // Only fetch series on mount
  useEffect(() => {
    async function fetchSeries() {
      try {
        const seriesResponse = await fetch("/api/series")
        const seriesData = await seriesResponse.json()
        if (seriesData.series) {
          setSeriesList(seriesData.series)
        }
      } catch (err) {
        console.error("Error fetching series:", err)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load series.😕"
        })
      }
    }
    fetchSeries()
  }, [toast])

  const handleSchedulePost = async () => {
    if (selectedImages.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one image.🥹"
      })
      return
    }
    if (!caption.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a caption.🤓"
      })
      return
    }
    if (!date) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a date.📅"
      })
      return
    }
    if (!hour || !minute || !ampm) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a time.⏰"
      })
      return
    }

    setIsScheduling(true)
    setLoadingMessage("Scheduling your post... 📅✨")

    try {
      // Construct scheduledAt date
      const scheduledAt = new Date(date)
      let hours = parseInt(hour)
      if (ampm === "pm" && hours !== 12) hours += 12
      if (ampm === "am" && hours === 12) hours = 0
      scheduledAt.setHours(hours, parseInt(minute), 0, 0)

      // Ensure scheduled time is in the future
      const now = new Date()
      if (scheduledAt <= now) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Scheduled time must be in the future.⏰"
        })
        return
      }

      const response = await fetch("/api/instagram/schedule-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption,
          images: selectedImages.map(img => img.url),
          scheduledAt: scheduledAt.toISOString(),
          seriesId: selectedSeries || null,
          isCarousel: selectedImages.length > 1
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Post scheduled successfully! 🎉"
        })
        // Reset form and remove the scheduled images
        setCaption("")
        setSelectedImages([])
        setSelectedSeries("")
        setDate(undefined)
        setHour("")
        setMinute("")
        setAmpm("")
        setSessionPhotos(prev => prev.filter(p => !selectedImages.some(si => si.id === p.id)))
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to schedule post.😔"
        })
      }
    } catch (err) {
      console.error("Error scheduling post:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while scheduling the post.🤕"
      })
    } finally {
      setIsScheduling(false)
      setLoadingMessage("")
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Check if adding these files would exceed the 10 image limit
    if (selectedImages.length + files.length > 10) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You can only upload up to 10 images for a carousel post.📸"
      })
      return
    }

    for (const file of files) {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        })
        const data = await response.json()
        if (data.url) {
          const photoResponse = await fetch("/api/photos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: data.url, caption: "Uploaded photo" }),
          })
          const photoData = await photoResponse.json()
          if (photoData.photo) {
            const newPhoto = {
              id: photoData.photo.id,
              url: photoData.photo.url,
              alt: photoData.photo.caption || `Photo ${photoData.photo.id}`,
            }
            setSessionPhotos((prev) => [...prev, newPhoto])
            setSelectedImages((prev) => [...prev, newPhoto])
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: photoData.error || "Failed to save photo.😔"
            })
          }
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: data.error || "Failed to upload image.😔"
          })
        }
      } catch (err) {
        console.error("Error uploading image:", err)
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while uploading the image.🤕"
        })
      }
    }
  }

  const handleRemoveImage = (imageId: number) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(selectedImages)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSelectedImages(items)
  }

  return (
    <div className="flex h-screen">
      <Toaster />
      <LoadingDialog isOpen={isScheduling} message={loadingMessage} />
      
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Schedule Post</h1>

        <div className="grid gap-6 grid-cols-[1fr,350px] h-[calc(100vh-120px)]">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">1. Upload Images (Max 10)</h2>
                <span className="text-sm text-muted-foreground">
                  {selectedImages.length}/10 images selected
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
                multiple
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="mb-4"
                variant="secondary"
                disabled={selectedImages.length >= 10}
              >
                Upload Images
              </Button>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="images" direction="horizontal">
                  {(provided: DroppableProvided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto p-1"
                    >
                      {selectedImages.map((photo, index) => (
                        <Draggable key={photo.id} draggableId={photo.id.toString()} index={index}>
                          {(provided: DraggableProvided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="relative aspect-square rounded-md overflow-hidden border-2 border-primary group"
                            >
                              <div {...provided.dragHandleProps} className="absolute top-2 left-2 z-10">
                                <GripVertical className="h-5 w-5 text-white opacity-75" />
                              </div>
                              <button
                                onClick={() => handleRemoveImage(photo.id)}
                                className="absolute top-2 right-2 z-10 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4 text-white" />
                              </button>
                              <Image src={photo.url} alt={photo.alt} fill className="object-cover" />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">2. Select Series (Optional)</h2>
              <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select a series" />
                </SelectTrigger>
                <SelectContent>
                  {seriesList.map((series) => (
                    <SelectItem key={series.id} value={series.id.toString()}>
                      {series.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium mb-4">3. Write Caption</h2>
                <div className="relative">
                  <Textarea
                    placeholder="Write your caption here..."
                    className="min-h-[120px] max-h-[120px] resize-none w-[400px] pr-24"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    disabled={isEnhancing}
                    aria-busy={isEnhancing}
                    aria-label="Instagram caption input"
                  />
                  {isEnhancing && (
                    <div className="absolute inset-0 bg-gray-100/60 flex items-center justify-center pointer-events-none">
                      <div className="w-full h-full animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
                    </div>
                  )}
                  <button
                    type="button"
                    className={cn(
                      "absolute bottom-2 right-2 flex items-center gap-1 text-sm transition-colors",
                      isEnhancing
                        ? "text-muted-foreground cursor-not-allowed"
                        : "text-muted-foreground hover:text-primary cursor-pointer"
                    )}
                    onClick={isEnhancing ? undefined : enhanceCaption}
                    disabled={isEnhancing}
                    aria-label={isEnhancing ? "Enhancing caption" : "Enhance caption with AI"}
                  >
                    <span>{isEnhancing ? "Enhancing...😉" : "AI caption"}</span>
                    {isEnhancing ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium mb-4">4. Schedule Date & Time</h2>
                <div className="space-y-4">
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
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>

                  <div className="grid grid-cols-3 gap-2">
                    <Select value={hour} onValueChange={setHour}>
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
                    <Select value={minute} onValueChange={setMinute}>
                      <SelectTrigger>
                        <SelectValue placeholder="Minute" />
                      </SelectTrigger>
                      <SelectContent>
                        {minutes.map((min) => (
                          <SelectItem key={min} value={min}>
                            {min}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={ampm} onValueChange={setAmpm}>
                      <SelectTrigger>
                        <SelectValue placeholder="AM/PM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="am">AM</SelectItem>
                        <SelectItem value="pm">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>
                      {date && hour && minute && ampm
                        ? `Scheduled for ${format(date, "PPP")} at ${hour}:${minute} ${ampm.toUpperCase()}`
                        : "Not scheduled yet"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">5. Preview</h2>
            <Card className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <InstagramUsername />
                </div>

                <div className="relative aspect-square mb-2">
                  {selectedImages.length > 0 ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={selectedImages[0].url}
                        alt="First selected image"
                        fill
                        className="object-cover rounded"
                      />
                      {selectedImages.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                          +{selectedImages.length - 1}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                      <p className="text-muted-foreground">Select images</p>
                    </div>
                  )}
                </div>

                {caption && (
                  <p className="text-sm mb-2">{caption}</p>
                )}

                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>
                    {date && hour && minute && ampm
                      ? `${format(date, "PPP")} at ${hour}:${minute} ${ampm.toUpperCase()}`
                      : "Not scheduled yet"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => router.push('/images')} className="flex-1">
                Post Now Instead
              </Button>
              <Button onClick={handleSchedulePost} disabled={isScheduling} className="flex-1">
                {isScheduling ? "Scheduling..." : "Schedule Post"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
