"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarIcon, Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function SchedulePage() {
  const [date, setDate] = useState<Date>();
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [ampm, setAmpm] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [photos, setPhotos] = useState<{ id: number; url: string; alt: string }[]>([]);
  const [seriesList, setSeriesList] = useState<{ id: number; name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Generate all minutes (00–59)
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

  // Fetch user's series and photos on mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch series
        const seriesResponse = await fetch("/api/series");
        const seriesData = await seriesResponse.json();
        if (seriesData.series) {
          setSeriesList(seriesData.series);
        }

        // Fetch photos
        const photosResponse = await fetch("/api/photos");
        const photosData = await photosResponse.json();
        if (photosData.photos) {
          setPhotos(
            photosData.photos.map((photo: any) => ({
              id: photo.id,
              url: photo.url,
              alt: photo.caption || `Photo ${photo.id}`,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load series or photos.");
      }
    }
    fetchData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setError(null);
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.url) {
        // Create a Photo record
        const photoResponse = await fetch("/api/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: data.url, caption: "Uploaded photo" }),
        });
        const photoData = await photoResponse.json();
        if (photoData.photo) {
          setPhotos((prev) => [
            ...prev,
            {
              id: photoData.photo.id,
              url: photoData.photo.url,
              alt: photoData.photo.caption || `Photo ${photoData.photo.id}`,
            },
          ]);
        } else {
          setError(photoData.error || "Failed to save photo.");
        }
      } else {
        setError(data.error || "Failed to upload image.");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("An error occurred while uploading the image.");
    }
  };

  const handleSchedulePost = async () => {
    if (!selectedImage) {
      setError("Please select an image.");
      return;
    }
    if (!caption.trim()) {
      setError("Please enter a caption.");
      return;
    }
    if (!date) {
      setError("Please select a date.");
      return;
    }
    if (!hour || !minute || !ampm) {
      setError("Please select a time.");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const photo = photos.find((p) => p.id === selectedImage);
      if (!photo || photo.url.includes("placeholder.svg")) {
        setError("Please upload a valid image.");
        return;
      }

      // Construct scheduledAt date
      const scheduledAt = new Date(date);
      let hours = parseInt(hour);
      if (ampm === "pm" && hours !== 12) hours += 12;
      if (ampm === "am" && hours === 12) hours = 0;
      scheduledAt.setHours(hours, parseInt(minute), 0, 0); // Set seconds and milliseconds to 0

      // Log the constructed time for debugging
      console.log("Selected local time:", scheduledAt.toLocaleString("en-US", { timeZone: "Asia/Colombo" }));
      console.log("Scheduled UTC time:", scheduledAt.toISOString());

      // Ensure scheduled time is in the future
      const now = new Date();
      if (scheduledAt <= now) {
        setError("Scheduled time must be in the future.");
        return;
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
      });

      const data = await response.json();
      if (data.success) {
        setSuccess("Post scheduled successfully!");
        // Reset form
        setCaption("");
        setSelectedImage(null);
        setSelectedSeries("");
        setDate(undefined);
        setHour("");
        setMinute("");
        setAmpm("");
      } else {
        setError(data.error || "Failed to schedule post.");
      }
    } catch (err) {
      console.error("Error scheduling post:", err);
      setError("An error occurred while scheduling the post.");
    }
  };

  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Schedule Post</h1>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">1. Upload and Select Image</h2>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="mb-4"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className={cn(
                    "relative aspect-square cursor-pointer rounded-md overflow-hidden border-2",
                    selectedImage === photo.id ? "border-primary" : "border-transparent"
                  )}
                  onClick={() => setSelectedImage(photo.id)}
                >
                  <Image src={photo.url || "/placeholder.svg"} alt={photo.alt} fill className="object-cover" />
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
                {seriesList.map((series) => (
                  <SelectItem key={series.id} value={series.id.toString()}>
                    {series.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">3. Write Caption</h2>
            <Textarea
              placeholder="Write your caption here..."
              className="min-h-[120px]"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
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
                  <span className="font-medium">itsmekaveesha</span>
                </div>

                <div className="relative aspect-square mb-3">
                  {selectedImage ? (
                    <Image
                      src={photos.find((p) => p.id === selectedImage)?.url || "/placeholder.svg"}
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
                  <span>
                    {date && hour && minute && ampm
                      ? `${format(date, "PPP")} at ${hour}:${minute} ${ampm.toUpperCase()}`
                      : "Not scheduled yet"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline">Save as Draft</Button>
            <Button onClick={handleSchedulePost}>Schedule Post</Button>
          </div>
        </div>
      </div>
    </div>
  );
}