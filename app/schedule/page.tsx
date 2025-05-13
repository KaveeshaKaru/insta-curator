"use client"

import { useState, useRef, useEffect, Suspense, useCallback } from "react"
import { CalendarIcon, Clock } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import InstagramUsername from "@/components/InstagramUsername"
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"


export default function SchedulePage() {
  const [date, setDate] = useState<Date>()
  const [hour, setHour] = useState<string>("")
  const [minute, setMinute] = useState<string>("")
  const [ampm, setAmpm] = useState<string>("")
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [selectedSeries, setSelectedSeries] = useState<string>("")
  const [caption, setCaption] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [sessionPhotos, setSessionPhotos] = useState<{ id: number; url: string; alt: string }[]>([])
  const [seriesList, setSeriesList] = useState<{ id: number; name: string }[]>([])
  const [isScheduling, setIsScheduling] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [isEnhancing, setIsEnhancing] = useState(false);

   // Function to enhance caption
   const enhanceCaption = useCallback(async () => {
    if (!caption.trim()) {
      setError("Please enter a caption to enhance.");
      return;
    }

    setIsEnhancing(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/enhance-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption }),
      });

      const data = await response.json();
      if (data.enhancedCaption) {
        setCaption(data.enhancedCaption);
        //setSuccess("Caption enhanced successfully!");
      } else {
        //setError(data.error || "Failed to enhance caption.");
      }
    } catch (err) {
      console.error("Error enhancing caption:", err);
      setError("An error occurred while enhancing the caption.");
    } finally {
      setIsEnhancing(false);
    }
  }, [caption]);

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
        setError("Failed to load series.")
      }
    }
    fetchSeries()
  }, [])

  const handleSchedulePost = async () => {
    if (!selectedImage) {
      setError("Please select an image.")
      return
    }
    if (!caption.trim()) {
      setError("Please enter a caption.")
      return
    }
    if (!date) {
      setError("Please select a date.")
      return
    }
    if (!hour || !minute || !ampm) {
      setError("Please select a time.")
      return
    }

    setError(null)
    setSuccess(null)
    setIsScheduling(true)

    try {
      const photo = sessionPhotos.find((p) => p.id === selectedImage)
      if (!photo || photo.url.includes("placeholder.svg")) {
        setError("Please select a valid image.")
        return
      }

      // Construct scheduledAt date
      const scheduledAt = new Date(date)
      let hours = parseInt(hour)
      if (ampm === "pm" && hours !== 12) hours += 12
      if (ampm === "am" && hours === 12) hours = 0
      scheduledAt.setHours(hours, parseInt(minute), 0, 0) // Set seconds and milliseconds to 0

      // Ensure scheduled time is in the future
      const now = new Date()
      if (scheduledAt <= now) {
        setError("Scheduled time must be in the future.")
        return
      }

      const response = await fetch("/api/instagram/schedule-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption,
          imageUrl: photo.url,
          scheduledAt: scheduledAt.toISOString(),
          seriesId: selectedSeries || null,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setSuccess("Post scheduled successfully!")
        // Reset form and remove the scheduled image from session
        setCaption("")
        setSelectedImage(null)
        setSelectedSeries("")
        setDate(undefined)
        setHour("")
        setMinute("")
        setAmpm("")
        setSessionPhotos(prev => prev.filter(p => p.id !== selectedImage))
      } else {
        setError(data.error || "Failed to schedule post.")
      }
    } catch (err) {
      console.error("Error scheduling post:", err)
      setError("An error occurred while scheduling the post.")
    } finally {
      setIsScheduling(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      setError(null)
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (data.url) {
        // Create a Photo record
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
          // Automatically select the newly uploaded image
          setSelectedImage(photoData.photo.id)
        } else {
          setError(photoData.error || "Failed to save photo.")
        }
      } else {
        setError(data.error || "Failed to upload image.")
      }
    } catch (err) {
      console.error("Error uploading image:", err)
      setError("An error occurred while uploading the image.")
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left sidebar is handled by the layout component */}
      
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Schedule Post</h1>

        <div className="grid gap-6 grid-cols-[1fr,350px] h-[calc(100vh-120px)]">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4">1. Select Image</h2>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                className="mb-4"
                variant="outline"
              >
                Upload Image
              </Button>
              <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto p-1">
                {sessionPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className={cn(
                      "relative aspect-square cursor-pointer rounded-md overflow-hidden border-2",
                      selectedImage === photo.id ? "border-primary" : "border-transparent"
                    )}
                    onClick={() => setSelectedImage(photo.id)}
                  >
                    <Image src={photo.url} alt={photo.alt} fill className="object-cover" />
                  </div>
                ))}
              </div>
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
                  {selectedImage ? (
                    <Image
                      src={sessionPhotos.find(p => p.id === selectedImage)?.url || "/placeholder.svg"}
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

            {(error || success) && (
              <div className="mt-4">
                {error && <p className="text-red-600">{error}</p>}
                {success && <p className="text-green-600">{success}</p>}
              </div>
            )}

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
